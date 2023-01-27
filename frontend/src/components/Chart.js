export default function Chart({ name, description, chart, styles = {} }) {
  return (
    <div
      style={{
        padding: "1rem",
        ...styles,
      }}
    >
      <div
        style={{
          marginBottom: "1rem",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontWeight: "bold",
            fontSize: "2rem",
          }}
        >
          {name}
        </span>
        <br />
        <span
          style={{
            fontSize: "0.8rem",
          }}
        >
          {description}
        </span>
      </div>
      {chart}
    </div>
  );
}
