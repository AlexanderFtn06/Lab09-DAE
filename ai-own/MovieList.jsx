// Task 5 · MovieList
// Props: movies (array of movie objects).
// Returns a <ul> with one <li> per movie, each holding a <MovieCard> (import it from "./MovieCard.jsx").
// Every <li> needs a key that identifies the movie.

import MovieCard from "./MovieCard.jsx";

export default function MovieList({ movies }) {
  return (
    <ul>
      {movies.map((movie) => (
        <li key={movie.id}>
          <MovieCard movie={movie} />
        </li>
      ))}
    </ul>
  );
}