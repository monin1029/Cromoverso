# Cromoverso

Álbum digital de cromos con **seis mundos y 120 héroes originales**. Proyecto académico construido con React y Vite que consume la API de Cromoverso.

🔗 **Sitio publicado:** [URL DEL SITIO EN VERCEL]

![Vista previa de Cromoverso](./docs/captura-inicio.png)

## Contenido

- [Funcionalidades](#funcionalidades)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Instalación y uso](#instalación-y-uso)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Consumo de la API](#consumo-de-la-api)
- [Decisiones de diseño](#decisiones-de-diseño)
- [Despliegue](#despliegue)
- [Autoría](#autoría)

## Funcionalidades

- **Inicio público:** barra de navegación, sección principal (hero) y presentación de los seis mundos.
- **Catálogo de un mundo:** página con las 20 cartas del mundo, panel lateral de mundos y filtros por rareza y tipo guardados en la URL.
- **Español e inglés:** todos los textos de la interfaz salen de la API y cambian con el selector ES / EN.
- **Aviso de cookies:** guarda la decisión de la persona en una cookie del navegador.
- **Panel de accesibilidad:** tamaño del texto, alto contraste, reducción de movimiento, subrayado de enlaces y fuente para lectura fácil.
- **Diseño adaptable:** versión de escritorio y versión móvil.

## Tecnologías

- [React 19](https://react.dev/)
- [Vite](https://vite.dev/)
- CSS propio con *design tokens* (variables CSS)
- [Vercel](https://vercel.com/) para el despliegue

## Requisitos

- [Node.js](https://nodejs.org/) 22 o superior (recomendado)
- npm

## Instalación y uso

```bash
# 1. Clonar el repositorio
git clone [URL DEL REPOSITORIO]
cd cromoverso

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor de desarrollo
npm run dev
```

Otros comandos:

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Genera la versión de producción en `dist/` |
| `npm run preview` | Sirve localmente la versión compilada |

## Estructura del proyecto

```
src/
├── assests/            # Iconos y fondos SVG
├── components/         # Navbar, Hero, Mundos, MundoPagina, Footer, Cookies, PanelAccesibilidad
├── hooks/              # useTextos, useMundos, useMundo (consumo de la API)
├── styles/             # tokens.css (variables de diseño) y global.css
├── utils/              # interpolar (marcadores de los textos) y funciones de cookies
├── App.jsx             # Estado global: idioma, cookies, accesibilidad y navegación
└── main.jsx            # Punto de entrada
```

## Consumo de la API

**Dirección base:** `https://yanethm-cromoverso-api.fly.dev/api/v1`

La API devuelve JSON y, por ser un proyecto académico, usa **datos simulados** que viven en memoria y vuelven a su estado inicial cuando el servidor se reinicia.

| Endpoint | Para qué se usa |
|---|---|
| `GET /textos?idioma=es\|en` | Todos los textos de la interfaz |
| `GET /mundos` | Los seis mundos (tarjetas del inicio y panel lateral) |
| `GET /mundos/:id` | Un mundo con sus 20 cromos |
| `GET /rarezas` | Las cuatro rarezas, con su icono y su nombre |
| `GET /cromos` | Cromos filtrados por mundo, rareza o tipo |

Manejo de estados: carga, error con botón de reintentar, mundo no encontrado (`404`) y lista vacía (`200` con `datos: []`).

Documentación de la API: `https://yanethm-cromoverso-api.fly.dev/docs`

## Decisiones de diseño

- **Ningún texto va escrito en los componentes:** todo se pide a la API según el idioma.
- **La rareza nunca se muestra solo con color:** siempre lleva icono y palabra.
- **Las cartas se dibujan con CSS y SVG:** la API no entrega imágenes; cada carta usa el color y la figura que indica `ilustracion`.
- **Los filtros viven en la URL** (`?rareza=…&tipo=…`) para que no se pierdan al recargar.
- **Cookies:** `consentimiento` guarda la decisión de la persona; `idioma` solo se guarda si aceptó las cookies.
- **Accesibilidad:** el panel aplica sus opciones mediante atributos `data-*` en `<html>`, que lee el CSS global.

## Despliegue

El proyecto se publica en Vercel conectando el repositorio de GitHub:

1. **Framework Preset:** Vite
2. **Build Command:** `npm run build`
3. **Output Directory:** `dist`

Cada `git push` a la rama `main` genera un nuevo despliegue.

## Autoría

Proyecto académico desarrollado por **[TU NOMBRE]** para **[CURSO / UNIVERSIDAD]**.

Los héroes, mundos y datos de la API son originales y se usan con fines académicos.