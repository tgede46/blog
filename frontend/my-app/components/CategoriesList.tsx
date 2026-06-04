import React from "react"

type CategoryItem = {
  label: string
  count: number
  active?: boolean
  icon: React.ReactNode
}

function Badge({ count }: { count: number }) {
  return (
    <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-on-surface px-2 text-xs leading-none text-on-surface">
      {count}
    </span>
  )
}

function CategoryIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-12 w-12 shrink-0">
      {children}
    </div>
  )
}

export default function CategoriesList() {
  const items: CategoryItem[] = [
    {
      label: "All",
      count: 8,
      active: true,
      icon: (
        <CategoryIcon>
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full" aria-hidden>
            <circle cx="22" cy="14" r="6.5" fill="#F4C2C2" stroke="#1f2937" strokeWidth="1.5" />
            <circle cx="34" cy="24" r="6.5" fill="#D6EAF8" stroke="#1f2937" strokeWidth="1.5" />
            <circle cx="16" cy="34" r="6.5" fill="#FAE9C0" stroke="#1f2937" strokeWidth="1.5" />
            <path d="M24 18.5 30 20.5" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M19 20 18 28" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </CategoryIcon>
      ),
    },
    {
      label: "Autre",
      count: 2,
      icon: (
        <CategoryIcon>
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full" aria-hidden>
            <circle cx="22" cy="14" r="6.5" fill="#F4C2C2" stroke="#1f2937" strokeWidth="1.5" />
            <circle cx="34" cy="24" r="6.5" fill="#D6EAF8" stroke="#1f2937" strokeWidth="1.5" />
            <circle cx="16" cy="34" r="6.5" fill="#FAE9C0" stroke="#1f2937" strokeWidth="1.5" />
            <path d="M24 18.5 30 20.5" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M19 20 18 28" fill="none" stroke="#1f2937" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </CategoryIcon>
      ),
    },
    {
      label: "Design Pattern",
      count: 2,
      icon: (
        <CategoryIcon>
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full" aria-hidden>
            <rect x="15" y="7" width="18" height="5" rx="1.5" fill="#CDB4DB" stroke="#1f2937" strokeWidth="1.2" />
            <circle cx="12" cy="23" r="5" fill="#D6EAF8" stroke="#1f2937" strokeWidth="1.2" />
            <rect x="22" y="18" width="10" height="10" transform="rotate(45 27 23)" fill="#FAE9C0" stroke="#1f2937" strokeWidth="1.2" />
            <circle cx="36" cy="30" r="3" fill="#F4C2C2" stroke="#1f2937" strokeWidth="1.2" />
            <rect x="17" y="33" width="12" height="4" rx="2" fill="#fff" stroke="#1f2937" strokeWidth="1.2" />
            <path d="M19 12v7M12 23h7M27 28h8M27 33v-6" fill="none" stroke="#1f2937" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </CategoryIcon>
      ),
    },
    {
      label: "JavaScript",
      count: 3,
      icon: (
        <CategoryIcon>
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full" aria-hidden>
            <circle cx="24" cy="24" r="15" fill="none" stroke="#1f2937" strokeWidth="1.4" />
            <circle cx="17" cy="17" r="12" fill="rgba(214,234,248,0.15)" stroke="#1f2937" strokeWidth="1.2" />
            <circle cx="31" cy="17" r="12" fill="rgba(244,194,194,0.15)" stroke="#1f2937" strokeWidth="1.2" />
            <circle cx="24" cy="29" r="12" fill="rgba(250,233,192,0.15)" stroke="#1f2937" strokeWidth="1.2" />
          </svg>
        </CategoryIcon>
      ),
    },
    {
      label: "Productivité",
      count: 1,
      icon: (
        <CategoryIcon>
          <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full" aria-hidden>
            <path d="M11 32c2-9 9-15 18-15 7 0 13 3 17 10" fill="none" stroke="#1f2937" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M9 15c0-1.8 1.5-3.3 3.3-3.3S15.6 13.2 15.6 15s-1.5 3.3-3.3 3.3S9 16.8 9 15Zm27 23.7c0-1.8 1.5-3.3 3.3-3.3s3.3 1.5 3.3 3.3-1.5 3.3-3.3 3.3S36 40.5 36 38.7Z" fill="#fff" stroke="#1f2937" strokeWidth="1.2" />
            <rect x="18" y="23" width="4" height="11" fill="#D6EAF8" stroke="#1f2937" strokeWidth="1.2" />
            <rect x="24" y="18" width="4" height="16" fill="#F4C2C2" stroke="#1f2937" strokeWidth="1.2" />
            <rect x="30" y="27" width="4" height="7" fill="#CDB4DB" stroke="#1f2937" strokeWidth="1.2" />
          </svg>
        </CategoryIcon>
      ),
    },
  ]

  return (
    <section>
      <h4 className="font-headline font-bold uppercase text-sm tracking-widest mb-3">CATEGORIES</h4>
      <div className="space-y-5">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            className={`flex w-full items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left transition-colors ${
              item.active ? "border-[#1f2937] bg-transparent" : "border-transparent"
            }`}
          >
            {item.icon}
            <span className="flex flex-1 items-center justify-between gap-4">
              <span className="text-[1.05rem] font-medium text-[#253045]">{item.label}</span>
              <Badge count={item.count} />
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}
