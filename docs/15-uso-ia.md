# Paso 15 · Uso de IA

Asistentes usados, con autorización del docente:
- OpenCode con el modelo Nemotron 3.5 Lightning: modo Plan para leer y analizar, modo Build para crear y editar archivos.
- Claude (asistente de chat): guía de los pasos, redacción de los prompts para OpenCode y revisión de sus respuestas contra el código y las pruebas.

Los componentes de src/duel/team/ (pasos 5 y 6) se escribieron sin IA.

| Paso | Qué se le pidió | Qué respondió | Aceptado o rechazado, y por qué |
|---|---|---|---|
| 2 | OpenCode: leer src/data/movies.js, contar películas, ubicar la que no tiene funciones y la sinopsis hostil | 8 películas, "Ruta 91" sin funciones, "La Última Función" con `onerror="window.__xss=1"` | Aceptado. Se añadió que `src=x` garantiza que la imagen falle y que `<b>` también se volvería HTML |
| 3 | OpenCode: tablas de las pruebas T1 y T2 y explicación del espía de console.error | Tablas con cuatro errores: llamó rol al nombre accesible "Principal", citó una consulta equivocada, dijo "carece de className" al revés y explicó mal por qué la prueba de avisos va primera | Aceptado en parte. Se corrigió contra el código de las pruebas. Se ejecutó en modo Build por error; `git status` confirmó que no modificó archivos |
| 1-4 | OpenCode: crear y completar docs/01-04-exploracion.md | Transcribió el contenido indicado | Aceptado tras revisar el archivo |
| 6 | OpenCode: agregar las clases de index.css a seis componentes de team/ ya terminados | Agregó solo los className indicados | Aceptado: es solo estilo y las pruebas siguieron en 43/43 |
| 7 | OpenCode: escribir los ocho componentes desde cero en ai-own/, solo con los enunciados y los datos | Nueve archivos; 37/43 pruebas. Puso la valoración dentro del h3 de MovieCard, lo que tumba T3 y T5 en cascada | No se adoptó: se guardó en ai-own/ solo para comparar. Evidencia de que el enunciado era ambiguo |
| 9 | OpenCode: clasificar los seis fallos de la IA del repositorio | Clasificó por gravedad y no por cómo reacciona React: marcó T3, T4, T5 y T6 como ruidoso o avisa, dijo que T5 no tenía key y que la prueba de avisos de T6 fallaba | Rechazada la clasificación. Corregida: 4 silenciosos, 1 avisa (T2) y 1 ruidoso (T7) |
| 7-9 | OpenCode: crear docs/07-09-duelo-ia.md | Transcribió el contenido corregido | Aceptado tras revisar el archivo |
| 11 | OpenCode: seis arreglos en src/duel/fixed/, de uno en uno, ejecutando npm run duel:fixed tras cada uno | Código correcto: 14 → 13 → 12 → 10 → 8 → 5 → 0 | Código aceptado: lo verificaron las pruebas. Explicaciones aceptadas en parte: dijo que jsdom oculta el aviso de las keys (falso: no hay aviso porque sí hay key), explicó de forma confusa el 0 de Showtimes y contó mal un paso (13 → 10 en vez de 12 → 10) |
| 10-11 | OpenCode: crear docs/10-11-arreglos.md | Transcribió el contenido corregido | Aceptado tras revisar el archivo |
| 12 | OpenCode: explicar las pruebas de T5 con rerender y el problema de key={index} | Puntos 1, 3 y 4 correctos; en el 2 y el 5 usó películas equivocadas y se contradijo sobre si el texto del input se pierde | Aceptado en parte. Se corrigió: el texto se queda en el nodo y aparece bajo otra película |
| 12-14 | OpenCode: crear docs/12-14-keys-y-xss.md | Transcribió el contenido corregido | Aceptado tras revisar el archivo |
| Todos | Claude: guía del procedimiento, prompts, pistas sin código para los pasos 5 y 6, y revisión de las respuestas de OpenCode | Instrucciones paso a paso y correcciones razonadas | Aceptado. Cada corrección se verificó contra el código de las pruebas o ejecutándolas |

### Conclusión
El código que propuso la IA se pudo verificar de forma objetiva con las pruebas: un arreglo pasa o no pasa. Sus explicaciones no tienen ese verificador, y fue donde más se equivocó: clasificó los fallos por intuición, inventó la causa de un aviso que no existía y confundió los ejemplos. Las pruebas verificaron el código, pero las explicaciones necesitaron revisión humana.