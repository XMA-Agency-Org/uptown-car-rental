import { writeFile, mkdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import type { BlogPost, BlogCategory } from "../types/blog";

const BASE_URL = "https://www.uptowndxb.com";
const DELAY_MS = 300;

interface ScrapedBlog {
  url: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  publishedAt: string;
  modifiedAt: string;
  readingTime: string;
  category: string;
  tags: string[];
}

function extractSlugFromUrl(url: string): string {
  const cleanUrl = url.replace(/\/$/, "");
  return cleanUrl.split("/").pop() || "";
}

function normalizeCategory(category: string): BlogCategory {
  const categoryMap: Record<string, BlogCategory> = {
    "uncategorized": "uncategorized",
    "dubai": "dubai-guide",
    "dubai guide": "dubai-guide",
    "car rental": "car-rental",
    "rental": "car-rental",
    "driving": "driving-tips",
    "driving tips": "driving-tips",
    "luxury": "luxury-lifestyle",
    "lifestyle": "luxury-lifestyle",
    "travel": "travel",
  };

  const lowerCategory = category.toLowerCase().trim();
  return categoryMap[lowerCategory] || "uncategorized";
}

function fixMojibake(text: string): string {
  return text
    .replace(/â€œ/g, '"')
    .replace(/â€/g, '"')
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€"/g, "—")
    .replace(/â€"/g, "–")
    .replace(/â€¦/g, "...")
    .replace(/Â /g, " ")
    .replace(/Â·/g, "·")
    .replace(/â€¢/g, "•")
    .replace(/Ã©/g, "é")
    .replace(/Ã¨/g, "è")
    .replace(/Ã /g, "à")
    .replace(/Ã¢/g, "â")
    .replace(/Ã®/g, "î")
    .replace(/Ã´/g, "ô")
    .replace(/Ã»/g, "û")
    .replace(/Ã§/g, "ç")
    .replace(/ï‚·/g, "•")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#039;/g, "'");
}

function cleanMarkdownContent(markdown: string): string {
  let content = markdown;

  content = fixMojibake(content);

  content = content.replace(/\[Skip to content\][^\n]*\n?/gi, "");
  content = content.replace(/\[Call \+971[^\]]*\][^\n]*\n?/gi, "");
  content = content.replace(/\[Whats \+971[^\]]*\][^\n]*\n?/gi, "");
  content = content.replace(/Booking Date : From[\s\S]*?Send\n?/gi, "");
  content = content.replace(/## OR[\s\S]*$/gi, "");
  content = content.replace(/Choose Car Model[\s\S]*?NISSAN KICKS white 2021\n?/gi, "");
  content = content.replace(/#### Like this article\?[\s\S]*?Share on Pinterest\n?/gi, "");
  content = content.replace(/Share on Facebook\n?/gi, "");
  content = content.replace(/Share on Twitter\n?/gi, "");
  content = content.replace(/Share on Linkdin\n?/gi, "");
  content = content.replace(/Share on Pinterest\n?/gi, "");
  content = content.replace(/<Base64-Image-Removed>/g, "");
  content = content.replace(/!\[\]\(<Base64-Image-Removed>\)/g, "");

  content = content.replace(/\n{3,}/g, "\n\n");
  content = content.trim();

  return content;
}

function extractExcerpt(content: string, maxLength: number = 200): string {
  const lines = content.split("\n").filter(line => {
    const trimmed = line.trim();
    return trimmed.length > 0 &&
           !trimmed.startsWith("#") &&
           !trimmed.startsWith("!") &&
           !trimmed.startsWith("[");
  });

  const firstParagraph = lines[0] || "";

  if (firstParagraph.length <= maxLength) {
    return firstParagraph;
  }

  return firstParagraph.substring(0, maxLength).trim() + "...";
}

function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

async function scrapeBlogPost(url: string): Promise<ScrapedBlog | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: ${response.status}`);
      return null;
    }

    const html = await response.text();

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch
      ? titleMatch[1]
          .replace(/ - Uptown Rent a Car.*$/i, "")
          .replace(/ \| Uptown Rent a Car.*$/i, "")
          .trim()
      : "";

    const ogImageMatch = html.match(/og:image"\s*content="([^"]+)"/i);
    const featuredImage = ogImageMatch ? ogImageMatch[1] : "";

    const publishedMatch = html.match(/article:published_time"\s*content="([^"]+)"/i);
    const publishedAt = publishedMatch ? publishedMatch[1] : new Date().toISOString();

    const modifiedMatch = html.match(/article:modified_time"\s*content="([^"]+)"/i);
    const modifiedAt = modifiedMatch ? modifiedMatch[1] : publishedAt;

    const categoryMatch = html.match(/article:section"\s*content="([^"]+)"/i);
    const category = categoryMatch ? categoryMatch[1] : "Uncategorized";

    const tagsMatches = html.matchAll(/article:tag"\s*content="([^"]+)"/gi);
    const tags: string[] = [];
    for (const match of tagsMatches) {
      tags.push(match[1]);
    }

    const descMatch = html.match(/og:description"\s*content="([^"]+)"/i);
    const metaDescription = descMatch ? descMatch[1] : "";

    const readingTimeMatch = html.match(/Time to read[^"]*"[^"]*"(\d+\s*minutes?)"/i);
    let readingTime = "5 min read";
    if (readingTimeMatch) {
      readingTime = readingTimeMatch[1].replace("minutes", "min read").replace("minute", "min read");
    }

    let rawContent = "";

    const elementorStartIdx = html.indexOf('data-widget_type="theme-post-content.default">');
    if (elementorStartIdx !== -1) {
      const contentStart = elementorStartIdx + 'data-widget_type="theme-post-content.default">'.length;
      const likeArticleIdx = html.indexOf('Like this article?', contentStart);
      const shareButtonsIdx = html.indexOf('elementor-widget-share-buttons', contentStart);
      const endIdx = Math.min(
        likeArticleIdx !== -1 ? likeArticleIdx : Infinity,
        shareButtonsIdx !== -1 ? shareButtonsIdx : Infinity
      );

      if (endIdx !== Infinity) {
        rawContent = html.slice(contentStart, endIdx);
      } else {
        const nextElementorIdx = html.indexOf('<div class="elementor-element', contentStart + 100);
        if (nextElementorIdx !== -1) {
          rawContent = html.slice(contentStart, nextElementorIdx);
        }
      }
    }

    if (!rawContent) {
      const articleMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
      const mainContentMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
      const entryContentMatch = html.match(/class="entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
      rawContent = articleMatch?.[1] || mainContentMatch?.[1] || entryContentMatch?.[1] || "";
    }

    rawContent = rawContent
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "")
      .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "");

    let content = rawContent
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "# $1\n\n")
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "## $1\n\n")
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "### $1\n\n")
      .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "#### $1\n\n")
      .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1\n\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<li[^>]*>(.*?)<\/li>/gi, "- $1\n")
      .replace(/<ul[^>]*>/gi, "\n")
      .replace(/<\/ul>/gi, "\n")
      .replace(/<ol[^>]*>/gi, "\n")
      .replace(/<\/ol>/gi, "\n")
      .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, "> $1\n\n")
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
      .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
      .replace(/<em[^>]*>(.*?)<\/em>/gi, "*$1*")
      .replace(/<i[^>]*>(.*?)<\/i>/gi, "*$1*")
      .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, "[$2]($1)")
      .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, "![$2]($1)")
      .replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, "![]($1)")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    content = cleanMarkdownContent(content);

    const excerpt = metaDescription || extractExcerpt(content);

    if (!content || content.length < 100) {
      readingTime = estimateReadingTime(excerpt);
    }

    return {
      url,
      title,
      slug: extractSlugFromUrl(url),
      excerpt,
      content: content || excerpt,
      featuredImage,
      publishedAt,
      modifiedAt,
      readingTime,
      category,
      tags,
    };
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

async function getBlogUrls(): Promise<string[]> {
  console.log("Fetching blog listing page...");

  try {
    const response = await fetch(`${BASE_URL}/blog/`);
    const html = await response.text();

    const blogLinkRegex = /href="(https:\/\/www\.uptowndxb\.com\/[a-z0-9-]+\/)"/gi;
    const urls = new Set<string>();
    let match;

    while ((match = blogLinkRegex.exec(html)) !== null) {
      const url = match[1];

      if (
        !url.includes("/blog/") &&
        !url.includes("/rent/") &&
        !url.includes("/rental/") &&
        !url.includes("/category/") &&
        !url.includes("/tag/") &&
        !url.includes("/page/") &&
        !url.includes("/cart/") &&
        !url.includes("/checkout/") &&
        !url.includes("/my-account/") &&
        !url.includes("/contact") &&
        !url.includes("/about") &&
        !url.includes("/faq") &&
        !url.includes("/terms") &&
        !url.includes("/privacy") &&
        url !== `${BASE_URL}/`
      ) {
        urls.add(url);
      }
    }

    const readMoreRegex = /\[Read More[^\]]*\]\((https:\/\/www\.uptowndxb\.com\/[a-z0-9-]+\/)\)/gi;
    while ((match = readMoreRegex.exec(html)) !== null) {
      urls.add(match[1]);
    }

    return Array.from(urls);
  } catch (error) {
    console.error("Error fetching blog listing:", error);
    return [];
  }
}

function generateTypescriptFile(blogs: BlogPost[]): string {
  const sorted = blogs.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return `import type { BlogPost } from "@/types";

export const blogs: BlogPost[] = ${JSON.stringify(sorted, null, 2)};
`;
}

async function main() {
  console.log("🚀 Starting blog scraper...\n");

  const urls = await getBlogUrls();
  console.log(`📝 Found ${urls.length} blog URLs\n`);

  if (urls.length === 0) {
    console.error("No blog URLs found. Exiting.");
    return;
  }

  const blogs: BlogPost[] = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`[${i + 1}/${urls.length}] Scraping: ${extractSlugFromUrl(url)}`);

    const scraped = await scrapeBlogPost(url);

    if (scraped && scraped.title && scraped.content) {
      const blog: BlogPost = {
        id: `blog-${i + 1}`,
        slug: scraped.slug,
        title: scraped.title,
        excerpt: scraped.excerpt,
        content: scraped.content,
        featuredImage: scraped.featuredImage,
        publishedAt: scraped.publishedAt,
        modifiedAt: scraped.modifiedAt,
        readingTime: scraped.readingTime,
        category: normalizeCategory(scraped.category),
        tags: scraped.tags,
      };

      blogs.push(blog);
      successCount++;
    } else {
      failCount++;
      console.log(`  ⚠️ Skipped (missing content)`);
    }

    await new Promise(resolve => setTimeout(resolve, DELAY_MS));
  }

  console.log(`\n✅ Successfully scraped: ${successCount}`);
  console.log(`❌ Failed/Skipped: ${failCount}\n`);

  if (!existsSync("./data")) {
    await mkdir("./data", { recursive: true });
  }

  const tsContent = generateTypescriptFile(blogs);
  await writeFile("./data/blogs-data.ts", tsContent);
  console.log("📁 Saved to ./data/blogs-data.ts");

  await writeFile("./data/blogs-raw.json", JSON.stringify(blogs, null, 2));
  console.log("📁 Saved raw JSON to ./data/blogs-raw.json");

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
