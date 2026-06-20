export type InputFieldType = "text" | "image";

export interface InputField {
  id: string;
  type: InputFieldType;
  label: string;
  value?: string;
}

export interface RequestInputsData {
  fields: InputField[];
  [key: string]: unknown;
}

export interface GeminiProData {
  prompt: string;
  systemPrompt: string;
  settingsOpen: boolean;
  temperature: number;
  maxTokens: number;
  responseOutput?: string;
  executionError?: string;
  [key: string]: unknown;
}

export interface CropImageData {
  x: number;
  y: number;
  width: number;
  height: number;
  [key: string]: unknown;
}

export interface ResponseData {
  [key: string]: unknown;
}

export const HANDLE_COLORS = {
  text: "#3b82f6",
  image: "#f97316",
  video: "#a855f7",
  audio: "#22c55e",
  file: "#64748b",
  response: "#8b5cf6",
  result: "#6366f1",
  output: "#0ea5e9",
} as const;
