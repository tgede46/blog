import React from "react"
import Nav from "../components/Nav"
import Hero from "../components/Hero"
import Stats from "../components/Stats"
import Articles from "../components/Articles"
import Newsletter from "../components/Newsletter"
import SiteFooter from "../components/SiteFooter"

export default function Home() {
  return (
    <div className="bg-surface text-on-surface font-body selection:bg-tertiary-fixed">
      <Nav />
      <main className="max-w-7xl mx-auto px-6">
        <Hero />
        <Stats />
        <Articles />
        <Newsletter />
      </main>
      <SiteFooter />
    </div>
  )
}
