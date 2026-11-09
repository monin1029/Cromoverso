export function interpolar(plantilla = "", valores = {}) {
  return plantilla.replace(/\{(\w+)\}/g, (_, clave) => valores[clave] ?? "");
}
