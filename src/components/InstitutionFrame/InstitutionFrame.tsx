import type { ReactNode } from "react";
import MenuLateral from "../Sidebar/Sidebar";
import BarraSuperior from "../Topbar/Topbar";
import FundoPrincipal from "../MainBackground/MainBackground";

import iconeMenu from "../../assets/icons/menu.png";
import iconeInicio from "../../assets/icons/home.png";
import iconeBemEstar from "../../assets/icons/bem-estar.png";
import iconeAcolhimento from "../../assets/icons/acolhimento.png";
import iconeEventos from "../../assets/icons/eventos.png";
import iconeComunicados from "../../assets/icons/comunicados.png";
import iconeGerenciamento from "../../assets/icons/gerenciamento.png";
import iconeLogoBloom from "../../assets/icons/logo-b.png";
import iconeSino from "../../assets/icons/sino.png";
import iconeBusca from "../../assets/icons/busca.png";
import iconeCalendario from "../../assets/icons/calendario.png";
import iconeSetaBaixo from "../../assets/icons/chevron-down-topbar.png";

import "./InstitutionFrame.css";

interface PropriedadesEstruturaInstitucional {
  paginaAtiva: string;
  aoNavegar: (pagina: string) => void;
  /** Número mostrado no sino da barra superior. */
  quantidadeDeAvisos?: number;
  /** Endereço da foto do usuário. Sem ele, aparecem as iniciais. */
  fotoUsuario?: string;
  children: ReactNode;
}

const itensMenu = [
  { id: "inicio", rotulo: "Início", icone: <img src={iconeInicio} alt="Início" /> },
  { id: "bem-estar", rotulo: "Bem-estar", icone: <img src={iconeBemEstar} alt="Bem-estar" /> },
  { id: "acolhimento", rotulo: "Acolhimento", icone: <img src={iconeAcolhimento} alt="Acolhimento" /> },
  { id: "eventos", rotulo: "Eventos", icone: <img src={iconeEventos} alt="Eventos" /> },
  { id: "comunicados", rotulo: "Comunicados", icone: <img src={iconeComunicados} alt="Comunicados" /> },
  { id: "academico", rotulo: "Acadêmico", icone: <img src={iconeGerenciamento} alt="Acadêmico" /> },
];

function EstruturaInstitucional({
  paginaAtiva,
  aoNavegar,
  quantidadeDeAvisos = 2,
  fotoUsuario,
  children,
}: PropriedadesEstruturaInstitucional) {
  return (
    <div className="inicio">
      <MenuLateral
        itens={itensMenu}
        idAtivo={paginaAtiva}
        iconeMenu={<img src={iconeMenu} alt="Menu" />}
        aoSelecionar={aoNavegar}
      />

      <div className="fundo">
        <FundoPrincipal compacto={paginaAtiva !== "inicio"}>
          <BarraSuperior
            tituloMarca="Bloom"
            iconeMarca={<img src={iconeLogoBloom} alt="" />}
            subtituloMarca="Institucional"
            iconeBusca={<img src={iconeBusca} alt="" />}
            rotuloDaData="06 jul, 2026"
            quantidadeDeAvisos={quantidadeDeAvisos}
            nomeUsuario="Fernando Leonid"
            cargoUsuario="Coordenador"
            foto={fotoUsuario ? <img src={fotoUsuario} alt="" /> : <span>FL</span>}
            iconeSino={<img src={iconeSino} alt="" />}
            iconeCalendario={<img src={iconeCalendario} alt="" />}
            iconeSeta={<img src={iconeSetaBaixo} alt="" />}
          />

          {children}
        </FundoPrincipal>
      </div>
    </div>
  );
}

export default EstruturaInstitucional;
