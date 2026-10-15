import { Flame, Leaf, Sparkles, Star } from "lucide-react";
import { TAG_LABELS, type Tag } from "@/data/menu";

const STYLE: Record<Tag, { icon: typeof Star; className: string }> = {
  "mais-pedido": { icon: Star, className: "bg-mostarda text-carvao" },
  picante: { icon: Flame, className: "bg-brasa text-carvao" },
  vegetariano: { icon: Leaf, className: "bg-emerald-300 text-carvao" },
  novo: { icon: Sparkles, className: "bg-osso text-carvao" },
};

export function TagBadge({ tag }: { tag: Tag }) {
  const { icon: Icon, className } = STYLE[tag];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 font-display text-xs font-extrabold uppercase tracking-wider ${className}`}>
      <Icon aria-hidden className="size-3" />
      {TAG_LABELS[tag]}
    </span>
  );
}
