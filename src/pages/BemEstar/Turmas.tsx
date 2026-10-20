import { useState } from "react";
import AbasSegmentadas from "../../components/SegmentedTabs/SegmentedTabs";
import AnelDeProgresso from "../../components/ProgressRing/ProgressRing";
import CampoDeBusca from "../../components/SearchInput/SearchInput";
import GraficoDeArea from "../../components/AreaChart/AreaChart";
import Painel from "../../components/Panel/Panel";
import SeletorDePeriodo from "../../components/PeriodSelect/PeriodSelect";
import Selo from "../../components/Badge/Badge";
import { IconeMarcar, IconeSetaVariacao } from "../../components/Icons/Icons";
import { iconesBemEstar } from "../../components/Icons/IconesBemEstar";

import iconeBusca from "../../assets/icons/busca.png";
import iconeSetaDireita from "../../assets/icons/chevron-right.png";

import "./Turmas.css";

// Dados de exemplo. Só "Sobrecarga" segue a tela de referência; os outros textos e números
// são provisórios, para as abas já funcionarem enquanto não existe back-end.
const metricas = [
  {
    valor: "sobrecarga",
    rotulo: "Sobrecarga",
    titulo: "Sobrecarga acadêmica",
    descricao: "Pressão por prazos, acúmulo de atividades ou excesso de demandas.",
    icone: iconesBemEstar.desapontado,
    percentual: 78,
    variacao: "+8%",
    situacao: "Bom",
    valores: [27, 33, 37, 35, 30, 30, 38, 45, 44, 37, 30, 32, 38, 39, 37, 41],
  },
  {
    valor: "sono",
    rotulo: "Qualidade de sono",
    titulo: "Qualidade de sono",
    descricao: "Níveis de acesso ao app após 22h.",
    icone: iconesBemEstar.luaCrescente,
    percentual: 64,
    variacao: "+3%",
    situacao: "Bom",
    valores: [40, 44, 48, 46, 42, 45, 52, 55, 50, 47, 49, 53, 51, 56, 54, 58],
  },
  {
    valor: "ansiedade",
    rotulo: "Ansiedade",
    titulo: "Ansiedade aos estudos",
    descricao: "Níveis de relatos de ansiedade.",
    icone: iconesBemEstar.constrangido,
    percentual: 71,
    variacao: "+2%",
    situacao: "Bom",
    valores: [30, 28, 35, 38, 33, 36, 42, 40, 37, 39, 44, 41, 43, 46, 44, 47],
  },
  {
    valor: "organizacao",
    rotulo: "Organização",
    titulo: "Organização",
    descricao: "Planejamento de tarefas e cumprimento de prazos.",
    icone: iconesBemEstar.calendario,
    percentual: 69,
    variacao: "+5%",
    situacao: "Bom",
    valores: [35, 38, 36, 41, 45, 43, 40, 46, 50, 48, 47, 52, 55, 53, 56, 58],
  },
  {
    valor: "pertencimento",
    rotulo: "Pertencimento",
    titulo: "Pertencimento",
    descricao: "Sensação de fazer parte da turma e da instituição.",
    icone: iconesBemEstar.coracao,
    percentual: 82,
    variacao: "+5%",
    situacao: "Bom",
    valores: [50, 53, 55, 52, 58, 60, 57, 62, 65, 63, 66, 64, 68, 70, 69, 72],
  },
];

const datasDoGrafico = ["15/06", "22/06", "29/06", "06/07", "13/07", "20/07", "27/07", "03/08"];

const cursos = [
  { id: "ds", nome: "Desenvolvimento de sistemas", turmas: 4 },
  { id: "redes", nome: "Redes", turmas: 3 },
  { id: "eletricista", nome: "Eletricista de manutenção", turmas: 2 },
  { id: "mecanico", nome: "Mecânico de manutenção", turmas: 5 },
];

const abasDosFiltros = [
  { valor: "selecionados", rotulo: "Selecionados" },
  { valor: "pesquisar", rotulo: "Pesquisar" },
];

