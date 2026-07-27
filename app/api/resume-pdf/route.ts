import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { renderToBuffer, Font } from "@react-pdf/renderer";
import ResumePDF from "@/app/tools/resume-builder/ResumePDF";
import fs from "fs";
import path from "path";

function fontDataUrl(filePath: string) {
  const buf = fs.readFileSync(filePath);
  return `data:font/ttf;base64,${buf.toString("base64")}`;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const fontDir = path.join(process.cwd(), "public/fonts/crimson-pro");
    Font.register({
      family: "Crimson Pro",
      fonts: [
        { src: fontDataUrl(path.join(fontDir, "CrimsonPro-Regular.ttf")), fontWeight: 400, fontStyle: "normal" },
        { src: fontDataUrl(path.join(fontDir, "CrimsonPro-Bold.ttf")), fontWeight: 700, fontStyle: "normal" },
        { src: fontDataUrl(path.join(fontDir, "CrimsonPro-Italic.ttf")), fontWeight: 400, fontStyle: "italic" },
        { src: fontDataUrl(path.join(fontDir, "CrimsonPro-BoldItalic.ttf")), fontWeight: 700, fontStyle: "italic" },
      ],
    });

    const element = React.createElement(ResumePDF, { data }) as any;
    const buffer = await renderToBuffer(element);

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${(data.fullName || "resume").replace(/\s+/g, "_")}.pdf"`,
      },
    });
  } catch (err: any) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: err?.message || "Failed to generate PDF" }, { status: 500 });
  }
}
