import { describe, expect, it } from "vitest"
import { blocksToText, textToBlocks } from "./content"

describe("transformations du contenu d’article", () => {
  it("convertit les paragraphes, titres, encadrés et code", () => {
    const blocks = textToBlocks("Introduction.\n\n## Une section\n\n> À retenir\n\n```ts\nconst ok = true\n```")
    expect(blocks).toEqual([
      { type: "paragraph", text: "Introduction." },
      { type: "heading", text: "Une section", level: 2 },
      { type: "callout", text: "À retenir", variant: "quote" },
      { type: "code", code: "const ok = true", filename: "snippet.ts" },
    ])
  })

  it("accepte les sous-titres et les ## sans espace", () => {
    expect(textToBlocks("### Cookies\n\n##MFA sans espace")).toEqual([
      { type: "heading", text: "Cookies", level: 3 },
      { type: "heading", text: "MFA sans espace", level: 2 },
    ])
  })

  it("convertit les listes à puces", () => {
    expect(textToBlocks("- un admin\n- des médias\n- des abonnés")).toEqual([
      { type: "list", items: ["un admin", "des médias", "des abonnés"] },
    ])
  })

  it("convertit les tips bleus", () => {
    expect(textToBlocks(">! Astuce utile")).toEqual([
      { type: "callout", text: "Astuce utile", variant: "tip" },
    ])
  })

  it("permet un aller-retour éditable", () => {
    const source = [
      { type: "heading" as const, text: "Titre", level: 2 as const },
      { type: "paragraph" as const, text: "Texte." },
    ]
    expect(textToBlocks(blocksToText(source))).toEqual(source)
  })

  it("préserve les images pendant une édition", () => {
    const source = [
      {
        type: "image" as const,
        url: "https://cdn.example.com/architecture.png",
        alt: "Schéma d’architecture",
        caption: "API et interface",
      },
    ]

    expect(textToBlocks(blocksToText(source))).toEqual(source)
  })

  it("accepte une image sans légende", () => {
    expect(textToBlocks("![Capture](https://cdn.example.com/capture.png)")).toEqual([
      {
        type: "image",
        url: "https://cdn.example.com/capture.png",
        alt: "Capture",
        caption: undefined,
      },
    ])
  })
})
