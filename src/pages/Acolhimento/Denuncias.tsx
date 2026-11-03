import { fonteDisponivel } from "../../services/recursos";
import { useEffect, useState } from "react";
import EstruturaInstitucional from "../../components/Geral/InstitutionFrame/InstitutionFrame";
import CabecalhoDePagina from "../../components/Geral/PageHeader/PageHeader";
import AbasSegmentadas from "../../components/Geral/SegmentedTabs/SegmentedTabs";
import AnonymousChat from "./components/AnonymousChat/AnonymousChat";
import InformationCard from "./components/InformationCard/InformationCard";
import CartaoDenuncia from "./components/CartaoDenuncia";
import DetalheDenuncia from "./components/DetalheDenuncia";
import RedesApoio from "./RedesApoio";
import { carregarDenuncias, type Denuncia } from "./data/denuncias";

import iconeDenuncia from "../../assets/icons/Acolhimento/complaint.png";
import iconeRede from "../../assets/icons/Acolhimento/world-markets.png";
import iconeRepetir from "../../assets/icons/Acolhimento/repeat.png";
import iconeConcluido from "../../assets/icons/Acolhimento/check-mark.png";
import iconeLista from "../../assets/icons/Geral/clipboard.png";
import iconeBusca from "../../assets/icons/Geral/busca.png";
import "./Denuncia.css";

type Visao = "denuncias" | "redesApoio";

interface Props {
  aoNavegar: (pagina: string) => void;
  aoCadastrarRede?: () => void;
  visaoInicial?: Visao;
}

const abas = [
  { valor: "denuncias", rotulo: "Denúncias", icone: <img src={iconeDenuncia} alt="" /> },
  { valor: "redesApoio", rotulo: "Redes de apoio", icone: <img src={iconeRede} alt="" /> },
];

export default function Acolhimento({
  aoNavegar,
  aoCadastrarRede = () => {},
  visaoInicial = "denuncias",
}: Props) {
  const [visao, definirVisao] = useState<Visao>(visaoInicial);
  const [busca, definirBusca] = useState("");
  const [idSelecionado, definirSelecionado] = useState<number | null>(null);
  const [chatAberto, definirChatAberto] = useState(false);
  const [denuncias, definirDenuncias] = useState<Denuncia[]>([]);
  const [erro, definirErro] = useState("");
  const [carregando, definirCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    carregarDenuncias()
      .then((lista) => {
        if (!ativo) return;
        definirDenuncias(lista);
        definirSelecionado(lista[0]?.id ?? null);
      })
      .catch((falha: unknown) => {
        if (ativo) definirErro(falha instanceof Error ? falha.message : "Erro ao carregar denúncias.");
      })
      .finally(() => { if (ativo) definirCarregando(false); });
    return () => { ativo = false; };
  }, []);

  const denuncia = denuncias.find((item) => item.id === idSelecionado) ?? null;
  const denunciasFiltradas = denuncias.filter((item) =>
    `${item.id} ${item.categoria} ${item.resumo}`.toLocaleLowerCase("pt-BR")
      .includes(busca.toLocaleLowerCase("pt-BR")),
  );

  return (
    <EstruturaInstitucional paginaAtiva="acolhimento" aoNavegar={aoNavegar}>
      <main className="acolhimento-pagina">
        <CabecalhoDePagina
          className="acolhimento-cabecalho"
          titulo="Acolhimento"
          subtitulo="Acompanhe o bem-estar dos estudantes"
        />
        <AbasSegmentadas
          className="acolhimento-abas"
          itens={abas}
          valor={visao}
          aoMudar={(valor) => definirVisao(valor as Visao)}
        />

        {visao === "redesApoio" ? (
          <RedesApoio aoCadastrar={aoCadastrarRede} />
        ) : (
          <>
            <div className="acolhimento-estatisticas">
              <div className="information-cards">
                <InformationCard icon={iconeLista} value={fonteDisponivel() && !erro && !carregando ? denuncias.length : "—"} label="Recebidas" />
                <InformationCard icon={iconeRepetir} value={fonteDisponivel() && !erro && !carregando ? denuncias.filter((item) => item.status.toLocaleLowerCase("pt-BR") === "em andamento").length : "—"} label="Em andamento" />
                <InformationCard icon={iconeConcluido} value={fonteDisponivel() && !erro && !carregando ? denuncias.filter((item) => item.status.toLocaleLowerCase("pt-BR") === "resolvida").length : "—"} label="Resolvidas" />
              </div>
            </div>

            <div className="acolhimento-colunas">
              <section className="acolhimento-lista" aria-label="Denúncias">
                <h2><img src={iconeDenuncia} alt="" /> Denúncias</h2>
                <label className="acolhimento-busca">
                  <img src={iconeBusca} alt="" />
                  <input
                    type="search"
                    value={busca}
                    placeholder="Buscar denúncia"
                    onChange={(evento) => definirBusca(evento.target.value)}
                  />
                </label>
                <div className="acolhimento-itens">
                  {!fonteDisponivel() && <p>Configure VITE_API_BASE_URL no modo API para consultar denúncias.</p>}
                  {carregando && <p>Carregando denúncias...</p>}
                  {erro && <p role="alert">{erro}</p>}
                  {denunciasFiltradas.map((item) => (
                    <CartaoDenuncia
                      key={item.id}
                      denuncia={item}
                      selecionada={item.id === idSelecionado}
                      aoSelecionar={() => definirSelecionado(item.id)}
                    />
                  ))}
                  {!carregando && !erro && fonteDisponivel() && denunciasFiltradas.length === 0 && <p>Nenhuma denúncia registrada ou encontrada.</p>}
                </div>
              </section>
              {denuncia ? <DetalheDenuncia key={denuncia.id} denuncia={denuncia} aoAbrirChat={() => definirChatAberto(true)} /> :
                <aside className="acolhimento-detalhe"><h2>Detalhes da denúncia</h2><p>Selecione uma denúncia para ver os detalhes.</p></aside>}
            </div>
          </>
        )}
      </main>
      {idSelecionado != null && (
        <AnonymousChat
          aberto={chatAberto}
          aoFechar={() => definirChatAberto(false)}
          denunciaId={idSelecionado}
        />
      )}
    </EstruturaInstitucional>
  );
}
