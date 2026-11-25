import { useEffect, useRef, useState } from "react";
import { iniciarSesion } from "../api/cromoverso.js";
import cromosHero from "../assests/bg/cromos-hero.svg";
import logo from "../assests/iconos/logo-normal.svg";
import logoInverso from "../assests/iconos/logo-inverso.svg";
import "./IngresarPagina.css";

const MENSAJES = {
  es: {
    heroEtiqueta: "Temporada 1 · Seis mundos",
    heroTitulo: <>Seis mundos.<br />120 héroes.<br />Un álbum tuyo.</>,
    heroDescripcion: "Explora seis mundos y conoce a sus 120 héroes originales.",
    subtitulo: "Ingresa con el correo y la contraseña de tu cuenta.",
    alertaTitulo: "Revisa los campos marcados",
    alertaDetalle: "Para ingresar escribe tu correo y tu contraseña.",
    titulo: "Ingresa a tu cuenta",
    correo: "Correo electrónico",
    correoPlaceholder: "nombre@correo.com",
    correoRequerido: "Escribe tu correo electrónico.",
    correoInvalido: "Escribe un correo electrónico válido.",
    clave: "Contraseña",
    claveRequerida: "Escribe tu contraseña.",
    recordar: "Mantener la sesión iniciada",
    recuperar: "¿Olvidaste tu contraseña?",
    ingresar: "Ingresar",
    reintentar: "Reintentar",
    enviando: "Ingresando...",
    sinCuenta: "¿No tienes cuenta?",
    crearCuenta: "Crea una cuenta",
    mostrarClave: "Mostrar contraseña",
    ocultarClave: "Ocultar contraseña",
    errorGenerico: "No pudimos iniciar sesión. Inténtalo de nuevo.",
    errorConexion: "No pudimos conectar. Revisa tu conexión e inténtalo de nuevo.",
    esperar: (segundos) => `Espera ${segundos} segundos antes de intentarlo de nuevo.`,
  },
  en: {
    heroEtiqueta: "Season 1 · Six worlds",
    heroTitulo: <>Six worlds.<br />120 heroes.<br />One album of your own.</>,
    heroDescripcion: "Explore six worlds and meet their 120 original heroes.",
    subtitulo: "Sign in with your account email and password.",
    alertaTitulo: "Check the highlighted fields",
    alertaDetalle: "Enter your email and password to sign in.",
    titulo: "Sign in to your account",
    correo: "Email address",
    correoPlaceholder: "name@email.com",
    correoRequerido: "Enter your email address.",
    correoInvalido: "Enter a valid email address.",
    clave: "Password",
    claveRequerida: "Enter your password.",
    recordar: "Keep me signed in",
    recuperar: "Forgot your password?",
    ingresar: "Sign in",
    reintentar: "Try again",
    enviando: "Signing in...",
    sinCuenta: "Don't have an account?",
    crearCuenta: "Create an account",
    mostrarClave: "Show password",
    ocultarClave: "Hide password",
    errorGenerico: "We couldn't sign you in. Please try again.",
    errorConexion: "We couldn't connect. Check your connection and try again.",
    esperar: (segundos) => `Wait ${segundos} seconds before trying again.`,
  },
};

function validar(correo, clave, mensajes) {
  const errores = {};
  const correoLimpio = correo.trim();

  if (!correoLimpio) errores.correo = mensajes.correoRequerido;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
    errores.correo = mensajes.correoInvalido;
  }

  if (!clave) errores.clave = mensajes.claveRequerida;
  return errores;
}

function IconoAlerta() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 6v4.5M10 13.5v.1" />
    </svg>
  );
}

function IconoOjo({ visible }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M2 10s2.8-5 8-5 8 5 8 5-2.8 5-8 5-8-5-8-5Z" />
      <circle cx="10" cy="10" r="2.2" />
      {visible && <path d="m3 3 14 14" />}
    </svg>
  );
}

