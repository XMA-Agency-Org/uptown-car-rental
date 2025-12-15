import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Section } from "@/components/ui";
import { PageHero } from "@/components/sections/shared";
import { StaticFleetGrid } from "@/components/sections/fleet";
import {
  getCarsByBrand,
  getAllBrandsWithCount,
  getBrandDisplayName,
} from "@/data/cars";

interface BrandPageProps {
  params: Promise<{ brand: string }>;
}

export async function generateStaticParams() {
  const brands = getAllBrandsWithCount();
  return brands.map((brand) => ({
    brand: brand.id,
  }));
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { brand } = await params;
  const brandName = getBrandDisplayName(brand);
  const cars = getCarsByBrand(brand);

  if (cars.length === 0) {
    return {
      title: "Brand Not Found",
    };
  }

  return {
    title: `Rent ${brandName} Cars in Dubai | Uptown Car Rental`,
    description: `Browse our collection of ${cars.length} ${brandName} luxury vehicles available for rent in Dubai. Premium ${brandName} car rental with delivery.`,
    openGraph: {
      title: `${brandName} Car Rental Dubai | Uptown`,
      description: `Rent ${brandName} luxury cars in Dubai. ${cars.length} vehicles available.`,
      images: cars[0]?.images[0]?.src ? [cars[0].images[0].src] : [],
    },
  };
}

export default async function BrandPage({ params }: BrandPageProps) {
  const { brand } = await params;
  const brandName = getBrandDisplayName(brand);
  const cars = getCarsByBrand(brand);

  if (cars.length === 0) {
    notFound();
  }

  return (
    <>
      <PageHero
        tagline={`${brandName} Collection`}
        title={`${brandName} Rental`}
        description={`Discover our handpicked selection of ${brandName} vehicles. Experience the pinnacle of ${brandName} engineering and luxury in Dubai.`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Fleet", href: "/fleet" },
          { label: brandName },
        ]}
      />

      <Section spacing="none" className="pb-24">
          <StaticFleetGrid
            cars={cars}
            emptyMessage={`No ${brandName} vehicles available`}
          />
      </Section>
    </>
  );
}
