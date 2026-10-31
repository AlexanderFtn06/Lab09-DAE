# Pasos 5 y 6 · Componentes del equipo

Los ocho componentes de src/duel/team/ se escribieron sin consultar a ninguna IA, como funciones con props y sin estado. Cada uno se comprobó con `npx vitest run --mode team T<n>` y al final con `npm run duel`.

| Tarea | Componente | Intentos | Pruebas | Decisión clave |
|---|---|---|---|---|
| 1 | Header | 1 | 5/5 | `key={link.href}`, una key estable y única |
| 2 | Footer | 1 | 6/6 | Dirección sola en su `<p>`; `href` con `tel:` y `mailto:` |
| 3 | MovieCard | 1 | 6/6 | `alt={movie.title}` y la valoración en su propio `<p>` |
| 4 | Showtimes | 1 | 6/6 | `times.length === 0` con return temprano, sin `&&` |
| 5 | MovieList | 1 | 5/5 | `key={movie.id}`, no el índice |
| 6 | Synopsis | 1 | 5/5 | `{text}`, nunca `dangerouslySetInnerHTML` |
| 7 | Hero | 1 | 5/5 | Prop `movie` y `href={`#horarios-${movie.id}`}` |
| 8 | AgentMessage | 1 | 5/5 | `{" "}` explícito entre `<strong>` y `<span>`, porque JSX elimina el salto de línea |

Al terminar el paso 5 (tareas 1 a 4):

```
Test Files  4 failed | 4 passed (8)
     Tests  20 failed | 23 passed (43)
```

Al terminar el paso 6 (tareas 5 a 8):

```
Test Files  8 passed (8)
     Tests  43 passed (43)
```

Con `npm run dev` la cartelera se dibuja completa, sin errores en la consola. La sinopsis hostil y el mensaje del agente muestran sus etiquetas como texto. Después se agregaron las clases de src/index.css (hero, synopsis, agent-message, showtimes, movie-list, movie-card) con ayuda de OpenCode (ver paso 15); las pruebas siguieron en 43/43.