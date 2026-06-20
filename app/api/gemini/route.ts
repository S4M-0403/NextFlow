import { GoogleGenerativeAI, type Part } from "@google/generative-ai";
import { NextResponse } from "next/server";
import type { GeminiInvokeRequest } from "@/lib/gemini/types";

const DEFAULT_MODEL = "gemini-2.5-flash";

function isMockImageReference(value: string): boolean {
  return value.startsWith("mock-image://") || value.startsWith("mock-cropped://");
}

async function resolveImagePart(image: string): Promise<Part | null> {
  if (isMockImageReference(image)) {
    return null;
  }

  if (image.startsWith("data:")) {
    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;

    return {
      inlineData: {
        mimeType: match[1],
        data: match[2],
      },
    };
  }

  if (image.startsWith("http://") || image.startsWith("https://")) {
    const response = await fetch(image);
    if (!response.ok) return null;

    const mimeType = response.headers.get("content-type") ?? "image/png";
    const buffer = Buffer.from(await response.arrayBuffer());

    return {
      inlineData: {
        mimeType,
        data: buffer.toString("base64"),
      },
    };
  }

  return null;
}

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  let body: GeminiInvokeRequest;

  try {
    body = (await request.json()) as GeminiInvokeRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const prompt = body.prompt?.trim();

  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
      systemInstruction: body.systemPrompt?.trim() || undefined,
      generationConfig: {
        temperature: body.temperature ?? 0.7,
        maxOutputTokens: body.maxTokens ?? 2048,
      },
    });

    const parts: Part[] = [];

    if (body.image && typeof body.image === "string") {
      const imagePart = await resolveImagePart(body.image);
      if (imagePart) {
        parts.push(imagePart);
      }
    }

    parts.push({ text: prompt });

    const result = await model.generateContent(parts);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gemini generation failed.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
