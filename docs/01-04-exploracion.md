# Pasos 1 a 4 · Exploración

## Paso 1 · Puesta en marcha
- Node: vXX
- Comandos: npm install, npm run dev, http://localhost:5173
- Resultado: la página sale en blanco y la consola del navegador muestra:

```
Uncaught Error: TODO(team): write Header in src/duel/team/Header.jsx
    at Header (Header.jsx:6:9)
```

Es lo esperado: los ocho componentes de src/duel/team/ aún lanzan un error TODO(team).

## Paso 2 · Datos de src/data/movies.js
- Películas: 8 (ids 1 a 8).
- Sin funciones hoy: "Ruta 91" (id 5), showtimes: [].
- Sinopsis con HTML de un tercero: "La Última Función" (id 1).

Sinopsis copiada tal cual:

```
Gran estreno <img src=x onerror="window.__xss=1"> <b>no te lo pierdas</b>
```

Parte que ejecutaría código: `onerror="window.__xss=1"`.

- src=x apunta a un archivo que no existe, así que la imagen siempre falla al cargar y el navegador ejecuta el manejador onerror.
- Si el texto se insertara como HTML, ese código correría en la página (XSS). En este caso solo crea la propiedad window.__xss, pero podría ser cualquier JavaScript.
- `<b>no te lo pierdas</b>` no ejecuta código, pero también se volvería HTML real: el tercero podría alterar la página aunque no ataque.

## Paso 3 · Lectura de las pruebas T1 y T2

### T1-header.test.jsx

| Prueba | Consulta | Qué comprueba |
|---|---|---|
| no produce avisos de React en la consola | Ninguna: lee el espía `warnings()` | Que al dibujar Header React no imprima ningún aviso en console.error |
| es el encabezado de la página (rol banner) | `getByRole("banner")` | Que exista un `<header>` de página (rol implícito banner) |
| el nombre del cine es un encabezado de nivel 1 | `getByRole("heading", { level: 1, name: "Cine Tecsup" })` | Que el nombre del cine esté en un `<h1>` |
| la navegación se llama «Principal» y lista un enlace por opción | `getByRole("navigation", { name: "Principal" })`, `within(nav).getByRole("list")`, `getAllByRole("listitem")`, `getByRole("link", { name })` | Que el `<nav>` tenga el nombre accesible "Principal" (aria-label), contenga una lista con un `<li>` por enlace y que cada enlace tenga su texto y su href |
| con otros datos muestra esos datos y no los del ejemplo | `getByRole("heading", { level: 1, name: "Cine Norte" })`, `within(nav).getAllByRole("link")` | Que el componente use sus props y no datos escritos a mano: muestra "Cine Norte" y los enlaces "Alfa" y "Beta", en ese orden |

### T2-footer.test.jsx

| Prueba | Consulta | Qué comprueba |
|---|---|---|
| no produce avisos de React en la consola (usa className, no class) | Ninguna: lee el espía `warnings()` | Que no haya avisos de React, por ejemplo el de usar `class` en lugar de `className` en JSX |
| es el pie de la página (rol contentinfo) | `getByRole("contentinfo")` | Que exista un `<footer>` de página (rol implícito contentinfo) |
| muestra la dirección | `getByText(contact.address)` | Que la dirección aparezca como texto |
| el teléfono es un enlace tel: | `getByRole("link", { name: contact.phone })` | Que el teléfono sea un enlace con href exactamente `tel:+51987654321` |
| el correo es un enlace mailto: | `getByRole("link", { name: contact.email })` | Que el correo sea un enlace con href exactamente `mailto:hola@cinetecsup.example` |
| con otros datos de contacto muestra esos datos | `getByText("Calle Uno 123")`, `getByRole("link", { name })` | Que el componente use sus props: con otro contacto muestra esa dirección, teléfono y correo |

### Rol y nombre accesible frente a clase CSS
Las consultas por rol usan la semántica del HTML, no el estilo: siguen funcionando aunque se renombren o eliminen clases CSS, que son detalles internos. El nombre accesible sale del texto visible, del aria-label o del alt, así que la prueba busca lo mismo que percibe un usuario o un lector de pantalla. Además obliga a escribir HTML accesible: un `<div class="header">` no pasa la prueba, un `<header>` sí.

### El espía de console.error
`watchConsole()` reemplaza `console.error` con un espía de Vitest (`vi.spyOn`) que silencia la salida y guarda cada llamada. La función que devuelve lista la primera línea de cada mensaje, y la prueba exige que la lista esté vacía: así detecta avisos de React que no rompen la página, como `class` en lugar de `className` o una lista sin `key`. La prueba de avisos va primera porque React imprime cada tipo de aviso una sola vez por archivo; si otra prueba lo provocara antes, el espía no lo vería y la prueba pasaría en falso.

## Paso 4 · Primera ejecución de npm run duel

Comando: `npm run duel` (modo team, componentes de src/duel/team/).

```
Test Files  8 failed (8)
     Tests  43 failed (43)
```

Mensaje de una prueba (T7 Hero):

```
FAIL  src/duel/tests/T7-hero.test.jsx > [team] T7 Hero > con una película correcta se dibuja sin lanzar ningún error
AssertionError: expected [Function] to not throw an error but 'Error: TODO(team): write Hero in src/…' was thrown
```

Todas fallan porque cada componente de src/duel/team/ solo lanza el error TODO(team). En T7 el mensaje es un AssertionError porque la prueba envuelve el render en expect(...).not.toThrow(); en las demás pruebas aparece el error directo. El resultado esperado es todo en rojo (T7 usa not.toThrow).