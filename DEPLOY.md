# Deploying

Two paths. Vercel is the one to use unless there is a reason not to; the
self-hosted path is documented in full because the Digital Products Store case
study argues for it, and an argument you cannot demonstrate is a claim.

> **Status: not yet deployed.** Everything below is written and verified as far
> as it can be without credentials and a domain. The security headers were
> confirmed against a local production server; the items needing a real host are
> marked and listed in OPEN-QUESTIONS.md.

## Before either path

### Environment

| Variable | Required | What happens without it |
| --- | --- | --- |
| `RESEND_API_KEY` | for the contact form | The server action fails closed and tells the sender to email directly. No enquiry is ever silently lost. |
| `CONTACT_FROM_EMAIL` | for the contact form | Same. Must be an address on a domain verified in Resend. |
| `NEXT_PUBLIC_GTM_ID` | for analytics | Analytics is inert — no script, no banner, no requests. |

`.env.example` lists all three. None is needed for the site to build and serve.

### Set the canonical origin

`content/site.ts` → `baseUrl`. Every canonical URL, OG image, sitemap entry and
JSON-LD url resolves from it, so this is the one line to change. It is currently
a placeholder (OPEN-QUESTIONS.md item 6).

### Pre-flight

```bash
npm run gate          # lint, typecheck, contrast, content, build
npx next start --port 3130

npm run audit:a11y -- http://localhost:3130
npm run audit:keyboard -- http://localhost:3130
npm run audit:responsive -- http://localhost:3130
npm run audit:lighthouse -- http://localhost:3130
```

CI runs all of this on every push. Running it locally first is faster than
finding out from a red check.

---

## Path A — Vercel

1. **Import the repository** at vercel.com/new. Framework and build command are
   detected; nothing needs overriding.

2. **Add the environment variables** above, to Production and Preview. Preview
   deployments should use a Resend test key, or none — a preview build emailing
   real enquiries to a real inbox is a surprise nobody wants.

3. **Connect the domain**, then **pick one canonical host and enforce it**.
   Apex or `www`, it does not matter which, but serving both is two sites to
   search engines and splits every signal between them. In Vercel, add both and
   set one to redirect to the other with a 308.

4. **Force HTTPS.** On by default. Confirm rather than assume — `curl -I` the
   `http://` URL and check for a 308 to `https://`.

5. **Verify the headers** are actually arriving in production:

   ```bash
   curl -sI https://<domain> | grep -iE 'content-security|strict-transport|x-content-type|referrer|permissions|x-frame'
   ```

6. **Watch CSP for a week, then enforce it.** The policy ships as
   `Content-Security-Policy-Report-Only`. Once reports are quiet, rename the
   key in `next.config.ts` to `Content-Security-Policy`. Doing this before
   watching is how a site breaks in a way nobody notices until a visitor
   mentions it.

   `'unsafe-inline'` is in `script-src` for two reasons: the theme script must
   run in `<head>` before first paint to avoid a flash of the wrong theme, and
   Next inlines its own bootstrap. The stricter answer is a nonce, which forces
   every route to render dynamically — trading the entire static build for it.
   For a site with no user input rendered into the page, that is the wrong
   trade.

7. **HSTS preload.** The header is already set with `preload`. Submitting to
   hstspreload.org is a **one-way door** — browsers will refuse plain HTTP for
   the domain and removal takes months. Only submit once the domain is
   permanent and every subdomain is on HTTPS.

---

## Path B — self-hosted on Ubuntu

The architecture the Digital Products Store case study describes: one server,
Nginx in front, the Node process under systemd, TLS from Certbot, and deploys
over SSH that swap a symlink.

This is not the cheaper option in every sense. It trades a monthly bill for
attention — backups, kernel updates and certificate renewal become someone's
job. The trade is worth making when it is deliberate, and the point of writing
it down is that it stays deliberate.

### 1. Server

Ubuntu 24.04 LTS, 1 vCPU and 1GB RAM is enough for this site.

```bash
adduser deploy && usermod -aG sudo deploy
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable

# Key-only SSH. Password auth on a public IP is a brute-force target
# from the first hour.
sudo sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs nginx
```

### 2. Layout

```
/var/www/portfolio/
  releases/20260927T120000/   each build, timestamped
  current -> releases/...     the symlink systemd serves
  shared/.env                 secrets, never in a release
```

