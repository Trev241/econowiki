import { GiWorld } from "react-icons/gi";
import { Link } from "react-router-dom";

export default function Logo({ color, styles = {} }) {
  return (
    <div style={styles}>
      <Link
        to={"/"}
        className={`text-decoration-none text-${color}`}
        style={{
          fontFamily: "monospace",
        }}
      >
        <GiWorld size={"50px"} />&nbsp;
        <span style={{ fontSize: "1.25em" }}>World Income</span>
      </Link>
    </div>
  );
}
