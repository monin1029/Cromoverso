import { useEffect, useState } from "react";
import { api } from "../api/cromoverso.js";
import { interpolar } from "../utils/interpolar.js";
import { pad, IconoRareza, Silueta } from "./PiezasCromo.jsx";
import "./CromoPagina.css";

const ATRIBUTOS = ["fuerza", "velocidad", "mente", "energia"];

function actualizarMeta(titulo, descripcion) {
  document.title = titulo;
  let meta = document.querySelector('meta[name="description"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "description";
    document.head.append(meta);
  }
  meta.content = descripcion;
}

export default function CromoPagina({ id, textos }) {
  const [estado, setEstado] = useState({
    cromo: null,
    rarezas: [],
    cargando: true,
    error: null,
  });
  const [intento, setIntento] = useState(0);
  const d = textos?.paginas?.detalleCromo;
  const e = textos?.estados;

  useEffect(() => {
    const controlador = new AbortController();
    setEstado({ cromo: null, rarezas: [], cargando: true, error: null });
    Promise.all([
      api(`/cromos/${encodeURIComponent(id)}`, { signal: controlador.signal }),
      api("/rarezas", { signal: controlador.signal }),
    ])
      .then(([cromo, respuestaRarezas]) =>
        setEstado({
          cromo,
          rarezas: respuestaRarezas.datos,
          cargando: false,
          error: null,
        }),
      )
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setEstado({
          cromo: null,
          rarezas: [],
          cargando: false,
          error: { codigo: error?.codigo ?? "conexion" },
        });
      });

    return () => controlador.abort();
  }, [id, intento]);

  useEffect(() => {
    if (!estado.cromo) return;
    actualizarMeta(
      interpolar(d?.seo?.titulo ?? "{nombre} · Cromoverso", {
        nombre: estado.cromo.nombre,
      }),
      interpolar(d?.seo?.descripcion ?? "{poder}", {
        poder: estado.cromo.poder,
      }),
    );
  }, [estado.cromo, d]);

  useEffect(() => {
    if (estado.error?.codigo === "no_encontrado") {
      actualizarMeta(d?.noEncontrado?.titulo ?? "Cromo no encontrado", "");
    }
  }, [estado.error, d]);

  if (estado.cargando) {
    return (
      <section className="cromo-estado" role="status" aria-busy="true">
        <span className="cromo-esqueleto" />
        {e?.cargando ?? "Cargando…"}
      </section>
    );
  }

  if (estado.error?.codigo === "no_encontrado") {
    return (
      <section className="cromo-estado" role="status">
        <h1>{d?.noEncontrado?.titulo}</h1>
        <p>{d?.noEncontrado?.texto}</p>
        <a className="boton boton--acento" href="/#mundos">
          {d?.noEncontrado?.botones?.volver}
        </a>
      </section>
    );
  }

  if (estado.error) {
    const esConexion = estado.error.codigo === "conexion";
    const bloque = esConexion ? e?.sinConexion : e?.error;
    return (
      <section className="cromo-estado" role="alert">
        <h1>{bloque?.titulo}</h1>
        <p>
          {esConexion
            ? bloque?.texto
            : textos?.errores?.[estado.error.codigo] ??
              textos?.errores?.generico ??
              bloque?.texto}
        </p>
        <button
          className="boton boton--acento"
          type="button"
          onClick={() => setIntento((actual) => actual + 1)}
        >
          {e?.error?.botones?.reintentar}
        </button>
      </section>
    );
  }

  const { cromo, rarezas } = estado;
  const rareza = rarezas.find((item) => item.id === cromo.rareza);
  const tipo =
    d?.encabezado?.tipos?.[cromo.tipo] ?? cromo.tipo;
  const total = ATRIBUTOS.reduce(
    (suma, atributo) => suma + cromo.atributos[atributo],
    0,
  );

  return (
    <section className="cromo-detalle">
      <nav className="cromo-migas" aria-label={textos?.navbar?.aria?.menu}>
        <a href="/#mundos">{textos?.navbar?.enlaces?.mundos}</a>
        <span aria-hidden="true">›</span>
        <span aria-current="page">{cromo.nombre}</span>
      </nav>
      <div className="cromo-detalle-contenido">
        <div
          className={`cromo-lamina${cromo.holografico ? " es-holo" : ""}`}
          style={{ "--base": cromo.ilustracion.colorBase }}
        >
          <div className="cromo-carta">
            <span className="cromo-numero">{pad(cromo.numero)}</span>
            <span className="cromo-rareza" title={rareza?.nombre}>
              <IconoRareza id={cromo.rareza} />
              <span>{rareza?.nombre}</span>
            </span>
            <span className="cromo-arte">
              <Silueta figura={cromo.ilustracion.figura} />
            </span>
            <strong>{cromo.nombre}</strong>
            <small>{cromo.mundoNombre} · {tipo}</small>
          </div>
        </div>

        <article className="cromo-informacion">
          <a className="cromo-volver" href="/#mundos">
            {d?.noEncontrado?.botones?.volver}
          </a>
          <p className="cromo-ubicacion">
            {interpolar(d?.encabezado?.ubicacion, {
              id: cromo.id.toLowerCase(),
              mundo: cromo.mundoNombre,
              posicion: cromo.posicion ?? cromo.numero,
            })}
          </p>
          <h1>{cromo.nombre}</h1>
          <ul className="cromo-etiquetas">
            <li className="cromo-chip" style={{ "--r": rareza?.color }}>
              <IconoRareza id={cromo.rareza} />
              {rareza?.nombre}
            </li>
            <li className="cromo-chip">{tipo}</li>
            <li className="cromo-chip">{cromo.mundoNombre}</li>
          </ul>

          <section className="cromo-poder">
            <span aria-hidden="true">
              <svg viewBox="0 0 24 24" width="22" height="22">
                <path d="M13 2 5 14h6l-1 8 8-12h-6z" fill="currentColor" />
              </svg>
            </span>
            <div>
              <h2>{d?.poder?.titulo}</h2>
              <p>{cromo.poder}</p>
            </div>
          </section>
          <p className="cromo-descripcion">{cromo.descripcion}</p>

          <section className="cromo-atributos" aria-labelledby="cromo-atributos-titulo">
            <header>
              <h2 id="cromo-atributos-titulo">{d?.atributos?.titulo}</h2>
              <span>{interpolar(d?.atributos?.total, { total })}</span>
            </header>
            <p>{d?.atributos?.escala}</p>
            <ul>
              {ATRIBUTOS.map((atributo) => (
                <li key={atributo}>
                  <span>{d?.atributos?.nombres?.[atributo]}</span>
                  <span
                    className="cromo-barra"
                    role="meter"
                    aria-label={d?.atributos?.nombres?.[atributo]}
                    aria-valuemin={10}
                    aria-valuemax={99}
                    aria-valuenow={cromo.atributos[atributo]}
                  >
                    <span
                      style={{
                        width: `${((cromo.atributos[atributo] - 10) / 89) * 100}%`,
                      }}
                    />
                  </span>
                  <b>{cromo.atributos[atributo]}</b>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </div>
    </section>
  );
}
