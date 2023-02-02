export default function Chart({ name, description, chart, styles = {} }) {
  return (
    <div className="p-4" style={styles}>
      <div className="mb-4 text-center">
        <span className="h3">{name}</span>
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
