import { useEffect, useState } from "react";

const API = "https://yanethm-cromoverso-api.fly.dev/api/v1/textos";
const CLAVES_MENU = ["inicio", "mundos"];



function validarTextos(datos) {
  const textos = datos?.textos;
  const nav = textos?.navbar;
  const pag = textos?.paginas;

  const etiquetas = [
    nav?.logo?.texto,
    nav?.logo?.aria,

    nav?.enlaces?.inicio,
    nav?.enlaces?.mundos,

    nav?.buscador?.placeholder,
    nav?.buscador?.aria,

    nav?.botones?.ingresar,
    nav?.botones?.crearCuenta,
    nav?.botones?.sobresDisponibles?.uno,
    nav?.botones?.sobresDisponibles?.otro,

    // pag?.inicio?.hero?.titulo,
    // pag?.inicio?.hero?.subitulo,

    // pag?.inicio?.hero?.botones?.crearCuentaGratis,
    // pag?.inicio?.hero?.botones?.explorarMundos
  ];

  if (
    !etiquetas.every(
      (valor) => typeof valor === "string" && valor.trim().length > 0,
    )
  ) {
    throw new Error(
      "La respuesta no contiene todos los textos necesarios del navbar.",
    );
  }

  return textos;
}



export function useTextos(idioma) {
  const [textos, setTextos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const controlador = new AbortController();
    const limite = setTimeout(() => controlador.abort(), 12000);
    let vigente = true;
    setCargando(true);
    setError(false);
    setTextos(null);

    async function cargarTextosNavbar() {
      try {
        const respuesta = await fetch(`${API}?idioma=${idioma}`, {
          signal: controlador.signal,
        });
        if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
        //Si si respondio los datos correctamente
        const datos = await respuesta.json();
        const nuevosTextos = validarTextos(datos);
        if (vigente) setTextos(nuevosTextos);
      } catch (error) {
        if (vigente && error.name !== "AbortError") {
          console.error("Error al cargar los textos:", error);
          setError(true);
        }
      } finally {
        clearTimeout(limite);
        if (vigente) setCargando(false);
      }
    }

    cargarTextosNavbar();
    return () => {
      vigente = false;
      clearTimeout(limite);
      controlador.abort();
    };
  }, [idioma, intento]);

  return {
    textos,
    cargando,
    error,
    recargar: () => setIntento((valor) => valor + 1),
  };
}
