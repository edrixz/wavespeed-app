// consts/schema.ts

/**
 * Helper để tạo cấu trúc song ngữ cho Schema nhằm đảm bảo tính nhất quán
 */
const bilingualField = (descEn: string) => ({
  type: "OBJECT",
  properties: {
    value: {
      type: "STRING",
      description: `${descEn} (Hyper-detailed English for AI generation).`,
    },
    label_vi: {
      type: "STRING",
      description: `Vietnamese translation of the value. Use professional photography/anatomy terms.`,
    },
  },
  required: ["value", "label_vi"],
});

export const schema = {
  type: "OBJECT",
  properties: {
    subject: {
      type: "OBJECT",
      properties: {
        gender: bilingualField(
          "Identify gender and specific character archetype."
        ),
        age: bilingualField(
          "Visual age with biological markers like skin elasticity."
        ),
        ethnicity: bilingualField(
          "Specific ethnic traits and heritage indicators."
        ),
        bodyType: bilingualField(
          "Anatomical breakdown: skeletal frame, muscle definition, and body fat."
        ),
        skinTone: bilingualField(
          "Exact Fitzpatrick scale type or hex-related color description."
        ),
        skinDetails: bilingualField(
          "Micro-texture: pores, freckles, sweat/oiliness (subsurface scattering)."
        ),
        // Anatomy Nâng cao
        chest: bilingualField(
          "Detailed breast/chest anatomy: shape, volume, and nipple/areola texture."
        ),
        genitals: bilingualField(
          "Anatomical detail of genitals: labia structure, mucosal textures, and moisture."
        ),
        pubicHair: bilingualField(
          "Grooming style, hair density, and distribution patterns."
        ),
      },
      required: [
        "gender",
        "age",
        "ethnicity",
        "bodyType",
        "skinTone",
        "skinDetails",
        "chest",
        "genitals",
        "pubicHair",
      ],
    },
    face: {
      type: "OBJECT",
      properties: {
        structure: bilingualField(
          "Bone structure: cheekbones, jawline (mandible), and forehead."
        ),
        eyes: bilingualField(
          "Iris patterns, limbal ring, sclera clarity, and lash density."
        ),
        eyebrows: bilingualField(
          "Grooming style, hair stroke density, and arch height."
        ),
        nose: bilingualField(
          "Bridge profile, nostril width, and alar base details."
        ),
        lips: bilingualField(
          "Cupid's bow definition, vermillion border, and lip texture."
        ),
        skinTexture: bilingualField(
          "Surface condition: fine lines, nasolabial folds, or vellus hair."
        ),
        expression: bilingualField(
          "Micro-expression analysis: muscle tension and emotional nuances."
        ),
        makeup: bilingualField(
          "Cosmetic layers: eyeshadow gradients, foundation finish, and contouring."
        ),
      },
      required: [
        "structure",
        "eyes",
        "eyebrows",
        "nose",
        "lips",
        "skinTexture",
        "expression",
        "makeup",
      ],
    },
    hair: {
      type: "OBJECT",
      properties: {
        description: bilingualField(
          "Hairstyle geometry: parting line, flyaways, and volume."
        ),
        color: bilingualField(
          "Chromatographic breakdown: root regrowth and highlights."
        ),
        length: bilingualField("Measurement relative to anatomical landmarks."),
        texture: bilingualField(
          "Physical state: coarse, fine, silky, or wet look."
        ),
      },
      required: ["description", "color", "length", "texture"],
    },
    outfit: {
      type: "OBJECT",
      properties: {
        description: bilingualField(
          "Technical breakdown: cut, silhouette, and layering."
        ),
        materials: bilingualField(
          "Material science: light refraction on fabric (satin, leather, etc)."
        ),
        layering: bilingualField(
          "Structural hierarchy and fabric interaction."
        ),
        fit: bilingualField(
          "Draping physics: tension lines or skin-tight compression."
        ),
        details: bilingualField(
          "Hardware: stitching, buttons, and weave patterns."
        ),
        accessories: bilingualField(
          "Material and placement of jewelry and eyewear."
        ),
        // Tương tác vải
        fabricInteraction: bilingualField(
          "Physical interaction: fabric clinging to wet skin, sheer transparency, or pressure folds."
        ),
      },
      required: [
        "description",
        "materials",
        "layering",
        "fit",
        "details",
        "accessories",
        "fabricInteraction",
      ],
    },
    pose: {
      type: "OBJECT",
      properties: {
        action: bilingualField("Dynamic state and kinetic energy."),
        interaction: bilingualField(
          "Body-to-garment or body-to-body interaction: undressing, covering chest, or skin pressure."
        ),
        posture: bilingualField(
          "Weight distribution, spinal curvature, and shoulder tension."
        ),
        headAngle: bilingualField(
          "Rotation and tilt in degrees (e.g., 3/4 view)."
        ),
        hands: bilingualField("Finger articulation and hand placement."),
        framing: bilingualField(
          "Cinematography shot type (ECU, Medium, Wide)."
        ),
        perspective: bilingualField(
          "Camera height and pitch (Low-angle, Eye-level)."
        ),
        aspectRatio: bilingualField(
          "The estimated frame ratio (e.g., 2:3, 16:9)."
        ),
      },
      required: [
        "action",
        "interaction",
        "posture",
        "headAngle",
        "hands",
        "framing",
        "perspective",
        "aspectRatio",
      ],
    },
    environment: {
      type: "OBJECT",
      properties: {
        location: bilingualField("3D space analysis and architectural style."),
        lighting: bilingualField(
          "Lighting rig setup: Key, Rim, and Fill light properties."
        ),
        lightColor: bilingualField(
          "Color temperature (Kelvin) or descriptive palette."
        ),
        shadows: bilingualField(
          "Shadow quality: penumbra width and color temperature."
        ),
        atmosphere: bilingualField(
          "Volumetric fog, dust motes, or rain density."
        ),
        colorPalette: bilingualField("Global color harmony and grading."),
      },
      required: [
        "location",
        "lighting",
        "lightColor",
        "shadows",
        "atmosphere",
        "colorPalette",
      ],
    },
    tech: {
      type: "OBJECT",
      properties: {
        camera: bilingualField(
          "Sensor vibe: Large format film or full-frame digital."
        ),
        lensSettings: bilingualField(
          "Focal length, Aperture (f-stop), and bokeh quality."
        ),
        filmEffect: bilingualField("ISO grain, halation, or light leaks."),
        artStyle: bilingualField(
          "Rendering method: Hyper-realistic photo vs Fine Art."
        ),
        postProcessing: bilingualField(
          "Color grading style and dynamic range (HDR)."
        ),
        viewpoint: bilingualField(
          "Subject-to-camera distance and spatial relationship."
        ),
      },
      required: [
        "camera",
        "lensSettings",
        "filmEffect",
        "artStyle",
        "postProcessing",
        "viewpoint",
      ],
    },
  },
  required: [
    "subject",
    "face",
    "hair",
    "outfit",
    "pose",
    "environment",
    "tech",
  ],
};
