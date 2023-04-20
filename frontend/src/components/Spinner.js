export default function Spinner() {
  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "75vh" }}>
      <div
        className="spinner-border p-5"
        role="status"
      >
          <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}
