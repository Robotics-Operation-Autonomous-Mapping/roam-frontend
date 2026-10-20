"use client";

const FORMS = [
  {
    title: "Reimbursement Request",
    description: "Already paid for something for ROAM? Submit your receipts here to be paid back.",
    href: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=7KAJxuOlMUaWhhkigL2RUe_iR22INTtGsP5BpW2ivThUOUNBN1lGOUpVUjdRVkxYNjhaUThLUk1OUSQlQCN0PWcu",
  },
  {
    title: "Purchase Request",
    description: "Need ROAM to buy something? Request it here before purchasing.",
    href: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=7KAJxuOlMUaWhhkigL2RUe_iR22INTtGsP5BpW2ivThUOUNBN1lGOUpVUjdRVkxYNjhaUThLUk1OUSQlQCN0PWcu",
  },
];

export function ReimbursementPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
      <h1 className="font-mono text-sm tracking-[0.2em] mb-2">
        REIMBURSEMENTS &amp; PURCHASES
      </h1>
      <p className="text-sm text-[var(--admin-muted)] mb-8">
        Forms for subteam leads. Each opens in a new tab.
      </p>

      <div className="flex flex-col gap-4">
        {FORMS.map((form) => (
          <a
            key={form.title}
            href={form.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 hover:border-[var(--admin-accent)] transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-mono text-[13px] tracking-[0.1em]">{form.title}</h2>
                <p className="text-sm text-[var(--admin-muted)] mt-1">{form.description}</p>
              </div>
              <span className="font-mono text-lg text-[var(--admin-accent)]">↗</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}