// TODO(team) · Task 6
// Props: text (string, written by a third party).
// Returns a <p> that shows the text exactly as it is, never as HTML.

export default function Synopsis({ text }) {
  return (
    <p className="synopsis">{text}</p>
  );
}