import { useTextos } from "./hooks/useTextos.js";
import "./App.css";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import Hero from "./components/Hero.jsx";
import Mundos from "./components/Mundos.jsx";
import Footer from "./components/Footer.jsx";
import PreferenciasCookies from "./components/PreferenciasCookies.jsx";
import MundoPagina from "./components/MundoPagina.jsx"
import PanelAccesibilidad from "./components/PanelAccesibilidad.jsx";
import IngresarPagina from "./components/IngresarPagina.jsx"
import CromoPagina from "./components/CromoPagina.jsx";
import {
  cerrarSesion as solicitarCierreSesion,
  obtenerSesion,
} from "./api/cromoverso.js";


function leerSeccion() {
  if (window.location.pathname.startsWith("/cromos/")) {
    return window.location.pathname;
  }
  return window.location.hash.slice(1) || "inicio";
}

function leerIdCromo(ruta) {
  const id = ruta.slice("/cromos/".length);
  try {
    return decodeURIComponent(id);
  } catch {
    return id;
  }
}

function leerCookie(nombre) {
  const par = document.cookie.split("; ").find((p) => p.startsWith(`${nombre}=`));
  return par ? decodeURIComponent(par.slice(nombre.length + 1)) : null;
}

function escribirCookie(nombre, valor) {
  document.cookie = `${nombre}=${encodeURIComponent(valor)}; Max-Age=${60 * 60 * 24 * 180}; Path=/; SameSite=Lax`;
}

function borrarCookie(nombre) {
  document.cookie = `${nombre}=; Max-Age=0; Path=/; SameSite=Lax`;
}

