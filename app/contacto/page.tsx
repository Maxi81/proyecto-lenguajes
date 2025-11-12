"use client";

import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { createClient } from "@/lib/supabase/client";
import { Navbar } from "@/components/Navbar";

export default function ContactoPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "error" | null;
    text: string;
  }>({ type: null, text: "" });

  // Auto-rellenar el email del usuario si está logueado
  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        setIsLoggedIn(true);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatusMessage({ type: null, text: "" });

    // Validaciones básicas
    if (!email || !message) {
      setStatusMessage({
        type: "error",
        text: "Por favor completa todos los campos.",
      });
      return;
    }

    setIsSending(true);

    try {
      // Crear objeto con los parámetros del template
      const templateParams = {
        from_email: email, // Del useState
        message: message, // Del useState
      };

      // Enviar email usando EmailJS con el método send()
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      );

      if (result.status === 200) {
        setStatusMessage({
          type: "success",
          text: "¡Mensaje enviado exitosamente! Te responderemos pronto.",
        });
        // Limpiar solo el mensaje si el usuario está logueado
        setMessage("");
        if (!isLoggedIn) {
          setEmail("");
        }
      }
    } catch (error) {
      console.error("Error enviando email:", error);
      setStatusMessage({
        type: "error",
        text: "Hubo un error al enviar el mensaje. Por favor intenta de nuevo.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Contáctanos
            </h1>
            <p className="text-gray-600 mb-8">
              ¿Tienes alguna pregunta o comentario? Envíanos un mensaje y te
              responderemos lo antes posible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div>
                <label
                  htmlFor="from_email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="from_email"
                  name="from_email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoggedIn}
                  required
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                    isLoggedIn ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                  }`}
                  placeholder="tu@email.com"
                />
                {isLoggedIn && (
                  <p className="text-xs text-gray-500 mt-1">
                    Email cargado desde tu cuenta
                  </p>
                )}
              </div>

              {/* Campo Mensaje */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Escribe tu mensaje aquí..."
                />
              </div>

              {/* Mensaje de estado */}
              {statusMessage.type && (
                <div
                  className={`p-4 rounded-lg ${
                    statusMessage.type === "success"
                      ? "bg-green-50 border border-green-200 text-green-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  <p className="text-sm font-medium">{statusMessage.text}</p>
                </div>
              )}

              {/* Botón de envío */}
              <button
                type="submit"
                disabled={isSending}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isSending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                }`}
              >
                {isSending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  "Enviar mensaje"
                )}
              </button>
            </form>

            {/* Información adicional */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Otras formas de contacto
              </h2>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  info@groovy.com
                </p>
                <p className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  +1 (555) 123-4567
                </p>
              </div>
            </div>

            {/* Mapa de ubicación */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Nuestra ubicación
              </h2>
              <div className="w-full h-[450px] rounded-lg overflow-hidden shadow-md">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29768.82103660141!2d-86.826930642128!3d21.148313632016343!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4c29315eccc1f1%3A0x8c7cb90332b4730d!2sPlaya%20Tortugas!5e0!3m2!1ses-419!2sar!4v1762968249100!5m2!1ses-419!2sar"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Mapa de ubicación de Playa Tortugas"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
