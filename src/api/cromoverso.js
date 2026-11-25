export const BASE = import.meta.env.VITE_API_CROMOVERSO;

function notificarSesionVencida(error) {
  if (error?.codigo === "no_autenticado") {
    window.dispatchEvent(new Event("cromoverso:sesion-vencida"));
  }
}

export async function api(
  ruta,
  { signal, method = "GET", cuerpo, headers = {}, redirigirAlVencer = true } = {},
) {
  let res;
  try {
    res = await fetch(`${BASE}${ruta}`, {
      method,
      signal,
      credentials: "include",
      headers: cuerpo
        ? { "Content-Type": "application/json", ...headers }
        : headers,
      body: cuerpo ? JSON.stringify(cuerpo) : undefined,
    });
  } catch (falla) {
    if (falla?.name === "AbortError") throw falla;
    throw { codigo: "conexion" };
  }

  const respuesta = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const error = {
      ...(respuesta?.error ?? {
        codigo: "error_interno",
        mensaje: `HTTP ${res.status}`,
      }),
      reintentarEn: Number(res.headers.get("Retry-After")) || null,
    };
    if (redirigirAlVencer) notificarSesionVencida(error);
    throw error;
  }
  return respuesta;
}

export const iniciarSesion = (correo, clave) =>
  api("/sesion", { method: "POST", cuerpo: { correo, clave } });

export const obtenerSesion = (opciones = {}) =>
  api("/sesion", { ...opciones, redirigirAlVencer: false });

export const cerrarSesion = () => api("/sesion", { method: "DELETE" });
