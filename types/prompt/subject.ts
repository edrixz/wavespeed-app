export type Subject = {
  id: string;
  refImageIdx: number; // -1: None, 0, 1, 2...: Index of uploaded image

  role: string; // e.g. "The Woman", "The Man"

  // Identity
  gender: string;
  age: string;
  bodyType: string;
  skin: string; // Gộp skinTone + texture

  // Face
  faceShape: string;
  eyes: string;
  iris: string;
  nose: string;
  lips: string;
  freckles: string;
  expression: string;
  makeup: string;

  // Hair
  hairColor: string;
  hairStyle: string; // Gộp style + texture
  hairLength: string;

  // Fashion
  clothes: string; // Gộp mainClothing + fabric + details + accessories

  // Pose
  pose: string; // Gộp action + posture + hands
};
