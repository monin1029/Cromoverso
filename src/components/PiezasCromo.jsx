import iconoComun from "../assests/mundos/circulo.svg";
import iconoRara from "../assests/mundos/rombo.svg";
import iconoEpica from "../assests/mundos/estrella.svg";
import iconoLegendaria from "../assests/mundos/corona.svg";

export const pad = (n) => String(n).padStart(3, "0");

const ICONO_RAREZA = {
  comun: iconoComun,
  rara: iconoRara,
  epica: iconoEpica,
  legendaria: iconoLegendaria,
};

export function IconoRareza({ id }) {
  return (
    <span
      className={`icono-rareza icono-rareza--${id}`}
      style={{ "--icono": `url("${ICONO_RAREZA[id]}")` }}
      aria-hidden="true"
    />
  );
}

export function Silueta({ figura = "estrella" }) {
  const formas = {
    rayo: <path d="m55 77-18 25h13l-5 18 21-29H53z" fill="#FFD23F" />,
    estrella: (
      <path
        d="m50 77 5.5 11.2 12.4 1.8-9 8.8 2.1 12.4-11-5.8-11 5.8 2.1-12.4-9-8.8 12.4-1.8z"
        fill="#FFD23F"
      />
    ),
    corona: (
      <path
        d="m31 111 4-21 11 9 4-17 8 17 11-9 4 21z"
        fill="#FFD23F"
      />
    ),
    rombo: <path d="m50 79 17 17-17 17-17-17z" fill="#FFD23F" />,
    circulo: <circle cx="50" cy="96" r="13" fill="#FFD23F" />,
    ojo: (
      <>
        <path d="M32 96s7-11 18-11 18 11 18 11-7 11-18 11-18-11-18-11Z" fill="#FFD23F" />
        <circle cx="50" cy="96" r="5" fill="#1A1033" />
      </>
    ),
    llama: (
      <path
        d="M50 114c-12 0-17-8-13-17 2-5 7-8 7-15 7 4 8 9 8 13 4-4 5-9 5-14 10 8 13 19 7 27-3 4-8 6-14 6Z"
        fill="#FFD23F"
      />
    ),
    mundo: (
      <>
        <circle cx="50" cy="96" r="14" fill="none" stroke="#FFD23F" strokeWidth="4" />
        <path d="M36 96h28M50 82c7 7 7 21 0 28M50 82c-7 7-7 21 0 28" fill="none" stroke="#FFD23F" strokeWidth="2.5" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 100 120" data-figura={figura} aria-hidden="true">
      <circle cx="50" cy="58" r="38" fill="#fff" opacity=".18" />
      <circle cx="50" cy="52" r="15" fill="#1A1033" />
      <rect x="36" y="49" width="28" height="7" rx="3.5" fill="#FFD23F" />
      <path d="M20 112c0-22 13-38 30-38s30 16 30 38z" fill="#1A1033" />
      {formas[figura] ?? formas.estrella}
    </svg>
  );
}
