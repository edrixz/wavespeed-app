/**
 * Subject type representing a reference entity (e.g., character, person)
 * stored in the Supabase `subjects` table.
 */
export type Subject = {
  id: string;
  user_id: string;
  name: string;
  image: string;
  created_at: string;
};

/**
 * Payload for creating or updating a Subject.
 */
export type SubjectFormPayload = {
  name: string;
  image: string;
};
