import type { ReactNode } from "react";
import MenuLateral from "../Sidebar/Sidebar";
import BarraSuperior from "../Topbar/Topbar";
import FundoPrincipal from "../MainBackground/MainBackground";

import iconeInicio from "../../../assets/icons/Geral/home.png";
import iconeBemEstar from "../../../assets/icons/Geral/bem-estar.png";
import iconeAcolhimento from "../../../assets/icons/Geral/acolhimento.png";
import iconeEventos from "../../../assets/icons/Geral/eventos.png";
import iconeComunicados from "../../../assets/icons/Geral/comunicados.png";
import iconeGerenciamento from "../../../assets/icons/Geral/gerenciamento.png";
import iconeLogoBloom from "../../../assets/icons/Geral/logo-b.png";
import iconeSino from "../../../assets/icons/Geral/sino.png";
import iconeBusca from "../../../assets/icons/Geral/busca.png";
import iconeCalendario from "../../../assets/icons/Geral/calendario.png";
import iconeSetaBaixo from "../../../assets/icons/Geral/chevron-down-topbar.png";

// Ícones selecionados (dark)
import iconeInicioDark from "../../../assets/icons/Geral/nav/home-page-light.svg";
import iconeBemEstarDark from "../../../assets/icons/Geral/nav/flower-dark.svg";
import iconeAcolhimentoDark from "../../../assets/icons/Geral/nav/trust-dark.svg";
import iconeEventosDark from "../../../assets/icons/Geral/nav/calendar-dark.svg";
import iconeComunicadosDark from "../../../assets/icons/Geral/nav/chat-dark.svg";
import iconeGerenciamentoDark from "../../../assets/icons/Geral/nav/graduation-cap-dark.svg";

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
  {
    id: "inicio",
    rotulo: "Início",
    icone: iconeInicio,
    iconeDark: iconeInicioDark,
  },
  {
    id: "bem-estar",
    rotulo: "Bem-estar",
    icone: iconeBemEstar,
    iconeDark: iconeBemEstarDark,
  },
  {
    id: "acolhimento",
    rotulo: "Acolhimento",
    icone: iconeAcolhimento,
    iconeDark: iconeAcolhimentoDark,
  },
  {
    id: "eventos",
    rotulo: "Eventos",
    icone: iconeEventos,
    iconeDark: iconeEventosDark,
  },
  {
    id: "comunicados",
    rotulo: "Comunicados",
    icone: iconeComunicados,
    iconeDark: iconeComunicadosDark,
  },
  {
    id: "academico",
    rotulo: "Acadêmico",
    icone: iconeGerenciamento,
    iconeDark: iconeGerenciamentoDark,
  },
];

function EstruturaInstitucional({
  paginaAtiva,
  aoNavegar,
  quantidadeDeAvisos = 0,
  fotoUsuario,
  children,
}: PropriedadesEstruturaInstitucional) {
  return (
    <div className="inicio">
      <MenuLateral
        itens={itensMenu.map((item) => ({
          id: item.id,
          rotulo: item.rotulo,
          icone: (
            <img
              src={
                item.id === "inicio"
                  ? paginaAtiva === item.id
                    ? item.icone
                    : item.iconeDark
                  : paginaAtiva === item.id
                    ? item.iconeDark
                    : item.icone
              }
              alt=""
            />
          ),
        }))}
        idAtivo={paginaAtiva}
        aoSelecionar={aoNavegar}
      />
      <div className="fundo">
        <FundoPrincipal compacto={paginaAtiva !== "inicio"}>
          <BarraSuperior
            tituloMarca="Bloom"
            iconeMarca={<img src={iconeLogoBloom} alt="" />}
            subtituloMarca="Institucional"
            iconeBusca={<img src={iconeBusca} alt="" />}
            rotuloDaData={new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date())}
            quantidadeDeAvisos={quantidadeDeAvisos}
            nomeUsuario="Usuário institucional"
            cargoUsuario="Perfil pendente"
            foto={fotoUsuario ? <img src={fotoUsuario} alt="" /> : <span>BI</span>}
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
