import type { Metadata } from "next";
import {
  HeroSection,
  CategorySection,
  CTASection,
  TrustSignals,
  TestimonialsSection,
  BookingSection,
} from "@/components/sections/home";
import { FAQSection } from "@/components/sections/shared";

export const metadata: Metadata = {
  title: "Luxury Car Rental Dubai | Uptown Rent a Car",
  description:
    "Premium luxury car rental in Dubai. Rent Rolls Royce, Lamborghini, Ferrari, Bentley and more exotic cars. 24/7 delivery, competitive prices.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <CategorySection
        id="featured-cars"
        title="Our Featured Cars"
        category="featured"
        viewAllHref="/fleet"
      />

      <CategorySection
        id="exotic-cars"
        title="Exotic Cars"
        category="exotic"
        viewAllHref="/fleet/body-type/supercar"
      />

      <CategorySection
        id="suv-collection"
        title="Luxury SUVs"
        category="suv"
        viewAllHref="/fleet/body-type/suv"
      />

      {/* <CategorySection */}
      {/*   id="convertibles" */}
      {/*   title="Convertibles" */}
      {/*   subtitle="Open Air Freedom" */}
      {/*   description="Feel the Dubai breeze with our stunning convertible collection. Perfect for coastal drives and unforgettable experiences." */}
      {/*   category="convertible" */}
      {/*   viewAllHref="/fleet/body-type/convertible" */}
      {/*   alternateBackground */}
      {/* /> */}

      {/* <CategorySection */}
      {/*   id="sport-cars" */}
      {/*   title="Sport Cars" */}
      {/*   subtitle="Performance Driven" */}
      {/*   description="Experience precision engineering and thrilling performance with our collection of Porsches and sports cars." */}
      {/*   category="sports" */}
      {/*   viewAllHref="/fleet/body-type/sports" */}
      {/* /> */}

      <TrustSignals />

      <TestimonialsSection />

      <FAQSection limit={5} />

      <BookingSection />

    </>
  );
}
