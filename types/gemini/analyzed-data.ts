export type SubjectData = {
  gender?: string;
  age?: string;
  ethnicity?: string;
  bodyType?: string;
  skinTone?: string;
};

export type FaceData = {
  shape?: string;
  eyes?: string;
  nose?: string;
  lips?: string;
  skinTexture?: string;
  expression?: string;
  makeup?: string;
};

export type HairData = {
  color?: string;
  style?: string;
  length?: string;
  texture?: string;
};

export type OutfitData = {
  mainClothing?: string;
  fabric?: string;
  fit?: string;
  details?: string;
  accessories?: string;
};

export type PoseData = {
  action?: string;
  posture?: string;
  headAngle?: string;
  hands?: string;
};

export type EnvironmentData = {
  location?: string;
  lighting?: string;
  shadows?: string;
  atmosphere?: string;
};

export type TechData = {
  camera?: string;
  lens?: string;
  filmStock?: string;
  quality?: string;
  viewpoint?: string;
};

export type AnalyzedData = {
  subject?: SubjectData;
  face?: FaceData;
  hair?: HairData;
  outfit?: OutfitData;
  pose?: PoseData;
  environment?: EnvironmentData;
  tech?: TechData;
};

export type AnalyzeResponse = {
  result: AnalyzedData;
};