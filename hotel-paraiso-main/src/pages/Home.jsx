import { useState } from "react"
import Habitaciones from "../components/Habitaciones"
import Hero from "../components/Hero"
import Navbar from "../components/Navbar"
import Servicios from "../components/Servicios"
import Contacto from "../components/Contacto"
import Footer from "../components/Footer"
import LoginModal from "../components/LoginModal"

function Home({ validarCredenciales, onLogin, onRegister }) {
  const [mostrarLogin, setMostrarLogin] = useState(false)
  return (
  <>
  <Navbar  abrirLogin={() => setMostrarLogin(true)} />
  <Hero />
  <Habitaciones />
  <Servicios />
  <Contacto />
  <Footer />

  <LoginModal 
  mostrar={mostrarLogin}
  cerrar={() => setMostrarLogin(false)}  
  validarCredenciales={validarCredenciales}
  onLogin={onLogin}
  onRegister={onRegister}
  />
  </>


  )
}

export default Home