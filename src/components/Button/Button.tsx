import type { ReactNode } from "react";
import AreaIcone from "../IconSlot/IconSlot";
import "./Button.css";

type EstiloBotao = "principal" | "secundario" | "contorno" | "discreto";

interface PropriedadesBotao {
  estilo?: EstiloBotao;
  icone?: ReactNode;
  children?: ReactNode;
  aoClicar?: () => void;
  type?: "button" | "submit";
}

function Botao({ estilo = "principal", icone, children, aoClicar, type = "button" }: PropriedadesBotao) {
  return (
    <button type={type} className={"bloom-botao bloom-botao-" + estilo} onClick={aoClicar}>
      {icone && <AreaIcone icone={icone} tamanho={16} />}
      {children}
    </button>
  );
}

export default Botao;
