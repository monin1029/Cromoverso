import { useEffect, useState } from "react";
import { useMundo, useCromosFiltrados } from "../hooks/useMundo";
import { useMundos } from "../hooks/useMundos";
import { interpolar } from "../utils/interpolar";
import iconoComun from "../assests/mundos/circulo.svg";
import iconoRara from "../assests/mundos/rombo.svg";
import iconoEpica from "../assests/mundos/estrella.svg";
import iconoLegendaria from "../assests/mundos/corona.svg";
import "./MundoPagina.css";

const pad = (n) => String(n).padStart(3, "0");

const RAREZAS = ["comun", "rara", "epica", "legendaria"];
const TIPOS = ["heroe", "aliado", "villano"];
const ORDENES = { numero: (a, b) => a.numero - b.numero };
const ICONO_RAREZA = {
  comun: iconoComun,
  rara: iconoRara,
  epica: iconoEpica,
  legendaria: iconoLegendaria,
}; 

function leerFiltros() {
  const p = new URLSearchParams(window.location.search);
  const rareza = p.get("rareza");
  const tipo = p.get("tipo");
  return {
    rareza: RAREZAS.includes(rareza) ? rareza : null,
    tipo: TIPOS.includes(tipo) ? tipo : null,
  };
}

function guardarFiltros({ rareza, tipo }) {
  const p = new URLSearchParams();
  if (rareza) p.set("rareza", rareza);
  if (tipo) p.set("tipo", tipo);
  const qs = p.toString();
  history.replaceState(
    null,
    "",
    `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`,
  );
}

