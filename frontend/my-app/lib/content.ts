import type { ArticleDetail } from "./articles"

export function textToBlocks(value: string): ArticleDetail["content"] {
  return value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("## ")) return { type: "heading" as const, text: part.slice(3).trim() }
      if (part.startsWith("> ")) return { type: "callout" as const, text: part.slice(2).trim() }
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.split("\n")
        return { type: "code" as const, code: lines.slice(1, -1).join("\n"), filename: "snippet.ts" }
      }
      const image = part.match(/^!\[(.*?)\]\((\S+?)(?:\s+"(.*)")?\)$/)
      if (image) {
        return {
          type: "image" as const,
          alt: image[1].trim(),
          url: image[2].trim(),
          caption: image[3]?.trim(),
        }
      }
      return { type: "paragraph" as const, text: part }
    })
}

export function blocksToText(blocks: ArticleDetail["content"] = []) {
  return blocks
    .map((block) => {
      if (block.type === "heading") return `## ${block.text || ""}`
      if (block.type === "callout") return `> ${block.text || ""}`
      if (block.type === "code") return `\`\`\`\n${block.code || ""}\n\`\`\``
      if (block.type === "image") {
        const url = block.url || block.text || ""
        const caption = block.caption ? ` "${block.caption.replaceAll('"', '\\"')}"` : ""
        return url ? `![${block.alt || ""}](${url}${caption})` : ""
      }
      return block.text || ""
    })
    .filter(Boolean)
    .join("\n\n")
}
