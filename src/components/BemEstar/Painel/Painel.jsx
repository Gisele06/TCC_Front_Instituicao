import "./Painel.css";

function Painel({ titulo, icone, className = "", children }) {
  return (
    <section className={"bloom-painel " + className}>
      {titulo && (
        <h2 className="bloom-painel-titulo">
          {icone && <span className="bloom-painel-titulo-icone">{icone}</span>}
          {titulo}
        </h2>
      )}
      {children}
    </section>
  );
}

export default Painel;
