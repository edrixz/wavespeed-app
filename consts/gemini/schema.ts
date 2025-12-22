// consts/schema.ts
export const schema = {
  type: "OBJECT",
  properties: {
    subject: {
      type: "OBJECT",
      properties: {
        gender: {
          type: "STRING",
          description:
            "Identify gender and specific character archetype (e.g., Nordic warrior, High-fashion model).",
        },
        age: {
          type: "STRING",
          description:
            "Visual age with biological markers like skin elasticity, collagen levels, or fine wrinkles.",
        },
        ethnicity: {
          type: "STRING",
          description:
            "Specific ethnic traits, heritage indicators, and geographic origin look.",
        },
        bodyType: {
          type: "STRING",
          description:
            "Anatomical breakdown: skeletal frame, muscle definition (hyper-toned vs. soft), and body fat percentage look.",
        },
        skinTone: {
          type: "STRING",
          description:
            "Exact Fitzpatrick scale type or hex-related color description (e.g., Olive with golden undertones).",
        },
        skinDetails: {
          type: "STRING",
          description:
            "Micro-texture: pore visibility, freckle density, moles, tattoos, scars, or sweat/oiliness (subsurface scattering).",
        },
      },
      required: [
        "gender",
        "age",
        "ethnicity",
        "bodyType",
        "skinTone",
        "skinDetails",
      ],
    },
    face: {
      type: "OBJECT",
      properties: {
        structure: {
          type: "STRING",
          description:
            "Bone structure: prominence of cheekbones, jawline sharpness (mandible), and forehead projection.",
        },
        eyes: {
          type: "STRING",
          description:
            "Iris intricate patterns, limbal ring visibility, sclera clarity, and upper/lower lash density/length.",
        },
        eyebrows: {
          type: "STRING",
          description:
            "Grooming style, hair stroke density, arch height, and relationship to the brow bone.",
        },
        nose: {
          type: "STRING",
          description:
            "Bridge profile (straight, Roman, upturned), nostril width, and alar base details.",
        },
        lips: {
          type: "STRING",
          description:
            "Cupid's bow definition, vermillion border clarity, lip texture (cracked, glossy, matte), and precise color.",
        },
        skinTexture: {
          type: "STRING",
          description:
            "Surface condition: fine lines, nasolabial folds, acne scars, or peach fuzz (vellus hair).",
        },
        expression: {
          type: "STRING",
          description:
            "Micro-expression analysis: eye squinting (duchenne smile), tension in the jaw, or brow furrowing.",
        },
        makeup: {
          type: "STRING",
          description:
            "Cosmetic layer analysis: blended eyeshadow gradients, eyeliner wing type, foundation finish, and contouring areas.",
        },
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
        description: {
          type: "STRING",
          description:
            "Comprehensive hairstyle geometry: parting line, flyaway hairs, volume, and how it drapes over shoulders/ears.",
        },
        color: {
          type: "STRING",
          description:
            "Chromatographic breakdown: root regrowth, highlights, lowlights, and metallic sheen under light.",
        },
        length: {
          type: "STRING",
          description:
            "Measurement relative to anatomical landmarks (e.g., mid-back length, chin-length).",
        },
        texture: {
          type: "STRING",
          description:
            "Physical state: coarse, fine, frizzy, silky, or clumped together (wet look).",
        },
      },
      required: ["description", "color", "length", "texture"],
    },
    outfit: {
      type: "OBJECT",
      properties: {
        description: {
          type: "STRING",
          description:
            "Technical breakdown of all garments: cut, silhouette, and how they are layered (inner vs. outer).",
        },
        materials: {
          type: "STRING",
          description:
            "Material science: light refraction on satin, absorbency of cotton, or the rigid grain of leather.",
        },
        layering: {
          type: "STRING",
          description:
            "Structural hierarchy: what is tucked, what is draped, and the interaction between different fabrics.",
        },
        fit: {
          type: "STRING",
          description:
            "Draping physics: tension lines, baggy folds, or skin-tight compression.",
        },
        details: {
          type: "STRING",
          description:
            "Hardware and trimmings: stitching type, button material, zipper placement, and fabric patterns (weave).",
        },
        accessories: {
          type: "STRING",
          description:
            "Material and placement of jewelry (carat look), eyewear (frame thickness), or headgear.",
        },
      },
      required: [
        "description",
        "materials",
        "layering",
        "fit",
        "details",
        "accessories",
      ],
    },
    pose: {
      type: "OBJECT",
      properties: {
        action: {
          type: "STRING",
          description:
            "Dynamic state: kinetic energy, movement blur, or specific interaction with objects.",
        },
        posture: {
          type: "STRING",
          description:
            "Weight distribution: which leg is load-bearing, spinal curvature, and shoulder tension.",
        },
        headAngle: {
          type: "STRING",
          description:
            "Rotation and tilt in degrees (e.g., 3/4 view, tilted 15 degrees downward).",
        },
        hands: {
          type: "STRING",
          description:
            "Finger articulation and hand placement (e.g., relaxed grip, fingers splayed, hand on hip).",
        },
        framing: {
          type: "STRING",
          description:
            "Cinematography shot type: ECU, Close-up, Medium-Full, Cowboy, or Wide Shot.",
        },
        perspective: {
          type: "STRING",
          description:
            "Camera height and pitch: Low-angle (heroic), High-angle (diminishing), or Eye-level.",
        },
        aspectRatio: {
          type: "STRING",
          description:
            "The estimated frame ratio (e.g., 1:1 square, 9:16 vertical, 21:9 cinematic).",
        },
      },
      required: [
        "action",
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
        location: {
          type: "STRING",
          description:
            "3D space analysis: background elements, their distance (depth), and architectural style.",
        },
        lighting: {
          type: "STRING",
          description:
            "Lighting rig setup: Key light direction, Rim light intensity, and Fill light placement.",
        },
        lightColor: {
          type: "STRING",
          description:
            "Color temperature in Kelvin or descriptive palette (e.g., 3000K Amber vs. 6000K Daylight).",
        },
        shadows: {
          type: "STRING",
          description:
            "Shadow quality: penumbra width, hard vs. soft edges, and shadow color (cool vs. warm).",
        },
        atmosphere: {
          type: "STRING",
          description:
            "Environmental particles: volumetric fog, dust motes, rain density, or heat haze.",
        },
        colorPalette: {
          type: "STRING",
          description:
            "Global color harmony: Teal/Orange, Monochromatic, Pastel, or High-contrast vibrant.",
        },
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
        camera: {
          type: "STRING",
          description:
            "Sensor type vibe: Large format film, Full-frame digital, or vintage lo-fi analog.",
        },
        lensSettings: {
          type: "STRING",
          description:
            "Optical properties: Focal length (mm), Aperture (f-stop for bokeh), and lens flares.",
        },
        filmEffect: {
          type: "STRING",
          description:
            "Chemical/Digital finish: ISO grain, color fringing, halation, or light leaks.",
        },
        artStyle: {
          type: "STRING",
          description:
            "Rendering method: Hyper-realistic photo, Unreal Engine 5 render, or oil painting.",
        },
        postProcessing: {
          type: "STRING",
          description:
            "Color grading style: Desaturated, high-dynamic-range (HDR), or cross-processed film look.",
        },
        viewpoint: {
          type: "STRING",
          description: "Subject-to-camera distance and spatial relationship.",
        },
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
