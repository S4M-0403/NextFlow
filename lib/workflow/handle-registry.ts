import type { Node } from "@xyflow/react";
import type { InputField } from "@/lib/types/node-data";
import type { HandleDataType } from "./handle-types";

type HandleDirection = "source" | "target";

const GEMINI_TARGET_HANDLES: Record<string, HandleDataType> = {
  prompt: "text",
  "system-prompt": "text",
  "image-vision": "image",
  video: "video",
  audio: "audio",
  file: "file",
};

const GEMINI_SOURCE_HANDLES: Record<string, HandleDataType> = {
  response: "text",
};

const CROP_TARGET_HANDLES: Record<string, HandleDataType> = {
  image: "image",
};

const CROP_SOURCE_HANDLES: Record<string, HandleDataType> = {
  "output-image": "image",
};

const RESPONSE_TARGET_HANDLES: Record<string, HandleDataType> = {
  result: "text",
};

function getRequestInputsSourceType(
  node: Node,
  handleId: string,
): HandleDataType | null {
  const fields = (node.data?.fields as InputField[] | undefined) ?? [];
  const field = fields.find((item) => item.id === handleId);
  return field?.type ?? null;
}

export function getHandleDataType(
  node: Node,
  handleId: string | null | undefined,
  direction: HandleDirection,
): HandleDataType | null {
  if (!handleId) return null;

  switch (node.type) {
    case "requestInputs":
      return direction === "source"
        ? getRequestInputsSourceType(node, handleId)
        : null;

    case "geminiPro":
      return direction === "source"
        ? (GEMINI_SOURCE_HANDLES[handleId] ?? null)
        : (GEMINI_TARGET_HANDLES[handleId] ?? null);

    case "cropImage":
      return direction === "source"
        ? (CROP_SOURCE_HANDLES[handleId] ?? null)
        : (CROP_TARGET_HANDLES[handleId] ?? null);

    case "response":
      return direction === "target"
        ? (RESPONSE_TARGET_HANDLES[handleId] ?? null)
        : null;

    default:
      return null;
  }
}
