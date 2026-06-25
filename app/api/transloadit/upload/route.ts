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
    const incoming = await req.formData();
    const file = incoming.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Build multipart request to Transloadit
    // params must be a JSON string with auth key + steps
    const params = JSON.stringify({
      auth: { key: AUTH_KEY },
      steps: {
        ":original": { robot: "/upload/handle" },
      },
    });

    const body = new FormData();
    body.append("params", params);
    body.append("file", file, file.name);

    const assemblyRes = await fetch(TRANSLOADIT_API, {
      method: "POST",
      body,
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

    // :original step results contain the uploaded file
    const uploads: any[] = completed.uploads ?? [];
    if (!uploads.length) {
      return NextResponse.json(
        { error: "No uploads found in completed assembly" },
        { status: 502 }
      );
    }

    const cdnUrl: string = uploads[0].ssl_url;
    return NextResponse.json({ url: cdnUrl });
  } catch (err: any) {
    console.error("[transloadit/upload]", err);
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}