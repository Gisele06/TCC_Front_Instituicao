import { dadosReais } from "../../../js/integracao/avaliacoes.js";
import { obterTurmasIniciais } from "../../../js/Rotas_ACADEMICO/rotas_ACADEMICO.js";
import { useState } from "react";
import CardFiltroTurmas from "../../../components/BemEstar/CardFiltroTurmas/CardFiltroTurmas.jsx";
import CardMetricaTurmas from "../../../components/BemEstar/CardMetricaTurmas/CardMetricaTurmas.jsx";
import Painel from "../../../components/BemEstar/Painel/Painel.jsx";
import {
  obterMetricas,
  obterCursos,
  obterDatasDoGrafico,
} from "../../../js/Rotas_BEM_ESTAR/rotas_BEM_ESTAR.js";
import { iconesBemEstar } from "../../../js/Rotas_BEM_ESTAR/iconesBemEstar.js";
import "./Turmas.css";

const abasDosFiltros = [
  { valor: "selecionados", rotulo: "Selecionados" },
  { valor: "pesquisar", rotulo: "Pesquisar" },
];

function Turmas() {
  const datasDoGrafico = obterDatasDoGrafico();
  const real=dadosReais();
  const cursos = real ? obterTurmasIniciais().map(t=>({...t,turmas:1})) : obterCursos();

  const [metricaAtiva, definirMetricaAtiva] = useState("sobrecarga");
  const [abaDosFiltros, definirAbaDosFiltros] = useState("pesquisar");
  const [busca, definirBusca] = useState("");
  const [selecionados, definirSelecionados] = useState([]);

  const metricas = obterMetricas(real?selecionados:[]).map(item=>({...item,icone:iconesBemEstar[item.icone]}));
  const metrica = !real && selecionados.length ? null : metricas.find((item) => item.valor === metricaAtiva) ?? metricas[0];

  const cursosVisiveis = cursos.filter((curso) => {
    if (abaDosFiltros === "selecionados") return selecionados.includes(curso.id);
    return curso.nome.toLowerCase().includes(busca.trim().toLowerCase());
  });

  function alternarCurso(id) {
    definirSelecionados((atuais) =>
      atuais.includes(id)
        ? atuais.filter((item) => item !== id)
        : [...atuais, id]
    );
  }

  return (
    <div className="turmas-grade">
      {metrica ? (
        <CardMetricaTurmas
          metricas={metricas}
          metricaAtiva={metricaAtiva}
          definirMetricaAtiva={definirMetricaAtiva}
          metrica={metrica}
          datasDoGrafico={datasDoGrafico}
        />
      ) : (
        <Painel className="turmas-painel-vazio">
          <p>
            {selecionados.length
              ? "Não há avaliações detalhadas para os cursos selecionados."
              : "Ainda não há avaliações de bem-estar nesta conta."}
          </p>
        </Painel>
      )}

      <CardFiltroTurmas
        abasDosFiltros={abasDosFiltros}
        abaDosFiltros={abaDosFiltros}
        definirAbaDosFiltros={definirAbaDosFiltros}
        busca={busca}
        definirBusca={definirBusca}
        cursosVisiveis={cursosVisiveis}
        selecionados={selecionados}
        alternarCurso={alternarCurso}
        porTurma={real}
      />
    </div>
  );
}

export default Turmas;