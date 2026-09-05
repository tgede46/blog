import { describe, expect, it } from "vitest"
import { blocksToText, textToBlocks } from "./content"

describe("transformations du contenu d’article", () => {
  it("convertit les paragraphes, titres, encadrés et code", () => {
    const blocks = textToBlocks("Introduction.\n\n## Une section\n\n> À retenir\n\n```\nconst ok = true\n```")
    expect(blocks).toEqual([
      { type: "paragraph", text: "Introduction." },
      { type: "heading", text: "Une section" },
      { type: "callout", text: "À retenir" },
      { type: "code", code: "const ok = true", filename: "snippet.ts" },
    ])
  })

  it("permet un aller-retour éditable", () => {
    const source = [
      { type: "heading" as const, text: "Titre" },
      { type: "paragraph" as const, text: "Texte." },
    ]
    expect(textToBlocks(blocksToText(source))).toEqual(source)
  })
})
