import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseUrl } from "./config";

// Single shared client — import this everywhere in the admin
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type AdminUser = {
  id: string;
  email: string;
  name?: string | null;
};

export type AppStatus =
  | "pending"
  | "reviewed"
  | "interview"
  | "accepted"
  | "rejected"
  | "waitlisted";

export type Application = {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  ucid: string;
  university_email: string;
  personal_email: string | null;
  phone: string | null;
  year_of_study: string;
  degree_program: string;
  department: string;
  why_join: string;
  rover_excitement: string;
  hope_to_learn: string;
  project_description: string;
  technical_answers: Record<string, string>;
  hours_per_week: string;
  attend_meetings: string;
  intense_periods: string;
  hobbies: string;
  favorite_song: string | null;
  interesting_thing: string;
  team_environment: string;
  resume_path: string | null;
  linkedin: string | null;
  github: string | null;
  portfolio: string | null;
  other_clubs: string;
  which_clubs: string | null;
  why_bet_on_you: string;
  status: AppStatus;
  reviewer_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
};