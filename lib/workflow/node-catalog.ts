export type NodeCategory = "recent" | "image" | "video" | "audio" | "others";

export type WorkflowNodeType =
  | "requestInputs"
  | "geminiPro"
  | "cropImage"
  | "response";

export interface CatalogNode {
  id: string;
  type: WorkflowNodeType;
  name: string;
  description: string;
  category: NodeCategory;
  functional: boolean;
  keywords: string[];
}

export const NODE_CATALOG: CatalogNode[] = [
  {
    id: "gemini-pro",
    type: "geminiPro",
    name: "Gemini 3.1 Pro",
    description: "Multimodal text generation with vision, video, audio, and file inputs.",
    category: "others",
    functional: true,
    keywords: ["gemini", "llm", "text", "vision", "pro"],
  },
  {
    id: "crop-image",
    type: "cropImage",
    name: "Crop Image",
    description: "Crop an image using X, Y, width, and height coordinates.",
    category: "image",
    functional: true,
    keywords: ["crop", "image", "resize", "cut"],
  },
  {
    id: "stable-video",
    type: "geminiPro",
    name: "Stable Video Diffusion 1.1",
    description: "Text or image to video generation.",
    category: "video",
    functional: false,
    keywords: ["video", "diffusion", "stable"],
  },
  {
    id: "audio-gen",
    type: "geminiPro",
    name: "Audio Generator",
    description: "Generate audio from text prompts.",
    category: "audio",
    functional: false,
    keywords: ["audio", "speech", "sound"],
  },
];

export const CATEGORY_LABELS: Record<NodeCategory, string> = {
  recent: "Recent",
  image: "Image",
  video: "Video",
  audio: "Audio",
  others: "Others",
};

export function getDefaultNodeData(type: WorkflowNodeType): Record<string, unknown> {
  switch (type) {
    case "geminiPro":
      return {
        prompt: "",
        systemPrompt: "",
        settingsOpen: false,
        temperature: 0.7,
        maxTokens: 2048,
      };
    case "cropImage":
      return {
        x: 0,
        y: 0,
        width: 512,
        height: 512,
      };
    case "requestInputs":
      return { fields: [] };
    case "response":
      return {};
    default:
      return {};
  }
}
