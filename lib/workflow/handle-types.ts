export type HandleDataType = "text" | "image" | "video" | "audio" | "file";

export const HANDLE_DATA_TYPES = [
  "text",
  "image",
  "video",
  "audio",
  "file",
] as const satisfies readonly HandleDataType[];

export function areHandleTypesCompatible(
  sourceType: HandleDataType,
  targetType: HandleDataType,
): boolean {
  return sourceType === targetType;
}
