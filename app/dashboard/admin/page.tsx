'use client'

export default function AdminDashboard() {
  return (
    <div className="flex-1 w-full flex flex-col gap-6 items-center">
      <div className="w-full max-w-4xl flex justify-between items-center">
        <h1 className="text-2xl font-bold">Panel de Administrador</h1>
      </div>
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <h2 className="text-4xl font-bold text-center text-primary">¡Hola Administrador!</h2>
        <p className="text-center text-xl">Bienvenido al panel de administración</p>
        {/* Aquí puedes agregar más componentes específicos para el administrador */}
      </div>
    </div>
  )
}