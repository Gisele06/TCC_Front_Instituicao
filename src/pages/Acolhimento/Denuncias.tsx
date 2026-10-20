import { useState } from "react";
import "./Denuncia.css";
import EstruturaInstitucional from "../../components/InstitutionFrame/InstitutionFrame";
import CabecalhoDePagina from "../../components/PageHeader/PageHeader";
import AbasSegmentadas from "../../components/SegmentedTabs/SegmentedTabs";

interface PropriedadesAcolhimento {
  aoNavegar: (pagina: string) => void;
}

type VisaoAcolhimento = "denuncias" | "redesApoio";

const visoes = [
  { valor: "denuncias", rotulo: "Denuncias", icone: <img src="src/assets/icons/Acolhimento/complaint.png" alt="Ícone Denúncias" /> },
  { valor: "redesApoio", rotulo: "Redes de apoio", icone: <img src="src/assets/icons/Acolhimento/world-markets.png" alt="Ícone Redes de apoio" /> },
];

function Acolhimento({ aoNavegar }: PropriedadesAcolhimento) {
  const [visao, definirVisao] = useState<VisaoAcolhimento>("denuncias");

  return (
    <EstruturaInstitucional paginaAtiva="bem-estar" aoNavegar={aoNavegar} quantidadeDeAvisos={3}>
      <main className="bem-estar-pagina">
        <CabecalhoDePagina
          className="acolhimento-cabecalho"
          titulo="Acolhimento"
          subtitulo="Acompanhe o bem-estar dos estudantes"
        />

        <AbasSegmentadas
          className="bem-estar-abas"
          itens={visoes}
          valor={visao}
          aoMudar={(valor) => definirVisao(valor as VisaoAcolhimento)}
        />

        {}
        {visao === "denuncias" ? (
          <div>Conteúdo de Denúncias</div>
        ) : (
          <div>Redes de apoio </div>
        )}
      </main>
    </EstruturaInstitucional>
  );
}

export default Acolhimento;