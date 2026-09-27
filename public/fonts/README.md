# Fonts for OG image rendering

These files exist **only** so `next/og` (Satori) can draw the Open Graph cards
and the favicon in the site's own typefaces. The site itself does not load them
— `next/font` generates its own subset WOFF2 files at build time, and those are
not usable here because Satori needs TrueType or OpenType bytes.

Two things are worth knowing before replacing them:

1. **Instrument Sans must be a static instance, not the variable file.** The
   variable TTF from the `google/fonts` repository crashes Satori during
   prerender with `Cannot read properties of undefined`. The static Medium
   instance below works.

2. **Google serves different formats by user agent.** A bare `Mozilla/5.0`
   gets TrueType; a modern UA gets WOFF2 and an ancient one gets EOT, neither
   of which Satori can read.

To refetch:

```bash
url=$(curl -s "https://fonts.googleapis.com/css?family=Instrument+Sans:500" \
  -H "User-Agent: Mozilla/5.0" \
  | sed -n 's/.*src: url(\([^)]*\)).*/\1/p' | head -1)
curl -sL -o public/fonts/InstrumentSans-Medium.ttf "$url"

curl -sL -o public/fonts/IBMPlexMono-Regular.ttf \
  "https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexmono/IBMPlexMono-Regular.ttf"
```

Both families are licensed under the SIL Open Font License.
