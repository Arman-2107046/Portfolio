import type { Project } from "./types";

/**
 * The six projects, strongest first. Array order is display order.
 *
 * Every outcome here is qualitative unless a figure has been confirmed. Where a
 * number would make the sentence stronger but is not known, the gap is logged
 * in OPEN-QUESTIONS.md rather than filled in with something plausible. Live URLs
 * are omitted for the same reason — see OPEN-QUESTIONS.md item 16.
 */
export const projects: Project[] = [
  {
    slug: "amidx-technologies",
    name: "AmidX Technologies",
    client: "Technology company",
    year: "2025",
    lane: "corporate",
    category: "Corporate platform",
    summary:
      "A restrained monochrome site that non-technical staff can edit daily without ever being able to break the design.",
    headline: "A content system that cannot be used to ruin the layout",
    role: "Full-stack, sole engineer",
    duration: "About three months",

    context:
      "AmidX sells technical credibility to other businesses, so the site had to look considered rather than busy — close to monochrome, generous with space, nothing decorative. But the people who would be updating it every week are not designers, and the previous site had been slowly degraded by well-meaning edits: inconsistent heading sizes, images at four different aspect ratios on one page, paragraphs pasted in from Word carrying their own fonts.",

    problem:
      "The two goals were in direct tension. A site that is precise enough to look premium is exactly the kind of site a free-form editor destroys, and the usual answer — hand every page change to a developer — was not acceptable, because the marketing team needed to publish without waiting on anyone. The real requirement was not a CMS. It was a CMS whose worst possible output still looked correct.",

    approach:
      "I built the editing layer around a fixed set of typed content blocks rather than a page builder. Each block has a defined schema — a statement block takes one heading and at most two paragraphs, a capability block takes a title plus three to six items — and the editor exposes only those fields. There is no font control, no colour picker, no free HTML. Images are cropped to the block's ratio on upload rather than on render, so a portrait photograph dropped into a landscape slot is resolved at ingest, visibly, while the person who uploaded it is still looking at it. The public site is server-rendered Laravel with React mounted only where something is genuinely interactive, so the content pages stay fast and indexable and carry almost no JavaScript.",

    architectureNotes: [
      {
        title: "Fixed block schema, not a page builder",
        chose: "A closed set of typed blocks with only content fields exposed",
        over: "A drag-and-drop builder with rich text and styling controls",
        because:
          "A builder makes the design a suggestion. Constraining the editor to content means the layout cannot be violated, only filled in — and it made the CMS dramatically smaller to build and to explain.",
      },
      {
        title: "Crop on upload, not on render",
        chose: "Resolving the crop at ingest, with the editor watching",
        over: "Storing the original and applying object-fit at display time",
        because:
          "object-fit silently produces a bad crop that nobody sees until a client does. Forcing the decision at upload puts it in front of the one person who knows what the image is meant to show.",
      },
      {
        title: "Server-rendered pages with React islands",
        chose: "Laravel-rendered HTML, React only for interactive components",
        over: "A single-page application consuming the CMS as an API",
        because:
          "Nothing on a corporate site benefits from client-side routing, and an SPA would have put the entire content layer behind JavaScript for the search crawlers this site exists to attract.",
      },
      {
        title: "Draft preview against the real templates",
        chose: "Rendering unpublished content through the production templates",
        over: "A separate preview mode or a staging copy of the site",
        because:
          "A preview that runs through different code is not a preview. Rendering drafts through the same templates means what the editor approves is exactly what ships, and it removed the staging environment as a thing to maintain.",
      },
    ],

    outcomes: [
      {
        label:
          "Marketing publishes content changes directly, with no developer in the loop.",
      },
      {
        label:
          "The design constraints are enforced by the schema, so the layout has not drifted since launch.",
      },
      {
        label:
          "Content pages ship as server-rendered HTML with minimal JavaScript, keeping them indexable by default.",
      },
    ],

    stack: [
      "Laravel",
      "React",
      "Tailwind CSS",
      "MySQL",
      "Custom CMS layer",
      "Nginx",
      "Ubuntu VPS",
    ],
    featuredStack: ["Laravel", "React", "Tailwind CSS"],

    cover: {
      src: "/work/amidx-technologies/cover.png",
      alt: "The AmidX Technologies homepage, set in near-monochrome with a wide statement heading above a three-column capability block.",
      width: 1600,
      height: 1000,
    },
    gallery: [
      {
        src: "/work/amidx-technologies/block-editor.png",
        alt: "The block editor, showing a statement block with only heading and body fields available and no styling controls.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/work/amidx-technologies/crop-on-upload.png",
        alt: "The upload step, with an image being cropped to the block's fixed aspect ratio before it is saved.",
        width: 1600,
        height: 1000,
      },
    ],
  },

  {
    slug: "sooth-bangladesh",
    name: "Sooth Bangladesh",
    client: "Direct-to-consumer retailer",
    year: "2025",
    lane: "commerce",
    category: "E-commerce and measurement",
    summary:
      "Moved purchase tracking out of the browser and onto the server, so the ad platform stopped under-reporting sales that had already happened.",
    headline: "Recovering the conversions the browser had stopped reporting",
    role: "Full-stack, sole engineer",
    duration: "Ongoing, initial build about four months",

    context:
      "Sooth runs paid acquisition on Meta, and the decisions about where to spend are made from what the platform reports. The store's own database showed a healthy number of orders. The advertising dashboard showed meaningfully fewer. When the reported return on ad spend is lower than the real one, the rational response is to cut spend on campaigns that are actually working, which is the expensive kind of wrong.",

    problem:
      "The gap was a measurement problem, not a sales problem. Purchase events were being sent from the browser by the Meta pixel, and the browser had stopped being a reliable place to send them from: content blockers strip the pixel outright, Safari's tracking prevention limits what it can persist, and a customer who closes the tab on the confirmation page never fires the event at all. Every one of those is a sale that happened and was never reported. Fixing it by nagging customers or by fighting blockers was not an option — the event had to come from somewhere the browser could not interfere with.",

    approach:
      "The server is now the source of truth for conversions. When an order row is committed, the same transaction dispatches a queued job that posts the purchase to the Meta Conversions API, with a generated event identifier that the browser pixel also sends. Meta uses that identifier to collapse the two into one event, so a customer whose browser did fire the pixel is not counted twice, and a customer whose browser did not is still counted once. Customer identifiers are hashed before they leave the application. Alongside it, the product catalogue is published as an XML feed built from a scheduled snapshot rather than on request, which is what makes dynamic product ads possible without the feed fetch competing with live storefront traffic.",

    architectureNotes: [
      {
        title: "Emit the conversion from the order transaction, not the page",
        chose: "A queued server-side Conversions API call dispatched on order commit",
        over: "Relying on the browser pixel, or firing on the confirmation page view",
        because:
          "The browser is an untrusted, blockable, closeable place to record something that has already happened. The order row is the moment the sale becomes a fact, so that is where the event belongs.",
      },
      {
        title: "Share a deduplication key with the pixel",
        chose: "One generated event identifier sent from both the server and the browser",
        over: "Turning the browser pixel off once the server-side events worked",
        because:
          "The pixel still contributes signal the server does not have, including browser and session context. Sending both with a shared key means the platform collapses them, so keeping the pixel costs nothing and removing it would have lost data.",
      },
      {
        title: "Queue with retries and an idempotency guard",
        chose:
          "A background job with bounded retries, keyed so a retry cannot double count",
        over: "A synchronous HTTP call inside the checkout request",
        because:
          "A slow or failing call to an external API must never be able to fail a checkout. Making it asynchronous also means a transient outage delays a conversion event instead of losing it — but only if retries are idempotent, which is what the key is for.",
      },
      {
        title: "Hash identifiers in the application, before transmission",
        chose: "Hashing email and phone at the point of dispatch",
        over: "Sending raw values and relying on the platform to handle them",
        because:
          "Matching works on hashes, so sending the plaintext buys nothing and widens the blast radius of any future mistake. The cheapest time to make that decision is before the first event is ever sent.",
      },
      {
        title: "Build the catalogue feed from a snapshot",
        chose: "A scheduled job writing a static XML feed to disk",
        over: "Generating the feed on request from live product tables",
        because:
          "The platform fetches the entire catalogue on its own schedule. Serving that from live tables puts a large, uncacheable query in the same database that is trying to take orders, for a consumer that does not need up-to-the-second data.",
      },
    ],

    outcomes: [
      {
        label:
          "Purchases that the browser never reported — blocked, restricted, or abandoned before the pixel fired — are now recorded server-side.",
      },
      {
        label:
          "Reported conversions reconcile against the orders table, so campaign decisions are made against numbers that match the database.",
      },
      {
        label:
          "The catalogue feed powers dynamic product ads without the feed fetch touching live storefront queries.",
      },
      {
        label: "No customer identifier leaves the application in plaintext.",
      },
    ],

    stack: [
      "Laravel",
      "React",
      "MySQL",
      "Redis",
      "Meta Conversions API",
      "XML product feed",
      "GA4",
      "Google Tag Manager",
    ],
    featuredStack: ["Laravel", "Meta Conversions API", "GA4"],

    cover: {
      src: "/work/sooth-bangladesh/cover.png",
      alt: "The Sooth Bangladesh storefront, showing a product grid above the fold with a single-column checkout entry point.",
      width: 1600,
      height: 1000,
    },
    gallery: [
      {
        src: "/work/sooth-bangladesh/event-flow.png",
        alt: "A diagram of the conversion path: order commit dispatches a queued job to the Conversions API, sharing an event identifier with the browser pixel so the platform can deduplicate.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/work/sooth-bangladesh/catalogue-feed.png",
        alt: "The scheduled catalogue feed job, writing a static XML product feed consumed by dynamic product ads.",
        width: 1600,
        height: 1000,
      },
    ],
  },

  {
    slug: "hockerty-suit-designer",
    name: "Hockerty Premium Suit Designer",
    client: "Made-to-measure menswear",
    year: "2024",
    lane: "platform",
    category: "Product configurator",
    summary:
      "A made-to-measure configurator where the hard problem was image delivery and state, not the interface sitting on top of it.",
    headline: "Rendering a garment that has too many versions to pre-render",
    role: "Full-stack, sole engineer",
    duration: "About five months",

    context:
      "A customer designing a suit chooses a fabric, then a lapel, then buttons, pockets, lining, and a dozen other details, and expects the garment on screen to update as they go. That expectation is reasonable and it is also the entire engineering problem, because the number of garments a customer can construct is the product of every option list rather than the sum of them.",

    problem:
      "Pre-rendering every combination is not a large job, it is an impossible one — the permutations run into the millions, and the asset library grows multiplicatively every time a season adds one fabric. Rendering on demand instead moves the cost to request time, where it lands as latency on exactly the interaction that is supposed to feel immediate. On top of that, not every combination is valid: certain lapels do not exist on certain jackets, and the rules change with the range.",

    approach:
      "The garment is composited from layers rather than stored as finished images. Each option contributes one transparent layer, and a configuration is expressed as an ordered set of layer references that Cloudinary composites and then caches on its edge, so the first customer to build a given combination pays for the render and everyone after them gets a cached file. The configuration itself lives in the URL rather than in a server session, which makes a design shareable, makes the browser's back button behave the way a customer expects, and means a configuration can be cached and reopened without any server state. Which combinations are legal is a normalised compatibility table in the database, queried by the client, rather than rules written into the interface.",

    architectureNotes: [
      {
        title: "Composite layers on demand, cache the result",
        chose: "Per-option transparent layers composited at the CDN and cached by URL",
        over: "Pre-rendering finished images for each combination",
        because:
          "The combination space is multiplicative, so pre-rendering does not scale and adding one fabric would multiply the asset library. Compositing makes the cost proportional to the options rather than to their product, and the cache means the expensive path runs once per combination rather than once per visitor.",
      },
      {
        title: "Configuration in the URL, not the session",
        chose: "Encoding the full configuration into the address",
        over: "Holding the work-in-progress design in a server-side session",
        because:
          "A session makes a design private to one browser and breaks the back button. In the URL, a customer can send their suit to someone else, reopen it next week, and step backwards through their own choices — and the server needs to remember nothing.",
      },
      {
        title: "Compatibility as data, not as code",
        chose: "A normalised table of which options can coexist",
        over: "Validation rules written into the configurator component",
        because:
          "The rules change when the range changes, seasonally. As data they are edited by the people who know the garments; as code every change is a deploy and a chance to introduce an invalid state the UI allows but the factory cannot make.",
      },
      {
        title: "Preload the layers the customer is about to need",
        chose: "Fetching the likely next layers while the current step is still open",
        over: "Requesting each layer at the moment it is selected",
        because:
          "The correctness of on-demand compositing does not help if every click waits on a network round trip. Prefetching moves that wait into the time the customer is already spending reading the options.",
      },
    ],

    outcomes: [
      {
        label:
          "The full option range is available without the asset library growing with the combination count.",
      },
      {
        label:
          "Repeat views of a configuration are served from cache rather than re-rendered.",
      },
      {
        label:
          "Customers can share a design as a link and return to it later, with the back button stepping through their own choices.",
      },
      {
        label:
          "Invalid garments cannot be constructed, because compatibility is enforced from the same data the range is defined in.",
      },
    ],

    stack: [
      "React",
      "Laravel",
      "Cloudinary",
      "MySQL",
      "Redis",
      "Bulk image ingestion pipeline",
    ],
    featuredStack: ["React", "Laravel", "Cloudinary"],

    cover: {
      src: "/work/hockerty-suit-designer/cover.png",
      alt: "The suit configurator, with the composited garment on the left and the current option group listed on the right.",
      width: 1600,
      height: 1000,
    },
    gallery: [
      {
        src: "/work/hockerty-suit-designer/layer-composite.png",
        alt: "The layer model: separate transparent layers for fabric, lapel, buttons and pockets, stacked into one composited garment.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/work/hockerty-suit-designer/option-compatibility.png",
        alt: "The compatibility table, showing which lapel and jacket combinations are valid for a given range.",
        width: 1600,
        height: 1000,
      },
    ],
  },

  {
    slug: "digital-products-store",
    name: "Digital Products Store",
    client: "Independent digital goods seller",
    year: "2024",
    lane: "commerce",
    category: "SEO-first commerce",
    summary:
      "Built for organic acquisition from the first commit, and self-hosted on one Ubuntu box on purpose rather than by default.",
    headline: "Choosing one server you understand over five services you rent",
    role: "Full-stack, sole engineer",
    duration: "About four months",

    context:
      "A digital goods store has no physical margin to protect and no warehouse to amortise, which changes the economics of everything else. Paid acquisition is expensive relative to the price of the product, so organic search was not a channel to add later — it was the plan. And because the margin is thin, the monthly cost of infrastructure is a real line item rather than a rounding error.",

    problem:
      "Two decisions usually made casually had to be made deliberately. First, most stores are built and then made search-visible, which is the wrong order: retrofitting indexable content, stable URLs, and fast first renders onto a client-rendered store is slower and worse than starting there. Second, the default hosting answer — a managed platform plus a managed database plus a managed cache plus a managed queue — would have cost more each month than the project could justify, for scale it did not need.",

    approach:
      "The storefront is Next.js, statically rendered for catalogue and content pages so that the HTML a crawler receives is the HTML a customer receives, with the commerce and admin layer behind it in Laravel and Filament. It runs on a single Ubuntu VPS: Nginx terminating TLS and reverse-proxying, PostgreSQL and Redis on the same box, the Node process under systemd, and deploys performed by a GitHub Actions job that builds, uploads, and swaps a symlink so a release either happens completely or not at all. Search is PostgreSQL's own full-text search rather than a separate search service, and Redis carries both the cache and the queue.",

    architectureNotes: [
      {
        title: "One VPS, chosen rather than defaulted to",
        chose: "A single Ubuntu server running Nginx, PostgreSQL, Redis and the app",
        over: "A managed platform with managed database, cache and queue add-ons",
        because:
          "At this traffic level the managed stack costs several times more per month for capacity the store will not use, and it puts a vendor between the developer and the logs. One box is cheaper, has no cold starts, and is completely inspectable — the trade-off accepted is that backups, updates and TLS renewal are now explicitly someone's job, which is why they are written down in the runbook instead of assumed.",
      },
      {
        title: "Static rendering for everything a crawler cares about",
        chose: "Pre-rendered catalogue and content pages",
        over: "Client-side rendering with data fetched after load",
        because:
          "Organic search is the acquisition plan, and the cheapest way to be indexable is to send HTML. It also happens to be the fastest thing to serve, so the SEO decision and the performance decision are the same decision.",
      },
      {
        title: "PostgreSQL full-text search instead of a search service",
        chose: "Native full-text search over the product tables",
        over: "Adding Elasticsearch or a hosted search API",
        because:
          "A catalogue of this size does not need a dedicated search engine, and a search service is a second source of truth that has to be kept in sync, monitored, and paid for. Postgres already has the data and an index type for the job.",
      },
      {
        title: "Symlink-swap deploys with a health check",
        chose: "Build a new release directory, verify it, then move a symlink",
        over: "Pulling and restarting in place",
        because:
          "Deploying in place means there is a window where the running code is half the old release and half the new one. A symlink swap is atomic, and it makes rolling back the same operation as deploying, pointed the other way.",
      },
    ],

    outcomes: [
      {
        label:
          "Catalogue and content pages are served as pre-rendered HTML, so they are indexable without a JavaScript execution step.",
      },
      {
        label:
          "Infrastructure runs on a single VPS at a predictable fixed monthly cost, with no per-request pricing.",
      },
      {
        label:
          "Releases are atomic and reversible by pointing a symlink back, with no in-place restart window.",
      },
      {
        label:
          "The full stack — database, cache, queue and search — is inspectable over one SSH session.",
      },
    ],

    stack: [
      "Next.js",
      "Laravel",
      "Filament",
      "PostgreSQL",
      "Redis",
      "Nginx",
      "Ubuntu VPS",
      "GitHub Actions",
      "systemd",
    ],
    featuredStack: ["Next.js", "PostgreSQL", "Ubuntu VPS"],

    cover: {
      src: "/work/digital-products-store/cover.png",
      alt: "A product page from the digital products store, with the product summary, price and download detail above the fold.",
      width: 1600,
      height: 1000,
    },
    gallery: [
      {
        src: "/work/digital-products-store/deploy-pipeline.png",
        alt: "The deploy pipeline: GitHub Actions builds a release, uploads it, runs a health check, then swaps the symlink.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/work/digital-products-store/admin-filament.png",
        alt: "The Filament admin, showing the product catalogue with order and download records.",
        width: 1600,
        height: 1000,
      },
    ],
  },

  {
    slug: "hr-group",
    name: "H&R Group",
    client: "Garment manufacturer and exporter",
    year: "2024",
    lane: "corporate",
    category: "Industrial B2B",
    summary:
      "An export manufacturer presented with the composure of a consumer brand, because that is what its international buyers compare it against.",
    headline: "Making a factory legible to a buyer on the other side of the world",
    role: "Front-end, sole engineer",
    duration: "About two months",

    context:
      "H&R manufactures garments in Bangladesh for buyers overseas. Those buyers are sourcing managers who will shortlist a handful of suppliers from a browser tab, having never visited the country, and the sites they are comparing are mostly built to the same template: a hero image, a paragraph about quality and commitment, a table of machinery, a contact form. The company's actual advantages — capacity, compliance, the specific things it can make — were present on the old site but arranged so that nothing stood out.",

    problem:
      "This was not a technical problem and pretending otherwise would have produced the wrong site. The difficulty was that the information a buyer needs in order to trust a factory is documentary and slightly dull — certifications, floor capacity, lead times, audit status — while the impression that gets a factory onto a shortlist is visual. Most sites in the category choose one and lose the other: either a handsome brochure with nothing verifiable in it, or a specification dump nobody reads.",

    approach:
      "The site leads with photography of the actual floor and the actual product, at a scale that treats the work as something worth looking at, and then puts the documentary material one level down where it is easy to reach and easy to read rather than buried in a footer PDF. Compliance and certification is a destination in the primary navigation, not an afterthought — it is the thing a sourcing manager is looking for, so it is where they would look. Motion is used only to mark the transition between sections, never on individual items, because a buyer scanning for facts should not have to wait for content to finish arriving. Images are budgeted tightly, since a proportion of the audience is on connections that punish a heavy page.",

    architectureNotes: [
      {
        title: "Photography-led, with the documents one level down",
        chose:
          "Leading with the floor and the product, then linking straight to the evidence",
        over: "A specification-first homepage, or a brochure with no verifiable detail",
        because:
          "Shortlisting is visual and verification is documentary, and the site has to survive both. Separating them by one level lets each be good at its job instead of compromising in the middle.",
      },
      {
        title: "Compliance as a primary navigation destination",
        chose: "A first-class section for certifications and audit status",
        over: "A PDF list in the footer",
        because:
          "It is the single thing a sourcing manager must confirm before a supplier can be considered. Putting it in the footer signals it is an obligation; putting it in the navigation signals it is an argument.",
      },
      {
        title: "Motion at section boundaries only",
        chose: "Transitions between sections, with individual content static",
        over: "Revealing each card, statistic and image as it scrolls into view",
        because:
          "Per-item animation makes a page feel expensive to the person who built it and slow to the person trying to read it. A buyer skimming for lead times should never be waiting on a fade.",
      },
      {
        title: "A hard image budget",
        chose: "Fixed dimensions, modern formats, and a ceiling on page weight",
        over: "Full-resolution photography wherever it looked best",
        because:
          "The audience is international and a meaningful share of it is on slow or metered connections. A photograph that does not arrive is not a photograph.",
      },
    ],

    outcomes: [
      {
        label:
          "Certification and capacity information is reachable from the primary navigation rather than from a footer document list.",
      },
      {
        label:
          "The site reads as a brand rather than a directory listing, while still carrying the documentary detail a buyer has to verify.",
      },
      {
        label:
          "Page weight is bounded by an explicit image budget, so the photography-led approach survives a slow connection.",
      },
    ],

    stack: ["React", "Framer Motion", "Tailwind CSS", "Vite"],
    featuredStack: ["React", "Framer Motion", "Tailwind CSS"],

    cover: {
      src: "/work/hr-group/cover.png",
      alt: "The H&R Group homepage, leading with a full-width photograph of the production floor above a short capability statement.",
      width: 1600,
      height: 1000,
    },
    gallery: [
      {
        src: "/work/hr-group/compliance.png",
        alt: "The compliance section, listing certifications and audit status as a primary navigation destination.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/work/hr-group/capability.png",
        alt: "The capability page, pairing product photography with floor capacity and lead time detail.",
        width: 1600,
        height: 1000,
      },
    ],
  },

  {
    slug: "bees-bangladesh",
    name: "BEES",
    client: "Bangladesh Extension Education Services, a development NGO",
    year: "2023",
    lane: "nonprofit",
    category: "Information architecture",
    summary:
      "A large, content-heavy organisation made navigable by restructuring what was there rather than redecorating it.",
    headline: "The work was the structure, not the surface",
    role: "Full-stack, sole engineer",
    duration: "About three months",

    context:
      "BEES runs a number of long-running programmes across microfinance, health, education and agriculture, each with its own history, reports, and audiences — donors, government bodies, field staff, and the communities served. All of it already existed on the old site. The problem was that it had accumulated rather than been organised: pages had been added for each new initiative and each new audience, so the same programme might be described in three places, none of them obviously the main one.",

    problem:
      "A redesign was the obvious brief and would have been the wrong one. Making those pages look better would not have helped a donor trying to establish what the organisation actually does, because the difficulty was not visual — it was that the site's structure mirrored the organisation's internal departments and its own history rather than the questions visitors arrive with. Worse, the duplication was load-bearing: different audiences had been sent links to different copies of the same programme, so the pages could not simply be deleted.",

    approach:
      "I restructured the site around what people come to find out rather than around how the organisation is arranged internally. Each programme became a single canonical record — one page that is the truth about that programme — with multiple entry paths leading into it for the different audiences, so a donor and a field officer arrive by different routes at the same page rather than at two divergent descriptions. The older duplicates redirect into the canonical record instead of being removed, so existing links and citations keep working. Reports and documents, of which there are a lot, are disclosed progressively: the current one is visible, the archive is reachable, and neither buries the other.",

    architectureNotes: [
      {
        title: "One canonical page per programme, many ways in",
        chose: "A single programme record with audience-specific entry paths",
        over: "A page per programme per audience",
        because:
          "Duplicated descriptions drift, and once they drift the site actively misinforms. One record means one place to update, and the audience-specific framing is carried by the route in rather than by a second copy of the facts.",
      },
      {
        title: "Navigation shaped by visitor questions, not the org chart",
        chose: "Top-level sections named after what a visitor wants to establish",
        over: "Top-level sections mirroring internal departments",
        because:
          "A visitor does not know which department owns the thing they are looking for, and should not have to. The org chart is the organisation's own mental model, and using it as an information architecture is the most common way a large site becomes unusable.",
      },
      {
        title: "Redirect the old structure instead of deleting it",
        chose: "Mapping every legacy URL onto its canonical destination",
        over: "Removing superseded pages at launch",
        because:
          "Those links are in donor correspondence, government filings and research citations that cannot be reissued. A redirect costs one line and preserves a decade of references; a 404 quietly breaks them.",
      },
      {
        title: "Progressive disclosure for the document archive",
        chose: "Current documents surfaced, the archive one deliberate step away",
        over: "A single chronological list of every report",
        because:
          "Most visitors want the latest annual report and a few want the one from 2016. A flat list serves the second group at the expense of the first, while hiding the archive entirely fails the researchers who are a real part of this audience.",
      },
    ],

    outcomes: [
      {
        label:
          "Each programme has one canonical page, so the organisation no longer describes the same work three different ways.",
      },
      {
        label:
          "Legacy URLs in donor correspondence, filings and citations still resolve, via redirects to the canonical records.",
      },
      {
        label:
          "Navigation is organised around what visitors arrive to find out rather than around internal departments.",
      },
    ],

    stack: ["Laravel", "React", "MySQL", "Tailwind CSS", "Nginx"],
    featuredStack: ["Laravel", "React", "MySQL"],

    cover: {
      src: "/work/bees-bangladesh/cover.png",
      alt: "The BEES homepage, with top-level navigation named after what visitors come to establish rather than after internal departments.",
      width: 1600,
      height: 1000,
    },
    gallery: [
      {
        src: "/work/bees-bangladesh/programme-record.png",
        alt: "A canonical programme page, with separate entry paths for donors and field staff leading into the same record.",
        width: 1600,
        height: 1000,
      },
      {
        src: "/work/bees-bangladesh/document-archive.png",
        alt: "The document archive, showing the current annual report with the historical archive one step away.",
        width: 1600,
        height: 1000,
      },
    ],
  },
];

/** Lookup by slug, for the case-study route. */
export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** Previous and next, wrapping at both ends. */
export function getAdjacentProjects(slug: string): {
  previous: Project;
  next: Project;
} {
  const index = projects.findIndex((project) => project.slug === slug);
  if (index === -1) throw new Error(`Unknown project slug: ${slug}`);

  // Non-null assertions are safe here and nowhere else: the modulo keeps both
  // indices inside an array that is known to be non-empty, and the six entries
  // above are the only source.
  const previous = projects[(index - 1 + projects.length) % projects.length]!;
  const next = projects[(index + 1) % projects.length]!;

  return { previous, next };
}
