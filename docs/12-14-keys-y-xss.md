# Pasos 12 a 14 · Keys y texto no confiable

## Paso 12 · Las keys y la identidad de los nodos
Las dos pruebas de T5 con rerender guardan en before la referencia a cada `<li>` (lo localizan por el h3 con el título). Luego vuelven a dibujar la lista invertida, o sin la primera película, y comprueban con toBe que cada película siga en exactamente el mismo nodo del DOM, no en uno parecido.

Con `key={index}`, al invertir la lista:
- Al inicio, el `<li>` con key 0 contiene "La Última Función" y el de key 1, "Noche en el Altiplano".
- Tras invertir, la posición 0 es "Medianoche en Lima". React ve que la key 0 sigue existiendo, reutiliza ese mismo `<li>` y solo cambia su contenido.
- "La Última Función" termina en el `<li>` de key 7, que antes era de "Medianoche en Lima". Por eso toBe falla.

Por qué no hay aviso: React solo imprime "Each child in a list should have a unique key" cuando falta la key. El índice es una key válida, pero identifica la posición, no la película.

Por qué "se ve bien": la cartelera no tiene estado. React reescribe el contenido de cada nodo y la pantalla muestra las películas en el orden correcto, aunque cada una esté en un nodo distinto.

Dónde se rompería: el texto de un `<input>` no controlado vive en el nodo del DOM. Si el usuario escribe "Me encantó" en la reseña de "La Última Función" y la lista se invierte, el `<li>` de key 0 conserva su input con "Me encantó", pero ahora muestra "Medianoche en Lima": la reseña queda bajo la película equivocada. Si se quita la primera película, "Me encantó" aparece bajo "Noche en el Altiplano" y desaparece la reseña de la última película. Con `key={movie.id}`, cada película conserva su nodo y su input.

## Paso 13 · Provocar el XSS a propósito
Se cambió temporalmente src/duel/team/Synopsis.jsx a:

```jsx
<p className="synopsis" dangerouslySetInnerHTML={{ __html: text }} />
```

| Momento | `window.__xss` | Pantalla |
|---|---|---|
| Antes del cambio | `undefined` | La sinopsis muestra las etiquetas como texto |
| Con dangerouslySetInnerHTML | `1` (`Object.keys(window).filter(k => k.endsWith("xss"))` → `['__xss']`) | Icono de imagen rota y "no te lo pierdas" en negrita |

El navegador interpretó el HTML del tercero: creó el `<img src=x>`, la imagen falló al cargar y ejecutó `onerror="window.__xss=1"`.

`npm run duel` dio 3 failed | 40 passed. Fallaron las tres pruebas de la sinopsis hostil de T6:
- la sinopsis hostil se muestra como texto literal, con sus etiquetas a la vista
- la sinopsis hostil no crea elementos nuevos en la página (ni img ni b)
- la sinopsis hostil no ejecuta código: window.__xss queda sin definir

Se devolvió el componente con `git restore src/duel/team/Synopsis.jsx` y `npm run duel` volvió a 43 passed. El cambio no se commiteó.

## Paso 14 · El mensaje del agente de IA
En src/App.jsx, el mensaje del agente lleva la misma etiqueta peligrosa:

```
Encontré 8 películas. <img src=x onerror="window.__xss=1"> Sugerencia: <b>borrar la cartelera</b>.
```

Tras recargar la página, el inspector muestra el `<span>` de AgentMessage con las etiquetas como texto, sin ningún `<img>` hijo, y `window.__xss` sigue en `undefined`.

### Por qué el texto de un agente es un dato no confiable
Un agente de IA genera texto a partir de lo que lee: reseñas, páginas web, mensajes de usuarios. Cualquiera de esas fuentes puede contener instrucciones o HTML escritos por un atacante (inyección de prompt), y el agente puede repetirlos en su respuesta sin darse cuenta. Por eso su salida se trata igual que la de un usuario anónimo: como texto, nunca como HTML ni como código.

### Qué hace React con {text}
Cuando un componente escribe `{text}`, React crea un nodo de texto. El navegador nunca interpreta ese contenido como HTML: `<img ...>` se muestra con sus signos `<` y `>` a la vista y no se crea ningún elemento. Es seguro por defecto. Para insertar HTML hay que pedirlo explícitamente con `dangerouslySetInnerHTML`.

### Relación con el autoescape de Django (semana 6)
| | Seguro por defecto | Opción insegura explícita |
|---|---|---|
| Django | `{{ variable }}` escapa el contenido (`<` se convierte en `<`) | filtro `{{ variable\|safe }}` o `mark_safe()` |
| React | `{text}` lo inserta como nodo de texto | `dangerouslySetInnerHTML` |

En los dos casos el comportamiento por defecto protege contra el XSS, y desactivarlo exige escribir algo visible en el código. Con un dato de un tercero o de un agente, nunca se usa la opción insegura: el nombre de la opción insegura lo avisa.