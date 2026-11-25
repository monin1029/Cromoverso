import { useEffect, useRef, useState } from "react";
import logoNormal from "../assests/iconos/logo-normal.svg";
import logoInverso from "../assests/iconos/logo-inverso.svg";
import Menu from "../assests/iconos/menu.svg";
import Cerrar from "../assests/iconos/cerrar.svg";
import Inicio from "../assests/iconos/inicio.svg";
import Flecha from "../assests/iconos/chevronder.svg";
import Mundo from "../assests/iconos/mundo.svg";
import Accesibilidad from "../assests/iconos/accesibilidad.svg";
import "./Navbar.css";

const DESTINOS = {
    inicio: "#inicio",
    mundos: "#mundos",    
};


export default function Navbar({
  textos,
  cargando,
  error,
  recargar,
  idioma,
  cambiarIdioma,
  activo,
  sesion,
  cerrarSesion,
  errorSesion,
  abrirAccesibilidad,
}) {
  const [abierto, setAbierto] = useState(false);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);
  const botonMenu = useRef(null);
  const botonCerrar = useRef(null);
  const botonUsuario = useRef(null);
  const menuUsuario = useRef(null);
  const menuEstabaAbierto = useRef(false);
  const nav = textos?.navbar;
  const ingles = idioma === "en";
  const desdeDetalle = window.location.pathname.startsWith("/cromos/");
  const destino = (hash) => `${desdeDetalle ? "/" : ""}${hash}`;
  const usuario = sesion?.usuario;
  const correoUsuario = usuario?.correo ?? usuario?.email ?? "";
  const identificadorUsuario =
    usuario?.usuario ??
    usuario?.username ??
    usuario?.handle ??
    usuario?.alias ??
    "";
  const etiquetaUsuario = identificadorUsuario
    ? identificadorUsuario.startsWith("@")
      ? identificadorUsuario
      : `@${identificadorUsuario}`
    : correoUsuario;
  const nombreCompuesto = [
    usuario?.nombre,
    usuario?.apellido ?? usuario?.apellidos,
  ]
    .filter(Boolean)
    .join(" ");
  const abrir =
    textos?.menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menú");
  const cerrar =
    textos?.menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");
  const nombreUsuario =
    (usuario?.nombreCompleto ??
      usuario?.name ??
      usuario?.displayName ??
      nombreCompuesto) ||
    correoUsuario;
  const iniciales = (nombreUsuario || correoUsuario || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toLocaleUpperCase();
  const enlaces = Object.entries(
    nav?.enlaces ?? {
      inicio: ingles ? "Home" : "Inicio",
      mundos: ingles ? "Worlds" : "Mundos",
    },
  ).filter(([clave]) => DESTINOS[clave]);

  useEffect(() => {
    if (abierto) {
      botonCerrar.current?.focus();
    } else if (menuEstabaAbierto.current) {
      botonMenu.current?.focus();
    }
    menuEstabaAbierto.current = abierto;
  }, [abierto]);

  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === "Escape" && menuUsuarioAbierto) {
        setMenuUsuarioAbierto(false);
        botonUsuario.current?.focus();
      }
      if (evento.key === "Escape" && abierto) {
        setAbierto(false);
        botonMenu.current?.focus();
      }
    }

    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto, menuUsuarioAbierto]);

  useEffect(() => {
    function cerrarAlHacerClicFuera(evento) {
      if (!menuUsuario.current?.contains(evento.target)) {
        setMenuUsuarioAbierto(false);
      }
    }

    document.addEventListener("pointerdown", cerrarAlHacerClicFuera);
    return () =>
      document.removeEventListener("pointerdown", cerrarAlHacerClicFuera);
  }, []);

  useEffect(() => {
    setMenuUsuarioAbierto(false);
  }, [sesion]);

  useEffect(() => {
    if (!abierto) return undefined;

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflowAnterior;
    };
  }, [abierto]);

  return (
    <header className="navbar">
      <nav
        className="navbar-interior"
        aria-label={nav?.aria.menu ?? "Navegación principal"}
      >
        <a
          className="navbar-logo"
          href={destino("#inicio")}
          aria-label={nav?.logo.aria ?? "Inicio"}
          onClick={() => setAbierto(false)}
        >
          <img src={logoNormal} className="logo-escritorio" alt="" />
          <img src={logoInverso} className="logo-movil" alt="" />
        </a>

        <div className={`navbar-enlaces ${abierto ? "is-abierto" : ""}`}>
          {enlaces.map(([clave, texto]) => (
            <a
              key={clave}
              href={destino(DESTINOS[clave])}
              aria-current={activo === clave ? "page" : undefined}
              onClick={() => setAbierto(false)}
            >
              {texto}
            </a>
          ))}
        </div>

        {/* Controles */}
        <div className={`navbar-acciones ${abierto ? "is-abierto" : ""}`}>
          <button
            type="button"
            className="navbar-boton-icono navbar-accesibilidad"
            aria-label={nav?.aria?.accesibilidad}
            aria-haspopup="dialog"
            onClick={abrirAccesibilidad}
          >
            <img src={Accesibilidad} alt="" />
          </button>
          <div className="navbar-idiomas" aria-label="Idioma">
            <button
              type="button"
              className={idioma === "es" ? "seleccionado" : ""}
              aria-pressed={idioma === "es"}
              onClick={() => cambiarIdioma("es")}
            >
              ES
            </button>

            <button
              type="button"
              className={idioma === "en" ? "seleccionado" : ""}
              aria-pressed={idioma === "en"}
              onClick={() => cambiarIdioma("en")}
            >
              EN
            </button>
          </div>

          {sesion ? (
            <div className="navbar-usuario" ref={menuUsuario}>
              <button
                ref={botonUsuario}
                type="button"
                className="navbar-avatar"
                aria-label={
                  ingles
                    ? `User menu: ${nombreUsuario}`
                    : `Menú de usuario: ${nombreUsuario}`
                }
                aria-haspopup="menu"
                aria-expanded={menuUsuarioAbierto}
                aria-controls="navbar-menu-usuario"
                onClick={() => setMenuUsuarioAbierto((valor) => !valor)}
              >
                {iniciales}
              </button>
              {menuUsuarioAbierto && (
                <div
                  id="navbar-menu-usuario"
                  className="navbar-menu-usuario"
                  role="menu"
                >
                  <div className="navbar-usuario-detalle">
                    <span className="navbar-avatar navbar-avatar--detalle" aria-hidden="true">
                      {iniciales}
                    </span>
                    <span className="navbar-usuario-texto">
                      <strong>{nombreUsuario}</strong>
                      {correoUsuario && <small>{correoUsuario}</small>}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    className="navbar-cerrar-sesion"
                    onClick={() => {
                      setMenuUsuarioAbierto(false);
                      cerrarSesion?.();
                    }}
                  >
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M8 3H4v14h4M11 6l4 4-4 4m4-4H7" />
                    </svg>
                    {ingles ? "Sign out" : "Cerrar sesión"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <a className="navbar-boton navbar-ingresar" href={destino("#ingresar")} onClick={() => setAbierto(true)}>
                {nav?.botones?.ingresar ?? (ingles ? "Log in": "Ingresar")}
              </a>

              <a className="navbar-boton navbar-crear" href={destino("#registro")}>
                {nav?.botones?.crearCuenta}
              </a>
            </>
          )}
        </div>

        {/* Botón del menú móvil */}
        <button
          ref={botonMenu}
          type="button"
          className="navbar-menu"
          aria-label={abierto ? cerrar : abrir}
          aria-expanded={abierto}
          aria-controls="navbar-menu-movil"
          onClick={() => setAbierto((valor) => !valor)}
        >
          <img src={Menu} alt="" />
        </button>
      </nav>

      {errorSesion && (
        <p className="navbar-sesion-error" role="alert">
          {errorSesion}
        </p>
      )}

      <section
        id="navbar-menu-movil"
        className={`navbar-panel-movil ${abierto ? "is-abierto" : ""}`}
        role="dialog"
        aria-label={
          nav?.aria.menu ??
          (ingles ? "Main navigation" : "Navegación principal")
        }
        aria-hidden={!abierto}
        aria-modal={abierto ? "true" : undefined}
        inert={!abierto}
      >
        <div className="navbar-panel-header">
          <a
            className="navbar-panel-logo"
            href={destino("#inicio")}
            onClick={() => setAbierto(false)}
            aria-label={nav?.logo.aria ?? "Inicio"}
          >
            <img src={logoNormal} className="logo-escritorio" alt="" />
            <img src={logoInverso} className="logo-movil" alt="" />
          </a>
          <button
            ref={botonCerrar}
            className="navbar-cerrar"
            type="button"
            aria-label={cerrar}
            onClick={() => setAbierto(false)}
            tabIndex={abierto ? 0 : -1}
          >
            <img src={Cerrar} alt="" />
          </button>
        </div>

        <nav
          className="navbar-panel-navegacion"
          aria-label={
            nav?.aria.menu ??
            (ingles ? "Main navigation" : "Navegación principal")
          }
        >
          {enlaces.map(([clave, texto]) => (
            <a
              key={clave}
              href={destino(DESTINOS[clave])}
              className={`navbar-panel-enlace ${activo === clave ? "activo" : ""}`}
              aria-current={activo === clave ? "page" : undefined}
              onClick={() => setAbierto(false)}
            >
              {clave === "inicio" ? (
                <img src={Inicio} alt="" />
              ) : (
                <img src={Mundo} alt="" />
              )}
              <span className="navbar-panel-texto">{texto}</span>
              {activo === clave ? (
                <span className="navbar-estas-aqui">
                  {ingles ? "YOU ARE HERE" : "ESTÁS AQUÍ"}
                </span>
              ) : (
                <span className="navbar-flecha" aria-hidden="true">
                  <img src={Flecha} alt="" />
                </span>
              )}
            </a>
          ))}
        </nav>

        <div className="navbar-panel-idioma">
          <span>{ingles ? "Language" : "Idioma"}</span>
          <div
            className="navbar-idiomas"
            role="group"
            aria-label={ingles ? "Language" : "Idioma"}
          >
            <button
              type="button"
              className={idioma === "es" ? "seleccionado" : ""}
              aria-pressed={idioma === "es"}
              onClick={() => cambiarIdioma("es")}
            >
              ES
            </button>
            <button
              type="button"
              className={idioma === "en" ? "seleccionado" : ""}
              aria-pressed={idioma === "en"}
              onClick={() => cambiarIdioma("en")}
            >
              EN
            </button>
          </div>
        </div>

        <div className="navbar-panel-idioma">
          <span>{textos?.menuMovil?.secciones?.accesibilidad}</span>
          <button
            type="button"
            className="navbar-boton-icono"
            aria-label={nav?.aria?.accesibilidad}
            aria-haspopup="dialog"
            onClick={() => {
              setAbierto(false);
              abrirAccesibilidad();
            }}
          >
            <img src={Accesibilidad} alt="" />
          </button>
        </div>

        <footer
          className={`navbar-panel-footer${sesion ? " navbar-panel-footer--sesion" : ""}`}
        >
          {sesion ? (
            <div className="navbar-panel-cuenta">
              <div className="navbar-panel-perfil">
                <span className="navbar-avatar navbar-avatar--panel" aria-hidden="true">
                  {iniciales}
                </span>
                <span className="navbar-panel-usuario">
                  <strong>{nombreUsuario}</strong>
                  {etiquetaUsuario && <small>{etiquetaUsuario}</small>}
                </span>
              </div>
              <button
                type="button"
                className="navbar-panel-cerrar-sesion"
                onClick={() => {
                  setAbierto(false);
                  cerrarSesion?.();
                }}
              >
                <svg viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M8 3H4v14h4M11 6l4 4-4 4m4-4H7" />
                </svg>
                {ingles ? "Sign out" : "Cerrar sesión"}
              </button>
            </div>
          ) : (
            <div className="navbar-panel-botones">
              <a
                className="navbar-boton navbar-ingresar"
                href={destino("#ingresar")}
                onClick={() => setAbierto(false)}
              >
                {nav?.botones?.ingresar ?? (ingles ? "Log in" : "Ingresar")}
              </a>
              <a
                className="navbar-boton navbar-crear"
                href={destino("#registro")}
                onClick={() => setAbierto(false)}
              >
                {nav?.botones?.crearCuenta ??
                  (ingles ? "Create account" : "Crear cuenta")}
              </a>
            </div>
          )}
        </footer>
      </section>

      {/* Estados de carga y error de la API */}
      {cargando && (
        <p className="navbar-mensaje" role="status">
          {ingles ? "Loading..." : "Cargando..."}
        </p>
      )}

      {error && (
        <div className="navbar-mensaje" role="alert">
          <span>
            {ingles
              ? "Navigation could not be loaded."
              : "No se pudo cargar la navegación."}
          </span>
          <button type="button" onClick={recargar}>
            {ingles ? "Retry" : "Reintentar"}
          </button>
        </div>
      )}
    </header>
  );
}