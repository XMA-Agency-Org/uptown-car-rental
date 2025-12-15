import type { Metadata } from "next";
import { Section } from "@/components/ui";
import { PageHero } from "@/components/sections/shared";
import { BlogGrid } from "@/components/sections/blog";
import { getAllBlogs, getTotalBlogCount } from "@/data/blogs";

export const metadata: Metadata = {
  title: "Blog | Uptown Car Rental Dubai",
  description:
    "Explore our blog for the latest news, Dubai driving guides, car rental tips, and luxury lifestyle articles. Your go-to resource for everything automotive in the UAE.",
  openGraph: {
    title: "Blog | Uptown Car Rental Dubai",
    description:
      "Explore our blog for the latest news, Dubai driving guides, car rental tips, and luxury lifestyle articles.",
  },
};

export default function BlogPage() {
  const blogs = getAllBlogs();
  const totalCount = getTotalBlogCount();

  return (
    <>
      <PageHero
        tagline="Our Blog"
        title="News & Guides"
        description={`Explore ${totalCount}+ articles covering Dubai driving guides, car rental tips, luxury lifestyle, and everything you need to know about driving in the UAE.`}
      />

      <Section spacing="none" className="pb-24">
          <BlogGrid blogs={blogs} showFilters itemsPerPage={12} />
      </Section>
    </>
  );
}
