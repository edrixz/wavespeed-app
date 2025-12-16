// SCHEMA (Cấu trúc JSON trả về)
export const schema = {
  type: "OBJECT",
  properties: {
    // 1. IDENTITY & BODY
    subject: {
      type: "OBJECT",
      properties: {
        gender: {
          type: "STRING",
          description: "Male, Female, Non-binary...",
        },
        age: {
          type: "STRING",
          description: "Specific age number (e.g. 24 years old)",
        },
        ethnicity: {
          type: "STRING",
          description: "Ethnicity or nationality look",
        },
        bodyType: {
          type: "STRING",
          description:
            "Detailed body shape (e.g. Hourglass, Muscular, Slim, Curvy)",
        },
        skinTone: {
          type: "STRING",
          description: "Pale, Tan, Olive, Dark...",
        },
      },
    },

    // 2. FACE & MAKEUP (Quan trọng cho Portrait)
    face: {
      type: "OBJECT",
      properties: {
        shape: {
          type: "STRING",
          description: "Oval, Square, Heart, Diamond...",
        },
        eyes: {
          type: "STRING",
          description: "Detailed eyes: Color, Shape, Iris details, Eyelashes",
        },
        nose: { type: "STRING", description: "Nose shape" },
        lips: {
          type: "STRING",
          description: "Lips shape, color, glossiness",
        },
        skinTexture: {
          type: "STRING",
          description: "Freckles, Pores, Moles, Scars, Wet skin, Sweat...",
        },
        expression: {
          type: "STRING",
          description:
            "Micro-expression (e.g. Slight smirk, Melancholic stare)",
        },
        makeup: {
          type: "STRING",
          description:
            "Makeup style (e.g. No-makeup look, Smoky eyes, Red matte lipstick)",
        },
      },
    },

    // 3. HAIR
    hair: {
      type: "OBJECT",
      properties: {
        color: {
          type: "STRING",
          description: "Specific color (e.g. Platinum Blonde with dark roots)",
        },
        style: {
          type: "STRING",
          description: "Hairstyle name (e.g. Messy Bun, Beach Waves, Buzz cut)",
        },
        length: { type: "STRING", description: "Precise length" },
        texture: {
          type: "STRING",
          description: "Silky, Frizzy, Wet, Oily, Curly...",
        },
      },
    },

    // 4. OUTFIT & ACCESSORIES
    outfit: {
      type: "OBJECT",
      properties: {
        mainClothing: {
          type: "STRING",
          description: "Detailed description of top/dress/suit",
        },
        fabric: {
          type: "STRING",
          description: "Material (e.g. Silk, Denim, Leather, Latex, Lace)",
        },
        fit: {
          type: "STRING",
          description: "Tight, Oversized, Baggy, Tailored...",
        },
        details: {
          type: "STRING",
          description: "Ruffles, Zippers, Buttons, Embroidery, Ripped...",
        },
        accessories: {
          type: "STRING",
          description: "Jewelry, Glasses, Hats, Scarves",
        },
      },
    },

    // 5. POSE & ACTION
    pose: {
      type: "OBJECT",
      properties: {
        action: { type: "STRING", description: "What are they doing?" },
        posture: {
          type: "STRING",
          description: "Standing, Sitting, Leaning, Floating...",
        },
        headAngle: {
          type: "STRING",
          description: "Looking at camera, Looking away, Profile view...",
        },
        hands: {
          type: "STRING",
          description: "Hand placement (e.g. Hand on hip, Touching hair)",
        },
      },
    },

    // 6. ENVIRONMENT & LIGHTING
    environment: {
      type: "OBJECT",
      properties: {
        location: {
          type: "STRING",
          description:
            "Specific setting (e.g. Cyberpunk street, Victorian bedroom)",
        },
        lighting: {
          type: "STRING",
          description:
            "Lighting type (e.g. Cinematic, Rembrandt, Neon, Golden Hour)",
        },
        shadows: {
          type: "STRING",
          description: "Hard shadows, Soft shadows, Volumetric lighting",
        },
        atmosphere: {
          type: "STRING",
          description: "Foggy, Dusty, Rainy, Cozy, Ethereal",
        },
      },
    },

    // 7. PHOTOGRAPHY STYLE (Quan trọng cho AI Art)
    tech: {
      type: "OBJECT",
      properties: {
        camera: {
          type: "STRING",
          description: "Camera model vibe (e.g. Sony A7RIV, Polaroid, GoPro)",
        },
        lens: {
          type: "STRING",
          description: "Focal length (e.g. 35mm, 85mm portrait, Fisheye)",
        },
        filmStock: {
          type: "STRING",
          description: "Kodak Portra 400, Fujifilm, Black and White",
        },
        quality: {
          type: "STRING",
          description: "8k, Raw photo, Masterpiece, Ultra-detailed",
        },
        viewpoint: {
          type: "STRING",
          description: "Low angle, High angle, Eye level, Dutch angle",
        },
      },
    },
  },
  // Các trường bắt buộc phải trả về
  required: ["subject", "face", "hair", "outfit", "environment"],
};
