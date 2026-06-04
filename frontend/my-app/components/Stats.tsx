import React from "react"
import TechChip from "./TechChip"

export default function Stats() {
  return (
    <div className="py-12 flex flex-wrap justify-between items-center gap-8 border-b-2 border-on-surface/10">
      <div className="flex items-center gap-4">
        <span className="font-headline font-black text-4xl">150+</span>
        <span className="font-label uppercase font-bold text-sm leading-tight text-on-surface/60">Articles<br/>Techniques</span>
      </div>
      <div className="flex items-center gap-4 border-l-2 border-on-surface/10 pl-8">
        <span className="font-headline font-black text-4xl">12k</span>
        <span className="font-label uppercase font-bold text-sm leading-tight text-on-surface/60">Abonnés<br/>Newsletter</span>
      </div>
      <div className="flex items-center gap-4 border-l-2 border-on-surface/10 pl-8">
        <span className="font-headline font-black text-4xl">45</span>
        <span className="font-label uppercase font-bold text-sm leading-tight text-on-surface/60">Projets<br/>Open Source</span>
      </div>
      <div className="flex-grow"></div>
      <div className="flex gap-4 items-center">
        <TechChip label="terminal" variant="js" size={48} />
        <TechChip label="code" variant="ts" size={48} />
        <TechChip label="javascript" variant="node" size={48} />
      </div>
    </div>
  )
}
