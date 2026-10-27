export const habitacionesIniciales = [
  {
    id: 1,
    nombre: "Habitación Estandar",
    tipo: "Estándar",
    precio: 150000,
    estado: "Disponible"
  },
  {
    id: 2,
    nombre: "Habitación Premiun",
    tipo: "Premium",
    precio: 250000,
    estado: "Disponible"
  },
  {
    id: 3,
    nombre: "Habitación Suite",
    tipo: "Suite",
    precio: 500000,
    estado: "Mantenimiento"
  }
]

export function inferirTipoHabitacion(nombre = "") {
  const normalizado = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
  if (normalizado.includes("suite")) return "Suite"
  if (normalizado.includes("premium") || normalizado.includes("premiun")) return "Premium"
  if (normalizado.includes("doble")) return "Doble"
  if (normalizado.includes("sencilla")) return "Sencilla"
  if (normalizado.includes("estandar")) return "Estándar"
  return "Otra"
}

export function cargarHabitaciones() {
  try {
    const guardadas = localStorage.getItem("habitacionesHotel")
    const habitaciones = guardadas ? JSON.parse(guardadas) : habitacionesIniciales
    if (!Array.isArray(habitaciones)) return habitacionesIniciales

    return habitaciones.map(habitacion => ({
      ...habitacion,
      tipo: habitacion.tipo || inferirTipoHabitacion(habitacion.nombre)
    }))
  } catch {
    return habitacionesIniciales
  }
}