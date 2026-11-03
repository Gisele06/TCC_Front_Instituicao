import { useState } from "react";
import EstruturaInstitucional from "../../components/Geral/InstitutionFrame/InstitutionFrame";
import CabecalhoDePagina from "../../components/Geral/PageHeader/PageHeader";
import AbasSegmentadas from "../../components/Geral/SegmentedTabs/SegmentedTabs";
import { iconesBemEstar } from "./icons/IconesBemEstar";
import PanoramaGeral from "./PanoramaGeral";
import Turmas from "./Turmas";

import "./BemEstar.css";

interface PropriedadesBemEstar {
  aoNavegar: (pagina: string) => void;
}

type VisaoDoBemEstar = "panorama" | "turmas";

const visoes = [
  { valor: "panorama", rotulo: "Panorama geral", icone: <img src={iconesBemEstar.graficoDePizza} alt="" /> },
  { valor: "turmas", rotulo: "Turmas", icone: <img src={iconesBemEstar.prancheta} alt="" /> },
];

function BemEstar({ aoNavegar }: PropriedadesBemEstar) {
  const [visao, definirVisao] = useState<VisaoDoBemEstar>("panorama");

  return (
    <EstruturaInstitucional paginaAtiva="bem-estar" aoNavegar={aoNavegar}>
      <main className="bem-estar-pagina">
        <CabecalhoDePagina
          className="bem-estar-cabecalho"
          titulo="Bem-estar"
          subtitulo="Acompanhe o bem-estar dos estudantes"
        />

        <AbasSegmentadas
          className="bem-estar-abas"
          itens={visoes}
          valor={visao}
          aoMudar={(valor) => definirVisao(valor as VisaoDoBemEstar)}
        />

        {visao === "panorama" ? <PanoramaGeral /> : <Turmas />}
      </main>
    </EstruturaInstitucional>
  );
}

export default BemEstar;
