"use client";

import Image from "next/image";
import { useState } from "react";
import { GALLERY, GALLERY_FILTERS, type GalleryCategory } from "@/data/gallery";
import { Lightbox } from "./Lightbox";

export function GalleryView() {
  const [filter, setFilter] = useState<"todos" | GalleryCategory>("todos");
  const [index, setIndex] = useState<number | null>(null);
  const photos = filter === "todos" ? GALLERY : GALLERY.filter((p) => p.category === filter);

  return (
    <>
      <div role="group" aria-label="Filtrar fotos" className="flex flex-wrap gap-2">
        {GALLERY_FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => {
              setFilter(f.id);
              setIndex(null);
            }}
            className={`px-4 py-2 font-display text-sm font-bold uppercase tracking-wider transition-colors ${filter === f.id ? "bg-brasa text-carvao" : "ring-1 ring-osso/25 hover:text-brasa"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <ul className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((photo, i) => (
          <li key={photo.id} className="mb-4 break-inside-avoid">
            <button type="button" aria-label={`Ampliar foto: ${photo.alt}`} onClick={() => setIndex(i)} className="group relative block w-full overflow-hidden">
              <Image
                src={photo.src}
                alt=""
                placeholder="blur"
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${i % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/3]"}`}
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-carvao/90 to-transparent p-4 text-left font-display text-lg font-bold uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {photo.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox photos={photos} index={index} onIndexChange={setIndex} />
    </>
  );
}
