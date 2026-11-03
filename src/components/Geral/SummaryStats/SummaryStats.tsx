import type { ReactNode } from "react";
import AreaIcone from "../IconSlot/IconSlot";
import "./SummaryStats.css";

interface ItemResumoDeIndicador {
  id: string;
  icone?: ReactNode;
  valor: number;
  rotulo: string;
}

interface PropriedadesResumoDeIndicadores {
  itens: ItemResumoDeIndicador[];
}

function ResumoDeIndicadores({ itens }: PropriedadesResumoDeIndicadores) {
  return (
    <div className="bloom-resumo-indicadores">
      {itens.map((item) => (
        <div key={item.id} className="bloom-resumo-indicador">
          <AreaIcone icone={item.icone} tamanho={18} />
          <span className="bloom-resumo-indicador-valor">{item.valor}</span>
          <span className="bloom-resumo-indicador-rotulo">{item.rotulo}</span>
        </div>
      ))}
    </div>
  );
}

export default ResumoDeIndicadores;
