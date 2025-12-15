import type { Car } from "@/types";
import carImagesData from "./car-images.json";
import cars from "./cars-data";

type CarImageData = {
  carName: string;
  carSlug: string;
  category: string;
  images: string[];
  thumbnail: string;
};

export function getImagesForSlug(
  slug: string,
): { src: string; alt: string; isPrimary?: boolean }[] {
  const carData = (carImagesData as CarImageData[]).find(
    (car) => car.carSlug === slug,
  );
  if (!carData) return [];

  return carData.images
    .filter((img) => !img.includes("UPTOWN-LOGO"))
    .map((src, index) => ({
      src,
      alt: carData.carName,
      isPrimary: index === 0,
    }));
}

export function getThumbnail(slug: string): string {
  const carData = (carImagesData as CarImageData[]).find(
    (car) => car.carSlug === slug,
  );
  return carData?.thumbnail || "";
}

export function getFeaturedCars(): Car[] {
  return cars.filter((car) => car.isFeatured && car.isAvailable);
}

export function getCarBySlug(slug: string): Car | undefined {
  return cars.find((car) => car.slug === slug);
}

export function getCarsByBrand(brand: string): Car[] {
  return cars.filter((car) => car.brand === brand && car.isAvailable);
}

export function getCarsByCategory(category: string): Car[] {
  return cars.filter((car) => car.category === category && car.isAvailable);
}

export function getSimilarCars(car: Car, limit: number = 4): Car[] {
  return cars
    .filter(
      (c) =>
        c.id !== car.id &&
        c.isAvailable &&
        (c.brand === car.brand || c.category === car.category),
    )
    .slice(0, limit);
}

export function getCarCountByBrand(): Record<string, number> {
  return cars.reduce(
    (acc, car) => {
      if (car.isAvailable) {
        acc[car.brand] = (acc[car.brand] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );
}

export function getCarCountByCategory(): Record<string, number> {
  return cars.reduce(
    (acc, car) => {
      if (car.isAvailable) {
        acc[car.category] = (acc[car.category] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>,
  );
}

export function getTotalCarCount(): number {
  return cars.filter((car) => car.isAvailable).length;
}

const brandDisplayNames: Record<string, string> = {
  "rolls-royce": "Rolls-Royce",
  lamborghini: "Lamborghini",
  ferrari: "Ferrari",
  bentley: "Bentley",
  mercedes: "Mercedes-Benz",
  bmw: "BMW",
  porsche: "Porsche",
  "range-rover": "Range Rover",
  audi: "Audi",
  mclaren: "McLaren",
  "aston-martin": "Aston Martin",
  chevrolet: "Chevrolet",
  cadillac: "Cadillac",
  mini: "MINI",
  gmc: "GMC",
  nissan: "Nissan",
  maserati: "Maserati",
};

export function getAllBrandsWithCount(): { id: string; name: string; count: number }[] {
  const counts = getCarCountByBrand();
  const uniqueBrands = [...new Set(cars.map((car) => car.brand))];

  return uniqueBrands
    .map((brandId) => ({
      id: brandId,
      name:
        brandDisplayNames[brandId] ||
        brandId
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" "),
      count: counts[brandId] || 0,
    }))
    .sort((a, b) => b.count - a.count);
}

export function getBrandDisplayName(brandId: string): string {
  return (
    brandDisplayNames[brandId] ||
    brandId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  );
}

export function getCarsByBodyType(bodyType: string): Car[] {
  return cars.filter((car) => car.category === bodyType && car.isAvailable);
}

export function getAllCars(): Car[] {
  return cars.filter((car) => car.isAvailable);
}