function App() {
  const ACC_INICIAL = {
    tamano: "normal",
    altoContraste: false,
    reducirMovimiento: false,
    subrayarEnlaces: false,
    fuenteLecturaFacil: false,
  };
  
  const [consentimiento, setConsentimiento] = useState(() => leerCookie("consentimiento"));
  const [idioma, setIdioma] = useState(() => {
  const guardado = leerCookie("idioma");
  return leerCookie("consentimiento") === "aceptado" && ["es", "en"].includes(guardado)
      ? guardado
      : "es";
  });
  const [activo, setActivo] = useState(leerSeccion);  
  const [textoGrande, setTextoGrande] = useState(false);
  const datos = useTextos(idioma);  
  const [accAbierto, setAccAbierto] = useState(false);
  const [acc, setAcc] = useState(ACC_INICIAL);
  const [sesion, setSesion] = useState(null);
  const [errorSesion, setErrorSesion] = useState(null);

  const esIngresar = activo === "ingresar";
  const idCromo = activo.startsWith("/cromos/")
    ? leerIdCromo(activo)
    : null;

  const ingles = idioma === "en";
  const titulo =
    activo === "favoritos"
      ? datos.textos?.navbar.botones.favoritos
      : datos.textos?.navbar.enlaces[activo];

  //Va a sincronizar el estado del componente con el hash de la URL  

  useEffect(() => {
    function actualizar() {
      setActivo(leerSeccion());    
    }
    window.addEventListener("hashchange", actualizar);
    window.addEventListener("popstate", actualizar);
    return () => {
      window.removeEventListener("hashchange", actualizar);
      window.removeEventListener("popstate", actualizar);
    };
  }, []);

  useEffect(() => {
    const controlador = new AbortController();
    obtenerSesion({ signal: controlador.signal })
      .then(({ usuario }) => setSesion({ usuario }))
      .catch((error) => {
        if (error?.name === "AbortError" || error?.codigo === "no_autenticado") {
          setSesion(null);
          return;
        }
        console.error("No se pudo consultar la sesión:", error);
      });
    return () => controlador.abort();
  }, []);

  useEffect(() => {
    function llevarAIngreso() {
      setSesion(null);
      setErrorSesion("no_autenticado");
      window.history.pushState(null, "", "/#ingresar");
      setActivo("ingresar");
    }
    window.addEventListener("cromoverso:sesion-vencida", llevarAIngreso);
    return () =>
      window.removeEventListener("cromoverso:sesion-vencida", llevarAIngreso);
  }, []);

  useEffect(() => {
    document.documentElement.lang = idioma;
  }, [idioma]);  

  useEffect(() => {
    document.documentElement.style.fontSize = textoGrande ? "112%" : "";
    return () => {
      document.documentElement.style.fontSize = "";
    };
  }, [textoGrande]);  

  useEffect(() => {
    if (consentimiento === "aceptado") escribirCookie("idioma", idioma);
    else borrarCookie("idioma");
  }, [idioma, consentimiento]);

  function decidirCookies(valor) {
    escribirCookie("consentimiento", valor);
    setConsentimiento(valor);
  }

  useEffect(() => {
    if (
      activo.startsWith("mundos/") ||
      activo.startsWith("/cromos/") ||
      activo === "ingresar"
    ) {
      window.scrollTo(0, 0);
    }
    else document.getElementById(activo)?.scrollIntoView();
  }, [activo]);
  

  const idMundo = activo.startsWith("mundos/") ? activo.split("/")[1] : null;

  useEffect(() => {
    document.body.dataset.vista = idCromo ? "cromo" : idMundo ? "mundo" : "inicio";
  }, [idCromo, idMundo]);

  useEffect(() => {
    if (idCromo || idMundo || !datos.textos?.paginas?.inicio?.seo) return;
    document.title = datos.textos.paginas.inicio.seo.titulo;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.append(meta);
    }
    meta.content = datos.textos.paginas.inicio.seo.descripcion;
  }, [datos.textos, idCromo, idMundo]);

  function volverAlInicio() {
    window.history.pushState(null, "", "/#inicio");
    setActivo("inicio");
  }

  async function cerrarSesion() {
    setErrorSesion(null);
    try {
      await solicitarCierreSesion();
      setSesion(null);
      volverAlInicio();
    } catch (error) {
      setErrorSesion(error?.codigo ?? "error_interno");
    }
  }

  function iniciarSesion(usuario) {
    setSesion({ usuario });
    setErrorSesion(null);
    volverAlInicio();
  }

  useEffect(() => {
    const r = document.documentElement;
    r.dataset.tamano = acc.tamano;
    r.dataset.contraste = acc.altoContraste ? "alto" : "normal";
    r.dataset.movimiento = acc.reducirMovimiento ? "reducido" : "normal";
    r.dataset.enlaces = acc.subrayarEnlaces ? "subrayados" : "normal";
    r.dataset.fuente = acc.fuenteLecturaFacil ? "facil" : "normal";
  }, [acc]);

  return (
    <>
      {!esIngresar && (
        <Navbar
          {...datos}
          idioma={idioma}
          cambiarIdioma={setIdioma}
          activo={activo.split("/")[0]}
          sesion={sesion}
          cerrarSesion={cerrarSesion}
          errorSesion={
            errorSesion === "conexion"
              ? datos.textos?.estados?.sinConexion?.texto
              : errorSesion
                ? datos.textos?.errores?.[errorSesion] ??
                  datos.textos?.errores?.generico
                : null
          }
          texto={textoGrande}
          alternarTexto={() => setTextoGrande((valor) => !valor)}
          abrirAccesibilidad={() => setAccAbierto(true)}
        />
      )}

      <main>
        {esIngresar ? (
          <IngresarPagina {...datos} idioma={idioma} onSesion={iniciarSesion} />
        ) : idCromo ? (
          <CromoPagina id={idCromo} textos={datos.textos} />
        ) : idMundo ? (
          <MundoPagina {...datos} idioma={idioma} id={idMundo} />
        ) : (
          <>
            <Hero {...datos} idioma={idioma} />
            <Mundos {...datos} idioma={idioma} />
            <PreferenciasCookies
              {...datos}
              consentimiento={consentimiento}
              onDecidir={decidirCookies}
            />
          </>
        )}
      </main>
      {!esIngresar && <Footer {...datos} idioma={idioma} />}

      <PanelAccesibilidad
        textos={datos.textos}
        abierto={accAbierto}
        onCerrar={() => setAccAbierto(false)}
        valores={acc}
        onCambiar={(clave, valor) =>
          setAcc((actual) => ({ ...actual, [clave]: valor }))
        }
        onRestablecer={() => setAcc(ACC_INICIAL)}
      />
    </>
  );
}

export default App;