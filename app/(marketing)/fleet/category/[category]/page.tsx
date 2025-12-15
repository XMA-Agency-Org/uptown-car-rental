import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Section } from "@/components/ui";
import { PageHero } from "@/components/sections/shared";
import { StaticFleetGrid } from "@/components/sections/fleet";
import { getAllCars, getFeaturedCars } from "@/data/cars";
import { CAR_CATEGORIES } from "@/lib/constants";
import type { Car } from "@/types";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return CAR_CATEGORIES.filter((cat) => cat.id !== "all").map((cat) => ({
    category: cat.id,
  }));
}

function getCategoryLabel(categoryId: string): string {
  const category = CAR_CATEGORIES.find((c) => c.id === categoryId);
  return category?.label || categoryId;
}

function getCarsByMarketingCategory(categoryId: string): Car[] {
  const allCars = getAllCars();

  switch (categoryId) {
    case "luxury":
      return allCars.filter((car) => car.pricing.daily >= 2000);
    case "business":
      return allCars.filter(
        (car) =>
          car.category === "luxury-sedan" ||
          (car.pricing.daily >= 500 && car.pricing.daily < 2000),
      );
    case "economy":
      return allCars.filter((car) => car.pricing.daily < 500);
    case "popular":
      return getFeaturedCars();
    case "new-arrivals":
      return allCars.filter((car) => car.year >= 2024);
    case "special-offers":
      return allCars.filter((car) => car.isFeatured);
    default:
      return [];
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryLabel = getCategoryLabel(category);
  const cars = getCarsByMarketingCategory(category);

  return {
    title: `${categoryLabel} Cars for Rent in Dubai | Uptown Car Rental`,
    description: `Browse our ${categoryLabel.toLowerCase()} car collection. ${cars.length} vehicles available for rent in Dubai with premium service.`,
    openGraph: {
      title: `${categoryLabel} Car Rental Dubai | Uptown`,
      description: `Rent ${categoryLabel.toLowerCase()} cars in Dubai. ${cars.length} vehicles available.`,
      images: cars[0]?.images[0]?.src ? [cars[0].images[0].src] : [],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryLabel = getCategoryLabel(category);
  const cars = getCarsByMarketingCategory(category);

  if (cars.length === 0) {
    notFound();
  }

  const descriptions: Record<string, string> = {
    luxury:
      "Experience the pinnacle of automotive excellence with our luxury collection. Premium vehicles for those who demand the best.",
    business:
      "Professional vehicles perfect for corporate travel and business meetings. Make an impression wherever you go.",
    economy:
      "Quality vehicles at competitive prices. Perfect for budget-conscious travelers without compromising on comfort.",
    popular:
      "Our most sought-after vehicles. Discover what makes these cars the top choice for our customers.",
    "new-arrivals":
      "Be the first to drive our latest additions. Fresh arrivals featuring the newest models.",
    "special-offers":
      "Limited-time deals on premium vehicles. Don't miss these exclusive rental opportunities.",
  };

  return (
    <>
      <PageHero
        tagline={categoryLabel}
        title={`${categoryLabel} Vehicles`}
        description={
          descriptions[category] ||
          `Browse our ${categoryLabel.toLowerCase()} vehicle collection available for rent in Dubai.`
        }
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Fleet", href: "/fleet" },
          { label: categoryLabel },
        ]}
      />

      <Section spacing="none" className="pb-24">
          <StaticFleetGrid
            cars={cars}
            emptyMessage={`No ${categoryLabel.toLowerCase()} vehicles available`}
          />
      </Section>
    </>
  );
}