function Turmas() {
  const [metricaAtiva, definirMetricaAtiva] = useState("sobrecarga");
  const [abaDosFiltros, definirAbaDosFiltros] = useState("pesquisar");
  const [busca, definirBusca] = useState("");
  const [selecionados, definirSelecionados] = useState<string[]>([]);

  const metrica = metricas.find((item) => item.valor === metricaAtiva) ?? metricas[0];

  const cursosVisiveis = cursos.filter((curso) => {
    if (abaDosFiltros === "selecionados") return selecionados.includes(curso.id);
    return curso.nome.toLowerCase().includes(busca.trim().toLowerCase());
  });

  function alternarCurso(id: string) {
    definirSelecionados((atuais) => (atuais.includes(id) ? atuais.filter((item) => item !== id) : [...atuais, id]));
  }

  return (
    <div className="turmas-grade">
      <Painel className="turmas-painel-principal">
        <AbasSegmentadas
          className="turmas-abas"
          itens={metricas.map((item) => ({
            valor: item.valor,
            rotulo: item.rotulo,
            icone: <img src={item.icone} alt="" />,
          }))}
          valor={metricaAtiva}
          aoMudar={definirMetricaAtiva}
        />

        <header className="turmas-metrica-cabecalho">
          <div className="turmas-metrica-texto">
            <h2>
              <img src={metrica.icone} alt="" />
              {metrica.titulo}
            </h2>
            <p>{metrica.descricao}</p>
          </div>
          <Selo estilo="destaque">{metrica.situacao}</Selo>
        </header>

        <div className="turmas-metrica-cartao">
          <section className="turmas-resumo">
            <div className="turmas-resumo-anel">
              <AnelDeProgresso valor={metrica.percentual} tamanho={193} tamanhoDaFonte={52} />
            </div>
            <strong className="turmas-resumo-variacao">
              <IconeSetaVariacao sentido="cima" />
              {metrica.variacao}
            </strong>
            <p>Em relação ao mês anterior</p>
          </section>

          <section className="turmas-grafico">
            <SeletorDePeriodo className="turmas-periodo" />
            <GraficoDeArea
              series={[{ id: metrica.valor, nome: metrica.titulo, cor: "#d80b00", valores: metrica.valores }]}
              rotulosDoEixoX={datasDoGrafico}
              opacidadeDoPreenchimento={0.17}
              pontas
            />
          </section>
        </div>
      </Painel>

      <Painel className="turmas-painel-filtros" titulo="Filtros" icone={<img src={iconesBemEstar.filtro} alt="" />}>
        <AbasSegmentadas
          className="turmas-filtros-abas"
          tamanho="compacto"
          itens={abasDosFiltros}
          valor={abaDosFiltros}
          aoMudar={definirAbaDosFiltros}
        />

        <CampoDeBusca
          className="turmas-busca"
          textoDeAjuda="Pesquise por cursos"
          valor={busca}
          aoMudar={definirBusca}
          icone={<img src={iconeBusca} alt="" />}
          tamanhoDoIcone="calc(28 * var(--un))"
        />

        <h3 className="turmas-cursos-titulo">Cursos</h3>

        <ul className="turmas-cursos-lista">
          {cursosVisiveis.map((curso) => {
            const marcado = selecionados.includes(curso.id);
            return (
              <li key={curso.id}>
                <label className="turmas-curso">
                  <input type="checkbox" checked={marcado} onChange={() => alternarCurso(curso.id)} />
                  <span className="turmas-curso-caixa">{marcado && <IconeMarcar />}</span>
                  <span className="turmas-curso-nome">{curso.nome}</span>
                  <span className="turmas-curso-quantidade">{curso.turmas} turmas</span>
                  <img src={iconeSetaDireita} alt="" />
                </label>
              </li>
            );
          })}
        </ul>
      </Painel>
    </div>
  );
}

export default Turmas;
