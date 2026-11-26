import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import iconeInicio from "../../../img/icones/inicio.png";
import iconeBemEstar from "../../../img/icones/bem-estar.png";
import iconeAcolhimento from "../../../img/icones/acolhimento.png";
import iconeEventos from "../../../img/icones/eventos.png";
import iconeComunicados from "../../../img/icones/comunicados.png";
import iconeGerenciamento from "../../../img/icones/gerenciamento.png";
import iconeInicioClaro from "../../../img/icones/NavBar/inicioClaro.svg";
import iconeBemEstarEscuro from "../../../img/icones/NavBar/florEscura.svg";
import iconeAcolhimentoEscuro from "../../../img/icones/NavBar/acolhimentoEscuro.svg";
import iconeEventosEscuro from "../../../img/icones/NavBar/calendarioEscuro.svg";
import iconeComunicadosEscuro from "../../../img/icones/NavBar/conversaEscura.svg";
import iconeGerenciamentoEscuro from "../../../img/icones/NavBar/capeloEscuro.svg";
import NavBarBotao from "./NavBarBotao/NavBarBotao.jsx";
import "./NavBar.css";

const TEMPO_ESPERA_MS = 300;

const itensMenu = [
  {
    id: "inicio",
    rotulo: "Início",
    icone: iconeInicio,
    iconeAlternativo: iconeInicioClaro,
  },
  {
    id: "bem-estar",
    rotulo: "Bem-estar",
    icone: iconeBemEstar,
    iconeAlternativo: iconeBemEstarEscuro,
  },
  {
    id: "acolhimento",
    rotulo: "Acolhimento",
    icone: iconeAcolhimento,
    iconeAlternativo: iconeAcolhimentoEscuro,
  },
  {
    id: "eventos",
    rotulo: "Eventos",
    icone: iconeEventos,
    iconeAlternativo: iconeEventosEscuro,
  },
  {
    id: "comunicados",
    rotulo: "Comunicados",
    icone: iconeComunicados,
    iconeAlternativo: iconeComunicadosEscuro,
  },
  {
    id: "academico",
    rotulo: "Acadêmico",
    icone: iconeGerenciamento,
    iconeAlternativo: iconeGerenciamentoEscuro,
  },
];

function NavBar({ idAtivo }) {
  const navegar = useNavigate();
  const reduzirMovimento = useReducedMotion();
  const [idVisualAtivo, definirIdVisualAtivo] = useState(idAtivo);
  const idAnteriorRef = useRef(idAtivo);

  useEffect(() => {
    if (idAtivo === idAnteriorRef.current) return;
    idAnteriorRef.current = idAtivo;

    if (reduzirMovimento) {
      definirIdVisualAtivo(idAtivo);
      return;
    }

    definirIdVisualAtivo(null);
    const temporizador = setTimeout(() => {
      definirIdVisualAtivo(idAtivo);
    }, TEMPO_ESPERA_MS);

    return () => clearTimeout(temporizador);
  }, [idAtivo, reduzirMovimento]);

  function aoSelecionar(id) {
    navegar(id === "inicio" ? "/home" : `/${id}`);
  }

  return (
    <nav className="bloom-menu-lateral" aria-label="Navegação principal">
      {itensMenu.map((item) => (
        <NavBarBotao
          key={item.id}
          item={item}
          idAtivo={idVisualAtivo}
          ehPaginaAtual={item.id === idAtivo}
          aoSelecionar={aoSelecionar}
        />
      ))}
    </nav>
  );
}

export default NavBar;