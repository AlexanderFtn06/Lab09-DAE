# Pasos 7 a 9 · Duelo con la IA

## Paso 7 · Respuestas de una IA propia (ai-own/)
Asistente autorizado por el docente: OpenCode con el modelo Nemotron 3.5 Lightning. Se le pasaron los enunciados de las ocho tareas y los datos de src/data/movies.js, sin acceso a src/duel/. Sus respuestas están en ai-own/.

Para probarlas se copiaron temporalmente a src/duel/fixed/ y se ejecutó npm run duel:fixed:

```
Test Files  2 failed | 6 passed (8)
     Tests  6 failed | 37 passed (43)
```

Fallan T3 MovieCard (3 pruebas) y T5 MovieList (3 pruebas), pero la causa es una sola, en MovieCard:

```jsx
<h3>{movie.title} ★ {movie.rating}</h3>
```

- La valoración quedó dentro del h3, así que su nombre accesible es "La Última Función ★ 4.5" y no hay un elemento cuyo texto sea exactamente "★ 4.5".
- T5 falla en cascada: MovieList estaba bien escrito (key={movie.id}), pero sus pruebas localizan cada li a través del h3 con el título exacto.
- Tipo: silencioso. React no lanza error ni imprime avisos.
- Origen: el enunciado es ambiguo ("an h3 with the title and the rating as text"). La IA siguió la letra del enunciado y la prueba fijó el significado.

## Paso 8 · npm run duel:ai

```
Test Files  6 failed | 2 passed (8)
     Tests  14 failed | 29 passed (43)
```

Fallan T2 (1), T3 (1), T4 (2), T5 (2), T6 (3) y T7 (5). T1 y T8 pasan completas.

## Paso 9 · Clasificación de los seis fallos

Tipos: ruidoso (React lanza un error), avisa (React imprime un aviso en la consola), silencioso (React no dice nada y solo una prueba lo atrapa).

| Tarea | Qué hizo la IA | Prueba que lo detecta y mensaje | Tipo |
|---|---|---|---|
| T2 Footer | `<footer class="footer">`: usa class en lugar de className | "no produce avisos de React en la consola (usa className, no class)": `expected [ Array(1) ] to deeply equal []` (el aviso es Invalid DOM property `class`. Did you mean `className`?) | avisa |
| T3 MovieCard | `<img src={movie.image} />` sin alt | "la imagen tiene como texto alternativo el título de la película": `Unable to find an element with the alt text: La Última Función` | silencioso |
| T4 Showtimes | `if (!times)` no detecta el arreglo vacío ([] es truthy) y `{times.length && ...}` dibuja un 0 | "con lista vacía muestra el mensaje «Sin funciones hoy»": `Unable to find an element with the text: Sin funciones hoy`; "con lista vacía no imprime un 0 suelto": `expected '0' to be 'Sin funciones hoy'` | silencioso |
| T5 MovieList | `<li key={index}>`: usa el índice como key | "al invertir el orden, cada película conserva su propio nodo del DOM" y "al quitar la primera película, las demás conservan su nodo del DOM": `expected <li>…</li> to be <li>…</li> // Object.is equality` | silencioso |
| T6 Synopsis | `dangerouslySetInnerHTML={{ __html: html }}` para convertir saltos de línea en `<br />` | Las tres de la sinopsis hostil: `expected 'Gran estreno  no te lo pierdas' to be 'Gran estreno <img src=x onerror=…'`; se crean `img` y `b`; `window.__xss`: `expected 1 to be undefined` | silencioso |
| T7 Hero | `function Hero({ film })`: desestructura film, pero recibe la prop movie | Las cinco; la primera: `TypeError: Cannot read properties of undefined (reading 'title')` | ruidoso |

### Por qué T1 y T8 no fallan
- T1 Header: usa header, h1 y nav con aria-label="Principal", no usa class y cada li lleva `key={link.href}`, una key estable y única. Cumple todo lo que piden las pruebas.
- T8 AgentMessage: muestra el texto con `<span>{text}</span>`, así que React lo escapa y las etiquetas del agente se ven como texto. Contraste: la misma IA escapa bien en T8 pero no en T6, donde quiso añadir un extra (convertir saltos de línea en `<br />`) que la obligó a insertar HTML y abrió la puerta al XSS.

### El fallo más peligroso
T6 Synopsis: permite XSS. Cualquier texto de un tercero puede ejecutar JavaScript en la página del usuario. Además es silencioso: en pantalla la sinopsis incluso se ve "mejor" (con negrita), así que nadie lo nota sin una prueba.

### Conclusión
Solo un fallo es ruidoso (T7) y solo uno avisa (T2). Los otros cuatro son silenciosos: React no dice nada y la página parece funcionar. Sin las pruebas, la key por índice, el 0 suelto, la imagen sin alt y el XSS habrían llegado a producción, precisamente porque en la pantalla se veía bien.