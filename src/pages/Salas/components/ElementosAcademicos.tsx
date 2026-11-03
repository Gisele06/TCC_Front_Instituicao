import iconePessoas from "../../../assets/icons/Geral/pessoas.png";
import iconeVoltar from "../../../assets/icons/Geral/seta-voltar.png";

export function Resumo({ valor, rotulo, icone }: { valor: string; rotulo: string; icone: string }) {
  return (
    <div className="academico-resumo">
      {icone === "grafico" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="2" width="20" height="16" rx="2" />
          <path d="m5 14 4-4 3 2 5-6" />
          <path d="M4 22h16" className="academico-grafico-base" />
        </svg>
      ) : icone === "pausado" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="6" height="18" rx="1" />
          <rect x="15" y="3" width="6" height="18" rx="1" />
        </svg>
      ) : (
        <img src={iconePessoas} alt="" />
      )}
      <strong>{valor}</strong>
      <span>{rotulo}</span>
    </div>
  );
}

export function CabecalhoEditor({ titulo, descricao, aoVoltar }: { titulo: string; descricao: string; aoVoltar: () => void }) {
  return (
    <header className="academico-editor-titulo">
      <button type="button" onClick={aoVoltar} aria-label="Voltar para gerenciamento">
        <img src={iconeVoltar} alt="" />
      </button>
      <div>
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
    </header>
  );
}

export function AcoesFormulario({ aoCancelar, textoSalvar = "Salvar" }: { aoCancelar: () => void; textoSalvar?: string }) {
  return (
    <footer className="academico-acoes">
      <button type="button" className="academico-botao-secundario" onClick={aoCancelar}>Cancelar</button>
      <button type="submit" className="academico-botao-principal">{textoSalvar}</button>
    </footer>
  );
}

export function SetaDireita() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>;
}

export function IconePorta() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 2h14v20H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
      <path className="detalhe" d="M16 2v20m-3-11h.1" />
    </svg>
  );
}

export function Lixeira() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" /></svg>;
}
