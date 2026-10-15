"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";
import type { GalleryPhoto } from "@/data/gallery";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";

export function Lightbox({ photos, index, onIndexChange }: { photos: GalleryPhoto[]; index: number | null; onIndexChange(i: number | null): void }) {
  const ref = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const isOpen = index !== null;
  const count = photos.length;
  const close = () => onIndexChange(null);
  const go = (delta: number) => {
    if (index !== null) onIndexChange((index + delta + count) % count);
  };

  useFocusTrap(ref, isOpen, close);
  useScrollLock(isOpen);

  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  });
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goRef.current(1);
      if (e.key === "ArrowLeft") goRef.current(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  if (index === null) return null;
  const photo = photos[index];

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Visualizador de fotos"
      className="lightbox fixed inset-0 z-50 flex flex-col bg-black/95"
      onPointerDown={(e) => (touchX.current = e.clientX)}
      onPointerUp={(e) => {
        if (touchX.current === null) return;
        const dx = e.clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <p className="font-display text-lg font-bold">
          {index + 1} / {count}
        </p>
        <button type="button" aria-label="Fechar" onClick={close} className="grid size-11 place-items-center hover:text-brasa">
          <X aria-hidden className="size-7" />
        </button>
      </div>
      <div className="relative flex-1">
        <Image key={photo.id} src={photo.src} alt={photo.alt} fill placeholder="blur" sizes="100vw" className="object-contain" />
      </div>
      <div className="flex items-center justify-between gap-4 px-4 py-4">
        <button type="button" aria-label="Foto anterior" onClick={() => go(-1)} className="grid size-12 place-items-center border border-osso/30 hover:border-brasa hover:text-brasa">
          <ChevronLeft aria-hidden className="size-6" />
        </button>
        <p className="text-center font-semibold">{photo.caption}</p>
        <button type="button" aria-label="Próxima foto" onClick={() => go(1)} className="grid size-12 place-items-center border border-osso/30 hover:border-brasa hover:text-brasa">
          <ChevronRight aria-hidden className="size-6" />
        </button>
      </div>
    </div>
  );
}
