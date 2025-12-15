"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Text } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ArticleContentProps {
  content: string;
  className?: string;
}

export function ArticleContent({ content, className }: ArticleContentProps) {
  return (
    <div className={cn("max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16", className)}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <MarkdownRenderer content={content} />
      </motion.article>
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentParagraph: string[] = [];
  let inList = false;
  let listItems: string[] = [];
  let listType: "ul" | "ol" = "ul";

  function flushParagraph() {
    if (currentParagraph.length > 0) {
      const text = currentParagraph.join(" ").trim();
      if (text) {
        elements.push(
          <p
            key={`p-${elements.length}`}
            className="text-lg leading-relaxed text-neutral-300 mb-6"
          >
            {processInlineMarkdown(text)}
          </p>,
        );
      }
      currentParagraph = [];
    }
  }

  function flushList() {
    if (listItems.length > 0) {
      const ListTag = listType;
      const listClass =
        listType === "ul"
          ? "list-disc pl-6 space-y-2 mb-6 text-neutral-300"
          : "list-decimal pl-6 space-y-2 mb-6 text-neutral-300";
      elements.push(
        <ListTag key={`list-${elements.length}`} className={listClass}>
          {listItems.map((item, idx) => (
            <li key={idx} className="text-lg leading-relaxed">
              {processInlineMarkdown(item)}
            </li>
          ))}
        </ListTag>,
      );
      listItems = [];
      inList = false;
    }
  }

  function processInlineMarkdown(text: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    while (remaining.length > 0) {
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      const italicMatch = remaining.match(/\*(.+?)\*/);
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

      const matches = [
        boldMatch
          ? { type: "bold", match: boldMatch, index: boldMatch.index! }
          : null,
        italicMatch && !boldMatch
          ? { type: "italic", match: italicMatch, index: italicMatch.index! }
          : null,
        linkMatch
          ? { type: "link", match: linkMatch, index: linkMatch.index! }
          : null,
      ].filter(Boolean) as {
        type: string;
        match: RegExpMatchArray;
        index: number;
      }[];

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      const first = matches.sort((a, b) => a.index - b.index)[0];

      if (first.index > 0) {
        parts.push(remaining.slice(0, first.index));
      }

      if (first.type === "bold") {
        parts.push(
          <strong key={keyIdx++} className="font-semibold text-neutral-100">
            {first.match[1]}
          </strong>,
        );
        remaining = remaining.slice(first.index + first.match[0].length);
      } else if (first.type === "italic") {
        parts.push(
          <em key={keyIdx++} className="italic">
            {first.match[1]}
          </em>,
        );
        remaining = remaining.slice(first.index + first.match[0].length);
      } else if (first.type === "link") {
        parts.push(
          <a
            key={keyIdx++}
            href={first.match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-500 hover:text-primary-400 underline underline-offset-2 transition-colors"
          >
            {first.match[1]}
          </a>,
        );
        remaining = remaining.slice(first.index + first.match[0].length);
      }
    }

    return parts.length === 1 ? parts[0] : parts;
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === "") {
      flushParagraph();
      flushList();
      continue;
    }

    if (trimmed.startsWith("# ")) {
      flushParagraph();
      flushList();
      elements.push(
        <h1
          key={`h1-${elements.length}`}
          className="font-grunge text-4xl md:text-5xl text-neutral-50 mt-12 mb-6 tracking-wide"
        >
          {trimmed.slice(2)}
        </h1>,
      );
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushParagraph();
      flushList();
      elements.push(
        <h2
          key={`h2-${elements.length}`}
          className="font-grunge text-2xl md:text-3xl text-neutral-100 mt-12 mb-4 tracking-wide border-b border-neutral-800 pb-3"
        >
          {trimmed.slice(3)}
        </h2>,
      );
      continue;
    }

    if (trimmed.startsWith("### ")) {
      flushParagraph();
      flushList();
      elements.push(
        <h3
          key={`h3-${elements.length}`}
          className="font-semibold text-xl text-neutral-200 mt-8 mb-3"
        >
          {trimmed.slice(4)}
        </h3>,
      );
      continue;
    }

    if (trimmed.startsWith("#### ")) {
      flushParagraph();
      flushList();
      elements.push(
        <h4
          key={`h4-${elements.length}`}
          className="font-semibold text-lg text-neutral-300 mt-6 mb-2"
        >
          {trimmed.slice(5)}
        </h4>,
      );
      continue;
    }

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      flushParagraph();
      if (!inList || listType !== "ul") {
        flushList();
        inList = true;
        listType = "ul";
      }
      listItems.push(trimmed.slice(2));
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      if (!inList || listType !== "ol") {
        flushList();
        inList = true;
        listType = "ol";
      }
      listItems.push(trimmed.replace(/^\d+\.\s/, ""));
      continue;
    }

    if (trimmed.startsWith("> ")) {
      flushParagraph();
      flushList();
      elements.push(
        <blockquote
          key={`bq-${elements.length}`}
          className="border-l-4 border-primary-500 pl-6 py-2 my-6 italic text-neutral-400"
        >
          <p className="text-lg">{processInlineMarkdown(trimmed.slice(2))}</p>
        </blockquote>,
      );
      continue;
    }

    if (trimmed === "---" || trimmed === "***") {
      flushParagraph();
      flushList();
      elements.push(
        <hr key={`hr-${elements.length}`} className="border-neutral-800 my-8" />,
      );
      continue;
    }

    if (trimmed.startsWith("![")) {
      flushParagraph();
      flushList();
      const imgMatch = trimmed.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imgMatch) {
        elements.push(
          <figure key={`img-${elements.length}`} className="my-8">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-800">
              <Image
                src={imgMatch[2]}
                alt={imgMatch[1] || "Blog image"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
            {imgMatch[1] && (
              <figcaption className="text-sm text-neutral-500 text-center mt-3 italic">
                {imgMatch[1]}
              </figcaption>
            )}
          </figure>,
        );
      }
      continue;
    }

    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  if (elements.length === 0) {
    return <Text color="muted">No content available.</Text>;
  }

  return <>{elements}</>;
}
