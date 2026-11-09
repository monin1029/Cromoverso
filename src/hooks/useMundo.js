import { useEffect, useState } from "react";

const BASE = "https://yanethm-cromoverso-api.fly.dev/api/v1";

async function pedir(ruta, signal) {
  const res = await fetch(`${BASE}${ruta}`, { signal });
  const cuerpo = await res.json().catch(() => null);
  if (!res.ok) throw cuerpo?.error ?? { codigo: "error_interno" };
  return cuerpo;
}

export function useMundo(id) {
  const [estado, setEstado] = useState({
    mundo: null,
    rarezas: [],
    cargando: true,
    error: null,
  });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setEstado({ mundo: null, rarezas: [], cargando: true, error: null });

    Promise.all([
      pedir(`/mundos/${id}`, ctrl.signal),
      pedir("/rarezas", ctrl.signal),
    ])
      .then(([mundo, r]) =>
        setEstado({ mundo, rarezas: r.datos, cargando: false, error: null }),
      )
      .catch((falla) => {
        if (falla?.name === "AbortError") return;
        setEstado({
          mundo: null,
          rarezas: [],
          cargando: false,
          error: { codigo: falla?.codigo ?? "conexion" },
        });
      });

    return () => ctrl.abort();
  }, [id, intento]);

  return { ...estado, recargar: () => setIntento((n) => n + 1) };
}
