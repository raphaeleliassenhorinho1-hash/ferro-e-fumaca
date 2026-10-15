"use client";

import { useEffect, useState } from "react";
import type { Category, CategoryId } from "@/data/menu";

export function CategoryNav({ categories }: { categories: Category[] }) {
  const [active, setActive] = useState<CategoryId>(categories[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id as CategoryId);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    categories.forEach((c) => {
      const el = document.getElementById(c.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [categories]);

  return (
    <nav aria-label="Categorias do cardápio" className="sticky top-16 z-30 border-b border-osso/10 bg-carvao/95 backdrop-blur lg:top-20">
      <ul className="mx-auto flex w-full max-w-7xl gap-2 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
        {categories.map((c) => (
          <li key={c.id} className="shrink-0">
            <a
              href={`#${c.id}`}
              onClick={() => setActive(c.id)}
              aria-current={active === c.id ? "true" : undefined}
              className={`block px-4 py-2 font-display text-sm font-bold uppercase tracking-wider transition-colors ${active === c.id ? "bg-brasa text-carvao" : "text-osso hover:text-brasa"}`}
            >
              {c.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
