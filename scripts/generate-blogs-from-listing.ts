import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import type { BlogPost, BlogCategory } from "../types/blog";

const BLOG_LISTING_DATA = `
[Your Guide to Rent a Car Sports in Dubai](https://www.uptowndxb.com/rent-a-car-sports/)|https://cdn-ffnkj.nitrocdn.com/cFfqdBkZFiUjzYoAZoGEosoDurerCqIA/assets/images/optimized/rev-c71f5c4/www.uptowndxb.com/wp-content/uploads/2025/12/rent-a-car-sports-sports-car-768x432.jpg
[Your Guide to Abu Dhabi Salik Free Time and Tolls](https://www.uptowndxb.com/abu-dhabi-salik-free-time/)|https://cdn-ffnkj.nitrocdn.com/cFfqdBkZFiUjzYoAZoGEosoDurerCqIA/assets/images/optimized/rev-c71f5c4/www.uptowndxb.com/wp-content/uploads/2025/12/abu-dhabi-salik-free-time-salik-sign-768x432.jpg
[Dubai to Muscat by Road A Complete Driver's Guide](https://www.uptowndxb.com/dubai-to-muscat-by-road/)|https://cdn-ffnkj.nitrocdn.com/cFfqdBkZFiUjzYoAZoGEosoDurerCqIA/assets/images/optimized/rev-c71f5c4/www.uptowndxb.com/wp-content/uploads/2025/12/dubai-to-muscat-by-road-road-trip-768x432.jpg
[Your Guide to a Long Term Car Lease in Abu Dhabi](https://www.uptowndxb.com/long-term-car-lease-in-abu-dhabi/)|https://cdn-ffnkj.nitrocdn.com/cFfqdBkZFiUjzYoAZoGEosoDurerCqIA/assets/images/optimized/rev-c71f5c4/www.uptowndxb.com/wp-content/uploads/2025/12/long-term-car-lease-in-abu-dhabi-car-lease-768x432.jpg
[How to Rent a Cadillac Escalade in Dubai A Practical Guide](https://www.uptowndxb.com/rent-a-cadillac-escalade/)|https://cdn-ffnkj.nitrocdn.com/cFfqdBkZFiUjzYoAZoGEosoDurerCqIA/assets/images/optimized/rev-c71f5c4/www.uptowndxb.com/wp-content/uploads/2025/12/rent-a-cadillac-escalade-escalade-rental-768x432.jpg
[Your Ultimate Guide to Mustang Car Rental Dubai](https://www.uptowndxb.com/mustang-car-rental-dubai/)|https://cdn-ffnkj.nitrocdn.com/cFfqdBkZFiUjzYoAZoGEosoDurerCqIA/assets/images/optimized/rev-c71f5c4/www.uptowndxb.com/wp-content/uploads/2025/12/mustang-car-rental-dubai-dubai-mustang-768x432.jpg
`.trim();

interface BlogEntry {
  title: string;
  url: string;
  slug: string;
  featuredImage: string;
}

function extractSlugFromUrl(url: string): string {
  const cleanUrl = url.replace(/\/$/, "");
  return cleanUrl.split("/").pop() || "";
}

function categorizeBySlug(slug: string): BlogCategory {
  const lowerSlug = slug.toLowerCase();

  if (
    lowerSlug.includes("rent") ||
    lowerSlug.includes("rental") ||
    lowerSlug.includes("hire") ||
    lowerSlug.includes("lease")
  ) {
    return "car-rental";
  }

  if (
    lowerSlug.includes("dubai") &&
    (lowerSlug.includes("thing") ||
      lowerSlug.includes("place") ||
      lowerSlug.includes("attraction") ||
      lowerSlug.includes("restaurant") ||
      lowerSlug.includes("beach"))
  ) {
    return "dubai-guide";
  }

  if (
    lowerSlug.includes("driving") ||
    lowerSlug.includes("license") ||
    lowerSlug.includes("parking") ||
    lowerSlug.includes("toll") ||
    lowerSlug.includes("salik") ||
    lowerSlug.includes("traffic") ||
    lowerSlug.includes("road")
  ) {
    return "driving-tips";
  }

  if (
    lowerSlug.includes("luxury") ||
    lowerSlug.includes("rolls") ||
    lowerSlug.includes("bentley") ||
    lowerSlug.includes("lamborghini") ||
    lowerSlug.includes("ferrari")
  ) {
    return "luxury-lifestyle";
  }

  if (
    lowerSlug.includes("trip") ||
    lowerSlug.includes("getaway") ||
    lowerSlug.includes("oman") ||
    lowerSlug.includes("safari") ||
    lowerSlug.includes("border")
  ) {
    return "travel";
  }

  return "car-rental";
}

