export interface GeminiInvokeRequest {
  prompt: string;
  systemPrompt?: string;
  image?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface GeminiInvokeResponse {
  text: string;
}

export interface GeminiInvokeError {
  error: string;
}
