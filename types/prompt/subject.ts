export type Subject = {
  id: number;
  role: string; // e.g. "The Woman", "The Man"
  refImageIdx: number; // -1: None, 0, 1, 2...: Index of uploaded image

  // Appearance
  gender: string;
  age: number;
  bodyType: string;
  faceShape: string;

  // Details
  skin: string; // Pores, freckles, imperfections...
  freckles: string; // Freckles details
  eyes: string; // Color, shape, iris details...
  iris: string; // Iris details
  hairLength: string;
  hairColor: string;
  hairStyle: string;
  beard: string; // For male
  makeup: string;

  // State
  clothes: string;
  pose: string;
  expression: string;
};
