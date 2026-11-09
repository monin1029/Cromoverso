import { useMundos } from "../hooks/useMundos";
import { interpolar } from "../utils/interpolar";
import Rayo from "../assests/mundos/rayo.svg";
import Coral from "../assests/mundos/mundo.svg";
import Bosque from "../assests/mundos/destellos.svg";
import Forja from "../assests/mundos/llama.svg";
import Orbita from "../assests/mundos/estrella.svg";
import Niebla from "../assests/mundos/ojo.svg";
import "./Mundos.css";

// Una entrada por cada valor de `figura` que devuelva la API
const ICONOS = { rayo: Rayo, ola: Coral, hoja: Bosque, llama: Forja, orbita: Orbita, runa: Niebla };

export default function Mundos({ textos, idioma }) {
    const t = textos?.paginas?.inicio?.mundos;
    const { mundos, cargando, error, recargar } = useMundos();
    const primero = mundos[0];
    const ingles = idioma === "en";

    return (
      <section className="mundos" id="mundos" aria-labelledby="mundos-titulo" aria-busy={cargando}>
        <div className="mundos-cabecera">
          <div>
            <h2 id="mundos-titulo">{t?.titulo}</h2>
            <p>{t?.subtitulo}</p>
          </div>
          {primero && (
            <a className="mundos-ver" href={`#mundos/${primero.id}`}>
              {interpolar(t?.enlaces?.ver, { mundo: primero.nombre })}
            </a>
          )}
        </div>

        {error ? (
          <div role="alert">
            <p>{ingles ? "We couldn't load the worlds." : "No pudimos cargar los mundos."}</p>
            <button onClick={recargar}>{ingles ? "Try again" : "Reintentar"}</button>
          </div>
        ) : (
          <ul className="mundos-lista">
            {cargando
              ? [0, 1, 2, 3, 4, 5].map((i) => <li key={i} className="mundo mundo-esqueleto" />)
              : mundos.map((m, i) => <TarjetaMundo key={m.id} mundo={m} indice={i} t={t} />)}
          </ul>
        )}
      </section>
    );
}

function TarjetaMundo({ mundo, indice, t }) {
  return (
    <li>
      <a className="mundo" href={`#mundos/${mundo.id}`} style={{ "--c": mundo.color }}>
        <span className="mundo-icono">
          <img src={ICONOS[mundo.figura] ?? Rayo} alt="" />
        </span>
        {indice === 0 && (
          <span className="mundo-insignia">
            {interpolar(t?.etiquetas?.mundo, { numero: indice + 1 })}
          </span>
        )}
        <strong>{mundo.nombre}</strong>
        <span className="mundo-cromos">
          {interpolar(t?.etiquetas?.cromos, { cantidad: mundo.totalCromos })}
        </span>
      </a>
    </li>
  );
}