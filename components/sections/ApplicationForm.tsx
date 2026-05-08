"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase/client";
import { initialData, STEPS, TECH_QUESTIONS } from "./application/constants";
import { FormData, Department } from "./application/types";
import { SuccessScreen } from "./application/SuccessScreen";
import { DepartmentStep } from "./application/steps/DepartmentStep";
import { BasicInfoStep } from "./application/steps/BasicInfoStep";
import { MotivationStep } from "./application/steps/MotivationStep";
import { TechnicalStep } from "./application/steps/TechnicalStep";
import { CommitmentStep } from "./application/steps/CommitmentStep";
import { CultureStep } from "./application/steps/CultureStep";
import { LinksStep } from "./application/steps/LinksStep";
import { FinalStep } from "./application/steps/FinalStep";
import { ReviewStep } from "./application/steps/ReviewStep";

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
    setData((prev) => ({
      ...prev,
      technical: { ...prev.technical, [key]: value },
    }));

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const techQuestions = data.department
    ? TECH_QUESTIONS[data.department as Department]
    : [];

  // ─── Validation ──────────────────────────────────────────────────────────
  const canNext = (): boolean => {
    if (step === 0) return data.department !== "";
    if (step === 1)
      return !!(
        data.full_name &&
        data.ucid &&
        data.university_email &&
        data.year_of_study &&
        data.degree_program
      );
    if (step === 2)
      return !!(
        data.why_join &&
        data.rover_excitement &&
        data.hope_to_learn &&
        data.project_description
      );
    if (step === 3)
      return techQuestions.every(
        (q) => q.key === "portfolio_link" || !!data.technical[q.key],
      );
    if (step === 4)
      return !!(
        data.hours_per_week &&
        data.attend_meetings &&
        data.intense_periods
      );
    if (step === 5)
      return !!(
        data.hobbies &&
        data.interesting_thing &&
        data.team_environment
      );
    if (step === 8)
      return (
        data.agree_professionalism &&
        data.agree_contribution &&
        data.agree_contact
      );
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
      setError(
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again.",
      );
    } finally {
      setSubmitting(false);
      setResumeUploading(false);
    }
  };

  if (submitted) return <SuccessScreen data={data} />;

  const progress = (step / (STEPS.length - 1)) * 100;

  const renderStep = () => {
    const props = { data, setData, set, setTech, resumeFile, setResumeFile };
    switch (step) {
      case 0: return <DepartmentStep {...props} />;
      case 1: return <BasicInfoStep {...props} />;
      case 2: return <MotivationStep {...props} />;
      case 3: return <TechnicalStep {...props} />;
      case 4: return <CommitmentStep {...props} />;
      case 5: return <CultureStep {...props} />;
      case 6: return <LinksStep {...props} />;
      case 7: return <FinalStep {...props} />;
      case 8: return <ReviewStep {...props} error={error} />;
      default: return null;
    }
  };

  return (
    <div
      className="min-h-screen bg-[var(--color-bg)] text-[var(--color-cream)] relative"
      ref={topRef}
    >
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
              <h1 className="font-display text-3xl m-0 text-[var(--color-cream)] uppercase tracking-wide">
                Recruitment Application
              </h1>
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
            <div
              className="h-full bg-[var(--color-primary)] transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{ width: `${progress}%` }}
            />
            {STEPS.map((s, i) => (
              <div
                key={s}
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-colors duration-300"
                style={{
                  left: `${(i / (STEPS.length - 1)) * 100}%`,
                  background:
                    i <= step
                      ? "var(--color-primary)"
                      : "var(--color-surface-2)",
                  border:
                    i === step ? "2px solid var(--color-primary-2)" : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="max-w-3xl mx-auto px-6 pt-12 pb-20 relative z-10">
        {renderStep()}

        {/* ── Navigation ── */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-[var(--color-surface-2)]">
          {step > 0 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="border border-[var(--color-primary)] text-[var(--color-primary)] px-8 py-3 hover:bg-[var(--color-primary)] hover:text-white transition-all font-sans font-bold uppercase tracking-widest text-xs"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canNext() && setStep((s) => s + 1)}
              disabled={!canNext()}
              className={`${canNext() ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-2)] cursor-pointer" : "bg-[var(--color-surface-2)] text-[var(--color-muted)] cursor-not-allowed"} px-8 py-3 transition-colors font-sans font-bold uppercase tracking-widest text-xs border-none`}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canNext() || submitting || resumeUploading}
              className={`${canNext() && !submitting && !resumeUploading ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-2)] cursor-pointer" : "bg-[var(--color-surface-2)] text-[var(--color-muted)] cursor-not-allowed"} px-8 py-3 transition-colors font-sans font-bold uppercase tracking-widest text-xs border-none`}
            >
              {submitting || resumeUploading
                ? "Submitting..."
                : "Submit Application →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
