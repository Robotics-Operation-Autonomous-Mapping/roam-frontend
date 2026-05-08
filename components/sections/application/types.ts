export type Department =
  | "Mechanical Engineering"
  | "Electrical Engineering"
  | "Computer Engineering"
  | "Software Development"
  | "Geomatics"
  | "Mechatronics"
  | "Business / Operations"
  | "Content & Media";

export type FormData = {
  // Section 1
  full_name: string;
  ucid: string;
  university_email: string;
  personal_email: string;
  phone: string;
  year_of_study: string;
  degree_program: string;
  // Section 2
  department: Department | "";
  // Section 3
  why_join: string;
  rover_excitement: string;
  hope_to_learn: string;
  project_description: string;
  // Section 4 — department specific (stored as key/value)
  technical: Record<string, string>;
  // Section 5
  hours_per_week: string;
  attend_meetings: string;
  intense_periods: string;
  // Section 6
  hobbies: string;
  favorite_song: string;
  interesting_thing: string;
  team_environment: string;
  // Section 7
  resume_url: string;
  linkedin: string;
  github: string;
  portfolio: string;
  // Section 8
  other_clubs: string;
  which_clubs: string;
  why_bet_on_you: string;
  // Section 9
  agree_professionalism: boolean;
  agree_contribution: boolean;
  agree_contact: boolean;
};

export type TechQuestion = {
  key: string;
  label: string;
  placeholder: string;
  maxWords: number;
  multiline?: boolean;
};

export interface FormStepProps {
  data: FormData;
  setData: React.Dispatch<React.SetStateAction<FormData>>;
  set: (field: keyof FormData, value: unknown) => void;
  setTech?: (key: string, value: string) => void;
  resumeFile?: File | null;
  setResumeFile?: React.Dispatch<React.SetStateAction<File | null>>;
}
