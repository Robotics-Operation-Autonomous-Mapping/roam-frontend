import type { Appearance } from "@clerk/types";

/** Shared Clerk UI theme — cream text on ROAM dark surfaces. */
export const clerkAppearance: Appearance = {
  variables: {
    colorPrimary: "#E8512A",
    colorDanger: "#E8512A",
    colorSuccess: "#4ade80",
    colorWarning: "#F07A50",
    colorBackground: "#111113",
    colorInputBackground: "#0A0A0B",
    colorInputText: "#F5ECD7",
    colorText: "#F5ECD7",
    colorTextSecondary: "#A8A29A",
    colorTextOnPrimaryBackground: "#0A0A0B",
    colorNeutral: "#F5ECD7",
    borderRadius: "0px",
    fontFamily: "var(--font-sans), ui-sans-serif, system-ui, sans-serif",
    fontFamilyButtons: "var(--font-mono), ui-monospace, monospace",
  },
  elements: {
    rootBox: "mx-auto",
    card: "bg-[#111113] border border-[#222226] shadow-none",
    headerTitle: "text-[#F5ECD7] font-sans",
    headerSubtitle: "text-[#A8A29A]",
    socialButtonsBlockButton:
      "bg-[#0A0A0B] border border-[#222226] text-[#F5ECD7] hover:border-[#E8512A] hover:bg-[#1A1A1E]",
    socialButtonsBlockButtonText: "text-[#F5ECD7]",
    dividerLine: "bg-[#222226]",
    dividerText: "text-[#6B6B72]",
    formFieldLabel: "text-[#A8A29A]",
    formFieldInput:
      "bg-[#0A0A0B] border border-[#222226] text-[#F5ECD7] placeholder:text-[#6B6B72] focus:border-[#E8512A]",
    formButtonPrimary:
      "bg-[#E8512A] text-[#0A0A0B] hover:bg-[#F07A50] shadow-none rounded-none",
    footerActionText: "text-[#A8A29A]",
    footerActionLink: "text-[#E8512A] hover:text-[#F07A50]",
    identityPreviewText: "text-[#F5ECD7]",
    identityPreviewEditButton: "text-[#E8512A]",
    formFieldInputShowPasswordButton: "text-[#A8A29A]",
    otpCodeFieldInput: "bg-[#0A0A0B] border-[#222226] text-[#F5ECD7]",
    alternativeMethodsBlockButton: "text-[#F5ECD7] border-[#222226]",
    formResendCodeLink: "text-[#E8512A]",
    alertText: "text-[#F5ECD7]",
    formFieldSuccessText: "text-[#4ade80]",
    formFieldErrorText: "text-[#E8512A]",
    footer: "bg-[#111113] border-t border-[#222226]",
  },
};
