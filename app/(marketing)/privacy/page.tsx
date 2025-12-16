import { Metadata } from "next";
import { PageHero } from "@/components/sections/shared";
import { PrivacyContent } from "@/components/sections/privacy";
import { CTASection } from "@/components/sections/home";

export const metadata: Metadata = {
  title: "Privacy Policy | Uptown Car Rental Dubai",
  description:
    "Learn how Uptown Rent A Car LLC collects, uses, and protects your personal information. Read our privacy and cookie policy.",
  openGraph: {
    title: "Privacy Policy | Uptown Car Rental",
    description:
      "Privacy and cookie policy for Uptown Rent A Car LLC in Dubai, UAE.",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        tagline="Legal"
        title="Privacy Policy"
        description="Your privacy is important to us. Learn how we collect, use, and protect your personal information."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <PrivacyContent />

      <CTASection />
    </>
  );
}
