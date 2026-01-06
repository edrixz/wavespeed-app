/**
 * Hằng số liên quan đến prompt assembly
 */

// Các phần của prompt
export const PROMPT_SECTIONS = {
  SUBJECT: "subject",
  ENVIRONMENT: "environment",
  TECHNICAL: "technical",
  FRAMING: "framing",
} as const;

// Template cho negative prompt
export const NEGATIVE_PROMPT_TEMPLATES = {
  QUALITY: "low quality, worst quality, out of focus, blurry, deformed",
  ANATOMY:
    "extra limbs, mutated hands, bad anatomy, bad proportions, disfigured",
  LIMBS: "malformed limbs, missing arms, missing legs, extra arms, extra legs",
  HANDS: "fused fingers, too many fingers, long neck",
  STYLE: "cartoon, anime, 3d render, illustration, painting, drawing, sketch",
  ARTIFACTS:
    "film grain, dust, scratches, chromatic aberration, light leaks, vignette",
  SKIN: "acne, skin blemishes, wrinkles, moles, scars, age spots, large pores",
  TEXT: "text, watermark, signature, username, error, logo, words, letters, digits",
} as const;

// Giá trị aspect ratio
export const ASPECT_RATIO_VALUES = {
  SQUARE: "1:1",
  PORTRAIT: "3:4",
  PORTRAIT_TALL: "9:16",
  LANDSCAPE: "4:3",
  LANDSCAPE_WIDE: "16:9",
  CINEMA: "2.39:1",
} as const;

// Dấu tách trong prompt
export const PROMPT_SEPARATOR = ", ";

// Các cụm từ thường dùng
export const PROMPT_PHRASES = {
  FINE_ART: "Fine art photography",
  PROFESSIONAL: "Professional photography",
  ARTFULLY_REVEALING: "artfully revealing",
  EDITORIAL: "Editorial photography",
  HIGH_END_FASHION: "High-end fashion photography",
  BEAUTY_SHOT: "Beauty portrait shot",
  STUDIO_LIGHTING: "Studio lighting",
  NATURAL_LIGHT: "Natural light",
} as const;
