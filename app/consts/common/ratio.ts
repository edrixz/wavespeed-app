export const ASPECT_RATIOS = [
  { label: "Auto", value: undefined, description: "Let model decide" },
  { label: "1:1", value: "1:1", description: "Square" },
  { label: "16:9", value: "16:9", description: "Widescreen" },
  { label: "9:16", value: "9:16", description: "Story" },
  { label: "4:3", value: "4:3", description: "Classic" },
  { label: "3:4", value: "3:4", description: "Portrait" },
  { label: "3:2", value: "3:2", description: "Standard" },
  { label: "2:3", value: "2:3", description: "Tall" },
  { label: "4:5", value: "4:5", description: "Social" },
  { label: "5:4", value: "5:4", description: "Wide" },
  { label: "21:9", value: "21:9", description: "Cinematic" },
] as const;
