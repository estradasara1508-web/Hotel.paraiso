import { useState } from "react"
import { Routes, Route, useNavigate } from "react-router-dom"
import Home from "./pages/Home"
import Dashboard from "./pages/admin/Dashboard"
import ClienteDashboard from "./pages/cliente/ClienteDashboard"
import ProtectedRoute from "./components/ProtectedRoute"

const clienteDemo = {
  id: "cliente-demo",
  nombre: "Cliente Hotel",
  correo: "cliente@hotel.com",
  password: "12345",
  rol: "cliente",
  telefono: "",
  direccion: ""
}

function cargarClientes() {
  const perfilAnterior = (() => {
    try {
      return JSON.parse(localStorage.getItem("perfilClienteHotel") || "{}")
    } catch {
      return {}
    }
  })()

  const demo = {
    ...clienteDemo,
    ...perfilAnterior,
    id: clienteDemo.id,
    correo: clienteDemo.correo,
    password: clienteDemo.password,
    rol: clienteDemo.rol
  }
  try {
    const guardados = JSON.parse(localStorage.getItem("clientesHotel") || "null")
    if (Array.isArray(guardados)) {
      return [demo, ...guardados.filter(cliente => cliente.id !== demo.id)]
    }
  } catch {
    return [demo]
  }
  return [demo]
}

function cargarSesion() {
  try {
    const guardada = JSON.parse(localStorage.getItem("sesionHotel") || "null")
    if (guardada?.id && guardada?.rol) return guardada
  } catch {
    // Recupera sesiones guardadas por versiones anteriores.
  }

  const rolAnterior = localStorage.getItem("usuarioHotel")
  if (rolAnterior === "admin") return { id: "admin", rol: "admin" }
  if (rolAnterior === "cliente") return { id: clienteDemo.id, rol: "cliente" }
  return null
}

function App() {
  const [clientes, setClientes] = useState(cargarClientes)
  const [sesion, setSesion] = useState(cargarSesion)

  const navigate = useNavigate()

  const validarCredenciales = (correo, password) => {
    const correoNormalizado = correo.trim().toLowerCase()
    if (correoNormalizado === "admin@hotel.com" && password === "12345") {
      return { id: "admin", rol: "admin" }
    }

    const cliente = clientes.find(cuenta =>
      cuenta.correo.toLowerCase() === correoNormalizado && cuenta.password === password
    )
    return cliente ? { id: cliente.id, rol: cliente.rol } : null
  }

  const iniciarSesion = (usuarioAutenticado) => {
    const nuevaSesion = { id: usuarioAutenticado.id, rol: usuarioAutenticado.rol }
    setSesion(nuevaSesion)
    localStorage.setItem("sesionHotel", JSON.stringify(nuevaSesion))
    localStorage.setItem("usuarioHotel", nuevaSesion.rol)
    navigate(nuevaSesion.rol === "admin" ? "/admin" : "/cliente")
  }

  const registrarCliente = ({ nombre, correo, password }) => {
    const correoNormalizado = correo.trim().toLowerCase()
    if (clientes.some(cliente => cliente.correo.toLowerCase() === correoNormalizado)) {
      return null
    }

    const nuevoCliente = {
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      correo: correoNormalizado,
      password,
      rol: "cliente",
      telefono: "",
      direccion: ""
    }
    const clientesActualizados = [...clientes, nuevoCliente]
    setClientes(clientesActualizados)
    localStorage.setItem("clientesHotel", JSON.stringify(clientesActualizados))
    return { id: nuevoCliente.id, rol: nuevoCliente.rol }
  }

  const cerrarSesion = () => {
    setSesion(null)
    localStorage.removeItem("sesionHotel")
    localStorage.removeItem("usuarioHotel")
    navigate("/")
  }

  const clienteActivo = sesion?.rol === "cliente"
    ? clientes.find(cliente => cliente.id === sesion.id)
    : null
  const rolActivo = sesion?.rol === "admin" ? "admin" : clienteActivo?.rol
  const perfilActivo = clienteActivo
    ? {
        id: clienteActivo.id,
        nombre: clienteActivo.nombre,
        correo: clienteActivo.correo,
        telefono: clienteActivo.telefono,
        direccion: clienteActivo.direccion
      }
    : null

  const guardarPerfilCliente = (perfilActualizado) => {
    const clientesActualizados = clientes.map(cliente =>
      cliente.id === clienteActivo?.id
        ? {
            ...cliente,
            nombre: perfilActualizado.nombre,
            telefono: perfilActualizado.telefono,
            direccion: perfilActualizado.direccion
          }
        : cliente
    )
    setClientes(clientesActualizados)
    localStorage.setItem("clientesHotel", JSON.stringify(clientesActualizados))
  }

  return (
    <Routes>
      <Route
        path="/"
        element={(
          <Home
            validarCredenciales={validarCredenciales}
            onLogin={iniciarSesion}
            onRegister={registrarCliente}
          />
        )}
       
      />
      <Route
        path="/admin"
        element={
            <ProtectedRoute usuario={rolActivo} rolPermitido="admin">
            <Dashboard onLogout={cerrarSesion} />
            </ProtectedRoute>
        }
        />

        <Route
        path="/cliente"
        element={
          <ProtectedRoute usuario={rolActivo} rolPermitido="cliente">
            <ClienteDashboard
              onLogout={cerrarSesion}
              perfil={perfilActivo}
              guardarPerfil={guardarPerfilCliente}
              clienteId={clienteActivo?.id}
            />

          </ProtectedRoute>
        }
        />
         
    
    </Routes>
  )
}

export default App