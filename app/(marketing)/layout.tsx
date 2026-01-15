import dynamic from "next/dynamic";
import { Header, Footer } from "@/components/layout";

const WhatsAppCTA = dynamic(
  () => import("@/components/features/WhatsAppCTA").then((mod) => mod.WhatsAppCTA)
);

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppCTA />
    </>
  );
}
