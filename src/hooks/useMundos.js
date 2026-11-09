import { useEffect, useState } from "react";

const URL_MUNDOS = "https://yanethm-cromoverso-api.fly.dev/api/v1/mundos";

export function useMundos() {
  const [estado, setEstado] = useState({
    mundos: [],
    cargando: true,
    error: false,
  });
  const [intento, setIntento] = useState(0);

  useEffect(() => {
    const ctrl = new AbortController();
    setEstado({ mundos: [], cargando: true, error: false });

    fetch(URL_MUNDOS, { signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(({ datos }) =>
        setEstado({ mundos: datos, cargando: false, error: false }),
      )
      .catch((falla) => {
        if (falla.name !== "AbortError")
          setEstado({ mundos: [], cargando: false, error: true });
      });

    return () => ctrl.abort();
  }, [intento]);

  return { ...estado, recargar: () => setIntento((n) => n + 1) };
}
