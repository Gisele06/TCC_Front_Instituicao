import { useState } from "react";
import TituloSecao from "../../components/Gerais/Cabecalho/TituloSecao/TituloSecao.jsx";
import Abas, { ConteudoAba } from "../../components/Gerais/Abas/Abas.jsx";
import { iconesBemEstar } from "../../js/Rotas_BEM_ESTAR/iconesBemEstar.js";
import PanoramaGeral from "./PANORAMA_GERAL/PanoramaGeral.jsx";
import Turmas from "./TURMAS/Turmas.jsx";
import "./BemEstar.css";

const visoes = [
  {
    valor: "panorama",
    rotulo: "Panorama geral",
    icone: <img src={iconesBemEstar.graficoDePizza} alt="" />,
  },
  {
    valor: "turmas",
    rotulo: "Turmas",
    icone: <img src={iconesBemEstar.prancheta} alt="" />,
  },
];

function BemEstar() {
  const [visao, definirVisao] = useState("panorama");

  return (
    <main className="bem-estar-pagina">
      <TituloSecao
        className="bem-estar-cabecalho"
        titulo="Bem-estar"
        subtitulo="Acompanhe o bem-estar dos estudantes"
      />

      <Abas
        className="bem-estar-abas"
        itens={visoes}
        valor={visao}
        aoMudar={definirVisao}
      />

      <ConteudoAba chave={visao}>
        {visao === "panorama" ? <PanoramaGeral /> : <Turmas />}
      </ConteudoAba>
    </main>
  );
}

export default BemEstar;