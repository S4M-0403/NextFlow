/**
 * CropImageExecutor
 *
 * Receives a Transloadit CDN URL + crop coordinates from the workflow,
 * calls /api/transloadit/crop, and returns the new cropped CDN URL.
 *
 * Drop this file in place of your existing CropImageExecutor.
 * Adjust the import path for your WorkflowExecutor base/types as needed.
 */

export interface CropImageInput {
  url: string;   // Transloadit CDN URL of the original image
  x: number;     // Left edge of crop rectangle (pixels)
  y: number;     // Top edge of crop rectangle (pixels)
  width: number; // Width of crop rectangle (pixels)
  height: number;// Height of crop rectangle (pixels)
}

export interface CropImageOutput {
  url: string;   // Transloadit CDN URL of the cropped image
}

export async function executeCropImage(input: CropImageInput): Promise<CropImageOutput> {
  const { url, x, y, width, height } = input;
  console.log("Crop input:", input);
  const response = await fetch("/api/transloadit/crop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, x, y, width, height }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(`Crop failed: ${err.error ?? response.statusText}`);
  }

  const data = await response.json();

  if (!data.url) {
    throw new Error("Crop API returned no URL");
  }

  return { url: data.url };
}