import { TEAM_EMAIL } from "@/lib/site";        // pull in the email from site.ts

export const RecruitmentClosed = () => {         // component = function returning JSX
  return (
    <section className="w-full py-32 px-6 bg-bg">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="font-display text-5xl md:text-7xl text-cream mb-6">
          RECRUITMENT IS CLOSED
        </h1>
        <p className="font-sans text-lg text-cream/80 mb-4">
          We are not accepting applications right now. Check back next term.
        </p>
        <p className="font-mono text-sm text-cream/60">
          Questions? Email {TEAM_EMAIL}            {/* { } inserts the variable */}
        </p>
      </div>
    </section>
  );
};