"use client";

import { submitReview } from "@/app/habitaciones/[id]/actions";
import { useState } from "react";

type ReviewFormProps = {
  habitacionId: number;
  userId: string;
};

export function ReviewForm({ habitacionId, userId }: ReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await submitReview(formData);

      if (result.success) {
        setMessage({
          type: "success",
          text: result.message || "Reseña enviada exitosamente",
        });
        // Limpiar el formulario
        const form = document.querySelector("form");
        if (form) form.reset();
      } else {
        setMessage({
          type: "error",
          text: result.error || "Error al enviar la reseña",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Error inesperado. Intenta de nuevo.",
      });
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Deja tu reseña
      </h3>

      <form action={handleSubmit} className="space-y-4 max-w-2xl">
        {/* Calificación */}
        <div>
          <label
            htmlFor="rating"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Calificación
          </label>
          <select
            id="rating"
            name="rating"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecciona una calificación</option>
            <option value="1">1 - Muy malo</option>
            <option value="2">2 - Malo</option>
            <option value="3">3 - Regular</option>
            <option value="4">4 - Bueno</option>
            <option value="5">5 - Excelente</option>
          </select>
        </div>

        {/* Comentario */}
        <div>
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tu opinión
          </label>
          <textarea
            id="comment"
            name="comment"
            placeholder="Comparte tu experiencia con esta habitación..."
            required
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Campos ocultos */}
        <input type="hidden" name="habitacion_id" value={habitacionId} />
        <input type="hidden" name="user_id" value={userId} />

        {/* Mensaje de estado */}
        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Enviando..." : "Enviar Reseña"}
        </button>
      </form>
    </section>
  );
}

export default ReviewForm;
