import Link from "next/link";

export default function ReservaExitoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          ¡Pago confirmado!
        </h1>
        <p className="text-gray-700 mb-6">
          Tu reserva ha sido confirmada correctamente. En breve recibirás un
          correo con los detalles.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
