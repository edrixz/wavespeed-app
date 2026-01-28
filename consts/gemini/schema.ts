// Định nghĩa cấu trúc con dùng String Literals ("OBJECT", "STRING")
const bilingualField = {
  type: "OBJECT",
  properties: {
    value: {
      type: "STRING",
      description:
        "Detailed description in English for image generation prompt.",
    },
    label_vi: {
      type: "STRING",
      description:
        "Vietnamese translation strictly mirroring the English structure.",
    },
  },
  required: ["value", "label_vi"],
};

// Cấu trúc chính
export const analysisSchema = {
  type: "OBJECT",
  properties: {
    subject: {
      ...bilingualField,
      description: "Main character, body type, age, ethnicity, facial features",
    },
    clothing: {
      ...bilingualField,
      description: "Outfit, materials, fabric physics, accessories",
    },
    pose: {
      ...bilingualField,
      description: "Action, posture, hand placement, viewing angle",
    },
    lighting: {
      ...bilingualField,
      description: "Light source, shadows, atmosphere, cinematic lighting",
    },
    background: {
      ...bilingualField,
      description: "Environment location, depth of field, surrounding elements",
    },
    technical: {
      ...bilingualField,
      description:
        "Camera gear, focal length, art style, rendering details, color grading",
    },
  },
  required: [
    "subject",
    "clothing",
    "pose",
    "lighting",
    "background",
    "technical",
  ],
};
