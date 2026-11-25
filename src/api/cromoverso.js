export const BASE = import.meta.env.VITE_API_CROMOVERSO;

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

export async function enviar(ruta, cuerpo) {
  let res;
  try {
    res = await fetch(`${BASE}${ruta}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });
  } catch {
    throw { codigo: "conexion" };
  }
  const datos = await res.json().catch(() => null);
  if (!res.ok) {
    throw {
      ...(datos?.error ?? { codigo: "error_interno" }),
      reintentarEn: Number(res.headers.get("Retry-After")) || null,
    };
  }
  return datos;
}

export const iniciarSesion = (correo, clave) =>
  enviar("/sesion", { correo, clave });
