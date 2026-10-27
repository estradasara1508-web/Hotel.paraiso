
import { useState } from "react";
import Swal from "sweetalert2";

function LoginModal({ mostrar, cerrar, validarCredenciales, onLogin, onRegister }) {
  const [modo, setModo] = useState("login");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  if (!mostrar) return null;

  const iniciarSesion = (e) => {
    e.preventDefault();
    const cuenta = validarCredenciales(correo, password);

    if (!cuenta) {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "El correo o la contraseña son incorrectos",
        confirmButtonText: "Intentar nuevamente",
        confirmButtonColor: "#344c5c"
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Bienvenido",
      text: "Sesión iniciada correctamente",
      confirmButtonText: "Continuar",
      confirmButtonColor: "#344c5c"
    }).then(() => {
      cerrar();
      onLogin(cuenta);
    });
  };

  const registrarCliente = (e) => {
    e.preventDefault();
    if (password !== confirmarPassword) {
      Swal.fire({
        icon: "warning",
        title: "Las contraseñas no coinciden",
        confirmButtonColor: "#344c5c"
      });
      return;
    }

    const cuenta = onRegister({ nombre, correo, password });
    if (!cuenta) {
      Swal.fire({
        icon: "error",
        title: "Correo ya registrado",
        text: "Inicia sesión con ese correo o utiliza uno diferente.",
        confirmButtonColor: "#344c5c"
      });
      return;
    }

    Swal.fire({
      icon: "success",
      title: "Cuenta creada",
      text: "Tu cuenta está lista. Iniciarás sesión ahora.",
      confirmButtonText: "Continuar",
      confirmButtonColor: "#344c5c"
    }).then(() => {
      cerrar();
      onLogin(cuenta);
    });
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content rounded-4 shadow">
          <div className="modal-header border-0">
            <h4 className="modal-title fw-bold">
              {modo === "login" ? "Bienvenido" : "Crear cuenta"}
            </h4>
            <button
              type="button"
              className="btn-close"
              onClick={cerrar}
            />
          </div>

          <div className="modal-body px-4 pb-4">
            <p className="text-muted">
              {modo === "login" ? "Ingresa a tu cuenta del hotel" : "Regístrate como cliente de Hotel Paraíso"}
            </p>

            <form onSubmit={modo === "login" ? iniciarSesion : registrarCliente}>
              {modo === "register" && (
                <div className="mb-3">
                  <label htmlFor="registro-nombre" className="form-label">Nombre completo</label>
                  <input
                    id="registro-nombre"
                    type="text"
                    className="form-control"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="acceso-correo" className="form-label">Correo electrónico</label>
                <input
                  id="acceso-correo"
                  type="email"
                  className="form-control"
                  placeholder="correo@ejemplo.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>

              <div className={modo === "login" ? "mb-4" : "mb-3"}>
                <label htmlFor="acceso-password" className="form-label">Contraseña</label>
                <input
                  id="acceso-password"
                  type="password"
                  className="form-control"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={modo === "login" ? "current-password" : "new-password"}
                  minLength={modo === "register" ? 6 : undefined}
                  required
                />
              </div>

              {modo === "register" && (
                <div className="mb-4">
                  <label htmlFor="registro-confirmar-password" className="form-label">Confirmar contraseña</label>
                  <input
                    id="registro-confirmar-password"
                    type="password"
                    className="form-control"
                    placeholder="Repite tu contraseña"
                    value={confirmarPassword}
                    onChange={(e) => setConfirmarPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </div>
              )}

              <button
                type="submit"
                className="btn w-100 text-white py-2"
                style={{ backgroundColor: "#6b7017" }}
              >
                {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
              </button>
            </form>

            <p className="text-center mt-3 mb-0">
              {modo === "login" ? "¿No tienes cuenta? " : "¿Ya tienes una cuenta? "}
              <button
                type="button"
                className="btn btn-link p-0 align-baseline"
                onClick={() => setModo(modo === "login" ? "register" : "login")}
              >
                {modo === "login" ? "Regístrate" : "Inicia sesión"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
