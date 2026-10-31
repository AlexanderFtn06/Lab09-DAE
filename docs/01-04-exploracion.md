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
(pendiente)

## Paso 4 · Primera ejecución de npm run duel
(pendiente)