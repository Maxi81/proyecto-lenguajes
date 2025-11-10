"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";

type Props = {
  images: string[];
  interval?: number;
  className?: string;
};

export default function Carousel({
  images,
  interval = 5000,
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!images || images.length === 0) return;
    if (paused) return;

    const t = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(t);
  }, [images, interval, paused]);

  if (!images || images.length === 0) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={src}
            alt={`carousel-${i}`}
            fill
            sizes="100vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* capa oscura para mejorar contraste */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* Los controles están ocultos pero mantenemos la funcionalidad para uso futuro */}
      <div className="hidden">
        <button aria-label="Previous" onClick={prev}>
          ‹
        </button>
        <button aria-label="Next" onClick={next}>
          ›
        </button>
        <div className="indicators">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
