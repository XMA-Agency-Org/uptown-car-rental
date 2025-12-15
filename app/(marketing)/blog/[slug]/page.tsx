import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArticleHero,
  ArticleContent,
  ArticleMeta,
  RelatedPosts,
} from "@/components/sections/blog";
import { getBlogBySlug, getAllBlogs } from "@/data/blogs";

interface BlogDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const blogs = getAllBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Post Not Found | Uptown Car Rental Dubai",
    };
  }

  return {
    title: `${blog.title} | Uptown Car Rental Dubai`,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: "article",
      publishedTime: blog.publishedAt,
      modifiedTime: blog.modifiedAt,
      images: blog.featuredImage ? [{ url: blog.featuredImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt,
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const { slug } = await params;
  const blog = getBlogBySlug(slug);

  if (!blog) {
    notFound();
  }

  return (
    <article>
      <ArticleHero blog={blog} />
      <ArticleMeta blog={blog} />
      <ArticleContent content={blog.content} />
      <RelatedPosts currentBlog={blog} limit={3} />
    </article>
  );
}
