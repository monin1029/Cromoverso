import { useEffect } from "react";
import { useMundo } from "../hooks/useMundo";
import { useMundos } from "../hooks/useMundos";
import { interpolar } from "../utils/interpolar";
import Circulo from "../assests/mundos/circulo.svg";
import "./MundoPagina.css";

const ICONOS_RAREZA = { circulo: Circulo /* + los otros tres */ };
// uso: {ICONOS_RAREZA[rareza?.icono] ?? "●"}

const pad = (n) => String(n).padStart(3, "0");

export default function MundoPagina({ id, textos }) {
    const t = textos?.paginas?.albumMundo;
    const e = textos?.estados    
    const { mundo, rarezas, cargando, error, recargar } = useMundo(id);
    const { mundos } = useMundos();

    useEffect(() => {
        if (mundo) document.title = interpolar(t?.seo?.titulo, { mundo: mundo.nombre });
    }, [mundo, t]);

    if (error) {
        const noExiste = error.codigo === "no_encontrado";
        const sinRed = error.codigo === "conexion";
        const bloque = noExiste ? e?.noEncontrado : sinRed ? e?.sinConexion : e?.error;
        const texto = noExiste || sinRed
        ? bloque?.texto
        : (textos?.errores?.[error.codigo] ?? textos?.errores?.generico);

        return (
            <section className="mundo-estado" role="alert">
                <h1>{bloque?.titulo}</h1>
                <p>{texto}</p>
                {noExiste ? (
                    <a className="boton boton--acento" href="#inicio">{bloque?.botones?.irAlInicio}</a>
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
    const posicion = mundos.findIndex((m) => m.id === id) + 1;

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
            <PanelMundos mundos={mundos} activo={id} t={t} />
            <ul className="mundo-rejilla">
                {mundo.cromos.map((c) => (
                    <CartaCromo key={c.id} cromo={c} rareza={rarezas.find((r) => r.id === c.rareza)} t={t} />
                ))}
            </ul>
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
                    <span className="panel__punto" aria-hidden="true" />
                    <span>{m.nombre}</span>
                    <span>{interpolar(t?.mundos?.cromos, { cantidad: m.totalCromos })}</span>
                    {m.id === activo && <small>{t?.mundos?.aria?.paginaActual}</small>}
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
            <span aria-hidden="true">.</span>   {/* aquí va el icono según rareza.icono */}
            <span className="solo-lectores">{rareza?.nombre}</span>        
        </span>
        <div className="carta-arte"><Silueta /></div>
        <strong>{cromo.nombre}</strong>
        <small>{interpolar(t?.tarjeta?.tipo, { mundo: cromo.mundoNombre, tipo })}</small>
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
      <path d="M50 88l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z" fill="#FFD23F" />
    </svg>
  );
}