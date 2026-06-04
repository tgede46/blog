import Link from "next/link"
import React from "react"
import ArticleCard from "./ArticleCard"

const sample = [
  {
    href: "/articles/advanced-typescript-patterns-for-enterprise-scale",
    date: "15 déc. 2025",
    title: "Maîtriser les Design Patterns en TypeScript",
    excerpt:
      "Découvrez comment les patterns Factory, Observer et Strategy peuvent rendre votre code TypeScript plus robuste et maintenable dans des projets d'envergure.",
    tag: "TS",
    minutes: "11mn",
  },
  {
    href: "/articles/deploying-nodejs-to-aws-lambda-using-cdk",
    date: "02 déc. 2025",
    title: "Node.js 22 : Les nouveautés indispensables",
    excerpt:
      "Le runtime Node.js continue d'évoluer. Faisons le tour des nouvelles APIs, des améliorations de performance et du support natif de TypeScript.",
    tag: "NODE",
    minutes: "08mn",
  },
  {
    href: "/articles/mastering-clean-architecture-in-modern-nodejs-applications",
    date: "18 nov. 2025",
    title: "Optimiser les performances SQL avec Prisma",
    excerpt:
      "Le n+1 query est l'ennemi de votre application. Apprenez à utiliser efficacement les relations et le filtrage avec Prisma ORM pour des requêtes fulgurantes.",
    tag: "DB",
    minutes: "14mn",
  },
]

export default function Articles() {
  return (
    <section className="py-24">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div className="space-y-4">
          <h2 className="font-headline font-bold text-4xl md:text-5xl tracking-tight">Mes derniers articles</h2>
          <p className="text-on-surface/60 text-lg max-w-xl">Explorations techniques, tutoriels approfondis et retours d&apos;expérience sur l&apos;écosystème JavaScript moderne.</p>
        </div>
        <Link className="font-headline font-bold uppercase tracking-widest text-sm border-b-2 border-tertiary-fixed hover:bg-tertiary-fixed transition-colors pb-1" href="/articles">
          Voir tous les articles
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {sample.map((a) => (
          <ArticleCard key={a.title} href={a.href} date={a.date} title={a.title} excerpt={a.excerpt} tag={a.tag} minutes={a.minutes} />
        ))}
      </div>
    </section>
  )
}
