import type { Edge, Node } from "@xyflow/react";

export const REQUEST_INPUTS_NODE_ID = "request-inputs";
export const RESPONSE_NODE_ID = "response";

export const initialNodes: Node[] = [
  {
    id: REQUEST_INPUTS_NODE_ID,
    type: "requestInputs",
    position: { x: 100, y: 250 },
    data: {
      fields: [
        {
          id: "field-text-1",
          type: "text",
          label: "Text Field",
        },
        {
          id: "field-image-1",
          type: "image",
          label: "Image Field",
        },
      ],
    },
  },
  {
    id: RESPONSE_NODE_ID,
    type: "response",
    position: { x: 950, y: 250 },
    data: {},
  },
];

export const responseWorkflow = {
  nodes: [
    {
      id: "request-inputs",
      type: "requestInputs",
      position: { x: 100, y: 150 },
      data: {
        fields: [
          {
            id: "field-text-1",
            type: "text",
            label: "Text",
            value: "",
          },
        ],
      },
    },
    {
      id: "response",
      type: "response",
      position: { x: 450, y: 150 },
      data: {},
    },
  ],
  edges: [
    {
      id: "edge-1",
      source: "request-inputs",
      target: "response",
      sourceHandle: "output",
      targetHandle: "result",
    },
  ],
};
export const initialEdges: Edge[] = [];