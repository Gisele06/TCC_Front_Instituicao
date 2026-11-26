import Abas, { ConteudoAba } from "../../Gerais/Abas/Abas.jsx";
import Input from "../../Gerais/Input/Input.jsx";
import { nomeDoCurso } from "../../../js/Rotas_ACADEMICO/gerenciamento.js";
import { IconeSala } from "../IconesSala/IconesSala.jsx";
import iconeBusca from "../../../img/icones/busca.png";
import iconePessoas from "../../../img/icones/pessoas.png";
import iconeSetaDireita from "../../../img/icones/setaDireita.png";
import "./CardListaAcademica.css";

const OPCOES_FILTRO = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "ativas", rotulo: "Ativas" },
  { valor: "inativas", rotulo: "Inativas" },
];

function IconeLixeira() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    </svg>
  );
}

function CardListaAcademica({
  excluirRegistro,
  secao,
  filtro,
  definirFiltro,
  busca,
  definirBusca,
  rotuloEntidade,
  rotuloPlural,
  definirEditor,
  salasFiltradas = [],
  turmasFiltradas = [],
  materiasFiltradas = [],
  salas = [],
  materias = [],
  alternarStatusSala,
  alternarStatusTurma,
  alternarStatusMateria,
  aoGerarCodigoTurma,
}) {
  const rotuloBotaoNovo =
    secao === "salas"
      ? "Nova Sala"
      : secao === "turmas"
        ? "Nova Turma"
        : "Nova Matéria";

  const listaVazia =
    (secao === "salas" && salasFiltradas.length === 0) ||
    (secao === "turmas" && turmasFiltradas.length === 0) ||
    (secao === "materias" && materiasFiltradas.length === 0);

  return (
    <section
      className="academico-lista-painel"
      aria-label={`Lista de ${rotuloPlural}`}
    >
      <div className="academico-controles">
        <div className="academico-filtros-faixa">
          <Abas
            className="academico-filtros-abas"
            tamanho="compacto"
            itens={OPCOES_FILTRO}
            valor={filtro}
            aoMudar={definirFiltro}
          />
        </div>

        <div className="academico-busca-linha">
          <Input
            tipo="busca"
            classeName="academico-busca"
            valor={busca}
            aoAlterar={(evento) => definirBusca(evento.target.value)}
            placeholder={`Buscar ${rotuloEntidade}`}
            aria-label={`Buscar ${rotuloEntidade}`}
            icone={<img src={iconeBusca} alt="" />}
            tamanhoDoIcone="19px"
          />

          <button
            type="button"
            className="academico-botao-principal academico-botao-novo"
            onClick={() => definirEditor({ secao })}
          >
            {rotuloBotaoNovo}
          </button>
        </div>
      </div>

      <ConteudoAba chave={`${secao}-${filtro}`} className="academico-lista-wrap">
        <div className="academico-lista">
          {secao === "salas" &&
            salasFiltradas.map((sala) => (
              <article
                className={`academico-item${
                  sala.ativa ? "" : " academico-item--inativo"
                }`}
                key={sala.id}
              >
                <button
                  className="academico-item-principal"
                  type="button"
                  onClick={() => definirEditor({ secao, id: sala.id })}
                  aria-label={`Editar sala ${sala.nome}`}
                >
                  <span className="academico-item-icone">
                    <IconeSala id={sala.icone} />
                  </span>
                  <span className="academico-item-informacoes">
                    <strong>{sala.nome}</strong>
                    <span>
                      {sala.tipo} · Capacidade: {sala.capacidade}
                    </span>
                    {sala.descricao && <small>{sala.descricao}</small>}
                  </span>
                </button>

                <span
                  className={`academico-status${sala.ativa ? "" : " inativo"}`}
                >
                  {sala.ativa ? "Ativa" : "Inativa"}
                </span>

                <div className="academico-item-acoes">
                  <button
                    type="button"
                    className="academico-botao-status"
                    onClick={() => alternarStatusSala(sala.id)}
                    aria-label={`${
                      sala.ativa ? "Desativar" : "Ativar"
                    } sala ${sala.nome}`}
                  >
                    {sala.ativa ? "Desativar" : "Ativar"}
                  </button>

                  <button
                    type="button"
                    className="academico-botao-excluir"
                    onClick={() => excluirRegistro(sala.id)}
                    aria-label={`Excluir sala ${sala.nome}`}
                    title="Excluir"
                  >
                    <IconeLixeira />
                  </button>
                </div>

                <button
                  className="academico-seta"
                  type="button"
                  onClick={() => definirEditor({ secao, id: sala.id })}
                  aria-label={`Abrir ${sala.nome}`}
                >
                  <img src={iconeSetaDireita} alt="" />
                </button>
              </article>
            ))}

          {secao === "turmas" &&
            turmasFiltradas.map((turma) => {
              const horario = turma.horarios?.[0];
              const sala = salas.find((item) => item.id === horario?.salaId);
              const materia = materias.find(
                (item) => item.id === horario?.materiaId,
              );

              return (
                <article
                  className={`academico-item${
                    turma.ativa ? "" : " academico-item--inativo"
                  }`}
                  key={turma.id}
                >
                  <button
                    className="academico-item-principal"
                    type="button"
                    onClick={() => definirEditor({ secao, id: turma.id })}
                    aria-label={`Editar turma ${turma.nome}`}
                  >
                    <span className="academico-item-icone">
                      <img src={iconePessoas} alt="" />
                    </span>
                    <span className="academico-item-informacoes">
                      <strong>{turma.nome}</strong>
                      <span>
                        {materia?.nome ?? "Sem matéria"} ·{" "}
                        {sala?.nome ?? "Sem sala"}
                      </span>
                      <small>
                        {turma.inicio}–{turma.fim} ·{" "}
                        {turma.descricao || "Sem descrição"}
                      </small>
                    </span>
                  </button>

                  <span
                    className={`academico-status${
                      turma.ativa ? "" : " inativo"
                    }`}
                  >
                    {turma.ativa ? "Ativa" : "Inativa"}
                  </span>

                  <div className="academico-item-acoes">
                    <button
                      type="button"
                      className="academico-botao-codigo"
                      disabled={!turma.ativa}
                      title={
                        turma.ativa
                          ? "Gerar código de convite da turma"
                          : "Ative a turma para gerar um código de convite"
                      }
                      onClick={() => aoGerarCodigoTurma?.(turma)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <circle cx="8" cy="12" r="3.5" />
                        <path d="M11.5 12H21" />
                        <path d="M18 12v3" />
                        <path d="M15 12v2.2" />
                      </svg>
                      <span>Código</span>
                    </button>

                    <button
                      type="button"
                      className="academico-botao-status"
                      onClick={() => alternarStatusTurma(turma.id)}
                      aria-label={`${
                        turma.ativa ? "Desativar" : "Ativar"
                      } turma ${turma.nome}`}
                    >
                      {turma.ativa ? "Desativar" : "Ativar"}
                    </button>

                    <button
                      type="button"
                      className="academico-botao-excluir"
                      onClick={() => excluirRegistro(turma.id)}
                      aria-label={`Excluir turma ${turma.nome}`}
                      title="Excluir"
                    >
                      <IconeLixeira />
                    </button>
                  </div>

                  <button
                    className="academico-seta"
                    type="button"
                    onClick={() => definirEditor({ secao, id: turma.id })}
                    aria-label={`Abrir ${turma.nome}`}
                  >
                    <img src={iconeSetaDireita} alt="" />
                  </button>
                </article>
              );
            })}

          {secao === "materias" &&
            materiasFiltradas.map((materia) => (
              <article
                className={`academico-item academico-item-materia${
                  materia.ativa ? "" : " academico-item--inativo"
                }`}
                key={materia.id}
              >
                <button
                  className="academico-item-principal"
                  type="button"
                  onClick={() => definirEditor({ secao, id: materia.id })}
                  aria-label={`Editar matéria ${materia.nome}`}
                >
                  <span className="academico-item-icone">
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M4.5 4A2.5 2.5 0 0 0 2 6.5v9A2.5 2.5 0 0 0 4.5 18h15a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 19.5 4h-15Zm3 8.8 3.2-3.2a1 1 0 0 1 1.37-.04l1.9 1.7 3.3-3.5a1 1 0 1 1 1.46 1.36l-3.98 4.22a1 1 0 0 1-1.4.06l-1.91-1.7-2.52 2.52a1 1 0 1 1-1.42-1.42ZM5 19.8h14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2Z" />
                    </svg>
                  </span>
                  <span className="academico-item-informacoes">
                    <strong>{materia.nome}</strong>
                    {materia.sigla && <span>{materia.sigla}</span>}
                    <small>{materia.descricao || "Sem descrição"}</small>
                  </span>
                </button>

                <div className="academico-cursos-resumo">
                  <strong>Cursos</strong>
                  <div className="academico-cursos-tags">
                    {materia.cursos?.length ? (
                      materia.cursos.map((cursoId) => (
                        <span key={cursoId} className="academico-curso-tag">
                          {nomeDoCurso(cursoId)}
                        </span>
                      ))
                    ) : (
                      <span className="academico-curso-tag academico-curso-tag--vazio">
                        Nenhum curso
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  className={`academico-status academico-status--clicavel${
                    materia.ativa ? "" : " inativo"
                  }`}
                  onClick={() => alternarStatusMateria(materia.id)}
                  title={
                    materia.ativa
                      ? "Clique para desativar"
                      : "Clique para ativar"
                  }
                  aria-label={`${
                    materia.ativa ? "Desativar" : "Ativar"
                  } matéria ${materia.nome}`}
                >
                  {materia.ativa ? "Ativa" : "Inativa"}
                </button>

                <button
                  className="academico-seta"
                  type="button"
                  onClick={() => definirEditor({ secao, id: materia.id })}
                  aria-label={`Abrir ${materia.nome}`}
                >
                  <img src={iconeSetaDireita} alt="" />
                </button>
              </article>
            ))}

          {listaVazia && (
            <div className="academico-lista-vazia">
              <strong>Nenhum resultado encontrado</strong>
              <span>Altere a busca ou o filtro para ver outros registros.</span>
            </div>
          )}
        </div>
      </ConteudoAba>
    </section>
  );
}

export default CardListaAcademica;