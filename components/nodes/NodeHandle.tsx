import { Handle, Position, type HandleProps } from "@xyflow/react";
import type { HandleDataType } from "@/lib/workflow/handle-types";

interface NodeHandleProps extends Omit<HandleProps, "position"> {
  color: string;
  dataType: HandleDataType;
  position?: Position;
  top?: string | number;
}

export default function NodeHandle({
  color,
  dataType,
  position = Position.Right,
  top,
  className = "",
  style,
  ...props
}: NodeHandleProps) {
  return (
    <Handle
      {...props}
      position={position}
      data-handle-type={dataType}
      className={`workflow-handle !h-3 !w-3 !border-2 !border-white ${className}`}
      style={{
        background: color,
        top,
        ...style,
      }}
    />
  );
}
