import "./TituloDoPainel.css";

function TituloDoPainel({ icone, texto }) {
  return (
    <span className="inicio-painel-titulo">
      {icone && <img src={icone} alt="" />}
      {texto}
    </span>
  );
}

export default TituloDoPainel;
