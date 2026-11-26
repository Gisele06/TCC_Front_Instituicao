import "./Icone.css";

function Icone({ icone, rotulo = "ícone", tamanho = "1.2vw", className = "" }) {
  return (
    <span className={"icone-espaco " + className} style={{ width: tamanho, height: tamanho }}>
      {icone ? icone : <span className="icone-espaco-dica">{rotulo}</span>}
    </span>
  );
}

export default Icone;

const base = { viewBox: "0 0 24 24", fill: "none", "aria-hidden": true };

export function IconeSetaVariacao({ sentido = "cima", ...props }) {
  return (
    <svg {...base} {...props}>
      <g
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={sentido === "baixo" ? "rotate(180 12 12)" : undefined}
      >
        <path d="M12 20.5V4.5" />
        <path d="M5.8 10.6L12 4.4l6.2 6.2" />
      </g>
    </svg>
  );
}

export function IconeMarcar(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
