export default function FormError({ message }) {
  return (
    <p
      style={{
        fontSize: "0.7rem",
        color: "red",
        padding: "0.3rem",
        wordSpacing: "0.1rem",
      }}
    >
      {message}
    </p>
  );
}
