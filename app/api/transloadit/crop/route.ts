import { NextRequest, NextResponse } from "next/server";

const TRANSLOADIT_API = "https://api2.transloadit.com/assemblies";
const AUTH_KEY = process.env.TRANSLOADIT_AUTH_KEY!;

/** Poll assembly_ssl_url until completed or failed (max 60s) */
async function pollAssembly(assemblyUrl: string): Promise<any> {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1500));
    const res = await fetch(assemblyUrl);
    const data = await res.json();
    if (data.ok === "ASSEMBLY_COMPLETED") return data;
    if (data.error) throw new Error(`Transloadit error: ${data.error} — ${data.message}`);
  }
  throw new Error("Transloadit assembly timed out after 60s");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      url: string;
      x: number;
      y: number;
      width: number;
      height: number;
    };

    const { url, x, y, width, height } = body;

    if (!url || width == null || height == null || x == null || y == null) {
      return NextResponse.json(
        { error: "Missing required fields: url, x, y, width, height" },
        { status: 400 }
      );
    }

    // Transloadit crop uses x1/y1/x2/y2 (top-left + bottom-right corners)
    const x1 = Math.round(x);
    const y1 = Math.round(y);
    const x2 = Math.round(x + width);
    const y2 = Math.round(y + height);

    const params = JSON.stringify({
      auth: { key: AUTH_KEY },
      steps: {
        // Import the image from the existing CDN URL
        imported: {
          robot: "/http/import",
          url,
        },
        // Crop using /image/resize with crop coordinates
        cropped: {
          use: "imported",
          robot: "/image/resize",
          result: true,
          resize_strategy: "crop",
          crop: { x1, y1, x2, y2 },
        },
      },
    });

    const formData = new FormData();
    formData.append("params", params);

    const assemblyRes = await fetch(TRANSLOADIT_API, {
      method: "POST",
      body: formData,
    });

    if (!assemblyRes.ok) {
      const text = await assemblyRes.text();
      return NextResponse.json(
        { error: "Transloadit assembly creation failed", detail: text },
        { status: 502 }
      );
    }

    const assembly = await assemblyRes.json();

    if (assembly.error) {
      return NextResponse.json(
        { error: assembly.error, message: assembly.message },
        { status: 502 }
      );
    }

    // Poll until done
    const completed = await pollAssembly(assembly.assembly_ssl_url);

    // Get cropped result from the "cropped" step
    const results = completed.results?.cropped ?? [];
    if (!results.length) {
      return NextResponse.json(
        { error: "No cropped result in completed assembly" },
        { status: 502 }
      );
    }

    const cdnUrl: string = results[0].ssl_url;
    return NextResponse.json({ url: cdnUrl });
  } catch (err: any) {
    console.error("[transloadit/crop]", err);
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}