import type {
  SubjectData,
  FaceData,
  HairData,
  OutfitData,
  PoseData,
} from "~/types";

export type Subject = {
  id: string;
  refImageIdx: number; // -1: None, 0, 1, 2...: Index of uploaded image

  subject?: SubjectData;
  face?: FaceData;
  hair?: HairData;
  outfit?: OutfitData;
  pose?: PoseData;
};
