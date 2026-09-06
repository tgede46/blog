import { describe, expect, it } from "vitest"
import { safeInternalPath } from "./navigation"

describe("safeInternalPath", () => {
  it("conserve une destination interne", () => {
    expect(safeInternalPath("/admin/posts")).toBe("/admin/posts")
  })

  it.each(["https://evil.example", "//evil.example", "/\\evil.example", "", undefined])(
    "remplace une destination non sûre (%s)",
    (value) => {
      expect(safeInternalPath(value)).toBe("/admin")
    },
  )
})
