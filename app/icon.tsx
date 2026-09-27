import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/**
 * Generated rather than shipped as a binary, so the mark cannot drift from the
 * palette. Ink square, canvas monogram — the same inversion the site uses for
 * a filled control, which is the only place it uses a solid block of ink.
 */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0e0f12",
        color: "#ffffff",
        fontSize: 34,
        fontWeight: 600,
        letterSpacing: "-0.04em",
        fontFamily: "sans-serif",
      }}
    >
      AR
    </div>,
    size,
  );
}