Keeping releases separate from `current` is what makes a deploy atomic and a
rollback the same operation pointed the other way.

### 3. systemd

`/etc/systemd/system/portfolio.service`:

```ini
[Unit]
Description=Portfolio (Next.js)
After=network.target

[Service]
Type=simple
User=deploy
WorkingDirectory=/var/www/portfolio/current
EnvironmentFile=/var/www/portfolio/shared/.env
Environment=NODE_ENV=production PORT=3000
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5

# The process serves HTTP and reads its own directory. Nothing else.
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=/var/www/portfolio

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now portfolio
```

### 4. Nginx

`/etc/nginx/sites-available/portfolio`:

```nginx
server {
  server_name armanrahmanrafi.com;

  # Next sets the security headers itself (see next.config.ts). They are not
  # repeated here — two sources for one header is how they drift apart.
  location /_next/static/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_cache_valid 200 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    # The contact form's rate limit reads this. Without it every visitor
    # shares one bucket.
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
  }

  gzip on;
  gzip_types text/plain text/css application/javascript application/json image/svg+xml;
}
```

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 5. TLS

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d armanrahmanrafi.com -d www.armanrahmanrafi.com

# Confirm renewal actually works before trusting it. A certificate that
# silently fails to renew takes the site down 90 days later, usually at night.
sudo certbot renew --dry-run
```

### 6. Deploy over SSH

`.github/workflows/deploy.yml`, to add when the server exists:

```yaml
name: Deploy

on:
  workflow_run:
    workflows: [CI]
    branches: [main]
    types: [completed]

jobs:
  deploy:
    # Only after CI passed. Deploying on push regardless of the checks makes
    # the checks decorative.
    if: github.event.workflow_run.conclusion == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci && npm run build

      - name: Ship it
        env:
          SSH_KEY: ${{ secrets.DEPLOY_SSH_KEY }}
          HOST: ${{ secrets.DEPLOY_HOST }}
        run: |
          mkdir -p ~/.ssh && echo "$SSH_KEY" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh-keyscan -H "$HOST" >> ~/.ssh/known_hosts

          RELEASE=$(date -u +%Y%m%dT%H%M%S)
          TARGET=/var/www/portfolio/releases/$RELEASE

          ssh deploy@$HOST "mkdir -p $TARGET"
          rsync -az --delete \
            .next package.json package-lock.json public next.config.ts \
            deploy@$HOST:$TARGET/

          ssh deploy@$HOST "
            cd $TARGET
            npm ci --omit=dev
            ln -sfn /var/www/portfolio/shared/.env $TARGET/.env

            # Start the new release on a spare port and prove it answers
            # before anything is switched. A health check after the swap
            # tells you the site is down; this one keeps it up.
            PORT=3001 npm run start &
            NEW_PID=\$!
            sleep 6
            curl -fsS http://127.0.0.1:3001/ > /dev/null || { kill \$NEW_PID; exit 1; }
            kill \$NEW_PID

            ln -sfn $TARGET /var/www/portfolio/current
            sudo systemctl restart portfolio

            # Keep the last five. Rollback is:
            #   ln -sfn releases/<older> current && systemctl restart portfolio
            cd /var/www/portfolio/releases && ls -1t | tail -n +6 | xargs -r rm -rf
          "
```

Grant exactly one sudo command, not blanket access:

```
# /etc/sudoers.d/portfolio
deploy ALL=(ALL) NOPASSWD: /bin/systemctl restart portfolio
```

### 7. Backups

There is no database, so what needs keeping is small and easy to forget:

- `shared/.env` — the only unrecoverable thing on the box.
- `public/work/` — if final screenshots are ever edited on the server rather
  than committed, which they should not be.

Everything else is in git. Verify by restoring somewhere else, not by checking
that the backup job exited zero.

---

## Done when

- [ ] `baseUrl` in `content/site.ts` is the real domain
- [ ] Environment variables set in the host
- [ ] One canonical host, the other 308-redirecting to it
- [ ] HTTPS enforced, verified with `curl -I` on the `http://` URL
- [ ] All six security headers present in production
- [ ] CSP watched in report-only, then switched to enforcing
- [ ] `npm run audit:lighthouse -- https://<domain>` re-run against production
- [ ] Structured data checked in the Rich Results Test
- [ ] OG cards checked in a link-preview debugger
- [ ] A test enquiry sent through the form and received
- [ ] GA4 DebugView showing all five events with the documented parameters
