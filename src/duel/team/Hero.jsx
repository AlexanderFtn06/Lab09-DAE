// TODO(team) · Task 7
// Props: movie (a movie object).
// Returns a <section aria-label="Destacada"> with an <h2> holding the title and a
// link "Ver horarios" that points to #horarios-<id>.

export default function Hero({ movie }) {
  return (
    <section className="hero" aria-label="Destacada">
      <h2>{movie.title}</h2>

      <a href={`#horarios-${movie.id}`}>
        Ver horarios
      </a>
    </section>
  );
}