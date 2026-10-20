import type { ReactNode } from "react";
import "./SegmentedTabs.css";

export interface ItemDaAbaSegmentada {
  valor: string;
  rotulo: string;
  /** Ícone antes do texto (imagem ou SVG). */
  icone?: ReactNode;
  /** Cor da marquinha retangular antes do texto. Usado nos filtros de situação. */
  marcador?: string;
}

interface PropriedadesAbasSegmentadas {
  itens: ItemDaAbaSegmentada[];
  valor: string;
  aoMudar: (valor: string) => void;
  /** "compacto" é a caixa mais baixa, usada nos filtros. */
  tamanho?: "padrao" | "compacto";
  className?: string;
}

function AbasSegmentadas({ itens, valor, aoMudar, tamanho = "padrao", className = "" }: PropriedadesAbasSegmentadas) {
  const classes = ["bloom-abas-segmentadas", tamanho === "compacto" ? "abas-compactas" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="tablist">
      {itens.map((item) => {
        const ativo = item.valor === valor;
        return (
          <button
            key={item.valor}
            type="button"
            role="tab"
            aria-selected={ativo}
            className={ativo ? "bloom-aba-segmentada estado-ativo" : "bloom-aba-segmentada"}
            onClick={() => aoMudar(item.valor)}
          >
            {item.marcador && <i className="bloom-aba-segmentada-marcador" style={{ background: item.marcador }} />}
            {item.icone && <span className="bloom-aba-segmentada-icone">{item.icone}</span>}
            <span>{item.rotulo}</span>
          </button>
        );
      })}
    </div>
  );
}

export default AbasSegmentadas;
