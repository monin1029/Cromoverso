import cromosHero from "../assests/bg/cromos-hero.svg";
import "./Hero.css";
import Regalo from "../assests/iconos/regalo.svg"
import Album from "../assests/iconos/album.svg";
import Destellos from "../assests/iconos/destellos.svg"

function partirTitulo(titulo = "") {
  const corte = titulo.lastIndexOf(". ") + 1;
  return corte > 0 ? [titulo.slice(0, corte), titulo.slice(corte).trim()] : [titulo, ""];
}

export default function Hero({ textos, cargando, error, recargar, idioma }) {
    const ingles = idioma === "en";
    const inicio = textos?.paginas?.inicio;
    const hero = textos?.paginas?.inicio?.hero;

    if (error) {
        return (
        <section className="hero" id="inicio">
            <p>{ingles ? "We couldn't load the page": "No pudimos cargar la página"}</p>
            <button onClick={recargar}>{ingles ? "Try again": "Reintentar"}</button>
        </section>
        );
    }

    if (cargando || !hero) {
        return <section className="hero" id="inicio" aria-busy="true" />;
    }

    const [linea1, linea2] = partirTitulo(hero.titulo);

    return (
        <section className="hero" id="inicio">
            <div className="hero-texto">
                <h1 className="titular-display">
                    {linea1}{" "}<br />{linea2}
                </h1>

                <p className="hero-nota hero-nota-movil">{hero.subtituloMovil}</p>

                <div className="hero-acciones">
                    <a className="boton boton-acento" href="#registro">
                        <img src={Regalo} alt="" />
                        {hero.botones.crearCuentaGratis}
                    </a>
                    <a className="boton boton-claro" href="#mundos">
                        <img src={Album} alt="" />
                        {hero.botones.explorarMundos}
                    </a>
                </div>

                <p className="hero-nota hero-nota-escritorio">
                    <img src={Destellos} alt="" className="hero-destellos"/>
                    {hero.subtitulo}
                </p>                
            </div>

            <figure className="hero-figura">
                <img src={cromosHero} alt="" />
            </figure>
        </section>
    );
}