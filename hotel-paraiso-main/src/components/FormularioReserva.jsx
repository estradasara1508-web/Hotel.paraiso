import { useState } from "react"
import Swal from "sweetalert2"
import { inferirTipoHabitacion } from "../utils/habitaciones"

function normalizarNombre(nombre = "") {
    return nombre
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
}

function FormularioReserva({ reserva, guardar, cancelar, habitaciones, reservas }){
    const [ datos , setDatos] = useState(() => {
        if (!reserva) {
            return { habitacion: "", entrada: "", salida: "", estado: "Pendiente" }
        }

        const habitacionActual = habitaciones.find(habitacion =>
            String(habitacion.id) === String(reserva.habitacionId) ||
            (!reserva.habitacionId && habitacion.nombre === reserva.habitacion)
        )

        return {
            habitacion: habitacionActual ? String(habitacionActual.id) : "",
            entrada: reserva.entrada,
            salida: reserva.salida,
            estado: reserva.estado
        }
    })

    const habitacionesDisponibles = (() => {
        let entradaDisponibilidad = datos.entrada
        let salidaDisponibilidad = datos.salida

        if (entradaDisponibilidad && !salidaDisponibilidad) {
            const diaSiguiente = new Date(`${entradaDisponibilidad}T00:00:00Z`)
            diaSiguiente.setUTCDate(diaSiguiente.getUTCDate() + 1)
            salidaDisponibilidad = diaSiguiente.toISOString().slice(0, 10)
        }

        if (salidaDisponibilidad && entradaDisponibilidad && salidaDisponibilidad <= entradaDisponibilidad) {
            return []
        }

        return habitaciones.filter(habitacion => {
            if (habitacion.estado !== "Disponible" || habitacion.activa === false) return false
            if (!entradaDisponibilidad || !salidaDisponibilidad) return true

            return !reservas.some(reservaExistente => {
                if (reservaExistente.id === reserva?.id || reservaExistente.estado?.toLowerCase() === "cancelada") {
                    return false
                }

                const mismaHabitacion = reservaExistente.habitacionId
                    ? String(reservaExistente.habitacionId) === String(habitacion.id)
                    : normalizarNombre(reservaExistente.habitacion) === normalizarNombre(habitacion.nombre)

                return mismaHabitacion && reservaExistente.entrada && reservaExistente.salida &&
                    entradaDisponibilidad < reservaExistente.salida &&
                    reservaExistente.entrada < salidaDisponibilidad
            })
        })
    })()

    const habitacionSeleccionada = habitacionesDisponibles.find(habitacion =>
        String(habitacion.id) === String(datos.habitacion)
    )

    const manejarCambio = (e) => {
        setDatos(actuales => ({
            ...actuales,
            [e.target.name]: e.target.value
        }))
}

    const manejarEnvio = (e) => {
        e.preventDefault()
        if (!datos.habitacion || !datos.entrada  || !datos.salida){
            Swal.fire("Completa todos los satos")
            return
        }

        if (datos.salida <= datos.entrada){
            Swal.fire(
                "fechas incorrectas",
                "La fecha de salida debe ser posterior a la de entrada ",
                "warning"
            )
            return
        }

        const habitacion = habitacionesDisponibles.find(item =>
            String(item.id) === String(datos.habitacion)
        )
        if (!habitacion) {
            Swal.fire(
                "Habitación no disponible",
                "Selecciona una habitación disponible para las fechas indicadas.",
                "warning"
            )
            return
        }

        guardar({
            ...datos,
            habitacionId: habitacion.id,
            habitacion: habitacion.nombre,
            tipoHabitacion: habitacion.tipo || inferirTipoHabitacion(habitacion.nombre),
            precioHabitacion: Number(habitacion.precio)
        })

    }

    return (
        <form onSubmit={manejarEnvio}>
            <div className="mb-3">
                <label className="form-label">Habitación</label>
                <select 
                className="form-select"
                name="habitacion"
                value={datos.habitacion}
                onChange={manejarCambio}
                required       
            >
                <option value="">Seleccione una habitación</option>
                {habitacionesDisponibles.map(habitacion => (
                    <option key={habitacion.id} value={habitacion.id}>
                        {habitacion.nombre} · {habitacion.tipo || inferirTipoHabitacion(habitacion.nombre)} · ${Number(habitacion.precio).toLocaleString("es-CO")}
                    </option>
                ))}
                </select>
            {habitacionSeleccionada ? (
                <small className="form-text text-muted">
                    Tipo: {habitacionSeleccionada.tipo || inferirTipoHabitacion(habitacionSeleccionada.nombre)} ·
                    Precio: ${Number(habitacionSeleccionada.precio).toLocaleString("es-CO")} por noche
                </small>
            ) : datos.entrada && datos.salida && (
                <small className="form-text text-muted">No hay habitaciones disponibles para estas fechas.</small>
            )}
            </div>

            <div className="mb-3">
               <label className="form-label">Fecha de entrada</label> 
                <input 
                type="date"
                className="form-control"
                name="entrada"
                value={datos.entrada}
                onChange={manejarCambio}
                required
                 />
              </div>          

              <div className="mb-3">
               <label className="form-label">Fecha de salida</label> 
                <input 
                type="date"
                className="form-control"
                name="salida"
                min={datos.entrada ? (() => {
                    const diaSiguiente = new Date(`${datos.entrada}T00:00:00Z`)
                    diaSiguiente.setUTCDate(diaSiguiente.getUTCDate() + 1)
                    return diaSiguiente.toISOString().slice(0, 10)
                })() : undefined}
                value={datos.salida}
                onChange={manejarCambio}
                required
                 />

                <div className="mb-3">
                    <label htmlFor="" className="form-label">Estado</label>
                    <select 
                    className="form-select"
                    name="estado"
                    value={datos.estado}
                    onChange={manejarCambio}
                    required >

                <option value="Pendiente">Pendiente</option>
                <option value="Confirmada">Confirmada</option>
                <option value="Cancelada">Cancelada</option>
                    </select>
                    
                    </div> 
              </div>  
                <div className="d-flex justify-content-end gap-2">
                    <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={cancelar}
                    >
                Cancelar
                </button> 

                      <button
                    type="submit"
                    className="btn btn-success">
                    <i className="bi bi-check-circle me-2"></i>
                    Guardar Reserva

                </button> 
                </div>
              
              </form>
            
           
    )
}

export default FormularioReserva