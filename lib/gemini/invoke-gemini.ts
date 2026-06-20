import type {
  GeminiInvokeError,
  GeminiInvokeRequest,
  GeminiInvokeResponse,
} from "./types";

export async function invokeGemini(
  request: GeminiInvokeRequest,
): Promise<string> {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  const payload = (await response.json()) as
    | GeminiInvokeResponse
    | GeminiInvokeError;

  if (!response.ok) {
    throw new Error(
      "error" in payload ? payload.error : "Gemini request failed.",
    );
  }

  if (!("text" in payload) || typeof payload.text !== "string") {
    throw new Error("Gemini returned an invalid response.");
  }

  return payload.text;
}
