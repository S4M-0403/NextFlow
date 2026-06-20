import type { NodeTypes } from "@xyflow/react";
import CropImageNode from "./CropImageNode";
import GeminiProNode from "./GeminiProNode";
import RequestInputsNode from "./RequestInputsNode";
import ResponseNode from "./ResponseNode";

export const workflowNodeTypes = {
  requestInputs: RequestInputsNode,
  geminiPro: GeminiProNode,
  cropImage: CropImageNode,
  response: ResponseNode,
} satisfies NodeTypes;
