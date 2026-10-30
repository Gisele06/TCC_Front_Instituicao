import { useState } from "react";
import "./Denuncia.css";
import EstruturaInstitucional from "../../components/InstitutionFrame/InstitutionFrame";
import CabecalhoDePagina from "../../components/PageHeader/PageHeader";
import AbasSegmentadas from "../../components/SegmentedTabs/SegmentedTabs";
import AnonymousChat from "../../components/AnonymousChat/AnonymousChat";
import RedesApoio from "./RedesApoio";

import InformationCard from "../../components/Acolhimento/InformationCard/InformationCard";

import complaint from "../../assets/icons/Acolhimento/complaint.png";
import world from "../../assets/icons/Acolhimento/world-markets.png";
import bubble from "../../assets/icons/Acolhimento/chat-bubble.png";
import repeat from "../../assets/icons/Acolhimento/repeat.png";
import check from "../../assets/icons/Acolhimento/check-mark.png";
import clock from "../../assets/icons/Acolhimento/clock.png";
import visit from "../../assets/icons/Acolhimento/visit.png";
import people from "../../assets/icons/Acolhimento/people.png";
import chat from "../../assets/icons/Acolhimento/chat.png";
import clipboard from "../../assets/icons/Clipboard.png";
import busca from "../../assets/icons/busca.png";
import chevron from "../../assets/icons/chevron-right.png";

interface Props {
  aoNavegar: (pagina: string) => void;
}

type Visao = "denuncias" | "redesApoio";

const denuncias = [
  {
    id: 6767,
    categoria: "Violência/Agressão",
    resumo: "Gostaria de relatar uma situação que vem acontecendo...",
    relato:
      "Gostaria de relatar uma situação que vem acontecendo, no pátio do intervalo (não quero desenvolver uma situação de bullying finge que tem um relato escrito aqui)...",
    mensagens: 2,
    data: "Hoje, 10:32",
    status: "Em andamento",
    local: "Pátio",
  },
  {
    id: 6214,
    categoria: "Convivência/Bullying",
    resumo: "Estou contando isso porque já é a 5 vez que acontece com...",
    relato: "Estou contando isso porque já é a 5 vez que acontece comigo...",
    mensagens: 5,
    data: "2 dias atrás, 21:48",
    status: "Em andamento",
    local: "Escola",
  },
];
const abas = [
  {
    valor: "denuncias",
    rotulo: "Denúncias",
    icone: <img src={complaint} alt="" />,
  },
  {
    valor: "redesApoio",
    rotulo: "Redes de apoio",
    icone: <img src={world} alt="" />,
  },
];

function Acolhimento({ aoNavegar }: Props) {
  const [visao, setVisao] = useState<Visao>("denuncias");
  const [buscaTexto, setBuscaTexto] = useState("");
  const [selecionada, setSelecionada] = useState(6767);
  const [chatAberto, setChatAberto] = useState(false);
  const [expandido, setExpandido] = useState(false);
  const denuncia =
    denuncias.find((item) => item.id === selecionada) ?? denuncias[0];

  return (
    <EstruturaInstitucional
      paginaAtiva="acolhimento"
      aoNavegar={aoNavegar}
      quantidadeDeAvisos={3}
    >
      <main className="bem-estar-pagina acolhimento-pagina">
        <CabecalhoDePagina
          className="acolhimento-cabecalho"
          titulo="Acolhimento"
          subtitulo="Acompanhe o bem-estar dos estudantes"
        />

        <AbasSegmentadas
          className="bem-estar-abas"
          itens={abas}
          valor={visao}
          aoMudar={(valor) => setVisao(valor as Visao)}
        />

        {visao === "denuncias" ? (
          <>
            <div className="acolhimento-estatisticas">
              <div className="information-cards">
                <InformationCard
                  icon={clipboard}
                  value={15}
                  label="Recebidas"
                />

                <InformationCard icon={repeat} value={8} label="Em andamento" />

                <InformationCard icon={check} value={13} label="Resolvidas" />
              </div>
            </div>
            <div className="acolhimento-colunas">
              <section className="acolhimento-lista">
                <h2>
                  <img src={complaint} alt="" /> Denúncias
                </h2>
                <label className="acolhimento-busca">
                  <img src={busca} alt="" />
                  <input
                    placeholder="Buscar denúncia"
                    value={buscaTexto}
                    onChange={(e) => setBuscaTexto(e.target.value)}
                  />
                </label>
                <div className="acolhimento-itens">
                  {denuncias
                    .filter((item) =>
                      `${item.id} ${item.categoria} ${item.resumo}`
                        .toLowerCase()
                        .includes(buscaTexto.toLowerCase()),
                    )
                    .map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`acolhimento-item ${selecionada === item.id ? "selecionado" : ""}`}
                        onClick={() => {
                          setSelecionada(item.id);
                          setExpandido(false);
                        }}
                      >
                        <div className="acolhimento-item-texto">
                          <h3>
                            #{item.id} <span>{item.categoria}</span>
                          </h3>
                          <p>“{item.resumo}”</p>
                          <small>
                            <img src={bubble} alt="" /> {item.mensagens}{" "}
                            Mensagens
                          </small>
                        </div>
                        <div className="acolhimento-item-lado">
                          <small>{item.data}</small>
                          <span>{item.status}</span>
                        </div>
                        <img
                          className="acolhimento-chevron"
                          src={chevron}
                          alt=""
                        />
                      </button>
                    ))}
                </div>
              </section>

              <aside className="acolhimento-detalhe">
                <h2>Denúncia #{denuncia.id}</h2>
                <div className="acolhimento-detalhe-topo">
                  <div>
                    <strong>{denuncia.categoria}</strong>
                    <small>Recebida em 06/07/2026, às 10:32</small>
                  </div>
                  <span>{denuncia.status}</span>
                </div>
                <h3>Relato</h3>
                <p
                  className={`acolhimento-relato ${expandido ? "expandido" : ""}`}
                >
                  “{denuncia.relato}”
                </p>
                <button
                  className="acolhimento-vermais"
                  type="button"
                  onClick={() => setExpandido(!expandido)}
                >
                  {expandido ? "⌃ Ver menos" : "⌄ Ver mais"}
                </button>
                <h3>Informações</h3>
                <div className="acolhimento-info">
                  <span>
                    <img src={clock} alt="" /> Quando:
                  </span>
                  <small>Hoje, às 10:32</small>
                </div>
                <div className="acolhimento-info">
                  <span>
                    <img src={visit} alt="" /> Onde:
                  </span>
                  <small>{denuncia.local}</small>
                </div>
                <div className="acolhimento-info">
                  <span>
                    <img src={people} alt="" /> Envolvidos:
                  </span>
                  <small>Outros estudantes</small>
                </div>
                <button
                  type="button"
                  className="acolhimento-abrir-chat"
                  onClick={() => setChatAberto(true)}
                >
                  <img src={chat} alt="" /> Abrir chat
                </button>
              </aside>
            </div>
          </>
        ) : (
          <RedesApoio />
        )}
      </main>

      <AnonymousChat
        aberto={chatAberto}
        aoFechar={() => setChatAberto(false)}
        denunciaId={selecionada}
      />
    </EstruturaInstitucional>
  );
}

export default Acolhimento;
