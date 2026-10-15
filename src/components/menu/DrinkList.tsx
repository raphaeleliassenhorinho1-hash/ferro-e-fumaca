import { AddToCartButton } from "@/components/cart/AddToCartButton";
import type { MenuItem } from "@/data/menu";
import { formatBRL } from "@/lib/format";
import { TagBadge } from "./TagBadge";

export function DrinkList({ items }: { items: MenuItem[] }) {
  return (
    <ul className="grid gap-x-10 gap-y-6 md:grid-cols-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2">
              <h3 className="font-display text-xl font-black uppercase">{item.name}</h3>
              <span aria-hidden className="mb-1 min-w-6 flex-1 border-b-2 border-dotted border-osso/25" />
              <span className="font-display text-lg font-bold text-brasa">{formatBRL(item.priceCents)}</span>
            </div>
            <p className="mt-1 text-sm text-osso/70">{item.description}</p>
            {item.tags.length > 0 && (
              <div className="mt-2 flex gap-1.5">
                {item.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            )}
          </div>
          <AddToCartButton id={item.id} name={item.name} variant="icon" />
        </li>
      ))}
    </ul>
  );
}
