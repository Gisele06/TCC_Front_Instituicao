import { useEffect, useState } from "react";
import AbasSegmentadas from "../../components/Geral/SegmentedTabs/SegmentedTabs";
import AnelDeProgresso from "../../components/Geral/ProgressRing/ProgressRing";
import CampoDeBusca from "../../components/Geral/SearchInput/SearchInput";
import GraficoDeArea from "../../components/Geral/AreaChart/AreaChart";
import Painel from "../../components/Geral/Panel/Panel";
import SeletorDePeriodo from "../../components/Geral/PeriodSelect/PeriodSelect";
import Selo from "../../components/Geral/Badge/Badge";
import { IconeMarcar, IconeSetaVariacao } from "../../components/Geral/Icons/Icons";
import { iconesBemEstar } from "./icons/IconesBemEstar";

import iconeBusca from "../../assets/icons/Geral/busca.png";
import iconeSetaDireita from "../../assets/icons/Geral/chevron-right.png";

import { carregarAcademico, type CursoOpcao } from "../Salas/data/academico";
import { carregarBemEstarTurmas, type BemEstarTurmas } from "../../services/indicadores";
import "./Turmas.css";

// Os nomes das métricas são opções da interface. Os valores devem ser
// calculados no backend a partir das avaliações, diários e matrículas.
const metricas = [
  { valor: "sobrecarga", rotulo: "Sobrecarga", titulo: "Sobrecarga acadêmica", descricao: "Pressão por prazos, acúmulo de atividades ou excesso de demandas.", icone: iconesBemEstar.desapontado },
  { valor: "sono", rotulo: "Qualidade de sono", titulo: "Qualidade de sono", descricao: "Níveis de acesso ao app após 22h.", icone: iconesBemEstar.luaCrescente },
  { valor: "ansiedade", rotulo: "Ansiedade", titulo: "Ansiedade aos estudos", descricao: "Níveis de relatos de ansiedade.", icone: iconesBemEstar.constrangido },
  { valor: "organizacao", rotulo: "Organização", titulo: "Organização", descricao: "Planejamento de tarefas e cumprimento de prazos.", icone: iconesBemEstar.calendario },
  { valor: "pertencimento", rotulo: "Pertencimento", titulo: "Pertencimento", descricao: "Sensação de fazer parte da turma e da instituição.", icone: iconesBemEstar.coracao },
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
  const [cursos, definirCursos] = useState<Array<CursoOpcao & { turmas: number }>>([]);
  const [erro, definirErro] = useState("");
  const [dadosBemEstar, definirDadosBemEstar] = useState<BemEstarTurmas | null>(null);
  useEffect(() => {
    let ativo = true;
    carregarBemEstarTurmas()
      .then((dados) => { if (ativo) definirDadosBemEstar(dados); })
      .catch((falha: unknown) => {
        if (ativo) definirErro(falha instanceof Error ? falha.message : "Não foi possível carregar indicadores.");
      });
    return () => { ativo = false; };
  }, []);
  useEffect(() => {
    let ativo = true;
    carregarAcademico().then((dados) => {
      if (!ativo) return;
      definirCursos(dados.cursos.map((curso) => ({
        ...curso,
        turmas: dados.turmas.filter((turma) => String(turma.cursoId) === curso.id).length,
      })));
    }).catch((falha: unknown) => {
      if (ativo) definirErro(falha instanceof Error ? falha.message : "Não foi possível carregar os cursos.");
    });
    return () => { ativo = false; };
  }, []);

  const metrica = metricas.find((item) => item.valor === metricaAtiva) ?? metricas[0];
  const valores = dadosBemEstar?.metricas.find((item) => item.id === metricaAtiva);

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
          <Selo estilo={valores ? "destaque" : "neutro"}>{valores?.situacao ?? "Sem dados"}</Selo>
        </header>

        <div className="turmas-metrica-cartao">
          <section className="turmas-resumo">
            <div className="turmas-resumo-anel">
              <AnelDeProgresso valor={valores?.percentual ?? 0} tamanho={193} tamanhoDaFonte={52} rotulo={valores ? undefined : "Métrica indisponível"}>
                {valores ? undefined : "—"}
              </AnelDeProgresso>
            </div>
            <strong className="turmas-resumo-variacao">
              {valores ? <><IconeSetaVariacao sentido="cima" />{valores.variacao}</> : "—"}
            </strong>
            <p>{valores ? "Em relação ao mês anterior" : "Aguardando cálculo do backend"}</p>
          </section>

          <section className="turmas-grafico">
            <SeletorDePeriodo className="turmas-periodo" />
            <GraficoDeArea
              series={valores ? [{ id: metricaAtiva, nome: metrica.titulo, cor: "#d80b00", valores: valores.valores }] : []}
              rotulosDoEixoX={dadosBemEstar?.rotulos ?? []}
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
        {erro && <p role="alert">{erro}</p>}

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
