import { useEffect, useRef, useState } from "react";
import logoNormal from "../assests/iconos/logo-normal.svg";
import logoInverso from "../assests/iconos/logo-inverso.svg";
import Menu from "../assests/iconos/menu.svg";
import Cerrar from "../assests/iconos/cerrar.svg";
import Inicio from "../assests/iconos/inicio.svg";
import Flecha from "../assests/iconos/chevronder.svg";
import Mundo from "../assests/iconos/mundo.svg";
import "./Navbar.css";

const DESTINOS = {
    inicio: "#inicio",
    mundos: "#mundos"
};

export default function Navbar({
    textos,
    cargando,
    error,
    recargar,
    idioma,
    cambiarIdioma,
    activo,    
    textoGrande, 
    alternarTexto
}) {
    const [abierto, setAbierto] = useState(false);    
    const botonMenu = useRef(null);
    const botonCerrar = useRef(null);
    const menuEstabaAbierto = useRef(false);
    const nav = textos?.navbar;
    const ingles = idioma === "en";
    const abrir = textos?.menuMovil?.abrir ?? (ingles ? "Open menu" : "Abrir menú");
    const cerrar = textos?.menuMovil?.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");
    const enlaces = Object.entries(nav?.enlaces ?? {
        inicio: ingles ? "Home" : "Inicio",
        mundos: ingles ? "Worlds" : "Mundos"
    }).filter(([clave]) => DESTINOS[clave]);

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
            if (evento.key === "Escape" && abierto) {
                setAbierto(false);
                botonMenu.current?.focus();
            }
        }

        document.addEventListener("keydown", cerrarConEscape);
        return () => document.removeEventListener("keydown", cerrarConEscape);
    }, [abierto]);

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
                href="#inicio"
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
                    href={DESTINOS[clave]}
                    aria-current={activo === clave ? "page" : undefined}
                    onClick={() => setAbierto(false)}
                    >
                    {texto}
                    </a>
                ))}
                </div>

                {/* Controles */}
                <div className={`navbar-acciones ${abierto ? "is-abierto" : ""}`}>
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

                    <button
                    className="navbar-boton navbar-ingresar"
                    type="button"
                    >
                        {ingles ? "Log in" : "Ingresar"}
                    </button>

                    <button
                    className="navbar-boton navbar-crear"
                    type="button"
                    >
                        {ingles ? "Create account" : "Crear cuenta"}
                    </button>
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

            <section
                id="navbar-menu-movil"
                className={`navbar-panel-movil ${abierto ? "is-abierto" : ""}`}
                role="dialog"
                aria-label={nav?.aria.menu ?? (ingles ? "Main navigation" : "Navegación principal")}
                aria-hidden={!abierto}
                aria-modal={abierto ? "true" : undefined}
                inert={!abierto}
            >
                <div className="navbar-panel-header">
                    <a className="navbar-panel-logo" href="#inicio" onClick={() => setAbierto(false)} aria-label={nav?.logo.aria ?? "Inicio"}>
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

                <nav className="navbar-panel-navegacion" aria-label={nav?.aria.menu ?? (ingles ? "Main navigation" : "Navegación principal")}>
                    {enlaces.map(([clave, texto]) => (
                        <a
                            key={clave}
                            href={DESTINOS[clave]}
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
                                <span className="navbar-estas-aqui">{ingles ? "YOU ARE HERE" : "ESTÁS AQUÍ"}</span>
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
                    <div className="navbar-idiomas" role="group" aria-label={ingles ? "Language" : "Idioma"}>
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

                <footer className="navbar-panel-footer">
                    
                    <div className="navbar-panel-botones">
                        <button className="navbar-boton navbar-ingresar" type="button" onClick={() => setAbierto(false)}>
                            {nav?.botones?.ingresar ?? (ingles ? "Log in" : "Ingresar")}
                        </button>
                        <button className="navbar-boton navbar-crear" type="button" onClick={() => setAbierto(false)}>
                            {nav?.botones?.crearCuenta ?? (ingles ? "Create account" : "Crear cuenta")}
                        </button>
                    </div>
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
    )
}