/**
 * API-specific response types
 */

export type GenerateTaskResponse = {
  taskId: string;
  status: string;
  createdAt?: string;
};
