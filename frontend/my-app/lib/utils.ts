import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateFr(value?: string) {
  if (!value) return "Date à venir"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(date)
}

export function readingTime(value?: string | number) {
  if (typeof value === "number") return `${value} min`
  if (!value) return "Lecture rapide"
  return /\bmin\b/i.test(value) ? value : `${value} min`
}

export function headingId(text: string, index: number) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `section-${index}`
}
