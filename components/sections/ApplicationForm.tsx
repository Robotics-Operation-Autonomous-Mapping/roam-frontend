"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { SectionLabel } from "@/components/ui/SectionLabel";

// ─── Supabase client (anon key — safe for client side) ────────────────────────
const supabase = createClient(
  "https://eoqzmlalpbilwqrypwzl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvcXptbGFscGJpbHdxcnlwd3psIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxNjk0MDgsImV4cCI6MjA5Mjc0NTQwOH0.fU5dUSzfWY4nNxqnEwYDyRzDQ9w_x_PecwLEAW8QM_g"
);

// ─── Types ────────────────────────────────────────────────────────────────────
type Department =
  | "Mechanical Engineering"
  | "Electrical Engineering"
  | "Computer Engineering"
  | "Software Development"
  | "Geomatics"
  | "Mechatronics"
  | "Business / Operations"
  | "Content & Media";

type FormData = {
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

const DEPT_DESCRIPTIONS: Record<Department, string> = {
  "Mechanical Engineering": "Design chassis, suspension systems, sensor mounts, and structural systems optimized for durability and terrain performance.",
  "Electrical Engineering": "Develop power systems, motor control, wiring architecture, battery systems, and reliable sensor communication.",
  "Computer Engineering": "Work on embedded systems, low-level hardware control, firmware, interfaces, and hardware-software integration.",
  "Software Development": "Build autonomy systems using ROS 2, computer vision, path planning, mapping pipelines, and rover intelligence.",
  "Geomatics": "Process LiDAR, photogrammetry, and spatial data to generate accurate 3D maps and digital twins.",
  "Mechatronics": "Integrate sensors, actuators, controls, and mechanical systems into one coordinated rover platform.",
  "Business / Operations": "Lead sponsorships, partnerships, logistics, planning, timelines, budgeting, and internal organization.",
  "Content & Media": "Capture the build journey through photo, video, design, branding, and club communications.",
};

const DEPT_ICONS: Record<Department, string> = {
  "Mechanical Engineering": "⚙️",
  "Electrical Engineering": "⚡",
  "Computer Engineering": "💾",
  "Software Development": "🤖",
  "Geomatics": "🗺️",
  "Mechatronics": "🦾",
  "Business / Operations": "📊",
  "Content & Media": "🎥",
};

type TechQuestion = { key: string; label: string; placeholder: string; maxWords: number; multiline?: boolean };

const TECH_QUESTIONS: Record<Department, TechQuestion[]> = {
  "Mechanical Engineering": [
    { key: "torque", label: "What is torque, in simple terms?", placeholder: "Explain in your own words...", maxWords: 50 },
    { key: "chassis_design", label: "What matters when designing a rover chassis?", placeholder: "Key considerations...", maxWords: 50 },
    { key: "cad_experience", label: "Have you used CAD software? If yes, which tools?", placeholder: "e.g. SolidWorks, Fusion 360, AutoCAD...", maxWords: 50 },
  ],
  "Electrical Engineering": [
    { key: "voltage_current", label: "What is the difference between voltage and current?", placeholder: "Explain in your own words...", maxWords: 50 },
    { key: "fuse_purpose", label: "What is the purpose of a fuse?", placeholder: "In your own words...", maxWords: 50 },
    { key: "circuit_experience", label: "Have you worked with circuits, soldering, Arduino, or similar tools?", placeholder: "Describe your experience...", maxWords: 50 },
  ],
  "Computer Engineering": [
    { key: "microcontroller", label: "What is a microcontroller?", placeholder: "Explain in your own words...", maxWords: 50 },
    { key: "firmware", label: "What is firmware?", placeholder: "In your own words...", maxWords: 50 },
    { key: "embedded_experience", label: "Have you worked with embedded systems or hardware interfaces?", placeholder: "Describe your experience...", maxWords: 50 },
  ],
  "Software Development": [
    { key: "languages", label: "What programming languages do you know?", placeholder: "e.g. Python, C++, JavaScript, Rust...", maxWords: 50 },
    { key: "robotics_interest", label: "What interests you about robotics software?", placeholder: "What draws you to this space...", maxWords: 50 },
    { key: "coding_project", label: "Describe one coding project you worked on.", placeholder: "What did you build? What was your role?", maxWords: 75, multiline: true },
  ],
  "Geomatics": [
    { key: "lidar_use", label: "What is LiDAR used for?", placeholder: "Explain its purpose...", maxWords: 50 },
    { key: "mapping_importance", label: "Why is accurate mapping important for autonomy?", placeholder: "Your reasoning...", maxWords: 50 },
    { key: "gis_experience", label: "Have you used GIS, CAD, surveying, or mapping tools?", placeholder: "Tools and context...", maxWords: 50 },
  ],
  "Mechatronics": [
    { key: "feedback_control", label: "What is feedback control?", placeholder: "Explain in your own words...", maxWords: 50 },
    { key: "sensor_actuator", label: "Give one example of a sensor and actuator working together.", placeholder: "A real or hypothetical example...", maxWords: 50 },
    { key: "integrated_systems", label: "Have you built any integrated systems before?", placeholder: "Describe what you built...", maxWords: 50 },
  ],
  "Business / Operations": [
    { key: "sponsors", label: "How would you help ROAM gain sponsors?", placeholder: "Your approach...", maxWords: 75, multiline: true },
    { key: "org_strengths", label: "What organizational strengths do you bring?", placeholder: "Be specific...", maxWords: 50 },
    { key: "led_teams", label: "Have you led teams, events, or projects before?", placeholder: "Describe the experience...", maxWords: 75, multiline: true },
  ],
  "Content & Media": [
    { key: "tools", label: "What tools do you use for photo, video, or design?", placeholder: "e.g. Premiere, Lightroom, Figma, Canva...", maxWords: 50 },
    { key: "document_build", label: "How would you document a robotics build journey?", placeholder: "Your approach...", maxWords: 75, multiline: true },
    { key: "portfolio_link", label: "Share any portfolio or social media work (optional).", placeholder: "Link or handle...", maxWords: 50 },
  ],
};

const DEPARTMENTS = Object.keys(DEPT_DESCRIPTIONS) as Department[];
const STEPS = ["Department", "Basic Info", "Motivation", "Technical", "Commitment", "Culture", "Links", "Final", "Review"];

const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year+", "Graduate"];

function wordCount(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

const initialData: FormData = {
  full_name: "", ucid: "", university_email: "", personal_email: "", phone: "",
  year_of_study: "", degree_program: "", department: "",
  why_join: "", rover_excitement: "", hope_to_learn: "", project_description: "",
  technical: {},
  hours_per_week: "", attend_meetings: "", intense_periods: "",
  hobbies: "", favorite_song: "", interesting_thing: "", team_environment: "",
  resume_url: "", linkedin: "", github: "", portfolio: "",
  other_clubs: "", which_clubs: "", why_bet_on_you: "",
  agree_professionalism: false, agree_contribution: false, agree_contact: false,
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const Field: React.FC<{
  label: string; required?: boolean; hint?: string; maxWords?: number; value: string;
  children: React.ReactNode;
}> = ({ label, required, hint, maxWords, value, children }) => {
  const wc = maxWords ? wordCount(value) : 0;
  const over = maxWords ? wc > maxWords : false;
  return (
    <div className="mb-7">
      <label className="block mb-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-muted)]">
        {label}{required && <span className="text-[var(--color-primary)] ml-1">*</span>}
      </label>
      {hint && <p className="font-mono text-xs text-[var(--color-muted)] opacity-80 mb-2">{hint}</p>}
      {children}
      {maxWords && (
        <div className={`mt-1 font-mono text-[11px] text-right ${over ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]'}`}>
          {wc} / {maxWords} words
        </div>
      )}
    </div>
  );
};

const Input: React.FC<{
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}> = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-none text-[var(--color-cream)] font-mono text-sm px-4 py-3 outline-none transition-colors focus:border-[var(--color-primary)] box-border placeholder-[var(--color-muted)]"
  />
);

const Textarea: React.FC<{
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number;
}> = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-none text-[var(--color-cream)] font-mono text-sm px-4 py-3 outline-none transition-colors focus:border-[var(--color-primary)] box-border placeholder-[var(--color-muted)] resize-y leading-[1.6]"
  />
);

const Select: React.FC<{
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string;
}> = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-none text-[var(--color-cream)] font-mono text-sm px-4 py-3 outline-none transition-colors focus:border-[var(--color-primary)] box-border appearance-none cursor-pointer"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((o) => <option key={o} value={o}>{o}</option>)}
  </select>
);

