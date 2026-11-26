import "./CabecalhoEditor.css";

function CabecalhoEditor({ titulo, descricao, aoVoltar }) {
  return (
    <header className="academico-editor-titulo">
      <button
        type="button"
        className="academico-editor-voltar"
        onClick={aoVoltar}
        aria-label="Voltar para gerenciamento"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="11 18 5 12 11 6" />
        </svg>
      </button>

      <div className="academico-editor-titulo-texto">
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
    </header>
  );
}

export default CabecalhoEditor;