import { useMemo, useState } from "react";
import Abas, { ConteudoAba } from "../../Gerais/Abas/Abas.jsx";
import Input from "../../Gerais/Input/Input.jsx";
import { formatarData } from "../../../js/Gerais/calendario.js";
import iconeCalendarioDaLista from "../../../img/icones/calendario-evento.png";
import iconeRelogio from "../../../img/icones/relogio-evento.png";
import iconeLocalDoEvento from "../../../img/icones/local-evento.png";
import iconeOcultarEvento from "../../../img/icones/ocultar-evento.png";
import iconeReenviarEvento from "../../../img/icones/reenviar-evento.png";
import iconeSetaDireita from "../../../img/icones/setaDireita.png";
import iconeBusca from "../../../img/icones/busca.png";
import "./CardListaEventos.css";

const MESES_CURTOS = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

const TEMAS_CAPA = {
  festa: { fundo: "#e6efe8", destaque: "#3d745a", detalhe: "#c5dccb" },
  palestra: { fundo: "#e7eef4", destaque: "#2e6d9e", detalhe: "#c7dbeb" },
  oficina: { fundo: "#f3ece0", destaque: "#c47a2c", detalhe: "#e5d3b5" },
  campanha: { fundo: "#eee8f3", destaque: "#7b5ea7", detalhe: "#d5c7e3" },
  reunião: { fundo: "#e8ece9", destaque: "#274036", detalhe: "#cbd6cf" },
};

function formatarDataCard(dataStr) {
  if (!dataStr) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(dataStr));
  if (!match) return formatarData(dataStr);
  const ano = match[1];
  const mesIdx = Number(match[2]) - 1;
  const dia = Number(match[3]);
  return `${dia} ${MESES_CURTOS[mesIdx] || ""}, ${ano}`;
}

function normalizarTexto(texto = "") {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function CapaEstaticaEvento({ categoria = "" }) {
  const chave = categoria.trim().toLowerCase();
  const tema = TEMAS_CAPA[chave] || TEMAS_CAPA.palestra;

  return (
    <svg
      className="eventos-lista-foto-arte"
      viewBox="0 0 84 84"
      fill="none"
      aria-hidden="true"
    >
      <rect width="84" height="84" rx="14" fill={tema.fundo} />
      <circle cx="64" cy="22" r="18" fill={tema.detalhe} opacity="0.7" />
      <circle cx="22" cy="68" r="22" fill={tema.detalhe} opacity="0.5" />
      <path
        d="M18 59L34 41L46 53L56 43L68 59H18Z"
        fill={tema.destaque}
        opacity="0.82"
      />
      <circle cx="31" cy="29" r="6" fill={tema.destaque} opacity="0.75" />
    </svg>
  );
}

function CardListaEventos({
  aoEditar,
  aoOcultar,
  aoReenviar,
  categorias,
  aoCriarEvento,
  eventosDeExemplo,
}) {
  const [categoriaAtiva, definirCategoria] = useState("Todos");
  const [busca, definirBusca] = useState("");

  const itensAbas = useMemo(
    () =>
      categorias.map((cat) =>
        typeof cat === "string" ? { valor: cat, rotulo: cat } : cat
      ),
    [categorias]
  );

  const hojeISO = new Date().toLocaleDateString("sv-SE");

  const visiveis = useMemo(() => {
    const termo = normalizarTexto(busca);
    const catAlvo = normalizarTexto(categoriaAtiva);

    return eventosDeExemplo.filter((item) => {
      const catItem = normalizarTexto(item.categoria);
      const bateCategoria =
        catAlvo === "todos" ||
        catItem === catAlvo ||
        catAlvo.startsWith(catItem) ||
        catItem.startsWith(catAlvo);

      if (!bateCategoria) return false;
      if (!termo) return true;

      return normalizarTexto(
        `${item.titulo} ${item.descricao} ${item.local} ${item.categoria}`
      ).includes(termo);
    });
  }, [eventosDeExemplo, categoriaAtiva, busca]);

  return (
    <section className="eventos-lista-painel" aria-label="Lista de eventos">
      <div className="eventos-abas-faixa">
        <Abas
          className="eventos-categoria-abas"
          tamanho="compacto"
          itens={itensAbas}
          valor={categoriaAtiva}
          aoMudar={definirCategoria}
        />
      </div>

      <div className="eventos-lista-ferramentas">
        <Input
          tipo="busca"
          classeName="eventos-busca"
          placeholder="Buscar evento"
          valor={busca}
          aoAlterar={(e) => definirBusca(e.target.value)}
          icone={<img src={iconeBusca} alt="" />}
          tamanhoDoIcone="19px"
        />

        <button
          type="button"
          className="eventos-principal-botao"
          onClick={aoCriarEvento}
        >
          Novo evento
        </button>
      </div>

      <ConteudoAba chave={categoriaAtiva} className="eventos-lista-wrap">
        <div className="eventos-lista">
          {!visiveis.length ? (
            <p className="eventos-vazio">Nenhum evento encontrado.</p>
          ) : (
            visiveis.map((evento) => {
              const situacao = evento.oculto
                ? "Oculto"
                : evento.data < hojeISO
                  ? "Encerrado"
                  : "Em breve";

              return (
                <article
                  className={`eventos-lista-item${
                    evento.oculto ? " eventos-lista-item--oculto" : ""
                  }`}
                  key={evento.id}
                >
                  <div className="eventos-lista-foto" aria-hidden="true">
                    {evento.imagem ? (
                      <img
                        src={evento.imagem}
                        alt=""
                        className="eventos-lista-foto-img"
                      />
                    ) : (
                      <CapaEstaticaEvento categoria={evento.categoria} />
                    )}
                  </div>

                  <div className="eventos-lista-descricao">
                    <span className="eventos-categoria-rotulo">
                      {evento.categoria}
                    </span>
                    <h2>{evento.titulo}</h2>
                    <p>{evento.descricao}</p>
                  </div>

                  <div className="eventos-lista-detalhes">
                    <span>
                      <img src={iconeCalendarioDaLista} alt="" />
                      <span>{formatarDataCard(evento.data)}</span>
                    </span>
                    <span>
                      <img src={iconeRelogio} alt="" />
                      <span>
                        {evento.horaInicio}
                        {evento.horaFim ? ` - ${evento.horaFim}` : ""}
                      </span>
                    </span>
                    <span className="eventos-local">
                      <img src={iconeLocalDoEvento} alt="" />
                      <span>{evento.local}</span>
                    </span>
                  </div>

                  <span
                    className={`eventos-situacao${
                      evento.oculto ? " eventos-situacao--oculto" : ""
                    }`}
                  >
                    {situacao}
                  </span>

                  <div className="eventos-lista-acoes">
                    <button
                      type="button"
                      className="eventos-acao-botao"
                      onClick={() => aoOcultar(evento)}
                    >
                      <img src={iconeOcultarEvento} alt="" />
                      <span>{evento.oculto ? "Exibir" : "Ocultar"}</span>
                    </button>
                    <button
                      type="button"
                      className="eventos-acao-botao"
                      onClick={() => aoReenviar(evento)}
                    >
                      <img src={iconeReenviarEvento} alt="" />
                      <span>Reenviar</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="eventos-editar-botao"
                    aria-label={`Editar ${evento.titulo}`}
                    onClick={() => aoEditar(evento.id)}
                  >
                    <img
                      className="eventos-item-seta"
                      src={iconeSetaDireita}
                      alt=""
                    />
                  </button>
                </article>
              );
            })
          )}
        </div>
      </ConteudoAba>
    </section>
  );
}

export default CardListaEventos;