const RadioGroup: React.FC<{
  value: string; onChange: (v: string) => void; options: string[];
}> = ({ value, onChange, options }) => (
  <div className="flex gap-3 flex-wrap">
    {options.map((o) => (
      <label key={o} className={`flex items-center gap-2 cursor-pointer font-mono text-[13px] px-4 py-2 transition-colors border ${value === o ? 'text-[var(--color-primary)] border-[var(--color-primary)]' : 'text-[var(--color-muted)] border-[var(--color-border)]'}`}>
        <input type="radio" checked={value === o} onChange={() => onChange(o)} className="accent-[var(--color-primary)]" />
        {o}
      </label>
    ))}
  </div>
);

// ─── Main Form ────────────────────────────────────────────────────────────────
export function ApplicationForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const set = (field: keyof FormData, value: unknown) =>
    setData((prev) => ({ ...prev, [field]: value }));
  const setTech = (key: string, value: string) =>
    setData((prev) => ({ ...prev, technical: { ...prev.technical, [key]: value } }));

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const techQuestions = data.department ? TECH_QUESTIONS[data.department as Department] : [];

  // ─── Validation ──────────────────────────────────────────────────────────
  const canNext = (): boolean => {
    if (step === 0) return data.department !== "";
    if (step === 1) return !!(data.full_name && data.ucid && data.university_email && data.year_of_study && data.degree_program);
    if (step === 2) return !!(data.why_join && data.rover_excitement && data.hope_to_learn && data.project_description);
    if (step === 3) return techQuestions.every((q) => q.key === "portfolio_link" || !!data.technical[q.key]);
    if (step === 4) return !!(data.hours_per_week && data.attend_meetings && data.intense_periods);
    if (step === 5) return !!(data.hobbies && data.interesting_thing && data.team_environment);
    if (step === 8) return data.agree_professionalism && data.agree_contribution && data.agree_contact;
    return true;
  };

  // ─── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      let resume_path = null;

      if (resumeFile) {
        setResumeUploading(true);
        const ext = resumeFile.name.split(".").pop();
        const filename = `${data.ucid}_${Date.now()}.${ext}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(filename, resumeFile, { contentType: resumeFile.type });

        if (uploadError) throw uploadError;
        resume_path = uploadData.path;
        setResumeUploading(false);
      }

      const { error: sbError } = await supabase.from("applications").insert({
        full_name: data.full_name,
        ucid: data.ucid,
        university_email: data.university_email,
        personal_email: data.personal_email || null,
        phone: data.phone || null,
        year_of_study: data.year_of_study,
        degree_program: data.degree_program,
        department: data.department,
        why_join: data.why_join,
        rover_excitement: data.rover_excitement,
        hope_to_learn: data.hope_to_learn,
        project_description: data.project_description,
        technical_answers: data.technical,
        hours_per_week: data.hours_per_week,
        attend_meetings: data.attend_meetings,
        intense_periods: data.intense_periods,
        hobbies: data.hobbies,
        favorite_song: data.favorite_song || null,
        interesting_thing: data.interesting_thing,
        team_environment: data.team_environment,
        resume_path,
        linkedin: data.linkedin || null,
        github: data.github || null,
        portfolio: data.portfolio || null,
        other_clubs: data.other_clubs,
        which_clubs: data.which_clubs || null,
        why_bet_on_you: data.why_bet_on_you,
        agreed_to_terms: true,
        status: "pending",
      });
      if (sbError) throw sbError;
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
      setResumeUploading(false);
    }
  };

  // ─── Success screen ───────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-cream)] py-20 px-6">
        <div className="max-w-3xl mx-auto text-center py-20 px-10">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="font-display text-4xl text-[var(--color-cream)] tracking-tight mb-4 uppercase">Application Received</h2>
          <p className="text-[var(--color-muted)] font-mono text-sm leading-[1.8] max-w-lg mx-auto mb-8">
            Thank you, <span className="text-[var(--color-primary)]">{data.full_name}</span>. Your application to{" "}
            <span className="text-[var(--color-primary)]">{data.department}</span> has been submitted.
            We&apos;ll be in touch at <span className="text-[var(--color-cream)]">{data.university_email}</span>.
          </p>
          <div className="font-mono text-[11px] tracking-[0.15em] text-[var(--color-muted)] uppercase">
            — ROAM Recruitment Team
          </div>
        </div>
      </div>
    );
  }

  const progress = ((step) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-cream)] relative" ref={topRef}>
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none radial-gradient(ellipse_at_20%_0%,_rgba(232,81,42,0.04)_0%,_transparent_60%),_radial-gradient(ellipse_at_80%_100%,_rgba(34,68,170,0.06)_0%,_transparent_60%)" />

      {/* Header */}
      <div className="border-b border-[var(--color-border)] py-5 relative z-10">
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <div className="font-mono text-[11px] tracking-[0.2em] text-[var(--color-primary)] uppercase mb-1">
                ROAM — Autonomous Rover Team
              </div>
              <h1 className="font-display text-3xl m-0 text-[var(--color-cream)] uppercase tracking-wide">Recruitment Application</h1>
            </div>
            <div className="font-mono text-[11px] text-[var(--color-muted)] text-right">
              <div className="tracking-[0.12em] uppercase mb-1">
                Step {step + 1} of {STEPS.length}
              </div>
              <div className="text-[var(--color-primary)]">{STEPS[step]}</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 h-[2px] bg-[var(--color-surface)] relative">
            <div className="h-full bg-[var(--color-primary)] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]" style={{ width: `${progress}%` }} />
            {STEPS.map((s, i) => (
              <div
                key={s}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors duration-300"
                style={{
                  left: `${(i / (STEPS.length - 1)) * 100}%`,
                  background: i <= step ? "var(--color-primary)" : "var(--color-surface-2)",
                  border: i === step ? "2px solid var(--color-primary-2)" : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20 relative z-10">

        {/* ── Step 0: Department Selection ── */}
        {step === 0 && (
          <div>
            <SectionHeader
              number="01"
              title="Choose Your Department"
              subtitle="Select the team you'd like to join. This determines your technical questions."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {DEPARTMENTS.map((dept) => (
                <div
                  key={dept}
                  onClick={() => set("department", dept)}
                  className={`border p-5 cursor-pointer transition-all relative group ${data.department === dept ? 'border-[var(--color-primary)] bg-[rgba(232,81,42,0.06)]' : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-muted)]'}`}
                >
                  {data.department === dept && (
                    <div className="absolute top-3 right-3 text-[var(--color-primary)] font-mono text-[11px] tracking-[0.1em]">
                      ✓ SELECTED
                    </div>
                  )}
                  <div className="text-2xl mb-2.5">{DEPT_ICONS[dept]}</div>
                  <div className={`font-mono text-[13px] tracking-[0.08em] mb-2 uppercase ${data.department === dept ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)] group-hover:text-[var(--color-cream)] transition-colors'}`}>
                    {dept}
                  </div>
                  <div className="text-xs text-[var(--color-muted)] leading-[1.6] font-mono">
                    {DEPT_DESCRIPTIONS[dept]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Basic Info ── */}
        {step === 1 && (
          <div>
            <SectionHeader number="02" title="Basic Information" subtitle="Tell us who you are." />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field label="Full Name" required value={data.full_name}>
                <Input value={data.full_name} onChange={(v) => set("full_name", v)} placeholder="Jane Smith" />
              </Field>
              <Field label="UCID" required value={data.ucid}>
                <Input value={data.ucid} onChange={(v) => set("ucid", v)} placeholder="30XXXXXXX" />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field label="University of Calgary Email" required value={data.university_email}>
                <Input type="email" value={data.university_email} onChange={(v) => set("university_email", v)} placeholder="jsmith@ucalgary.ca" />
              </Field>
              <Field label="Personal Email (Optional)" value={data.personal_email}>
                <Input type="email" value={data.personal_email} onChange={(v) => set("personal_email", v)} placeholder="jane@gmail.com" />
              </Field>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field label="Phone Number" value={data.phone}>
                <Input value={data.phone} onChange={(v) => set("phone", v)} placeholder="+1 (403) 000-0000" />
              </Field>
              <Field label="Year of Study" required value={data.year_of_study}>
                <Select value={data.year_of_study} onChange={(v) => set("year_of_study", v)} options={YEAR_OPTIONS} placeholder="Select year..." />
              </Field>
            </div>
            <Field label="Degree Program / Field of Study" required value={data.degree_program}
              hint="e.g. Mechanical Engineering, Software Engineering, Business, Communications">
              <Input value={data.degree_program} onChange={(v) => set("degree_program", v)} placeholder="Your program" />
            </Field>
          </div>
        )}

        {/* ── Step 2: Motivation ── */}
        {step === 2 && (
          <div>
            <SectionHeader number="03" title="Motivation" subtitle="We want to understand what drives you." />
            <Field label="Why do you want to join ROAM?" required maxWords={100} value={data.why_join}>
              <Textarea value={data.why_join} onChange={(v) => set("why_join", v)} placeholder="What draws you to this team specifically..." rows={4} />
            </Field>
            <Field label="What excites you most about building an autonomous rover?" required maxWords={75} value={data.rover_excitement}>
              <Textarea value={data.rover_excitement} onChange={(v) => set("rover_excitement", v)} placeholder="The part of the challenge you're most fired up about..." rows={3} />
            </Field>
            <Field label="What do you hope to learn this year?" required maxWords={75} value={data.hope_to_learn}>
              <Textarea value={data.hope_to_learn} onChange={(v) => set("hope_to_learn", v)} placeholder="Skills, knowledge, or experience you want to gain..." rows={3} />
            </Field>
            <Field label="Describe a project you built or worked on." required maxWords={150} value={data.project_description}
              hint="Class project, personal project, hobby, team project — anything relevant.">
              <Textarea value={data.project_description} onChange={(v) => set("project_description", v)} placeholder="What was it, what was your role, what did you learn..." rows={5} />
            </Field>
          </div>
        )}

        {/* ── Step 3: Technical ── */}
        {step === 3 && data.department && (
          <div>
            <SectionHeader
              number="04"
              title={`${data.department} — Technical Questions`}
              subtitle="Answer based on your current knowledge. Honesty beats bluffing."
            />
            {techQuestions.map((q) => (
              <Field key={q.key} label={q.label} required={q.key !== "portfolio_link"} maxWords={q.maxWords} value={data.technical[q.key] ?? ""}>
                {q.multiline
                  ? <Textarea value={data.technical[q.key] ?? ""} onChange={(v) => setTech(q.key, v)} placeholder={q.placeholder} rows={4} />
                  : <Input value={data.technical[q.key] ?? ""} onChange={(v) => setTech(q.key, v)} placeholder={q.placeholder} />
                }
              </Field>
            ))}
          </div>
        )}

        {/* ── Step 4: Commitment ── */}
        {step === 4 && (
          <div>
            <SectionHeader number="05" title="Commitment" subtitle="We need reliable people. Be honest about your schedule." />
            <Field label="How many hours per week can you realistically commit to ROAM?" required value={data.hours_per_week}>
              <Input value={data.hours_per_week} onChange={(v) => set("hours_per_week", v)} placeholder="e.g. 6–8 hours" />
            </Field>
            <Field label="Can you regularly attend meetings and build sessions?" required value={data.attend_meetings}>
              <RadioGroup value={data.attend_meetings} onChange={(v) => set("attend_meetings", v)} options={["Yes", "No", "Mostly"]} />
            </Field>
            <Field label="Are you willing to contribute during intense build periods near deadlines?" required value={data.intense_periods} hint="There will be crunch periods before competitions.">
              <RadioGroup value={data.intense_periods} onChange={(v) => set("intense_periods", v)} options={["Yes", "No", "Depends on schedule"]} />
            </Field>
          </div>
        )}

        {/* ── Step 5: Culture ── */}
        {step === 5 && (
          <div>
            <SectionHeader number="06" title="Personality & Culture Fit" subtitle="We build together. We want to know who you are." />
            <Field label="What hobbies do you enjoy outside school?" required maxWords={75} value={data.hobbies}>
              <Textarea value={data.hobbies} onChange={(v) => set("hobbies", v)} placeholder="Anything goes..." rows={3} />
            </Field>
            <Field label="Favorite song or artist right now?" value={data.favorite_song}>
              <Input value={data.favorite_song} onChange={(v) => set("favorite_song", v)} placeholder="Currently on repeat..." />
            </Field>
            <Field label="Tell us one interesting thing about yourself." required maxWords={75} value={data.interesting_thing}>
              <Textarea value={data.interesting_thing} onChange={(v) => set("interesting_thing", v)} placeholder="Something unexpected..." rows={3} />
            </Field>
            <Field label="What kind of team environment helps you do your best work?" required maxWords={75} value={data.team_environment}>
              <Textarea value={data.team_environment} onChange={(v) => set("team_environment", v)} placeholder="How you work best with others..." rows={3} />
            </Field>
          </div>
        )}

        {/* ── Step 6: Resume / Links ── */}
        {step === 6 && (
          <div>
            <SectionHeader number="07" title="Resume & Links" subtitle="Share your work. All fields optional except what's marked." />
            <Field label="Resume" value="" hint="PDF preferred. Max 5MB.">
              <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                  className="w-full font-mono text-[13px] text-[var(--color-muted)] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[11px] file:font-sans file:font-bold file:bg-[var(--color-surface-2)] file:text-[var(--color-cream)] hover:file:bg-[var(--color-border)] file:transition-colors file:cursor-pointer cursor-pointer"
                />
                {resumeFile && (
                  <div className="mt-3 font-mono text-[11px] text-[var(--color-primary)]">
                    ✓ {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)
                  </div>
                )}
              </div>
            </Field>
            <Field label="LinkedIn (Optional)" value={data.linkedin}>
              <Input value={data.linkedin} onChange={(v) => set("linkedin", v)} placeholder="https://linkedin.com/in/..." />
            </Field>
            <Field label="GitHub (Optional)" value={data.github}>
              <Input value={data.github} onChange={(v) => set("github", v)} placeholder="https://github.com/..." />
            </Field>
            <Field label="Portfolio / Personal Website (Optional)" value={data.portfolio}>
              <Input value={data.portfolio} onChange={(v) => set("portfolio", v)} placeholder="https://..." />
            </Field>
          </div>
        )}

        {/* ── Step 7: Other Commitments ── */}
        {step === 7 && (
          <div>
            <SectionHeader number="08" title="Final Questions" subtitle="Almost done." />
            <Field label="Are you applying to other clubs or design teams?" required value={data.other_clubs}>
              <RadioGroup value={data.other_clubs} onChange={(v) => set("other_clubs", v)} options={["Yes", "No"]} />
            </Field>
            {data.other_clubs === "Yes" && (
              <Field label="If yes, which ones?" value={data.which_clubs}>
                <Input value={data.which_clubs} onChange={(v) => set("which_clubs", v)} placeholder="Team names..." />
              </Field>
            )}
            <Field label="Why should ROAM bet on you?" required maxWords={100} value={data.why_bet_on_you}>
              <Textarea value={data.why_bet_on_you} onChange={(v) => set("why_bet_on_you", v)} placeholder="Make your case..." rows={4} />
            </Field>
          </div>
        )}

        {/* ── Step 8: Review & Agreement ── */}
        {step === 8 && (
          <div>
            <SectionHeader number="09" title="Review & Agreement" subtitle="Confirm your details and agree to our team expectations." />

            {/* Summary card */}
            <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mb-8">
              <div className="font-mono text-[11px] tracking-[0.15em] text-[var(--color-primary)] uppercase mb-4">Application Summary</div>
              <div className="grid grid-cols-[140px_1fr] gap-x-5 gap-y-2.5">
                <ReviewRow label="Name" value={data.full_name} />
                <ReviewRow label="UCID" value={data.ucid} />
                <ReviewRow label="Email" value={data.university_email} />
                <ReviewRow label="Year" value={data.year_of_study} />
                <ReviewRow label="Program" value={data.degree_program} />
                <ReviewRow label="Department" value={data.department} />
                <ReviewRow label="Hours / Week" value={data.hours_per_week} />
                <ReviewRow label="Attends Meetings" value={data.attend_meetings} />
              </div>
            </div>

            {/* Agreement */}
            <div className="font-mono text-[11px] tracking-[0.15em] text-[var(--color-primary)] uppercase mb-4">
              Agreement — All Required
            </div>
            {[
              { key: "agree_professionalism" as const, text: "I understand ROAM values professionalism, reliability, respect, and teamwork." },
              { key: "agree_contribution" as const, text: "I understand consistent contribution matters." },
              { key: "agree_contact" as const, text: "I consent to being contacted regarding recruitment." },
            ].map(({ key, text }) => (
              <label key={key} className={`flex items-start gap-3 mb-4 cursor-pointer font-mono text-[13px] leading-[1.6] ${data[key] ? 'text-[var(--color-cream)]' : 'text-[var(--color-muted)]'}`}>
                <input
                  type="checkbox"
                  checked={data[key]}
                  onChange={(e) => set(key, e.target.checked)}
                  className="accent-[var(--color-primary)] mt-[3px] shrink-0"
                />
                {text}
              </label>
            ))}

            {error && (
              <div className="border border-[var(--color-primary)] p-3 font-mono text-xs text-[var(--color-primary)] mt-4">
                {error}
              </div>
            )}
          </div>
        )}

        {/* ── Navigation ── */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-[var(--color-surface-2)]">
          {step > 0 ? (
            <button onClick={() => setStep((s) => s - 1)} className="border border-[var(--color-primary)] text-[var(--color-primary)] px-8 py-3 hover:bg-[var(--color-primary)] hover:text-white transition-all font-sans font-bold uppercase tracking-widest text-xs">
              ← Back
            </button>
          ) : <div />}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canNext() && setStep((s) => s + 1)}
              disabled={!canNext()}
              className={`${canNext() ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-2)] cursor-pointer' : 'bg-[var(--color-surface-2)] text-[var(--color-muted)] cursor-not-allowed'} px-8 py-3 transition-colors font-sans font-bold uppercase tracking-widest text-xs border-none`}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canNext() || submitting || resumeUploading}
              className={`${canNext() && !submitting && !resumeUploading ? 'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-2)] cursor-pointer' : 'bg-[var(--color-surface-2)] text-[var(--color-muted)] cursor-not-allowed'} px-8 py-3 transition-colors font-sans font-bold uppercase tracking-widest text-xs border-none`}
            >
              {submitting || resumeUploading ? "Submitting..." : "Submit Application →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────
const SectionHeader: React.FC<{ number: string; title: string; subtitle: string }> = ({ number, title, subtitle }) => (
  <div className="mb-10">
    <SectionLabel>Section {number}</SectionLabel>
    <h2 className="font-display text-4xl mt-2 text-[var(--color-cream)] uppercase tracking-wide">{title}</h2>
    <p className="font-mono text-[13px] text-[var(--color-muted)] mt-1.5">{subtitle}</p>
  </div>
);

const ReviewRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <>
    <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--color-muted)] uppercase mt-1">{label}</div>
    <div className="font-mono text-[13px] text-[var(--color-cream)]">{value || "—"}</div>
  </>
);
