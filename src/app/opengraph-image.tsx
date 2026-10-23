import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Learn to Code by Building Real Software. Would You Use It?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const poster = await readFile(path.join(process.cwd(), "public/media/rust-os-poster.jpg"));
  const posterSrc = `data:image/jpeg;base64,${poster.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#05070D",
          position: "relative",
        }}
      >
        <img
          src={posterSrc}
          alt=""
          width={1110}
          height={630}
          style={{ position: "absolute", right: -260, top: 0, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #05070D 38%, rgba(5,7,13,0.75) 62%, rgba(5,7,13,0.1) 100%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
            width: 760,
            position: "relative",
          }}
        >
          <div style={{ fontSize: 22, letterSpacing: 5, color: "#17DDF2", fontFamily: "monospace" }}>
            AI APPRENTICESHIP // EARLY CONCEPT
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 70,
              lineHeight: 1.04,
              fontWeight: 700,
              color: "#F5F7FA",
              letterSpacing: -2,
            }}
          >
            Learn to Code by Building Real Software.
          </div>
          <div style={{ marginTop: 14, fontSize: 70, fontWeight: 700, color: "#B9FF35", letterSpacing: -2 }}>
            Would You Use It?
          </div>
          <div style={{ marginTop: 34, fontSize: 26, color: "#A1A7B3" }}>
            Learn Rust by building an OS. What would you build?
          </div>
        </div>
      </div>
    ),
    size,
  );
}
