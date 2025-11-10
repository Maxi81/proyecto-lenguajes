"use client";

import Carousel from "./carousel";

const IMAGES = [
  "https://xdxvqlvaiagsvtezaaft.supabase.co/storage/v1/object/sign/cliente/fondo%20cliente.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yZTllNWNlMS1mNThiLTRmYWItODcxYS0wOTA2NTM5NzFiNTUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjbGllbnRlL2ZvbmRvIGNsaWVudGUuanBnIiwiaWF0IjoxNzYyNzQyMzcwLCJleHAiOjE3NjMzNDcxNzB9.zsLk9g5R7wRr6rc26FjITC9TWZIECf5neMiR7k7I-Nk",
  "https://xdxvqlvaiagsvtezaaft.supabase.co/storage/v1/object/sign/cliente/carrusel%201.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yZTllNWNlMS1mNThiLTRmYWItODcxYS0wOTA2NTM5NzFiNTUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjbGllbnRlL2NhcnJ1c2VsIDEuanBnIiwiaWF0IjoxNzYyNzQyMzgwLCJleHAiOjE3NjMzNDcxODB9.rAFuxhWXnM5CnwwOR4VfjROOh_8vOzEcYDUK_KzaVcA",
  "https://xdxvqlvaiagsvtezaaft.supabase.co/storage/v1/object/sign/cliente/carrusel%202.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yZTllNWNlMS1mNThiLTRmYWItODcxYS0wOTA2NTM5NzFiNTUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjbGllbnRlL2NhcnJ1c2VsIDIuanBnIiwiaWF0IjoxNzYyNzQyMzg4LCJleHAiOjE3NjMzNDcxODh9.mJYyWE-bQO60aDH24yJAaN75v7HDPHVzLYxEoxWTAik",
];

export function Hero() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] lg:h-screen overflow-hidden">
      <Carousel images={IMAGES} className="carousel-no-buttons" />

      {/* Título del hotel centrado */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white text-center tracking-wider hotel-title-shadow">
          Hotel BlueDragon
        </h1>
      </div>

      {/* capa inferior para mejorar contraste con el contenido que viene debajo */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
    </section>
  );
}
