export type GenerateSettings = {
  width: number;
  height: number;
  prompt: string;
  negative_prompt: string;
  enableSafetyChecker: boolean;
  enableSyncMode: boolean;
  enableBase64Output: boolean;
};
