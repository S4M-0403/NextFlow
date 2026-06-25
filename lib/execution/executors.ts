import { invokeGemini } from "@/lib/gemini/invoke-gemini";
import type { ExecutionContext, Executor, NodeExecutionResult } from "./types";
import { mockExecutionDelay } from "./utils";


export class RequestInputsExecutor implements Executor {
  readonly nodeType = "requestInputs";

  async execute(context: ExecutionContext): Promise<NodeExecutionResult> {
    const duration = await mockExecutionDelay(400, 900);
    const fields =
      (context.nodeData.fields as Array<{
  id: string;
  type: string;
  label: string;
  value?: string;
}>) ??
      [];

    const outputs = Object.fromEntries(
  fields.map((field) => [
    field.id,
    {
      type: field.type as "text" | "image",
      value: field.value ?? "",
    },
  ]),
);

    return {
      nodeId: context.nodeId,
      nodeName: "Request Inputs",
      nodeType: this.nodeType,
      status: "success",
      duration,
      input: {},
      output: {
        type: "json",
        value: outputs,
      },
    };
  }
}

export class GeminiExecutor implements Executor {
  readonly nodeType = "geminiPro";

  async execute(context: ExecutionContext): Promise<NodeExecutionResult> {
    const startedAt = Date.now();
    const promptValue =
      context.inputs.prompt?.value ?? context.nodeData.prompt ?? "";
    const prompt =
      typeof promptValue === "string" ? promptValue.trim() : String(promptValue);

    const systemPromptValue =
      context.inputs["system-prompt"]?.value ?? context.nodeData.systemPrompt;
    const systemPrompt =
      typeof systemPromptValue === "string"
        ? systemPromptValue.trim()
        : systemPromptValue
          ? String(systemPromptValue)
          : undefined;

    const imageValue = context.inputs["image-vision"]?.value;
    const image =
      typeof imageValue === "string" && imageValue.length > 0
        ? imageValue
        : undefined;

    const temperature = Number(context.nodeData.temperature ?? 0.7);
    const maxTokens = Number(context.nodeData.maxTokens ?? 2048);

    if (!prompt) {
      return {
        nodeId: context.nodeId,
        nodeName: "Gemini 3.1 Pro",
        nodeType: this.nodeType,
        status: "failed",
        duration: Date.now() - startedAt,
        input: context.inputs,
        error: "Prompt is required. Connect an input or enter a prompt.",
      };
    }

    try {
      const text = await invokeGemini({
        prompt,
        systemPrompt,
        image,
        temperature,
        maxTokens,
      });

      return {
        nodeId: context.nodeId,
        nodeName: "Gemini 3.1 Pro",
        nodeType: this.nodeType,
        status: "success",
        duration: Date.now() - startedAt,
        input: context.inputs,
        output: {
          type: "text",
          value: text,
        },
      };
    } catch (error) {
      return {
        nodeId: context.nodeId,
        nodeName: "Gemini 3.1 Pro",
        nodeType: this.nodeType,
        status: "failed",
        duration: Date.now() - startedAt,
        input: context.inputs,
        error:
          error instanceof Error ? error.message : "Gemini execution failed.",
      };
    }
  }
}

export class CropImageExecutor implements Executor {
  readonly nodeType = "cropImage";

  async execute(context: ExecutionContext): Promise<NodeExecutionResult> {
    const startedAt = Date.now();

    try {
      const imageInput = context.inputs.image?.value;

      if (typeof imageInput !== "string" || imageInput.length === 0) {
        throw new Error("Invalid image input");
      }
      await new Promise((resolve) => setTimeout(resolve, 30000));

      const response = await fetch("/api/transloadit/crop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: imageInput,
          x: Number(context.nodeData.x ?? 0),
          y: Number(context.nodeData.y ?? 0),
          width: Number(context.nodeData.width ?? 100),
          height: Number(context.nodeData.height ?? 100),
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.error ?? "Crop failed");
      }

      return {
        nodeId: context.nodeId,
        nodeName: "Crop Image",
        nodeType: this.nodeType,
        status: "success",
        duration: Date.now() - startedAt,
        input: context.inputs,
        output: {
          type: "image",
          value: json.url,
        },
      };
    } catch (error) {
      return {
        nodeId: context.nodeId,
        nodeName: "Crop Image",
        nodeType: this.nodeType,
        status: "failed",
        duration: Date.now() - startedAt,
        input: context.inputs,
        error:
          error instanceof Error ? error.message : "Crop execution failed.",
      };
    }
  }
}

export class ResponseExecutor implements Executor {
  readonly nodeType = "response";

  async execute(context: ExecutionContext): Promise<NodeExecutionResult> {
    const duration = await mockExecutionDelay(300, 700);
    const resultInput = context.inputs.result;

    if (!resultInput) {
      return {
        nodeId: context.nodeId,
        nodeName: "Response",
        nodeType: this.nodeType,
        status: "failed",
        duration,
        input: context.inputs,
        error: "No result input connected or provided.",
      };
    }

    return {
      nodeId: context.nodeId,
      nodeName: "Response",
      nodeType: this.nodeType,
      status: "success",
      duration,
      input: context.inputs,
      output: resultInput,
    };
  }
}
