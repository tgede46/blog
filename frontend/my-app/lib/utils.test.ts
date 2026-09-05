import { describe, expect, it } from "vitest"
import { formatDateFr, headingId, readingTime } from "./utils"

describe("utilitaires d’affichage", () => {
  it("gère les durées numériques, textuelles et absentes", () => {
    expect(readingTime(7)).toBe("7 min")
    expect(readingTime("12")).toBe("12 min")
    expect(readingTime("8 min")).toBe("8 min")
    expect(readingTime()).toBe("Lecture rapide")
  })

  it("produit un identifiant stable sans accents", () => {
    expect(headingId("Déployer une API : étapes", 2)).toBe("deployer-une-api-etapes")
    expect(headingId("***", 4)).toBe("section-4")
  })

  it("tolère les dates absentes et invalides", () => {
    expect(formatDateFr()).toBe("Date à venir")
    expect(formatDateFr("date-invalide")).toBe("date-invalide")
  })
})
