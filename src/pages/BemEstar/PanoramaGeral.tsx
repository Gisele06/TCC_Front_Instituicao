import { useEffect, useState } from "react";
import AbasSegmentadas from "../../components/Geral/SegmentedTabs/SegmentedTabs";
import AnelDeProgresso from "../../components/Geral/ProgressRing/ProgressRing";
import BarraSegmentada from "../../components/Geral/SegmentedBar/SegmentedBar";
import GraficoDeArea from "../../components/Geral/AreaChart/AreaChart";
import LinhaDeIndicador from "../../components/Geral/MetricRow/MetricRow";
import Painel from "../../components/Geral/Panel/Panel";
import SeletorDePeriodo from "../../components/Geral/PeriodSelect/PeriodSelect";
import Selo from "../../components/Geral/Badge/Badge";
import { IconeSetaVariacao } from "../../components/Geral/Icons/Icons";
import { carregarPanoramaBemEstar, type PanoramaBemEstar } from "../../services/indicadores";
import { iconesBemEstar } from "./icons/IconesBemEstar";
import "./PanoramaGeral.css";

const filtrosDeSituacao = [
  { valor: "geral", rotulo: "Geral" },
  { valor: "bem", rotulo: "Bem", marcador: "var(--cor-bem)" },
  { valor: "regular", rotulo: "Regular", marcador: "var(--cor-regular)" },
  { valor: "atencao", rotulo: "Atenção", marcador: "var(--cor-atencao)" },
  { valor: "alerta", rotulo: "Alerta", marcador: "var(--cor-alerta-grafico)" },
];

const indicadores = [
  { id: "estresse", icone: iconesBemEstar.desapontado, titulo: "Estresse acadêmico", descricao: "Nível de estresse com as tarefas" },
  { id: "sono", icone: iconesBemEstar.luaCrescente, titulo: "Qualidade de sono", descricao: "Níveis de acesso ao app após 22h" },
  { id: "ansiedade", icone: iconesBemEstar.constrangido, titulo: "Ansiedade aos estudos", descricao: "Níveis de relatos de ansiedade" },
  { id: "organizacao", icone: iconesBemEstar.calendario, titulo: "Organização", descricao: "Planejamento e cumprimento de tarefas" },
  { id: "pertencimento", icone: iconesBemEstar.coracao, titulo: "Pertencimento", descricao: "Sensação de fazer parte da instituição" },
];

export default function PanoramaGeral() {
  const [situacao, definirSituacao] = useState("geral");
  const [dados, definirDados] = useState<PanoramaBemEstar | null>(null);
  const [erro, definirErro] = useState("");

  useEffect(() => {
    let ativo = true;
    carregarPanoramaBemEstar()
      .then((resultado) => { if (ativo) definirDados(resultado); })
      .catch((falha: unknown) => {
        if (ativo) definirErro(falha instanceof Error ? falha.message : "Não foi possível carregar o panorama.");
      });
    return () => { ativo = false; };
  }, []);

  const seriesVisiveis = dados?.series.filter((serie) => situacao === "geral" || serie.id === situacao) ?? [];

  return (
    <div className="panorama-grade">
      <div className="panorama-coluna-principal">
        <Painel className="panorama-painel-geral">
          <AbasSegmentadas className="panorama-filtros" itens={filtrosDeSituacao} valor={situacao} aoMudar={definirSituacao} />
          {erro && <p role="alert">{erro}</p>}
          <div className="panorama-geral-corpo">
            <section className="panorama-resumo">
              <h2 className="panorama-subtitulo panorama-subtitulo-resumo">
                <img src={iconesBemEstar.rindo} alt="" /> Bem-estar geral
              </h2>
              <div className="panorama-resumo-anel">
                <AnelDeProgresso valor={dados?.indice ?? 0} tamanho={180} tamanhoDaFonte={46} rotulo={dados ? undefined : "Índice indisponível"}>
                  {dados ? undefined : "—"}
                </AnelDeProgresso>
              </div>
              <div className="panorama-resumo-variacao">
                <strong>{dados ? <><IconeSetaVariacao sentido="cima" />{dados.variacao}</> : "—"}</strong>
                <Selo estilo={dados ? "destaque" : "neutro"}>{dados?.situacao ?? "Sem dados"}</Selo>
              </div>
              <p className="panorama-resumo-legenda">{dados ? "Em relação ao mês anterior" : "Aguardando indicadores do backend"}</p>
            </section>
            <section className="panorama-visao">
              <header className="panorama-visao-cabecalho">
                <h2 className="panorama-subtitulo"><img src={iconesBemEstar.graficoDeBarras} alt="" /> Visão geral</h2>
                <SeletorDePeriodo />
              </header>
              <GraficoDeArea className="panorama-grafico" series={seriesVisiveis} rotulosDoEixoX={dados?.rotulos ?? []} pontas />
            </section>
          </div>
        </Painel>
        <Painel className="panorama-painel-distribuicao" titulo="Distribuição de bem-estar" icone={<img src={iconesBemEstar.graficoDePizza} alt="" />}>
          <BarraSegmentada segmentos={dados?.distribuicao ?? []} />
          {!dados && <p>Distribuição disponível após integrar os dados das avaliações.</p>}
        </Painel>
      </div>
      <Painel className="panorama-painel-indicadores" titulo="Indicadores de bem estar" icone={<img src={iconesBemEstar.estatisticas} alt="" />}>
        <div className="panorama-indicadores-lista">
          {indicadores.map((indicador) => {
            const registro = dados?.indicadores.find((item) => item.id === indicador.id);
            return (
              <LinhaDeIndicador
                key={indicador.id}
                icone={<img src={indicador.icone} alt="" />}
                titulo={indicador.titulo}
                descricao={indicador.descricao}
                valor={registro?.valor ?? "—"}
                variacao={registro?.variacao}
                sentido={registro?.sentido as "cima" | "baixo" | undefined}
                tom={registro?.tom as "bom" | "ruim" | undefined}
              />
            );
          })}
        </div>
      </Painel>
    </div>
  );
}