function generateExcerpt(title: string): string {
  const excerpts: Record<string, string> = {
    rent: "Discover the best options for car rental in Dubai with our comprehensive guide.",
    luxury: "Experience ultimate luxury with premium vehicles available for rent in Dubai.",
    driving: "Essential tips and information for driving in the UAE.",
    dubai: "Your complete guide to experiencing the best of Dubai.",
    mustang: "Feel the power and style of a Ford Mustang on Dubai's iconic roads.",
    rolls: "Experience unmatched elegance with Rolls-Royce rental in Dubai.",
    bentley: "Drive in sophistication with Bentley rentals available across Dubai.",
    lamborghini: "Unleash the thrill of driving a Lamborghini supercar in Dubai.",
    ferrari: "Feel the racing heritage with Ferrari rentals in the heart of Dubai.",
    porsche: "German engineering excellence awaits with Porsche rentals in Dubai.",
    mercedes: "Luxury meets performance with Mercedes-Benz rentals in Dubai.",
    bmw: "Experience ultimate driving pleasure with BMW rentals in Dubai.",
    audi: "German luxury and innovation with Audi car rentals in Dubai.",
    range: "Command the road with Range Rover rentals perfect for Dubai terrain.",
    suv: "Spacious and powerful SUV rentals for your Dubai adventures.",
    seater: "Family-friendly vehicle rentals with ample space for everyone.",
    chauffeur: "Professional chauffeur services for a premium Dubai experience.",
    airport: "Convenient car rental and transfer services at Dubai airports.",
    monthly: "Flexible long-term car rental options with competitive monthly rates.",
    weekly: "Short-term weekly car rental deals for your Dubai stay.",
    wedding: "Make your special day unforgettable with luxury wedding car rentals.",
    desert: "Adventure awaits with vehicles perfect for Dubai desert experiences.",
    oman: "Cross-border travel guide for your journey from Dubai to Oman.",
  };

  const lowerTitle = title.toLowerCase();
  for (const [keyword, excerpt] of Object.entries(excerpts)) {
    if (lowerTitle.includes(keyword)) {
      return excerpt;
    }
  }

  return "Explore our comprehensive guide for the best car rental experience in Dubai.";
}

function estimateReadingTime(): string {
  const times = ["3 min read", "4 min read", "5 min read", "6 min read", "7 min read"];
  return times[Math.floor(Math.random() * times.length)];
}

async function fetchBlogMetadata(url: string): Promise<Partial<BlogEntry> | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const html = await response.text();

    const ogImageMatch = html.match(/og:image"\s*content="([^"]+)"/i);
    const featuredImage = ogImageMatch ? ogImageMatch[1] : "";

    return { featuredImage };
  } catch {
    return null;
  }
}

