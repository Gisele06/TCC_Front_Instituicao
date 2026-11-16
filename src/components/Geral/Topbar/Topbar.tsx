import { useState, type ReactNode } from "react";
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
  const [aberto, definirAberto] = useState(false);
  const [avisos, definirAvisos] = useState([
    { id: 1, titulo: "Nova denúncia registrada", descricao: "Consulte as denúncias recebidas no Acolhimento." },
    { id: 2, titulo: "Evento próximo", descricao: "Verifique os eventos agendados." },
    { id: 3, titulo: "Comunicados", descricao: "Acompanhe os comunicados publicados." },
  ]);
  const quantidadeVisivel = quantidadeDeAvisos || avisos.length;
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
        <div className="bloom-barra-superior-notificacoes">
          <button className="bloom-barra-superior-sino" type="button" aria-label="Abrir notificações" aria-expanded={aberto} onClick={() => definirAberto(valor => !valor)}>
            <AreaIcone icone={iconeSino} rotulo="Notificações" tamanho="20px" />
            {avisos.length > 0 && <span className="bloom-barra-superior-sino-contagem">{Math.min(quantidadeVisivel, avisos.length)}</span>}
          </button>
          {aberto && <section className="bloom-notificacoes-painel" aria-label="Notificações">
            <div className="bloom-notificacoes-cabecalho"><strong>Notificações</strong><button type="button" onClick={() => definirAberto(false)} aria-label="Fechar notificações">×</button></div>
            {avisos.length === 0 ? <p>Você não tem notificações pendentes.</p> : avisos.map(aviso =>
              <div key={aviso.id} className="bloom-notificacoes-item">
                <div><strong>{aviso.titulo}</strong><p>{aviso.descricao}</p></div>
                <button type="button" aria-label={"Dispensar " + aviso.titulo} onClick={() => definirAvisos(atuais => atuais.filter(item => item.id !== aviso.id))}>×</button>
              </div>)}
            {avisos.length > 0 && <button className="bloom-notificacoes-limpar" type="button" onClick={() => definirAvisos([])}>Marcar todas como lidas</button>}
          </section>}
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
