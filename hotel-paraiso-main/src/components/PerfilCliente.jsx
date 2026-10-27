import { useState } from "react"
import "./PerfilCliente.css"

function PerfilCliente({ perfil, guardar }) {
    const [editando, setEditando] = useState(false)
    const [datos, setDatos] = useState(perfil)

    const manejarCambio = (evento) => {
        const { name, value } = evento.target
        setDatos(actuales => ({ ...actuales, [name]: value }))
    }

    const cancelarEdicion = () => {
        setDatos(perfil)
        setEditando(false)
    }

    const manejarEnvio = (evento) => {
        evento.preventDefault()
        guardar({ ...datos, correo: perfil.correo })
        setEditando(false)
    }

    const campos = [
        { nombre: "nombre", etiqueta: "Nombre completo", tipo: "text", icono: "bi-person" },
        { nombre: "telefono", etiqueta: "Teléfono", tipo: "tel", icono: "bi-telephone" },
        { nombre: "direccion", etiqueta: "Dirección", tipo: "text", icono: "bi-geo-alt" }
    ]

    return (
        <section className="hp-profile" aria-labelledby="hp-profile-title">
            <div className="hp-profile-heading">
                <div>
                    <p className="hp-profile-kicker">CUENTA DEL CLIENTE</p>
                    <h2 id="hp-profile-title">Datos personales</h2>
                </div>
                {!editando && (
                    <button
                        type="button"
                        className="hp-profile-edit"
                        onClick={() => setEditando(true)}
                    >
                        <i className="bi bi-pencil-square" aria-hidden="true"></i>
                        Editar datos
                    </button>
                )}
            </div>

            <form className="hp-profile-form" onSubmit={manejarEnvio}>
                <div className="hp-profile-identity">
                    <div className="hp-profile-avatar" aria-hidden="true">
                        <i className="bi bi-person-fill"></i>
                    </div>
                    <div>
                        <h3>{datos.nombre || "Cliente Hotel"}</h3>
                        <p>{perfil.correo}</p>
                    </div>
                    <span className="hp-profile-status">
                        <i className="bi bi-patch-check-fill" aria-hidden="true"></i>
                        Cliente
                    </span>
                </div>

                <div className="hp-profile-fields">
                    {campos.map(campo => (
                        <div className="hp-profile-field" key={campo.nombre}>
                            <label htmlFor={`perfil-${campo.nombre}`}>
                                <i className={`bi ${campo.icono}`} aria-hidden="true"></i>
                                {campo.etiqueta}
                            </label>
                            <input
                                id={`perfil-${campo.nombre}`}
                                className="form-control"
                                type={campo.tipo}
                                name={campo.nombre}
                                value={datos[campo.nombre]}
                                onChange={manejarCambio}
                                readOnly={!editando}
                                required={campo.nombre === "nombre"}
                                autoComplete={campo.nombre === "nombre" ? "name" : campo.nombre === "telefono" ? "tel" : "street-address"}
                            />
                        </div>
                    ))}

                    <div className="hp-profile-field">
                        <label htmlFor="perfil-correo">
                            <i className="bi bi-envelope" aria-hidden="true"></i>
                            Correo de acceso
                        </label>
                        <input
                            id="perfil-correo"
                            className="form-control hp-profile-email"
                            type="email"
                            value={perfil.correo}
                            readOnly
                            aria-describedby="perfil-correo-ayuda"
                        />
                        <span id="perfil-correo-ayuda" className="hp-profile-note">No editable</span>
                    </div>
                </div>

                {editando && (
                    <div className="hp-profile-actions">
                        <button
                            type="button"
                            className="hp-profile-cancel"
                            onClick={cancelarEdicion}
                        >
                            Cancelar
                        </button>
                        <button type="submit" className="hp-profile-save">
                            <i className="bi bi-check2" aria-hidden="true"></i>
                            Guardar cambios
                        </button>
                    </div>
                )}
            </form>
        </section>
    )
}

export default PerfilCliente