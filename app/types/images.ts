export type ImageItem = {
  id: string;
  url: string;
  file: File | null;
  type: "SERVER" | "LOCAL";
};
