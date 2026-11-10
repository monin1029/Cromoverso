import { useTextos } from "./hooks/useTextos.js";
import "./App.css";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import Hero from "./components/Hero.jsx";
import Mundos from "./components/Mundos.jsx";
import Footer from "./components/Footer.jsx";
import PreferenciasCookies from "./components/PreferenciasCookies.jsx";
import MundoPagina from "./components/MundoPagina.jsx"


function leerSeccion() {
  return window.location.hash.slice(1) || "inicio";
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
  // Ahora el idioma va a depender de la Cookie  
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

  console.log(JSON.stringify({
  albumMundo: datos.textos?.paginas?.albumMundo,
  estados: datos.textos?.estados,
  errores: datos.textos?.errores,
}, null, 2));
  

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
    return () => window.removeEventListener("hashchange", actualizar);
  }, []);

  useEffect(() => {
    document.documentElement.lang;
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
    if (activo.startsWith("mundos/")) window.scrollTo(0, 0);
    else document.getElementById(activo)?.scrollIntoView();
  }, [activo]);
  

  const idMundo = activo.startsWith("mundos/") ? activo.split("/")[1] : null;

  useEffect(() => {
    document.body.dataset.vista = idMundo ? "mundo" : "inicio";
  }, [idMundo]);

  return (
    <>
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={setIdioma}
        activo={activo.split("/")[0]}     
        texto={textoGrande}
        alternarTexto={() => setTextoGrande((valor) => !valor)}        
      />                   
      <main>
        {idMundo ? (
          <MundoPagina {...datos} idioma={idioma} id={idMundo} />
        ) : (
          <>
            <Hero {...datos} idioma={idioma} />
            <Mundos {...datos} idioma={idioma} />
          </>
        )}
      </main>    
      <Footer 
      {...datos}
      idioma={idioma}
      />        
      <PreferenciasCookies
      {...datos}
      consentimiento={consentimiento} 
      onDecidir={decidirCookies}
      />
    </>
  );
}

export default App;