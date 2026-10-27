import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import TablaReservas from "../../components/TablaReservas";
import PerfilCliente from "../../components/PerfilCliente";
import "../admin/Dashboard.css"

function ClienteDashboard({ onLogout, perfil, guardarPerfil, clienteId }){
    const [seccion, setSeccion] = useState("Mis reservas")
    const opciones =["Mis reservas", "Mi perfil"]

return (
    <div className="hp-dashboard">
        <Sidebar
         titulo="Espacio del cliente"
         opciones={opciones}
         seccion={seccion}
         cambiarSeccion={setSeccion}
         cerrarSesion={onLogout}           
        />
<main className="hp-main">
    <header className="hp-header">
        <div>
            <p className="hp-eyebrow">PANEL DEL CLIENTE</p>
            <h1>{seccion}</h1>
            <p className="hp-subtitle">Bienvenido al Hotel Paraíso, {perfil.nombre}</p>
        </div>
    </header>
    {seccion === "Mis reservas" ? (
        <section className="hp-panel">
            <div className="hp-panel-header">
                <div>
                    <h2>Mis reservas</h2>
                    <p>Consulta aqui tus reservas</p>
                </div>
            </div>
            <TablaReservas clienteId={clienteId} />
        </section>
    ) : (
        <PerfilCliente perfil={perfil} guardar={guardarPerfil} />
    )}
</main>

    </div>
)
}

export default ClienteDashboard