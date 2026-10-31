# Pasos 10 y 11 · Arreglar la copia de la IA

## Paso 10 · Copia inicial
`npm run fixed:init` copió src/duel/ai/ a src/duel/fixed/. Desde aquí solo se editó src/duel/fixed/, nunca src/duel/ai/ ni src/duel/tests/.

```
npm run duel:fixed
Test Files  6 failed | 2 passed (8)
     Tests  14 failed | 29 passed (43)
```

## Paso 11 · Seis arreglos, uno por uno

| Arreglo | Archivo | Cambio | Pruebas en rojo después |
|---|---|---|---|
| — | — | Copia inicial de la IA | 14 |
| 1 | Footer.jsx | `class` → `className` | 13 |
| 2 | MovieCard.jsx | Agrega `alt={movie.title}` | 12 |
| 3 | Showtimes.jsx | `times.length === 0` y `<ul>` sin `&&` | 10 |
| 4 | MovieList.jsx | `key={index}` → `key={movie.id}` | 8 |
| 5 | Synopsis.jsx | Quita `dangerouslySetInnerHTML`, usa `{text}` | 5 |
| 6 | Hero.jsx | `{ film }` → `{ movie }` | 0 |

Resultado final:

```
npm run duel:fixed
Test Files  8 passed (8)
     Tests  43 passed (43)
```

### Arreglo 1 · Footer (avisa)
- Qué hacía: usaba `class="footer"`.
- Por qué React lo trata así: `class` es una palabra reservada de JavaScript. Como JSX se convierte en objetos de JavaScript, React usa el nombre de la propiedad del DOM, `className`, e imprime el aviso Invalid DOM property `class`. Did you mean `className`?
- Qué hace ahora: usa `className="footer"`, el aviso desaparece y T2 pasa.

### Arreglo 2 · MovieCard (silencioso)
- Qué hacía: `<img src={movie.image} />` sin `alt`.
- Por qué React lo trata así: React no valida la accesibilidad; un `img` sin `alt` es HTML válido para React y no imprime nada. Solo la prueba con `getByAltText` lo detecta.
- Qué hace ahora: `alt={movie.title}` da a la imagen un texto alternativo para lectores de pantalla y cuando no carga.

### Arreglo 3 · Showtimes (silencioso)
- Qué hacía: `if (!times)` y `{times.length && <ul>...}`.
- Por qué React lo trata así: un arreglo vacío es un objeto, por eso es truthy y `![]` es `false`: nunca entraba al caso vacío. Luego `&&` devuelve el primer operando falsy: `0 && <ul>` evalúa a `0`, y React dibuja los números (solo omite `false`, `null`, `undefined` y `true`). Resultado: un `0` suelto en pantalla.
- Qué hace ahora: con `times.length === 0` devuelve solo `<p>Sin funciones hoy</p>`; si hay horas, devuelve directamente el `<ul className="showtimes">`.

### Arreglo 4 · MovieList (silencioso)
- Qué hacía: `key={index}`.
- Por qué React lo trata así: la key es la identidad de cada elemento entre renders. React solo avisa cuando falta la key; el índice es una key válida, así que no hubo aviso. Pero el índice identifica la posición, no la película: al invertir la lista, la key 0 sigue existiendo, React reutiliza ese mismo `<li>` y solo cambia su contenido. Cada película termina en un nodo distinto.
- Qué hace ahora: con `key={movie.id}`, React reconoce cada película y mueve su nodo existente al reordenar o al quitar una.

### Arreglo 5 · Synopsis (silencioso)
- Qué hacía: convertía `\n` en `<br />` e insertaba el resultado con `dangerouslySetInnerHTML`.
- Por qué React lo trata así: `dangerouslySetInnerHTML` es una decisión explícita del desarrollador y React no avisa. El navegador interpreta el HTML: crea el `<img src=x>`, la imagen falla al cargar y ejecuta `onerror="window.__xss=1"` (XSS).
- Qué hace ahora: `<p className="synopsis">{text}</p>`. React inserta el texto como nodo de texto, sin interpretarlo como HTML: las etiquetas se ven literales y no se ejecuta nada. Los saltos de línea los respeta la regla CSS `.synopsis { white-space: pre-line }`, así que la conversión a `<br />` sobraba.

### Arreglo 6 · Hero (ruidoso)
- Qué hacía: `function Hero({ film })`, pero App.jsx y las pruebas pasan la prop `movie`.
- Por qué React lo trata así: al desestructurar una clave que no existe en props se obtiene `undefined`. Al leer `film.title`, JavaScript lanza `TypeError: Cannot read properties of undefined (reading 'title')`. Sin un error boundary, React aborta el render: en el navegador la página quedaría en blanco.
- Qué hace ahora: recibe `{ movie }` y usa `movie.title` y `movie.id`.

### Conclusión
El orden de dificultad para detectarlos es el inverso de su gravedad: el único fallo ruidoso (Hero) se ve al instante, mientras que el XSS de Synopsis, el más peligroso, es silencioso. De los seis fallos, React lanzó un error en uno y React avisó en uno.