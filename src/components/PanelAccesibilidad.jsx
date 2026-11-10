import { useEffect, useId, useRef } from "react";
import Cerrar from "../assests/iconos/cerrar.svg";
import "./PanelAccesibilidad.css";

const TAMANOS = ["normal", "grande", "muyGrande"];
const OPCIONES = [
  "altoContraste",
  "reducirMovimiento",
  "subrayarEnlaces",
  "fuenteLecturaFacil",
];

export default function PanelAccesibilidad({
  textos,
  abierto,
  onCerrar,
  valores,
  onCambiar,
  onRestablecer,
}) {
  const a = textos?.accesibilidad;
  const dialogo = useRef(null);
  const id = useId();

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (abierto && !d.open) d.showModal();
    if (!abierto && d.open) d.close();
  }, [abierto]);

  return (
    <dialog
      ref={dialogo}
      className="acc"
      aria-labelledby={`${id}-titulo`}
      onClose={onCerrar}
      onClick={(ev) => {
        if (ev.target === dialogo.current) onCerrar();
      }}
    >
      <div className="acc__contenido">
        <header className="acc__cabecera">
          <h2 id={`${id}-titulo`}>{a?.titulo}</h2>
          <button
            type="button"
            className="acc__cerrar"
            aria-label={textos?.general?.aria?.cerrarDialogo}
            onClick={onCerrar}
          >
            <img src={Cerrar} alt="" />
          </button>
        </header>

        <h3 id={`${id}-tamano`} className="acc__subtitulo">
          {a?.tamanoTexto?.titulo}
        </h3>
        <div
          className="acc__segmentos"
          role="group"
          aria-labelledby={`${id}-tamano`}
        >
          {TAMANOS.map((t) => (
            <button
              key={t}
              type="button"
              aria-pressed={valores.tamano === t}
              onClick={() => onCambiar("tamano", t)}
            >
              {a?.tamanoTexto?.opciones?.[t]}
            </button>
          ))}
        </div>

        {OPCIONES.map((clave) => (
          <div className="acc__fila" key={clave}>
            <div>
              <span id={`${id}-${clave}`} className="acc__nombre">
                {a?.[clave]?.titulo}
              </span>
              <span id={`${id}-${clave}-ayuda`} className="acc__ayuda">
                {a?.[clave]?.ayuda}
              </span>
            </div>
            <button
              type="button"
              role="switch"
              className="acc__interruptor"
              aria-checked={valores[clave]}
              aria-labelledby={`${id}-${clave}`}
              aria-describedby={`${id}-${clave}-ayuda`}
              onClick={() => onCambiar(clave, !valores[clave])}
            >
              <span aria-hidden="true" />
            </button>
          </div>
        ))}

        <footer className="acc__pie">
          <a href="#accesibilidad" onClick={onCerrar}>
            {a?.enlaces?.declaracion}
          </a>
          <button
            type="button"
            className="acc__restablecer"
            onClick={onRestablecer}
          >
            {a?.botones?.restablecer}
          </button>
        </footer>
      </div>
    </dialog>
  );
}
