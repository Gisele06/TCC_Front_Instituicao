import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  obterUsuarioLogado,
  obterAvisos,
  sairDaConta,
  marcarAvisosComoLidos,
} from "../../../js/Rotas_LOGIN/rotas_LOGIN.js";
import iconeLogoBloom from "../../../img/icones/logo-b.png";
import iconeSino from "../../../img/icones/sino.png";
import iconeBusca from "../../../img/icones/busca.png";
import iconeSetaBaixo from "../../../img/icones/setaBaixoCabecalho.png";
import PerfilCard from "./PerfilCard/PerfilCard.jsx";
import Icone from "../Icone/Icone.jsx";
import Input from "../Input/Input.jsx";
import "./Cabecalho.css";

const FUNCIONALIDADES_JSON = [
  {
    id: "inicio",
    titulo: "Início",
    descricao: "Visão geral dos indicadores e atividades recentes da instituição.",
    categoria: "Painel",
    rota: "/home",
    palavrasChave: ["home", "dashboard", "resumo", "indicadores"],
  },
  {
    id: "bem-estar",
    titulo: "Bem-estar",
    descricao: "Acompanhe avaliações emocionais e humor das turmas.",
    categoria: "Acompanhamento",
    rota: "/bem-estar",
    palavrasChave: ["avaliacoes", "humor", "emocional", "saude"],
  },
  {
    id: "acolhimento",
    titulo: "Acolhimento e Denúncias",
    descricao: "Gerencie relatos, mensagens e redes de apoio.",
    categoria: "Acompanhamento",
    rota: "/acolhimento",
    palavrasChave: ["denuncias", "mensagens", "apoio", "escuta"],
  },
  {
    id: "eventos",
    titulo: "Eventos",
    descricao: "Consulte o calendário de ações e encontros escolares.",
    categoria: "Agenda",
    rota: "/eventos",
    palavrasChave: ["calendario", "agenda", "palestras"],
  },
  {
    id: "cadastrar-evento",
    titulo: "Criar novo evento",
    descricao: "Agende uma nova atividade ou encontro para a comunidade.",
    categoria: "Ação rápida",
    rota: "/eventos/cadastrarEvento",
    palavrasChave: ["novo evento", "adicionar evento", "agendar"],
  },
  {
    id: "comunicados",
    titulo: "Comunicados",
    descricao: "Veja e publique avisos oficiais para alunos e equipe.",
    categoria: "Comunicação",
    rota: "/comunicados",
    palavrasChave: ["avisos", "mensagens", "noticias"],
  },
  {
    id: "academico",
    titulo: "Acadêmico e Salas",
    descricao: "Organize turmas, salas e vínculos institucionais.",
    categoria: "Gestão",
    rota: "/academico",
    palavrasChave: ["salas", "turmas", "alunos", "cursos"],
  },
];

const CURVA_POPOVER = [0.22, 1, 0.36, 1];

