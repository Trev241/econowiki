export default function Spinner() {
  return (
    <div
      className="spinner-border"
      role="status"
      style={{
        position: "absolute",
        bottom: "50%",
        left: "50%",
      }}
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
}
