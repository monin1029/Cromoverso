import "./PreferenciasCookies.css";

export default function Cookies({ textos, consentimiento, onDecidir }) {
    const c = textos?.cookies?.banner;
    if (consentimiento || !c) return null; 

    return (
        <section
        className="cookies"
        role="region"
        aria-labelledby="cookies-titulo"
        aria-describedby="cookies-texto"
        >
        <div className="cookies-texto">
            <h2 id="cookies-titulo">{c.titulo}</h2>
            <p id="cookies-texto">{c.texto}</p>
        </div>
        <div className="cookies-acciones">
            <button type="button" className="boton boton-claro" onClick={() => onDecidir("rechazado")}>
            {c.botones?.rechazar}
            </button>
            <button type="button" className="boton boton-primario" onClick={() => onDecidir("aceptado")}>
            {c.botones.aceptar}
            </button>
        </div>
        </section>
    );
}