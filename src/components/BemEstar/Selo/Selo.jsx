import "./Selo.css";

function Selo({ estilo = "neutro", children }) {
  return <span className={"bloom-selo bloom-selo-" + estilo}>{children}</span>;
}

export default Selo;
