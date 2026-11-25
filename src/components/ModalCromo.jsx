import { useEffect, useRef } from "react";
import { interpolar } from "../utils/interpolar";
import { pad, IconoRareza, Silueta } from "./PiezasCromo.jsx";
import "./ModalCromo.css";

const ATRIBUTOS = ["fuerza", "velocidad", "mente", "energia"];
// Respaldo mientras se confirman las claves reales de paginas.detalleCromo
// const ETIQUETA_ATRIBUTO = {
//   fuerza: "Fuerza",
//   velocidad: "Velocidad",
//   mente: "Mente",
//   energia: "Energía",
// };

export default function ModalCromo({
  mundo,
  lista,
  rarezas,
  idCromo,
  textos,
  idioma = "es",
  onIr,
  onCerrar,
}) {    

  const dialogo = useRef(null);
  const d = textos?.paginas?.detalleCromo;
  const filtros = textos?.paginas?.albumMundo?.filtros;

  const cromo = mundo.cromos.find((c) => c.id === idCromo);
  const indice = lista.findIndex((c) => c.id === idCromo);
  const anterior = indice > 0 ? lista[indice - 1] : null;
  const siguiente =
    indice >= 0 && indice < lista.length - 1 ? lista[indice + 1] : null;

  // Abre como modal nativo: el navegador atrapa el foco, inerta el fondo y cierra con Esc.
  useEffect(() => {
    const el = dialogo.current;
    if (el && !el.open) el.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  // Al cambiar de cromo, el contenido vuelve arriba.
  useEffect(() => {
    dialogo.current?.scrollTo(0, 0);
  }, [idCromo]);

  if (!cromo) return null;

  const rareza = rarezas.find((r) => r.id === cromo.rareza);
  const tipo = filtros?.tipo?.opciones?.[cromo.tipo];
  const total = ATRIBUTOS.reduce((suma, a) => suma + cromo.atributos[a], 0);
  const posicion = cromo.numero - mundo.numeros.desde + 1;

  function alTeclear(ev) {
    if (ev.key === "Escape") {
      ev.preventDefault();
      dialogo.current?.close();
      return;
    }
    if (ev.key === "ArrowLeft" && anterior) onIr(anterior.id);
    if (ev.key === "ArrowRight" && siguiente) onIr(siguiente.id);
  }

  return (
    <dialog
      ref={dialogo}
      className="modal-cromo"
      aria-labelledby="modal-cromo-titulo"
      onClose={onCerrar}
      onKeyDown={alTeclear}
      onClick={(ev) => {
        if (ev.target === ev.currentTarget) onCerrar();
      }}
      style={{ "--base": cromo.ilustracion.colorBase, "--c": mundo.color }}
    >
      <div className="modal-cromo-contenido">
        <button
          type="button"
          className="modal-cromo-cerrar"
          onClick={onCerrar}
          aria-label={d?.botones?.cerrar ?? textos?.navbar?.aria?.cerrar ?? "Cerrar"}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className={`modal-cromo-lamina${cromo.holografico ? " es-holo" : ""}`}>
          <div className="modal-cromo-carta">
            <span className="carta-numero">{pad(cromo.numero)}</span>
            <span className="carta-rareza" title={rareza?.nombre}>
              <IconoRareza id={cromo.rareza} />
            </span>
            <span className="modal-cromo-arte">
              <Silueta figura={cromo.ilustracion.figura} />
            </span>
            <strong>{cromo.nombre}</strong>
            <small>
              {interpolar(textos?.paginas?.albumMundo?.tarjeta?.tipo, {
                mundo: cromo.mundoNombre,
                tipo,
              })}
            </small>
          </div>
        </div>

        <div className="modal-cromo-info">
          <ul className="modal-cromo-chips">
            <li>
              <span className="chip" style={{ "--r": rareza?.color }}>
                <IconoRareza id={cromo.rareza} />
                {rareza?.nombre}
              </span>
            </li>
            <li>
              <span className="chip chip--mundo">{cromo.mundoNombre}</span>
            </li>
            <li>
              <span className="chip chip--tipo">{tipo}</span>
            </li>
          </ul>

          <p className="modal-cromo-meta">
            {d?.encabezado?.ubicacion
              ? interpolar(d.encabezado.ubicacion, {
                  id: cromo.id.toLowerCase(),
                  mundo: cromo.mundoNombre,
                  posicion,
                })
              : `${cromo.id.toLowerCase()} · ${cromo.mundoNombre} · ${posicion}`}
          </p>

          <h2 id="modal-cromo-titulo" aria-live="polite">
            {cromo.nombre}
          </h2>

          <div className="modal-cromo-poder">
            <span className="modal-cromo-poder-icono" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M13 2L5 14h6l-1 8 8-12h-6z" fill="currentColor" />
              </svg>
            </span>
            <div>
              <small>
                {d?.poder?.titulo ??
                  d?.poder ??
                  d?.etiquetas?.poder ??
                  "Poder"}
              </small>
              <strong>{cromo.poder}</strong>
            </div>
          </div>

          <p className="modal-cromo-descripcion">{cromo.descripcion}</p>
          <a
            className="modal-cromo-pagina"
            href={`/cromos/${encodeURIComponent(cromo.id)}`}
          >
            {d?.botones?.verPagina ??
              (idioma === "en" ? "Open full card page" : "Ver página completa")}
          </a>

          <section className="modal-cromo-atributos">
            <header>
              <h3>{d?.atributos?.titulo ?? "Atributos"}</h3>
              <span>
                {interpolar(d?.atributos?.total ?? "Total {total}", { total })}
              </span>
            </header>
            <ul>
              {ATRIBUTOS.map((a) => (
                <li key={a}>
                  <span>
                    {d?.atributos?.nombres?.[a] ??
                      d?.atributos?.[a] ??
                      ETIQUETA_ATRIBUTO[a]}
                  </span>
                  <span
                    className="barra"
                    role="meter"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={cromo.atributos[a]}
                  >
                    <span style={{ width: `${cromo.atributos[a]}%` }} />
                  </span>
                  <b>{cromo.atributos[a]}</b>
                </li>
              ))}
            </ul>
          </section>

          <nav className="modal-cromo-nav">
            {anterior ? (
              <button type="button" onClick={() => onIr(anterior.id)}>
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {pad(anterior.numero)} {anterior.nombre}
              </button>
            ) : (
              <span />
            )}
            {siguiente && (
              <button type="button" onClick={() => onIr(siguiente.id)}>
                {pad(siguiente.numero)} {siguiente.nombre}
                <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                  <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </nav>
        </div>
      </div>
    </dialog>
  );
}
