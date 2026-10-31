// Task 8 · AgentMessage
// Props: author (string), text (string produced by an AI agent).
// Returns <p><strong>{author}:</strong> <span>{text}</span></p>.
// The agent's text is always shown as text, never as HTML.

export default function AgentMessage({ author, text }) {
  return (
    <p>
      <strong>{author}:</strong> {" "}
      <span>{text}</span>
    </p>
  );
}