import { useMemo, useState } from "react";
import Abas, { ConteudoAba } from "../../Gerais/Abas/Abas.jsx";
import Input from "../../Gerais/Input/Input.jsx";
import { formatarData } from "../../../js/Gerais/calendario.js";
import iconeCalendarioDaLista from "../../../img/icones/calendario-evento.png";
import iconeRelogio from "../../../img/icones/relogio-evento.png";
import iconeOcultar from "../../../img/icones/ocultar-evento.png";
import iconeReenviar from "../../../img/icones/reenviar-evento.png";
import iconeSetaDireita from "../../../img/icones/setaDireita.png";
import iconeBusca from "../../../img/icones/busca.png";
import "./CardListaComunicados.css";

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

function CardListaComunicados({
  aoEditar,
  aoOcultar,
  aoReenviar,
  categorias,
  aoCriarComunicado,
  comunicadosDeExemplo,
}) {
  const [categoriaAtiva, definirCategoria] = useState("Todos");
  const [busca, definirBusca] = useState("");

  const itensAbas = useMemo(
    () =>
      categorias.map((cat) =>
        typeof cat === "string" ? { valor: cat, rotulo: cat } : cat,
      ),
    [categorias],
  );

  const hojeISO = new Date().toLocaleDateString("sv-SE");

  const visiveis = useMemo(() => {
    const termo = normalizarTexto(busca);
    const catAlvo = normalizarTexto(categoriaAtiva);

    return comunicadosDeExemplo.filter((item) => {
      const catItem = normalizarTexto(item.categoria);
      const bateCategoria =
        catAlvo === "todos" ||
        catItem === catAlvo ||
        catAlvo.startsWith(catItem) ||
        catItem.startsWith(catAlvo);

      if (!bateCategoria) return false;
      if (!termo) return true;

      return normalizarTexto(
        `${item.titulo} ${item.descricao} ${item.categoria}`,
      ).includes(termo);
    });
  }, [comunicadosDeExemplo, categoriaAtiva, busca]);

  return (
    <section
      className="comunicados-lista-painel"
      aria-label="Lista de comunicados"
    >
      <div className="comunicados-abas-faixa">
        <Abas
          className="comunicados-categoria-abas"
          tamanho="compacto"
          itens={itensAbas}
          valor={categoriaAtiva}
          aoMudar={definirCategoria}
        />
      </div>

      <div className="comunicados-lista-ferramentas">
        <Input
          tipo="busca"
          classeName="comunicados-busca"
          placeholder="Buscar comunicado"
          valor={busca}
          aoAlterar={(e) => definirBusca(e.target.value)}
          icone={<img src={iconeBusca} alt="" />}
          tamanhoDoIcone="19px"
        />

        <button
          type="button"
          className="comunicados-principal-botao"
          onClick={aoCriarComunicado}
        >
          Novo comunicado
        </button>
      </div>

      <ConteudoAba chave={categoriaAtiva} className="comunicados-lista-wrap">
        <div className="comunicados-lista">
          {!visiveis.length ? (
            <p className="comunicados-vazio">Nenhum comunicado encontrado.</p>
          ) : (
            visiveis.map((comunicado) => {
              const situacao = comunicado.oculto
                ? "Oculto"
                : comunicado.data < hojeISO
                  ? "Encerrado"
                  : "Em breve";

              return (
                <article
                  className={`comunicados-lista-item${
                    comunicado.oculto ? " comunicados-lista-item--oculto" : ""
                  }`}
                  key={comunicado.id}
                >
                  <div
                    className={`comunicados-lista-icone${
                      comunicado.imagem
                        ? " comunicados-lista-icone--com-foto"
                        : ""
                    }`}
                    aria-hidden="true"
                  >
                    <img src={comunicado.imagem || comunicado.icone} alt="" />
                  </div>

                  <div className="comunicados-lista-descricao">
                    <span className="comunicados-categoria-rotulo">
                      {comunicado.categoria}
                    </span>
                    <h2>{comunicado.titulo}</h2>
                    <p>{comunicado.descricao}</p>
                  </div>

                  <div className="comunicados-lista-detalhes">
                    <span>
                      <img src={iconeCalendarioDaLista} alt="" />
                      <span>{formatarDataCard(comunicado.data)}</span>
                    </span>
                    <span>
                      <img src={iconeRelogio} alt="" />
                      <span>
                        {comunicado.horaInicio}
                        {comunicado.horaFim ? ` - ${comunicado.horaFim}` : ""}
                      </span>
                    </span>
                  </div>

                  <span
                    className={`comunicados-situacao${
                      comunicado.oculto ? " comunicados-situacao--oculto" : ""
                    }`}
                  >
                    {situacao}
                  </span>

                  <div className="comunicados-lista-acoes">
                    <button
                      type="button"
                      className="comunicados-acao-botao"
                      onClick={() => aoOcultar(comunicado)}
                    >
                      <img src={iconeOcultar} alt="" />
                      <span>{comunicado.oculto ? "Exibir" : "Ocultar"}</span>
                    </button>
                    <button
                      type="button"
                      className="comunicados-acao-botao"
                      onClick={() => aoReenviar(comunicado)}
                    >
                      <img src={iconeReenviar} alt="" />
                      <span>Reenviar</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="comunicados-editar-botao"
                    aria-label={`Editar ${comunicado.titulo}`}
                    onClick={() => aoEditar(comunicado.id)}
                  >
                    <img
                      className="comunicados-item-seta"
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

export default CardListaComunicados;