export default function MundoPagina({ id, textos }) {
  const t = textos?.paginas?.albumMundo;
  const e = textos?.estados;
  const { mundo, rarezas, cargando, error, recargar } = useMundo(id);
  const { mundos } = useMundos();

  const [filtros, setFiltros] = useState(leerFiltros);
  const [orden, setOrden] = useState("numero");
  const filtrados = useCromosFiltrados(id, filtros.rareza, filtros.tipo);

  function aplicar(nuevos) {
    setFiltros(nuevos);
    guardarFiltros(nuevos);
  }
  const alternar = (clave, valor) => aplicar({ ...filtros, [clave]: filtros[clave] === valor ? null : valor });

  const limpiar = () => aplicar({ rareza: null, tipo: null });

  useEffect(() => {
    if (mundo)
      document.title = interpolar(t?.seo?.titulo, { mundo: mundo.nombre });
  }, [mundo, t]);

  if (error) {
    const noExiste = error.codigo === "no_encontrado";
    const sinRed = error.codigo === "conexion";
    const bloque = noExiste
      ? e?.noEncontrado
      : sinRed
        ? e?.sinConexion
        : e?.error;
    const texto =
      noExiste || sinRed
        ? bloque?.texto
        : (textos?.errores?.[error.codigo] ?? textos?.errores?.generico);

    return (
      <section className="mundo-estado" role="alert">
        <h1>{bloque?.titulo}</h1>
        <p>{texto}</p>
        {noExiste ? (
          <a className="boton boton--acento" href="#inicio">
            {bloque?.botones?.irAlInicio}
          </a>
        ) : (
          <button className="boton boton--acento" onClick={recargar}>
            {e?.error?.botones?.reintentar}
          </button>
        )}
      </section>
    );
  }

  if (cargando) {
    const nombre = mundos.find((m) => m.id === id)?.nombre ?? id;
    return (
      <section className="mundo-estado" role="status" aria-busy="true">
        {interpolar(e?.cargandoMundo, { mundo: nombre })}
      </section>
    );
  }

  const numeroMundo = Math.floor((mundo.numeros.desde - 1) / mundo.totalCromos) + 1;
  
  const hayFiltros = Boolean(filtros.rareza || filtros.tipo);
  const base = hayFiltros ? filtrados.cromos : mundo.cromos;
  const lista = base ? [...base].sort(ORDENES[orden]) : [];
  const porTipo = mundo.cromos.reduce(
    (acc, c) => ({ ...acc, [c.tipo]: (acc[c.tipo] ?? 0) + 1 }),
    {},
  );
  const rarezasOrdenadas = [...rarezas].sort(
    (a, b) => a.porcentaje - b.porcentaje,
  );

  return (
    <>
      <header className="mundo-cabecera" style={{ "--c": mundo.color }}>
        <nav>
          <a href="#inicio">{t?.migas?.inicio}</a>
          <span aria-hidden="true"> › </span>
          <span aria-current="page">{mundo.nombre}</span>
        </nav>
        <h1>{mundo.nombre}</h1>
        <p>
          {interpolar(t?.encabezado?.rango, {
            numero: numeroMundo,
            desde: pad(mundo.numeros.desde),
            hasta: pad(mundo.numeros.hasta),
          })}
        </p>
      </header>

      <div className="mundo-cuerpo">
        <aside className="mundo-lateral">
          <PanelMundos mundos={mundos} activo={id} t={t} />

          <section className="panel">
            <h2>{t?.filtros?.rareza?.titulo}</h2>
            <ul className="filtro">
              {rarezasOrdenadas.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className="filtro-opcion"
                    aria-pressed={filtros.rareza === r.id}
                    onClick={() => alternar("rareza", r.id)}
                    style={{ "--r": r.color }}
                  >
                    <span className="chip">
                      <IconoRareza id={r.id} />{r.nombre}
                    </span>
                    <span className="filtro-cuenta">
                      {cuenta(t, mundo.porRareza[r.id] ?? 0)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          <section className="panel">
            <h2>{t?.filtros?.tipo?.titulo}</h2>
            <ul className="filtro">
              {TIPOS.map((tp) => (
                <li key={tp}>
                  <button
                    type="button"
                    className="filtro-opcion"
                    aria-pressed={filtros.tipo === tp}
                    onClick={() => alternar("tipo", tp)}
                  >
                    <span>{t?.filtros?.tipo?.opciones?.[tp]}</span>
                    <span className="filtro-cuenta">
                      {cuenta(t, porTipo[tp] ?? 0)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <div className="mundo-principal">
          <div className="mundo-barra">
            <select
              className="orden"
              value={orden}
              onChange={(ev) => setOrden(ev.target.value)}
              aria-label={interpolar(t?.orden?.etiqueta, {
                orden: t?.orden?.opciones?.[orden],
              })}
            >
              {Object.keys(ORDENES).map((o) => (
                <option key={o} value={o}>
                  {interpolar(t?.orden?.etiqueta, {
                    orden: t?.orden?.opciones?.[o],
                  })}
                </option>
              ))}
            </select>
          </div>

          <p className="solo-lectores" role="status">
            {interpolar(
              lista.length === 1
                ? t?.filtros?.cantidad?.uno
                : t?.filtros?.cantidad?.otro,
              { cantidad: lista.length },
            )}
          </p>

          {hayFiltros && filtrados.error ? (
            <p role="alert">
              {textos?.errores?.[filtrados.error.codigo] ??
                textos?.errores?.generico}
            </p>
          ) : hayFiltros && filtrados.cargando ? (
            <p role="status">{e?.cargando}</p>
          ) : lista.length === 0 ? (
            <div className="vacio" role="status">
              <h2>{t?.vacio?.titulo}</h2>
              <p>{t?.vacio?.texto}</p>
              <button
                type="button"
                className="boton boton--acento"
                onClick={limpiar}
              >
                {t?.vacio?.botones?.limpiar}
              </button>
            </div>
          ) : (
            <ul className="mundo-rejilla">
              {lista.map((c) => (
                <CartaCromo
                  key={c.id}
                  cromo={c}
                  rareza={rarezas.find((r) => r.id === c.rareza)}
                  t={t}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

function PanelMundos({ mundos, activo, t }) {
  return (
    <nav className="panel">
      <h2>{t?.mundos?.titulo}</h2>
      <ul>
        {mundos.map((m) => (
          <li key={m.id}>
            <a
              href={`#mundos/${m.id}`}
              aria-current={m.id === activo ? "page" : undefined}
              style={{ "--c": m.color }}
            >
              <span className="panel-punto" aria-hidden="true" />
              <span>{m.nombre}</span>
              <span>
                {interpolar(t?.mundos?.cromos, { cantidad: m.totalCromos })}
              </span>
              {m.id === activo && (
                <small>{t?.mundos?.aria?.paginaActual}</small>
              )}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function CartaCromo({ cromo, rareza, t }) {
  const tipo = t?.filtros?.tipo?.opciones?.[cromo.tipo];
  return (
    <li>
      <a
        className={`carta${cromo.holografico ? " carta-holo" : ""}`}
        href={`#cromos/${cromo.id}`}
        style={{ "--base": cromo.ilustracion.colorBase }}
      >
        <span className="carta-numero">{pad(cromo.numero)}</span>
        <span className="carta-rareza" title={rareza?.nombre}>
          <IconoRareza id={rareza?.id} />
          <span className="solo-lectores">{rareza?.nombre}</span>
        </span>
        <div className="carta-arte">
          <Silueta />
        </div>
        <strong>{cromo.nombre}</strong>
        <small>
          {interpolar(t?.tarjeta?.tipo, { mundo: cromo.mundoNombre, tipo })}
        </small>
      </a>
    </li>
  );
}

function Silueta() {
  return (
    <svg viewBox="0 0 100 120" aria-hidden="true">
      <circle cx="50" cy="58" r="38" fill="#fff" opacity=".18" />
      <circle cx="50" cy="52" r="15" fill="#1A1033" />
      <rect x="36" y="49" width="28" height="7" rx="3.5" fill="#FFD23F" />
      <path d="M20 112c0-22 13-38 30-38s30 16 30 38z" fill="#1A1033" />
      <path
        d="M50 88l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"
        fill="#FFD23F"
      />
    </svg>
  );
}

function IconoRareza({ id }) {
  return (
    <span
      className={`icono-rareza icono-rareza--${id}`}
      style={{ "--icono": `url("${ICONO_RAREZA[id]}")` }}
      aria-hidden="true"
    />
  );
}

function cuenta(t, n) {
    return interpolar(
      n === 1 ? t?.filtros?.cantidad?.uno : t?.filtros?.cantidad?.otro,
      { cantidad: n },
    );
}