function normalizar(texto = "") {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function Cabecalho({ paginaAtiva }) {
  const usuario = obterUsuarioLogado();
  const navegar = useNavigate();

  const [busca, definirBusca] = useState("");
  const [popoverAberto, definirPopoverAberto] = useState(false);
  const [indiceAtivo, definirIndiceAtivo] = useState(0);
  const buscaRef = useRef(null);

  const resultados = useMemo(() => {
    const termo = normalizar(busca.trim());
    if (!termo) return [];
    return FUNCIONALIDADES_JSON.filter((item) => {
      const textoCompleto = [
        item.titulo,
        item.descricao,
        item.categoria,
        ...item.palavrasChave,
      ]
        .map(normalizar)
        .join(" ");
      return textoCompleto.includes(termo);
    });
  }, [busca]);

  const mostrarPopover = popoverAberto && busca.trim().length > 0;

  useEffect(() => {
    function aoClicarFora(evento) {
      if (!buscaRef.current?.contains(evento.target)) {
        definirPopoverAberto(false);
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, []);

  function selecionarFuncionalidade(item) {
    navegar(item.rota);
    definirBusca("");
    definirPopoverAberto(false);
    definirIndiceAtivo(0);
  }

  function aoTeclarNaBusca(evento) {
    if (!mostrarPopover) return;

    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      if (resultados.length > 0) {
        definirIndiceAtivo((atual) => (atual + 1) % resultados.length);
      }
    } else if (evento.key === "ArrowUp") {
      evento.preventDefault();
      if (resultados.length > 0) {
        definirIndiceAtivo(
          (atual) => (atual - 1 + resultados.length) % resultados.length
        );
      }
    } else if (evento.key === "Enter" && resultados[indiceAtivo]) {
      evento.preventDefault();
      selecionarFuncionalidade(resultados[indiceAtivo]);
    } else if (evento.key === "Escape") {
      definirPopoverAberto(false);
    }
  }

  const tituloMarca = "Bloom";
  const subtituloMarca = "Institucional";
  const dicaDeBusca = "Pesquisar funcionalidades";

  const avisos = obterAvisos();
  const quantidadeDeAvisos = ["bem-estar", "acolhimento"].includes(paginaAtiva)
    ? avisos.acolhimento
    : avisos.gerais;

  const nomeUsuario = usuario.nome;
  const cargoUsuario = usuario.cargo;
  const foto = usuario.foto ? (
    <img src={usuario.foto} alt="" />
  ) : (
    <span>
      {(usuario.nome || usuario.email)
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()}
    </span>
  );
  const iconeSeta = <img src={iconeSetaBaixo} alt="" />;

  return (
    <header className="bloom-barra-superior">
      <div className="bloom-barra-superior-marca">
        <div className="bloom-barra-superior-marca-titulo">
          <span className="bloom-barra-superior-marca-simbolo">
            <img src={iconeLogoBloom} alt="" />
          </span>
          <span className="bloom-barra-superior-marca-texto">
            <span className="bloom-barra-superior-marca-nome">
              {tituloMarca.slice(1)}
            </span>
            <span className="bloom-barra-superior-marca-subtitulo">
              {subtituloMarca}
            </span>
          </span>
        </div>
      </div>

      <div
        className="busca-funcionalidades"
        ref={buscaRef}
        onKeyDown={aoTeclarNaBusca}
      >
        <Input
          tipo="busca"
          classeName="bloom-barra-superior-busca"
          placeholder={dicaDeBusca}
          valor={busca}
          tamanhoDoIcone="20px"
          aoAlterar={(e) => {
            definirBusca(e.target.value);
            definirPopoverAberto(true);
            definirIndiceAtivo(0);
          }}
          icone={<img src={iconeBusca} alt="" />}
        />

        <AnimatePresence>
          {mostrarPopover && (
            <motion.div
              className="busca-popover"
              role="listbox"
              aria-label="Resultados de funcionalidades"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: CURVA_POPOVER }}
            >
              <div className="busca-popover-cabecalho">
                <span>Funcionalidades</span>
                <span className="busca-popover-contagem">
                  {resultados.length}{" "}
                  {resultados.length === 1 ? "resultado" : "resultados"}
                </span>
              </div>

              {resultados.length === 0 ? (
                <p className="busca-popover-vazio">
                  Nenhuma funcionalidade encontrada para "{busca.trim()}".
                </p>
              ) : (
                <div className="busca-popover-lista">
                  {resultados.map((item, indice) => (
                    <button
                      type="button"
                      key={item.id}
                      role="option"
                      aria-selected={indice === indiceAtivo}
                      className={`busca-popover-item ${
                        indice === indiceAtivo
                          ? "busca-popover-item--ativo"
                          : ""
                      }`}
                      onMouseEnter={() => definirIndiceAtivo(indice)}
                      onClick={() => selecionarFuncionalidade(item)}
                    >
                      <span className="busca-popover-item-topo">
                        <strong className="busca-popover-item-titulo">
                          {item.titulo}
                        </strong>
                        <span className="busca-popover-item-tag">
                          {item.categoria}
                        </span>
                      </span>
                      <span className="busca-popover-item-descricao">
                        {item.descricao}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bloom-barra-superior-acoes">
        <button
          type="button"
          className="bloom-barra-superior-sino"
          aria-label={`Marcar ${quantidadeDeAvisos} avisos como lidos`}
          onClick={() =>
            marcarAvisosComoLidos(
              ["bem-estar", "acolhimento"].includes(paginaAtiva)
                ? "acolhimento"
                : "gerais"
            )
          }
        >
          <Icone
            icone={<img src={iconeSino} alt="" />}
            rotulo="sino"
            tamanho="24px"
          />
          {quantidadeDeAvisos > 0 && (
            <span className="bloom-barra-superior-sino-contagem">
              {quantidadeDeAvisos}
            </span>
          )}
        </button>

        <PerfilCard
          foto={foto}
          nomeUsuario={nomeUsuario}
          cargoUsuario={cargoUsuario}
          iconeSeta={iconeSeta}
          aoSair={sairDaConta}
        />
      </div>
    </header>
  );
}

export default Cabecalho;