export const BASE = "https://yanethm-cromoverso-api.fly.dev/api/v1";

export async function api(ruta, { signal } = {}) {
  const res = await fetch(`${BASE}${ruta}`, { signal });
  if (!res.ok) {
    const cuerpo = await res.json().catch(() => null);
    throw (
      cuerpo?.error ?? {
        codigo: "error_interno",
        mensaje: `HTTP ${res.status}`,
      }
    );
  }
  return res.json();
}
