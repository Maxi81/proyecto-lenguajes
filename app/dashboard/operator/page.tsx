'use client'

export default function OperatorDashboard() {
  return (
    <div className="flex-1 w-full flex flex-col gap-6 items-center">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-2xl font-bold">Panel de Operador</h1>
      </div>
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <h2 className="text-4xl font-bold text-center text-primary">¡Hola Operador!</h2>
        <p className="text-center text-xl">Bienvenido al panel de operaciones</p>
        {/* Aquí puedes agregar más componentes específicos para el operador */}
      </div>
    </div>
  )
}