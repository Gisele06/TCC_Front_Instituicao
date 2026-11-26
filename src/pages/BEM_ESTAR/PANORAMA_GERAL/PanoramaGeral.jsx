import { dadosReais, periodosReais } from "../../../js/integracao/avaliacoes.js";
import CardIndicadores from "../../../components/BemEstar/CardIndicadores/CardIndicadores.jsx";
import CardDistribuicao from "../../../components/BemEstar/CardDistribuicao/CardDistribuicao.jsx";
import CardPanoramaGeral from "../../../components/BemEstar/CardPanoramaGeral/CardPanoramaGeral.jsx";
import { obterSeriesDeExemplo, obterDatasDoGrafico, obterDistribuicao, obterIndicadores } from "../../../js/Rotas_BEM_ESTAR/rotas_BEM_ESTAR.js";
import { useState } from "react";

import { iconesBemEstar } from "../../../js/Rotas_BEM_ESTAR/iconesBemEstar.js";

import "./PanoramaGeral.css";

const filtrosDeSituacao = [
  { valor: "geral", rotulo: "Geral" },
  { valor: "bem", rotulo: "Bem", marcador: "var(--cor-bem)" },
  { valor: "regular", rotulo: "Regular", marcador: "var(--cor-regular)" },
  { valor: "atencao", rotulo: "Atenção", marcador: "var(--cor-atencao)" },
  { valor: "alerta", rotulo: "Alerta", marcador: "var(--cor-alerta-grafico)" },
];


function PanoramaGeral() {
  const seriesDeExemplo = obterSeriesDeExemplo();
  const datasDoGrafico = obterDatasDoGrafico();
  const distribuicao = obterDistribuicao();
  const indicadores = obterIndicadores().map(item => ({ ...item, icone: <img src={iconesBemEstar[item.icone]} alt="" /> }));

  const [situacao, definirSituacao] = useState("geral");

  const seriesVisiveis = situacao === "geral" ? seriesDeExemplo : seriesDeExemplo.filter((serie) => serie.id === situacao);

  return (
    <div className="panorama-grade">
      <div className="panorama-coluna-principal">
        <CardPanoramaGeral filtrosDeSituacao={filtrosDeSituacao} situacao={situacao} definirSituacao={definirSituacao} seriesVisiveis={seriesVisiveis} datasDoGrafico={datasDoGrafico} dadosPorPeriodo={dadosReais()?periodosReais():undefined} contagemReal={dadosReais()} />

        <CardDistribuicao distribuicao={distribuicao} />
      </div>

      <CardIndicadores indicadores={indicadores} />
    </div>
  );
}

export default PanoramaGeral;
