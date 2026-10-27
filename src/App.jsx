import { useTextos } from "./hooks/useTextos.js";
import "./App.css";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import Hero from "./components/Hero.jsx";

function leerSeccion() {
  return window.location.hash.slice(1) || "inicio";
}

function App() {
  // Idioma por defecto español
  
  const [idioma, setIdioma] = useState("es");
  const [activo, setActivo] = useState(leerSeccion);  
  const [textoGrande, setTextoGrande] = useState(false);
  const datos = useTextos(idioma);
  console.log(datos);

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

  return (
    <>
      <Navbar
        {...datos}
        idioma={idioma}
        cambiarIdioma={setIdioma}
        activo={activo}        
        texto={textoGrande}
        alternarTexto={() => setTextoGrande((valor) => !valor)}
      />    
      <Hero
      {...datos}
      idioma={idioma}
      />
      <main className="inicio">
        <section className="portada" id="inicio">
          <div className="contenido">
            <h1>{ingles}</h1>
          </div>
        </section>
        <p>{ingles ? "English content": "Contenido en español"}</p>
        <h1>{titulo ?? (ingles ? "Navigation" : "Navegación")}</h1>        
        <p>          
          {ingles 
          ? "This example loads navigation abels from the API"
          : "Este ejemplo carga los textos del menu desde la API"}
        </p>
      </main>            
    </>
  );
}

export default App;