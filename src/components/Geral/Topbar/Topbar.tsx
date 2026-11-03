import type { ReactNode } from "react";
import AreaIcone from "../IconSlot/IconSlot";
import CampoDeBusca from "../SearchInput/SearchInput";
import "./Topbar.css";

interface PropriedadesBarraSuperior {
  tituloMarca: string;
  iconeMarca?: ReactNode;
  subtituloMarca?: string;
  dicaDeBusca?: string;
  iconeBusca?: ReactNode;
  rotuloDaData: string;
  quantidadeDeAvisos?: number;
  nomeUsuario: string;
  cargoUsuario: string;
  foto?: ReactNode;
  iconeSino?: ReactNode;
  iconeCalendario?: ReactNode;
  iconeSeta?: ReactNode;
}

function BarraSuperior({
  tituloMarca,
  iconeMarca,
  subtituloMarca,
  dicaDeBusca = "Pesquisar funcionalidades",
  iconeBusca,
  rotuloDaData,
  quantidadeDeAvisos = 0,
  nomeUsuario,
  cargoUsuario,
  foto,
  iconeSino,
  iconeCalendario,
  iconeSeta,
}: PropriedadesBarraSuperior) {
  return (
    <header className="bloom-barra-superior">
      <div className="bloom-barra-superior-marca">
        <div className="bloom-barra-superior-marca-titulo">
          {iconeMarca ? (
            <span className="bloom-barra-superior-marca-simbolo">{iconeMarca}</span>
          ) : (
            <span className="bloom-barra-superior-marca-letra">{tituloMarca[0]}</span>
          )}
          <span>{tituloMarca.slice(1)}</span>
        </div>
        {subtituloMarca && <span className="bloom-barra-superior-marca-subtitulo">{subtituloMarca}</span>}
      </div>

      <CampoDeBusca className="bloom-barra-superior-busca" textoDeAjuda={dicaDeBusca} icone={iconeBusca} />

      <div className="bloom-barra-superior-acoes">
        <div className="bloom-barra-superior-sino" aria-hidden="true">
          <AreaIcone icone={iconeSino} rotulo="sino" tamanho="clamp(14px, 1.6vw, 20px)" />
          {quantidadeDeAvisos > 0 && <span className="bloom-barra-superior-sino-contagem">{quantidadeDeAvisos}</span>}
        </div>

        <div className="bloom-barra-superior-data">
          <AreaIcone icone={iconeCalendario} rotulo="calendario" tamanho="1.2vw" />
          <span>{rotuloDaData}</span>
          <AreaIcone icone={iconeSeta} rotulo="v" tamanho="0.9vw" />
        </div>

        <div className="bloom-barra-superior-usuario">
          <AreaIcone icone={foto} rotulo="foto de perfil" tamanho="clamp(26px, 3.3vw, 40px)" className="bloom-barra-superior-retrato" />
          <div className="bloom-barra-superior-usuario-informacao">
            <span className="bloom-barra-superior-usuario-nome">{nomeUsuario}</span>
            <span className="bloom-barra-superior-usuario-cargo">{cargoUsuario}</span>
          </div>
          <AreaIcone icone={iconeSeta} rotulo="v" tamanho="0.9vw" />
        </div>
      </div>
    </header>
  );
}

export default BarraSuperior;
