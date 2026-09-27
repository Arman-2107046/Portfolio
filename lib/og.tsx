import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/*
 * The OG image is drawn in the site's own palette and structure: white canvas,
 * ink type, one hairline, and the mono rail along the bottom. A link preview is
 * usually the first thing anyone sees of this site, so it should be the site
 * rather than a coloured card with a name on it.
 *
 * Satori cannot use the next/font CSS variables — it needs the font bytes — so
 * the files are checked into public/fonts and read from disk at build time.
 * These are separate from the subset files next/font generates for the site
 * itself, which are woff2 and therefore unusable here. It has to be the static
 * Medium instance, not the variable file — the variable TTF crashes Satori
 * during prerender. public/fonts/README.md has the details and the refetch.
 */
const INK = "#0e0f12";
const INK_MUTED = "#4f535a";
const CANVAS = "#ffffff";
const HAIRLINE = "#e3e3e0";

async function loadFont(file: string): Promise<ArrayBuffer> {
  const data = await readFile(join(process.cwd(), "public/fonts", file));
  return Uint8Array.from(data).buffer;
}

export async function renderOgImage({
  eyebrow,
  title,
  meta,
}: {
  eyebrow: string;
  title: string;
  meta: string[];
}) {
  const [sans, mono] = await Promise.all([
    loadFont("InstrumentSans-Medium.ttf"),
    loadFont("IBMPlexMono-Regular.ttf"),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: CANVAS,
        padding: "72px 80px",
        fontFamily: "InstrumentSans",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontFamily: "PlexMono",
            fontSize: 26,
            letterSpacing: "0.02em",
            color: INK_MUTED,
          }}
        >
          {eyebrow}
        </div>

        <div
          style={{
            marginTop: 32,
            fontSize: title.length > 52 ? 66 : 82,
            lineHeight: 1.02,
            letterSpacing: "-0.035em",
            color: INK,
            // Satori needs an explicit cap or a long title runs off the card.
            maxWidth: 980,
          }}
        >
          {title}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ height: 1, width: "100%", backgroundColor: HAIRLINE }} />
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontFamily: "PlexMono",
            fontSize: 24,
            letterSpacing: "0.02em",
            color: INK_MUTED,
            gap: 40,
          }}
        >
          {meta.map((item) => (
            <div key={item} style={{ display: "flex" }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>,
    {
      ...OG_SIZE,
      fonts: [
        { name: "InstrumentSans", data: sans, style: "normal", weight: 500 },
        { name: "PlexMono", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
