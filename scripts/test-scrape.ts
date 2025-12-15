const TEST_URL = "https://www.uptowndxb.com/best-road-trips-from-dubai/";

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
    .replace(/ï‚·/g, "•")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&#039;/g, "'");
}

async function testScrape() {
  console.log("Testing scrape for:", TEST_URL);

  const response = await fetch(TEST_URL);
  const html = await response.text();

  console.log("\n--- Searching for content ---");

  let rawContent = "";

  const elementorStartIdx = html.indexOf('data-widget_type="theme-post-content.default">');
  console.log("Elementor content start index:", elementorStartIdx);

  if (elementorStartIdx !== -1) {
    const contentStart = elementorStartIdx + 'data-widget_type="theme-post-content.default">'.length;
    const likeArticleIdx = html.indexOf('Like this article?', contentStart);
    const shareButtonsIdx = html.indexOf('elementor-widget-share-buttons', contentStart);

    console.log("Like article index:", likeArticleIdx);
    console.log("Share buttons index:", shareButtonsIdx);

    const endIdx = Math.min(
      likeArticleIdx !== -1 ? likeArticleIdx : Infinity,
      shareButtonsIdx !== -1 ? shareButtonsIdx : Infinity
    );

    if (endIdx !== Infinity) {
      rawContent = html.slice(contentStart, endIdx);
      console.log("\nExtracted content length:", rawContent.length);
    }
  }

  if (!rawContent) {
    console.log("No Elementor content found, using fallback");
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

  content = fixMojibake(content);

  content = content.replace(/\n{3,}/g, "\n\n").trim();

  console.log("\n--- Final content preview (first 2000 chars) ---");
  console.log(content.slice(0, 2000));
  console.log("\n--- Total content length:", content.length, "characters ---");
}

testScrape().catch(console.error);
