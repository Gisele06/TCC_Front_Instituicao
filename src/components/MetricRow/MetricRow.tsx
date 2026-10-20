import type { ReactNode } from "react";
import { IconeSetaVariacao } from "../Icons/Icons";
import "./MetricRow.css";

interface PropriedadesLinhaDeIndicador {
  icone: ReactNode;
  titulo: string;
  descricao: string;
  valor: string;
  variacao: string;
  /** Para onde a seta aponta. */
  sentido: "cima" | "baixo";
  /** "bom" pinta de verde e "ruim" pinta de vermelho, independente do sentido da seta. */
  tom: "bom" | "ruim";
}

function LinhaDeIndicador({ icone, titulo, descricao, valor, variacao, sentido, tom }: PropriedadesLinhaDeIndicador) {
  return (
    <div className="bloom-linha-indicador">
      <span className="bloom-linha-indicador-icone">{icone}</span>

      <div className="bloom-linha-indicador-texto">
        <strong>{titulo}</strong>
        <span>{descricao}</span>
      </div>

      <div className="bloom-linha-indicador-valor">
        <strong>{valor}</strong>
        <span className={`bloom-linha-indicador-variacao tom-${tom}`}>
          <IconeSetaVariacao sentido={sentido} />
          {variacao}
        </span>
      </div>
    </div>
  );
}

export default LinhaDeIndicador;
