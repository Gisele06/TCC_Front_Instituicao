import type { ReactNode } from "react";
import AreaIcone from "../IconSlot/IconSlot";
import "./Sidebar.css";

interface ItemMenu {
  id: string;
  rotulo: string;
  icone?: ReactNode;
}

interface PropriedadesMenuLateral {
  itens: ItemMenu[];
  idAtivo: string;
  aoSelecionar: (id: string) => void;
  iconeMenu?: ReactNode;
  aoClicarMenu?: () => void;
}

function MenuLateral({ itens, idAtivo, aoSelecionar, iconeMenu, aoClicarMenu }: PropriedadesMenuLateral) {
  return (
    <nav className="bloom-menu-lateral">
      {aoClicarMenu ? (
        <button type="button" className="bloom-menu-lateral-menu" onClick={aoClicarMenu}>
          <AreaIcone icone={iconeMenu} rotulo="menu" tamanho="2.2vw" />
        </button>
      ) : (
        <div className="bloom-menu-lateral-menu" aria-hidden="true">
          <AreaIcone icone={iconeMenu} rotulo="menu" tamanho="2.2vw" />
        </div>
      )}

      {itens.map((item) => (
        <button
          key={item.id}
          type="button"
          title={item.rotulo}
          className={`bloom-menu-lateral-item${item.id === "inicio" ? " estado-inicio" : ""}${item.id === idAtivo ? " estado-ativo" : ""}`}
          onClick={() => aoSelecionar(item.id)}
        >
          <AreaIcone icone={item.icone} rotulo={item.rotulo} tamanho="2.4vw" />
        </button>
      ))}
    </nav>
  );
}

export default MenuLateral;
