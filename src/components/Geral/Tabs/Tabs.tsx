import type { ReactNode } from "react";
import AreaIcone from "../IconSlot/IconSlot";
import "./Tabs.css";

interface ItemDaAba {
  valor: string;
  rotulo: string;
  icone?: ReactNode;
}

interface PropriedadesAbas {
  itens: ItemDaAba[];
  valor: string;
  aoMudar: (valor: string) => void;
}

function Abas({ itens, valor, aoMudar }: PropriedadesAbas) {
  return (
    <div className="bloom-abas">
      {itens.map((item) => (
        <button
          key={item.valor}
          type="button"
          className={item.valor === valor ? "bloom-aba estado-ativo" : "bloom-aba"}
          onClick={() => aoMudar(item.valor)}
        >
          {item.icone && <AreaIcone icone={item.icone} tamanho={16} />}
          <span>{item.rotulo}</span>
        </button>
      ))}
    </div>
  );
}

export default Abas;
