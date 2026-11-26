import "./EtiquetaDeData.css";

function EtiquetaDeData({ dia, mes }) {
  return (
    <div className="inicio-data-selo">
      <span className="inicio-data-selo-dia">{dia}</span>
      <span className="inicio-data-selo-mes">{mes}</span>
    </div>
  );
}

export default EtiquetaDeData;
