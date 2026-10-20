import { useState } from "react";
import AbasSegmentadas from "../../components/SegmentedTabs/SegmentedTabs";
import AnelDeProgresso from "../../components/ProgressRing/ProgressRing";
import BarraSegmentada from "../../components/SegmentedBar/SegmentedBar";
import GraficoDeArea from "../../components/AreaChart/AreaChart";
import LinhaDeIndicador from "../../components/MetricRow/MetricRow";
import Painel from "../../components/Panel/Panel";
import SeletorDePeriodo from "../../components/PeriodSelect/PeriodSelect";
import Selo from "../../components/Badge/Badge";
import { IconeSetaVariacao } from "../../components/Icons/Icons";
import { iconesBemEstar } from "../../components/Icons/IconesBemEstar";
import type { SerieDoGrafico } from "../../components/AreaChart/AreaChart";

import "./PanoramaGeral.css";

// Dados de exemplo. Quando houver back-end, é só trocar estas listas pelo retorno da API.
const filtrosDeSituacao = [
  { valor: "geral", rotulo: "Geral" },
  { valor: "bem", rotulo: "Bem", marcador: "var(--cor-bem)" },
  { valor: "regular", rotulo: "Regular", marcador: "var(--cor-regular)" },
  { valor: "atencao", rotulo: "Atenção", marcador: "var(--cor-atencao)" },
  { valor: "alerta", rotulo: "Alerta", marcador: "var(--cor-alerta-grafico)" },
];

const seriesDeExemplo: SerieDoGrafico[] = [
  { id: "bem", nome: "Bem", cor: "#2f9365", valores: [63, 70, 75, 75, 82, 78, 72, 67, 64, 66, 72, 84, 92, 92, 90, 91] },
  { id: "atencao", nome: "Atenção", cor: "#f4aa06", valores: [44, 48, 55, 58, 64, 67, 66, 74, 82, 82, 76, 71, 72, 74, 74, 79] },
  { id: "regular", nome: "Regular", cor: "#de7009", valores: [30, 34, 38, 36, 32, 33, 45, 52, 51, 44, 40, 41, 48, 48, 46, 50] },
  { id: "alerta", nome: "Alerta", cor: "#d54017", valores: [13, 20, 24, 24, 22, 17, 21, 27, 30, 28, 22, 17, 19, 26, 26, 29] },
];

const datasDoGrafico = ["15/06", "22/06", "29/06", "06/07", "13/07", "20/07", "27/07", "03/08"];

// "largura" é o tamanho do trecho na barra. Na tela de referência ele é um pouco diferente da porcentagem.
const distribuicao = [
  { rotulo: "Bem", valor: 58, largura: 53, cor: "var(--cor-bem)" },
  { rotulo: "Atenção", valor: 24, largura: 21, cor: "var(--cor-atencao)" },
  { rotulo: "Regular", valor: 13, largura: 18, cor: "var(--cor-regular)" },
  { rotulo: "Alerta", valor: 5, largura: 8, cor: "var(--cor-alerta-grafico)" },
];

const indicadores = [
  {
    id: "estresse",
    icone: <img src={iconesBemEstar.desapontado} alt="" />,
    titulo: "Estresse acadêmico",
    descricao: "Nível de estresse com as tarefas",
    valor: "20%",
    variacao: "-5%",
    sentido: "baixo",
    tom: "bom",
  },
  {
    id: "sono",
    icone: <img src={iconesBemEstar.luaCrescente} alt="" />,
    titulo: "Qualidade de sono",
    descricao: "Níveis de acesso ao app após 22h",
    valor: "40%",
    variacao: "+10%",
    sentido: "cima",
    tom: "ruim",
  },
  {
    id: "ansiedade",
    icone: <img src={iconesBemEstar.constrangido} alt="" />,
    titulo: "Ansiedade aos estudos",
    descricao: "Níveis de relatos de ansiedade",
    valor: "20%",
    variacao: "+10%",
    sentido: "cima",
    tom: "ruim",
  },
  {
    id: "organizacao",
    icone: <img src={iconesBemEstar.calendario} alt="" />,
    titulo: "Organização",
    descricao: "Tem que ver o que vai colocar aqui...",
    valor: "40%",
    variacao: "+5%",
    sentido: "cima",
    tom: "bom",
  },
  {
    id: "pertencimento",
    icone: <img src={iconesBemEstar.coracao} alt="" />,
    titulo: "Pertencimento",
    descricao: "Tem que ver o que vai colocar aqui...",
    valor: "40%",
    variacao: "+5%",
    sentido: "cima",
    tom: "bom",
  },
] as const;

function PanoramaGeral() {
  const [situacao, definirSituacao] = useState("geral");

  // "Geral" mostra as quatro linhas. Os outros filtros mostram só a linha escolhida.
  const seriesVisiveis = situacao === "geral" ? seriesDeExemplo : seriesDeExemplo.filter((serie) => serie.id === situacao);

  return (
    <div className="panorama-grade">
      <div className="panorama-coluna-principal">
        <Painel className="panorama-painel-geral">
          <AbasSegmentadas className="panorama-filtros" itens={filtrosDeSituacao} valor={situacao} aoMudar={definirSituacao} />

          <div className="panorama-geral-corpo">
            <section className="panorama-resumo">
              <h2 className="panorama-subtitulo panorama-subtitulo-resumo">
                <img src={iconesBemEstar.rindo} alt="" />
                Bem-estar geral
              </h2>

              <div className="panorama-resumo-anel">
                <AnelDeProgresso valor={78} tamanho={180} tamanhoDaFonte={46} />
              </div>

              <div className="panorama-resumo-variacao">
                <strong>
                  <IconeSetaVariacao sentido="cima" />
                  +8%
                </strong>
                <Selo estilo="destaque">Bom</Selo>
              </div>
              <p className="panorama-resumo-legenda">Em relação ao mês anterior</p>
            </section>

            <section className="panorama-visao">
              <header className="panorama-visao-cabecalho">
                <h2 className="panorama-subtitulo">
                  <img src={iconesBemEstar.graficoDeBarras} alt="" />
                  Visão geral
                </h2>
                <SeletorDePeriodo />
              </header>

              <GraficoDeArea
                className="panorama-grafico"
                series={seriesVisiveis}
                rotulosDoEixoX={datasDoGrafico}
                pontas
              />
            </section>
          </div>
        </Painel>

        <Painel
          className="panorama-painel-distribuicao"
          titulo="Distribuição de bem-estar"
          icone={<img src={iconesBemEstar.graficoDePizza} alt="" />}
        >
          <BarraSegmentada segmentos={distribuicao} />
        </Painel>
      </div>

      <Painel
        className="panorama-painel-indicadores"
        titulo="Indicadores de bem estar"
        icone={<img src={iconesBemEstar.estatisticas} alt="" />}
      >
        <div className="panorama-indicadores-lista">
          {indicadores.map((indicador) => (
            <LinhaDeIndicador
              key={indicador.id}
              icone={indicador.icone}
              titulo={indicador.titulo}
              descricao={indicador.descricao}
              valor={indicador.valor}
              variacao={indicador.variacao}
              sentido={indicador.sentido}
              tom={indicador.tom}
            />
          ))}
        </div>
      </Painel>
    </div>
  );
}

export default PanoramaGeral;
