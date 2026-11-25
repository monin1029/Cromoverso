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

export function Silueta() {
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
