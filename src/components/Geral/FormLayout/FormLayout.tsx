import type { ReactNode } from "react";
import "./FormLayout.css";

interface CabecalhoProps {
  titulo: string;
  descricao: string;
  aoVoltar: () => void;
}

export function CabecalhoFormulario({ titulo, descricao, aoVoltar }: CabecalhoProps) {
  return (
    <header className="bloom-form-cabecalho">
      <button type="button" aria-label="Voltar" onClick={aoVoltar}>←</button>
      <div><h1>{titulo}</h1><p>{descricao}</p></div>
    </header>
  );
}

interface AcoesProps {
  aoCancelar: () => void;
  salvando?: boolean;
}

export function AcoesFormulario({ aoCancelar, salvando = false }: AcoesProps) {
  return (
    <footer className="bloom-form-acoes">
      <button type="button" onClick={aoCancelar}>Cancelar</button>
      <button type="submit" disabled={salvando}>{salvando ? "Salvando..." : "Salvar"}</button>
    </footer>
  );
}

interface PainelProps {
  titulo: string;
  children: ReactNode;
  className?: string;
}

export function PainelFormulario({ titulo, children, className = "" }: PainelProps) {
  return (
    <section className={`bloom-form-painel ${className}`.trim()}>
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}
