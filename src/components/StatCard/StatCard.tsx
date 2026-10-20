import type { ReactNode } from "react";
import AreaIcone from "../IconSlot/IconSlot";
import Selo from "../Badge/Badge";
import "./StatCard.css";

interface PropriedadesCartaoDeIndicador {
  icone?: ReactNode;
  rotulo: string;
  textoDoSelo?: string;
  estiloDoSelo?: "bom" | "aviso" | "alerta" | "informacao" | "neutro";
  valor: string;
  iconeDaVariacao?: ReactNode;
  textoDaVariacao?: string;
  iconeSeta?: ReactNode;
  aoClicar?: () => void;
}

function CartaoDeIndicador({
  icone,
  rotulo,
  textoDoSelo,
  estiloDoSelo = "bom",
  valor,
  iconeDaVariacao,
  textoDaVariacao,
  iconeSeta,
  aoClicar,
}: PropriedadesCartaoDeIndicador) {
  return (
    <div className="bloom-indicador-cartao" onClick={aoClicar}>
      <div className="bloom-indicador-cartao-cabecalho">
        <AreaIcone icone={icone} tamanho={24} />
        <span className="bloom-indicador-cartao-rotulo">{rotulo}</span>
        {textoDoSelo && <Selo estilo={estiloDoSelo}>{textoDoSelo}</Selo>}
      </div>

      <div className="bloom-indicador-cartao-valor">{valor}</div>

      <div className="bloom-indicador-cartao-rodape">
        {textoDaVariacao && (
          <span className="bloom-indicador-cartao-variacao">
            <AreaIcone icone={iconeDaVariacao} rotulo="^" tamanho={13} />
            {textoDaVariacao}
          </span>
        )}
        {aoClicar && <AreaIcone icone={iconeSeta} rotulo=">" tamanho={16} />}
      </div>
    </div>
  );
}

export default CartaoDeIndicador;
