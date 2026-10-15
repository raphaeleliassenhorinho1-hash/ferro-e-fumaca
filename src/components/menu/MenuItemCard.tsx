import Image from "next/image";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { MenuItem } from "@/data/menu";
import { formatBRL } from "@/lib/format";
import { TagBadge } from "./TagBadge";

export function MenuItemCard({ item, headingLevel = 3 }: { item: MenuItem; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <article className="group flex h-full flex-col bg-carvao-2 ring-1 ring-osso/10 transition-shadow hover:ring-brasa/60">
      {item.image && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={item.image}
            alt={item.imageAlt ?? ""}
            fill
            placeholder="blur"
            sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {item.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <TagBadge key={tag} tag={tag} />
              ))}
            </div>
          )}
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-4">
          <Heading className="font-display text-2xl leading-tight font-black uppercase">{item.name}</Heading>
          <p className="shrink-0 font-display text-xl font-bold text-brasa">{formatBRL(item.priceCents)}</p>
        </div>
        <p className="flex-1 text-osso/75">{item.description}</p>
        <AddToCartButton id={item.id} name={item.name} />
      </div>
    </article>
  );
}