async function main() {
  console.log("🚀 Generating blog data from listing page...\n");

  const blogUrls = [
    "https://www.uptowndxb.com/rent-a-car-sports/",
    "https://www.uptowndxb.com/abu-dhabi-salik-free-time/",
    "https://www.uptowndxb.com/dubai-to-muscat-by-road/",
    "https://www.uptowndxb.com/long-term-car-lease-in-abu-dhabi/",
    "https://www.uptowndxb.com/rent-a-cadillac-escalade/",
    "https://www.uptowndxb.com/mustang-car-rental-dubai/",
    "https://www.uptowndxb.com/rent-a-benz/",
    "https://www.uptowndxb.com/rolls-royce-rental-dubai/",
    "https://www.uptowndxb.com/mercedes-rent-in-dubai/",
    "https://www.uptowndxb.com/ferrari-car-for-rent-in-dubai/",
    "https://www.uptowndxb.com/mustang-dubai-rent/",
    "https://www.uptowndxb.com/ferrari-car-rental-in-dubai/",
    "https://www.uptowndxb.com/suv-rent-a-car-dubai/",
    "https://www.uptowndxb.com/rent-sports-car/",
    "https://www.uptowndxb.com/rent-audi-in-dubai/",
    "https://www.uptowndxb.com/luxury-car-hire-dubai-prices/",
    "https://www.uptowndxb.com/best-road-trips-from-dubai/",
    "https://www.uptowndxb.com/dubai-road-map/",
    "https://www.uptowndxb.com/mustang-for-rent-in-dubai/",
    "https://www.uptowndxb.com/rolls-royce-rental-in-dubai/",
    "https://www.uptowndxb.com/porsche-rental-dubai/",
    "https://www.uptowndxb.com/mercedes-for-rent-in-dubai/",
    "https://www.uptowndxb.com/rental-bentley-dubai/",
    "https://www.uptowndxb.com/7-car-seater-rental/",
    "https://www.uptowndxb.com/rent-mustang-in-dubai/",
    "https://www.uptowndxb.com/mercedes-benz-rentals/",
    "https://www.uptowndxb.com/rent-a-corvette-dubai/",
    "https://www.uptowndxb.com/rent-a-mustang-dubai/",
    "https://www.uptowndxb.com/mercedes-for-rent/",
    "https://www.uptowndxb.com/rent-an-audi-in-dubai/",
    "https://www.uptowndxb.com/bentley-rent-dubai/",
    "https://www.uptowndxb.com/dubai-oman-border/",
    "https://www.uptowndxb.com/dubai-parking-zones-map/",
    "https://www.uptowndxb.com/how-to-get-salik-tag/",
    "https://www.uptowndxb.com/weekly-car-rental/",
    "https://www.uptowndxb.com/what-to-do-in-dubai-at-night/",
    "https://www.uptowndxb.com/how-to-park-in-dubai/",
    "https://www.uptowndxb.com/driving-to-oman-from-dubai/",
    "https://www.uptowndxb.com/long-term-rent-a-car-dubai/",
    "https://www.uptowndxb.com/self-drive-desert-safari-dubai/",
    "https://www.uptowndxb.com/best-time-to-visit-dubai/",
    "https://www.uptowndxb.com/event-management-checklist/",
    "https://www.uptowndxb.com/luxury-car-hire-dubai-airport/",
    "https://www.uptowndxb.com/wedding-car-rental-dubai/",
    "https://www.uptowndxb.com/car-rental-dubai-monthly/",
    "https://www.uptowndxb.com/short-trips-from-dubai/",
    "https://www.uptowndxb.com/anniversary-celebration-ideas/",
    "https://www.uptowndxb.com/weekend-getaways-uae/",
    "https://www.uptowndxb.com/dubai-airport-car-rental/",
    "https://www.uptowndxb.com/weekend-getaways-from-dubai/",
  ];

  const blogTitles: Record<string, string> = {
    "rent-a-car-sports": "Your Guide to Rent a Car Sports in Dubai",
    "abu-dhabi-salik-free-time": "Your Guide to Abu Dhabi Salik Free Time and Tolls",
    "dubai-to-muscat-by-road": "Dubai to Muscat by Road A Complete Driver's Guide",
    "long-term-car-lease-in-abu-dhabi": "Your Guide to a Long Term Car Lease in Abu Dhabi",
    "rent-a-cadillac-escalade": "How to Rent a Cadillac Escalade in Dubai A Practical Guide",
    "mustang-car-rental-dubai": "Your Ultimate Guide to Mustang Car Rental Dubai",
    "rent-a-benz": "Your Guide to Rent a Benz in Dubai for the Ultimate Luxury Experience",
    "rolls-royce-rental-dubai": "Rolls-Royce Rental Dubai The Ultimate Luxury Driving Guide",
    "mercedes-rent-in-dubai": "Your Complete Guide to a Mercedes Rent in Dubai",
    "ferrari-car-for-rent-in-dubai": "Your Guide to a Ferrari Car for Rent in Dubai",
    "mustang-dubai-rent": "Your Guide to Mustang Dubai Rent",
    "ferrari-car-rental-in-dubai": "Ferrari Car Rental in Dubai Your Ultimate Guide",
    "suv-rent-a-car-dubai": "SUV Rent a Car Dubai Your Ultimate Guide",
    "rent-sports-car": "How to rent sports car in Dubai: Insider tips",
    "rent-audi-in-dubai": "Rent Audi in Dubai: Your Fast Guide to Luxury Car Hire",
    "luxury-car-hire-dubai-prices": "Luxury Car Hire Dubai Prices Your Complete Guide",
    "best-road-trips-from-dubai": "Top 10 Best Road Trips from Dubai for Your 2025 Adventure",
    "dubai-road-map": "Dubai Road Map A Guide to Driving and Navigating",
    "mustang-for-rent-in-dubai": "Your Guide to Mustang for Rent in Dubai",
    "rolls-royce-rental-in-dubai": "A Guide to Rolls Royce Rental in Dubai",
    "porsche-rental-dubai": "Porsche Rental Dubai: Your Guide to Driving Thrills",
    "mercedes-for-rent-in-dubai": "Mercedes for Rent in Dubai Your Complete Guide",
    "rental-bentley-dubai": "Rental Bentley Dubai Your Ultimate Luxury Guide",
    "7-car-seater-rental": "A Guide to Your 7 Car Seater Rental in Dubai",
    "rent-mustang-in-dubai": "rent mustang in dubai: Top deals, tips & routes",
    "mercedes-benz-rentals": "A Guide to Mercedes Benz Rentals in Dubai",
    "rent-a-corvette-dubai": "Rent a Corvette Dubai Ultimate Guide",
    "rent-a-mustang-dubai": "Rent a Mustang Dubai An Ultimate How-To Guide",
    "mercedes-for-rent": "Your Guide to Mercedes for Rent in Dubai",
    "rent-an-audi-in-dubai": "Your Guide to Rent an Audi in Dubai",
    "bentley-rent-dubai": "bentley rent dubai: Luxury car guide & booking",
    "dubai-oman-border": "Your Guide to the Dubai Oman Border Crossing",
    "dubai-parking-zones-map": "Your Guide to the Dubai Parking Zones Map",
    "how-to-get-salik-tag": "how to get salik tag in Dubai: easy guide",
    "weekly-car-rental": "Your Guide to Weekly Car Rental in Dubai",
    "what-to-do-in-dubai-at-night": "what to do in dubai at night: 8 unmissable experiences",
    "how-to-park-in-dubai": "How to Park in Dubai A Stress-Free Guide",
    "driving-to-oman-from-dubai": "Driving to Oman from Dubai A Practical Guide",
    "long-term-rent-a-car-dubai": "Long Term Rent a Car Dubai Your Ultimate Guide",
    "self-drive-desert-safari-dubai": "self drive desert safari dubai: Learn Dune Driving Essentials",
    "best-time-to-visit-dubai": "best time to visit dubai: 2025 Month-by-Month Guide",
    "event-management-checklist": "Event Management Checklist: 7 Essential Tips for 2025",
    "luxury-car-hire-dubai-airport": "Luxury Car Hire Dubai Airport Guide",
    "wedding-car-rental-dubai": "7 Top Choices for Wedding Car Rental Dubai in 2025",
    "car-rental-dubai-monthly": "Your Guide to Car Rental Dubai Monthly",
    "short-trips-from-dubai": "7 Unforgettable Short Trips from Dubai for 2025",
    "anniversary-celebration-ideas": "9 Upscale Anniversary Celebration Ideas for Dubai in 2025",
    "weekend-getaways-uae": "Top Weekend Getaways UAE 2025 | Explore Stunning Destinations",
    "dubai-airport-car-rental": "A Guide to Dubai Airport Car Rental",
    "weekend-getaways-from-dubai": "Top Weekend Getaways from Dubai for a Perfect Short Break",
  };

  const blogs: BlogPost[] = [];

  console.log(`Processing ${blogUrls.length} blog posts...`);

  for (let i = 0; i < blogUrls.length; i++) {
    const url = blogUrls[i];
    const slug = extractSlugFromUrl(url);
    const title = blogTitles[slug] || slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

    console.log(`[${i + 1}/${blogUrls.length}] Fetching metadata: ${slug}`);

    const metadata = await fetchBlogMetadata(url);

    const blog: BlogPost = {
      id: `blog-${i + 1}`,
      slug,
      title,
      excerpt: generateExcerpt(title),
      content: "",
      featuredImage: metadata?.featuredImage || `https://www.uptowndxb.com/wp-content/uploads/2021/10/Lamborghini-Spyder-Yellow-FTIM.jpg`,
      publishedAt: new Date(Date.now() - i * 86400000).toISOString(),
      readingTime: estimateReadingTime(),
      category: categorizeBySlug(slug),
      tags: [],
    };

    blogs.push(blog);

    await new Promise(resolve => setTimeout(resolve, 200));
  }

  if (!existsSync("./data")) {
    await mkdir("./data", { recursive: true });
  }

  const tsContent = `import type { BlogPost } from "@/types";

export const blogs: BlogPost[] = ${JSON.stringify(blogs, null, 2)};
`;

  await writeFile("./data/blogs-data.ts", tsContent);
  console.log("\n✅ Generated ./data/blogs-data.ts");

  const categories = blogs.reduce((acc, blog) => {
    acc[blog.category] = (acc[blog.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log("\n📊 Summary:");
  console.log(`  Total blogs: ${blogs.length}`);
  console.log("  By category:");
  Object.entries(categories).forEach(([cat, count]) => {
    console.log(`    ${cat}: ${count}`);
  });
}

main().catch(console.error);