export default function IngresarPagina({ textos, idioma = "es", onSesion }) {
  const mensajes = MENSAJES[idioma === "en" ? "en" : "es"];
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");
  const [recordar, setRecordar] = useState(true);
  const [mostrarClave, setMostrarClave] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensajeGeneral, setMensajeGeneral] = useState("");
  const [espera, setEspera] = useState(0);
  const [codigoError, setCodigoError] = useState(null);
  const campoCorreo = useRef(null);
  const campoClave = useRef(null);

  useEffect(() => {
    if (espera <= 0) return undefined;
    const temporizador = setTimeout(() => setEspera((actual) => actual - 1), 1000);
    return () => clearTimeout(temporizador);
  }, [espera]);

  async function enviar(evento) {
    evento.preventDefault();
    const erroresLocales = validar(correo, clave, mensajes);
    setErrores(erroresLocales);
    setCodigoError(null);
    setMensajeGeneral(
      Object.keys(erroresLocales).length > 0
        ? mensajes.alertaTitulo
        : "",
    );

    if (Object.keys(erroresLocales).length > 0) {
      (erroresLocales.correo ? campoCorreo : campoClave).current?.focus();
      return;
    }

    setEnviando(true);
    try {
      const { usuario } = await iniciarSesion(correo.trim(), clave);
      onSesion?.(usuario);
    } catch (falla) {
      const erroresServidor =
        falla?.codigo === "validacion" && falla.campos
          ? falla.campos
          : {};
      setErrores(erroresServidor);
      setCodigoError(falla?.codigo ?? "error_interno");
      if (erroresServidor.correo || erroresServidor.clave) {
        (erroresServidor.correo ? campoCorreo : campoClave).current?.focus();
      }

      if (falla?.codigo === "demasiadas_peticiones") {
        const segundos = falla.reintentarEn || 30;
        setEspera(segundos);
        setMensajeGeneral(mensajes.esperar(segundos));
      } else if (falla?.codigo === "validacion") {
        setMensajeGeneral(mensajes.alertaTitulo);
      } else if (falla?.codigo === "conexion") {
        setMensajeGeneral(mensajes.errorConexion);
      } else {
        setMensajeGeneral(
          textos?.errores?.[falla?.codigo] ??
            textos?.errores?.generico ??
            mensajes.errorGenerico,
        );
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="ingresar">
      <aside className="ingresar-visual" aria-label="Cromoverso">
        <a className="ingresar-logo ingresar-logo--claro" href="#inicio">
          <img src={logoInverso} alt="Cromoverso" />
        </a>
        <img className="ingresar-cromos" src={cromosHero} alt="" />
        <div className="ingresar-promocion">
          <span className="ingresar-etiqueta">{mensajes.heroEtiqueta}</span>
          <h2>{mensajes.heroTitulo}</h2>
          <p>{mensajes.heroDescripcion}</p>
        </div>
      </aside>

      <div className="ingresar-formulario">
        <div className="ingresar-contenido">
          <a className="ingresar-logo" href="#inicio">
            <img src={logo} alt="Cromoverso" />
          </a>
          <h1>{mensajes.titulo}</h1>
          <p className="ingresar-subtitulo">{mensajes.subtitulo}</p>

          {mensajeGeneral && (
            <div className="ingresar-alerta" role="alert">
              <span className="ingresar-alerta-icono"><IconoAlerta /></span>
              <span>
                <strong>{mensajeGeneral}</strong>
                {mensajeGeneral === mensajes.alertaTitulo && (
                  <small>{mensajes.alertaDetalle}</small>
                )}
              </span>
            </div>
          )}

          <form onSubmit={enviar} noValidate>
            <div className="ingresar-campo">
              <label htmlFor="correo">{mensajes.correo}</label>
              <input
                ref={campoCorreo}
                id="correo"
                name="correo"
                type="email"
                autoComplete="email"
                placeholder={mensajes.correoPlaceholder}
                value={correo}
                onChange={(evento) => setCorreo(evento.target.value)}
                aria-invalid={Boolean(errores.correo)}
                aria-describedby={errores.correo ? "correo-error" : undefined}
                disabled={enviando}
              />
              {errores.correo && (
                <small className="ingresar-error" id="correo-error">
                  <IconoAlerta />
                  {errores.correo}
                </small>
              )}
            </div>

            <div className="ingresar-campo">
              <label htmlFor="clave">{mensajes.clave}</label>
              <div
                className={`ingresar-clave${errores.clave ? " is-invalid" : ""}`}
              >
                <input
                  ref={campoClave}
                  id="clave"
                  name="clave"
                  type={mostrarClave ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={clave}
                  onChange={(evento) => setClave(evento.target.value)}
                  aria-invalid={Boolean(errores.clave)}
                  aria-describedby={errores.clave ? "clave-error" : undefined}
                  disabled={enviando}
                />
                <button
                  className="ingresar-ver-clave"
                  type="button"
                  onClick={() => setMostrarClave((visible) => !visible)}
                  aria-label={mostrarClave ? mensajes.ocultarClave : mensajes.mostrarClave}
                  aria-pressed={mostrarClave}
                  disabled={enviando}
                >
                  <IconoOjo visible={mostrarClave} />
                </button>
              </div>
              {errores.clave && (
                <small className="ingresar-error" id="clave-error">
                  <IconoAlerta />
                  {errores.clave}
                </small>
              )}
            </div>

            <div className="ingresar-opciones">
              <label className="ingresar-recordar">
                <input
                  type="checkbox"
                  checked={recordar}
                  onChange={(evento) => setRecordar(evento.target.checked)}
                />
                <span>{mensajes.recordar}</span>
              </label>
              <a href="#recuperar-contrasena">{mensajes.recuperar}</a>
            </div>

            <button
              className="ingresar-boton"
              type="submit"
              disabled={enviando || espera > 0}
            >
              {enviando
                ? mensajes.enviando
                : espera > 0
                  ? mensajes.esperar(espera)
                  : codigoError === "conexion"
                    ? mensajes.reintentar
                  : mensajes.ingresar}
            </button>
          </form>

          <p className="ingresar-registro">
            {mensajes.sinCuenta} <a href="#registro">{mensajes.crearCuenta}</a>
          </p>
        </div>
      </div>
    </section>
  );
}
