import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Same mark as app/icon.tsx, at the size iOS asks for. */
export default function AppleIcon() {
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
        fontSize: 92,
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
