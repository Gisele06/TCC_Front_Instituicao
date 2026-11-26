import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import TituloSecao from "../../components/Gerais/Cabecalho/TituloSecao/TituloSecao.jsx";
import Abas, { ConteudoAba } from "../../components/Gerais/Abas/Abas.jsx";
import CardCursos from "../../components/Academico/CardCursos/CardCursos.jsx";
import CardCronograma from "../../components/Academico/CardCronograma/CardCronograma.jsx";
import CardListaAcademica from "../../components/Academico/CardListaAcademica/CardListaAcademica.jsx";
import CardFuncionarios from "../../components/Academico/CardFuncionarios/CardFuncionarios.jsx";
import Resumo from "../../components/Academico/Resumo/Resumo.jsx";
import EditorSala from "../../components/Academico/EditorSala/EditorSala.jsx";
import EditorTurma from "../../components/Academico/EditorTurma/EditorTurma.jsx";
import EditorMateria from "../../components/Academico/EditorMateria/EditorMateria.jsx";
import EditorCurso from "../../components/Academico/EditorCurso/EditorCurso.jsx";
import EditorFuncionario from "../../components/Academico/EditorFuncionario/EditorFuncionario.jsx";
import ModalCodigoTurma from "../../components/Academico/ModalCodigoTurma/ModalCodigoTurma.jsx";

import {
  obterFuncionarios,
  cadastrarFuncionario,
  atualizarFuncionario,
  excluirFuncionario,
} from "../../js/Rotas_ACADEMICO/funcionarios.js";
import {
  filtrarItens,
  textoNormalizado,
} from "../../js/Rotas_ACADEMICO/gerenciamento.js";
import {
  obterSalasIniciais,
  obterMateriasIniciais,
  obterTurmasIniciais,
  obterCursosDisponiveis,
  cadastrarSala,
  atualizarSala,
  excluirSala,
  cadastrarTurma,
  atualizarTurma,
  excluirTurma,
  cadastrarMateria,
  atualizarMateria,
  excluirMateria,
  cadastrarCurso,
  atualizarCurso,
  excluirCurso,
} from "../../js/Rotas_ACADEMICO/rotas_ACADEMICO.js";
import "./Salas.css";

function IconeAbaSalas() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="13" rx="2.5" />
      <path d="m7 12.5 3-3 2.5 2 4.5-4.5" />
      <line x1="6" y1="20" x2="18" y2="20" />
    </svg>
  );
}

function IconeAbaTurmas() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="9" cy="8" r="3" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" />
      <circle cx="17" cy="9" r="2.3" />
      <path d="M16.5 14.3c2.2.3 4 1.9 4 4.7" />
    </svg>
  );
}

function IconeAbaMaterias() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
      <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H19" />
      <line x1="9" y1="8" x2="15" y2="8" />
    </svg>
  );
}

function IconeAbaCursos() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    </svg>
  );
}

function IconeAbaFuncionarios() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="7.5" r="4" />
      <path d="M4.5 19.5c0-3.6 3.36-6 7.5-6s7.5 2.4 7.5 6a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5Z" />
    </svg>
  );
}

const ABAS_ACADEMICO = [
  { valor: "salas", rotulo: "Salas", icone: <IconeAbaSalas /> },
  { valor: "turmas", rotulo: "Turmas", icone: <IconeAbaTurmas /> },
  { valor: "materias", rotulo: "Matérias", icone: <IconeAbaMaterias /> },
  { valor: "cursos", rotulo: "Cursos", icone: <IconeAbaCursos /> },
  {
    valor: "funcionarios",
    rotulo: "Funcionários",
    icone: <IconeAbaFuncionarios />,
  },
];

function Salas() {
  const [parametros] = useSearchParams();
  const [turmaCodigoModal, definirTurmaCodigoModal] = useState(null);
  const [secao, definirSecao] = useState(
    parametros.get("novo") === "turmas" ? "turmas" : "salas",
  );
  const [filtro, definirFiltro] = useState("todas");
  const [busca, definirBusca] = useState("");
  const [editor, definirEditor] = useState(
    parametros.get("novo") === "turmas" ? { secao: "turmas" } : null,
  );
  const [funcionarios, definirFuncionarios] = useState(() =>
    obterFuncionarios(),
  );

  const salas = obterSalasIniciais();
  const turmas = obterTurmasIniciais();
  const materias = obterMateriasIniciais();
  const cursos = obterCursosDisponiveis();

  const itemSala =
    editor?.secao === "salas"
      ? salas.find((item) => item.id === editor.id)
      : undefined;
  const itemTurma =
    editor?.secao === "turmas"
      ? turmas.find((item) => item.id === editor.id)
      : undefined;
  const itemMateria =
    editor?.secao === "materias"
      ? materias.find((item) => item.id === editor.id)
      : undefined;
  const itemCurso =
    editor?.secao === "cursos"
      ? cursos.find((item) => item.id === editor.id)
      : undefined;
  const itemFuncionario =
    editor?.secao === "funcionarios"
      ? funcionarios.find((item) => item.id === editor.id)
      : undefined;

  const salasFiltradas = useMemo(
    () =>
      filtrarItens(salas, busca, filtro, (item) => [
        item.nome,
        item.descricao,
        item.tipo,
      ]),
    [salas, busca, filtro],
  );

  const turmasFiltradas = useMemo(
    () =>
      filtrarItens(turmas, busca, filtro, (item) => [
        item.nome,
        item.descricao,
      ]),
    [turmas, busca, filtro],
  );

  const materiasFiltradas = useMemo(
    () =>
      filtrarItens(materias, busca, filtro, (item) => [
        item.nome,
        item.sigla,
        item.descricao,
      ]),
    [materias, busca, filtro],
  );

  const cursosFiltrados = useMemo(() => {
    const termo = textoNormalizado(busca);
    if (!termo) return cursos;
    return cursos.filter((curso) =>
      textoNormalizado(curso.nome).includes(termo),
    );
  }, [cursos, busca]);

  const funcionariosFiltrados = useMemo(
    () =>
      filtrarItens(funcionarios, busca, filtro, (item) => [
        item.nome,
        item.email,
        item.cargo,
      ]),
    [funcionarios, busca, filtro],
  );

  function mudarSecao(novaSecao) {
    definirSecao(novaSecao);
    definirFiltro("todas");
    definirBusca("");
  }

  function salvarSala(sala) {
    try {
      if (salas.some((item) => item.id === sala.id)) {
        atualizarSala(sala.id, sala);
      } else {
        cadastrarSala(sala);
      }
      definirEditor(null);
    } catch (e) {
      window.alert(e.message);
    }
  }

  function salvarTurma(turma) {
    try {
      if (turmas.some((item) => item.id === turma.id)) {
        atualizarTurma(turma.id, turma);
      } else {
        cadastrarTurma(turma);
      }
      definirEditor(null);
    } catch (e) {
      window.alert(e.message);
    }
  }

  function salvarMateria(materia) {
    try {
      if (materias.some((item) => item.id === materia.id)) {
        atualizarMateria(materia.id, materia);
      } else {
        cadastrarMateria(materia);
      }
      definirEditor(null);
    } catch (e) {
      window.alert(e.message);
    }
  }

  function salvarCurso(curso) {
    try {
      if (curso.id && cursos.some((item) => item.id === curso.id)) {
        atualizarCurso(curso.id, { nome: curso.nome });
      } else {
        cadastrarCurso({ nome: curso.nome });
      }
      definirEditor(null);
    } catch (e) {
      window.alert(e.message);
    }
  }

  function salvarFuncionario(dados) {
    const proximaLista = dados.id
      ? atualizarFuncionario(dados.id, dados)
      : cadastrarFuncionario(dados);
    definirFuncionarios(proximaLista);
    definirEditor(null);
  }

  function alternarStatusSala(id) {
    const alvo = salas.find((item) => item.id === id);
    if (!alvo) return;
    atualizarSala(id, { ativa: !alvo.ativa });
  }

  function alternarStatusTurma(id) {
    const alvo = turmas.find((item) => item.id === id);
    if (!alvo) return;
    atualizarTurma(id, { ativa: !alvo.ativa });
  }

  function alternarStatusMateria(id) {
    const alvo = materias.find((item) => item.id === id);
    if (!alvo) return;
    atualizarMateria(id, { ativa: !alvo.ativa });
  }

  function alternarStatusFuncionario(id) {
    const alvo = funcionarios.find((item) => item.id === id);
    if (!alvo) return;
    definirFuncionarios(atualizarFuncionario(id, { ativa: !alvo.ativa }));
  }

  function removerFuncionario(id) {
    if (!window.confirm("Excluir este funcionário definitivamente?")) return;
    definirFuncionarios(excluirFuncionario(id));
    definirEditor(null);
  }

  function excluirRegistro(id) {
    if (!window.confirm("Excluir este registro definitivamente?")) return;
    try {
      if (secao === "salas") excluirSala(id);
      else if (secao === "turmas") excluirTurma(id);
      else if (secao === "materias") excluirMateria(id);
      else if (secao === "cursos") excluirCurso(id);
      else definirFuncionarios(excluirFuncionario(id));
      definirEditor(null);
    } catch (e) {
      window.alert(e.message);
    }
  }

  const quantidadeTotal =
    secao === "salas"
      ? salas.length
      : secao === "turmas"
        ? turmas.length
        : secao === "materias"
          ? materias.length
          : secao === "cursos"
            ? cursos.length
            : funcionarios.length;

  const quantidadeAtivas =
    secao === "salas"
      ? salas.filter((item) => item.ativa).length
      : secao === "turmas"
        ? turmas.filter((item) => item.ativa).length
        : secao === "materias"
          ? materias.filter((item) => item.ativa).length
          : funcionarios.filter((item) => item.ativa).length;

  const quantidadeInativas = quantidadeTotal - quantidadeAtivas;

  const cursosComTurmas = cursos.filter((curso) =>
    turmas.some((turma) => turma.cursoId === curso.id),
  ).length;
  const cursosComMaterias = cursos.filter((curso) =>
    materias.some((materia) => materia.cursos?.includes(curso.id)),
  ).length;

  const rotuloEntidade =
    secao === "salas"
      ? "sala"
      : secao === "turmas"
        ? "turma"
        : secao === "materias"
          ? "matéria"
          : secao === "cursos"
            ? "curso"
            : "funcionário";

  const rotuloPlural =
    secao === "salas"
      ? "salas"
      : secao === "turmas"
        ? "turmas"
        : secao === "materias"
          ? "matérias"
          : secao === "cursos"
            ? "cursos"
            : "funcionários";

  const mostrarCronograma = secao === "salas" || secao === "turmas";

  return (
    <main className="academico-pagina" aria-label="Gerenciamento acadêmico">
      <ConteudoAba
        chave={
          editor ? `editor-${editor.secao}-${editor.id || "novo"}` : "lista"
        }
        className="academico-visao-raiz"
      >
        {editor ? (
          <div className="academico-editor-container">
            {editor.secao === "salas" && (
              <EditorSala
                existente={itemSala}
                aoVoltar={() => definirEditor(null)}
                aoSalvar={salvarSala}
              />
            )}
            {editor.secao === "turmas" && (
              <EditorTurma
                existente={itemTurma}
                salas={salas.filter((item) => item.ativa)}
                materias={materias.filter((item) => item.ativa)}
                aoVoltar={() => definirEditor(null)}
                aoSalvar={salvarTurma}
              />
            )}
            {editor.secao === "materias" && (
              <EditorMateria
                existente={itemMateria}
                aoVoltar={() => definirEditor(null)}
                aoSalvar={salvarMateria}
                aoExcluir={
                  itemMateria
                    ? () => excluirRegistro(itemMateria.id)
                    : undefined
                }
              />
            )}
            {editor.secao === "cursos" && (
              <EditorCurso
                existente={itemCurso}
                aoVoltar={() => definirEditor(null)}
                aoSalvar={salvarCurso}
                aoExcluir={
                  itemCurso ? () => excluirRegistro(itemCurso.id) : undefined
                }
              />
            )}
            {editor.secao === "funcionarios" && (
              <EditorFuncionario
                existente={itemFuncionario}
                aoVoltar={() => definirEditor(null)}
                aoSalvar={salvarFuncionario}
                aoExcluir={
                  itemFuncionario
                    ? () => removerFuncionario(itemFuncionario.id)
                    : undefined
                }
              />
            )}
          </div>
        ) : (
          <div className="academico-gerenciamento-container">
            <TituloSecao
              titulo="Gerenciamento"
              subtitulo="Organize as salas, turmas, matérias, cursos e funcionários."
            />

            <div className="academico-abas-faixa">
              <Abas
                className="academico-abas"
                itens={ABAS_ACADEMICO}
                valor={secao}
                aoMudar={mudarSecao}
              />
            </div>

            <ConteudoAba chave={secao} className="academico-secao-conteudo">
              <div className="academico-secao-bloco">
                <section
                  className="academico-resumos"
                  aria-label={`Resumo de ${rotuloPlural}`}
                >
                  {secao === "funcionarios" ? (
                    <>
                      <Resumo
                        valor={String(funcionarios.length)}
                        rotulo="Cadastrados"
                        icone="grafico"
                      />
                      <Resumo
                        valor={String(quantidadeAtivas)}
                        rotulo="Ativos"
                        icone="pessoas"
                      />
                      <Resumo
                        valor={String(quantidadeInativas)}
                        rotulo="Inativos"
                        icone="pausado"
                      />
                    </>
                  ) : secao === "cursos" ? (
                    <>
                      <Resumo
                        valor={String(cursos.length)}
                        rotulo="Cadastrados"
                        icone="grafico"
                      />
                      <Resumo
                        valor={String(cursosComTurmas)}
                        rotulo="Com turmas"
                        icone="pessoas"
                      />
                      <Resumo
                        valor={String(cursosComMaterias)}
                        rotulo="Com matérias"
                        icone="pausado"
                      />
                    </>
                  ) : (
                    <>
                      <Resumo
                        valor={String(quantidadeTotal)}
                        rotulo="Cadastradas"
                        icone="grafico"
                      />
                      <Resumo
                        valor={String(quantidadeAtivas)}
                        rotulo="Ativas"
                        icone="pessoas"
                      />
                      <Resumo
                        valor={String(quantidadeInativas)}
                        rotulo="Inativas"
                        icone="pausado"
                      />
                    </>
                  )}
                </section>

                <div
                  className={`academico-layout${
                    !mostrarCronograma ? " academico-layout-sem-cronograma" : ""
                  }`}
                >
                  {secao === "funcionarios" ? (
                    <CardFuncionarios
                      funcionarios={funcionariosFiltrados}
                      filtro={filtro}
                      definirFiltro={definirFiltro}
                      busca={busca}
                      definirBusca={definirBusca}
                      definirEditor={definirEditor}
                      alternarStatusFuncionario={alternarStatusFuncionario}
                    />
                  ) : secao === "cursos" ? (
                    <CardCursos
                      cursos={cursosFiltrados}
                      materias={materias}
                      turmas={turmas}
                      busca={busca}
                      definirBusca={definirBusca}
                      definirEditor={definirEditor}
                    />
                  ) : (
                    <CardListaAcademica
                      excluirRegistro={excluirRegistro}
                      secao={secao}
                      filtro={filtro}
                      definirFiltro={definirFiltro}
                      busca={busca}
                      definirBusca={definirBusca}
                      rotuloEntidade={rotuloEntidade}
                      rotuloPlural={rotuloPlural}
                      definirEditor={definirEditor}
                      salasFiltradas={salasFiltradas}
                      turmasFiltradas={turmasFiltradas}
                      materiasFiltradas={materiasFiltradas}
                      salas={salas}
                      materias={materias}
                      alternarStatusSala={alternarStatusSala}
                      alternarStatusTurma={alternarStatusTurma}
                      alternarStatusMateria={alternarStatusMateria}
                      aoGerarCodigoTurma={definirTurmaCodigoModal}
                    />
                  )}

                  {mostrarCronograma && (
                    <CardCronograma
                      turmas={turmas}
                      salas={salas}
                      materias={materias}
                    />
                  )}
                </div>
              </div>
            </ConteudoAba>
          </div>
        )}
      </ConteudoAba>

      <ModalCodigoTurma
        turma={turmaCodigoModal}
        aoFechar={() => definirTurmaCodigoModal(null)}
      />
    </main>
  );
}

export default Salas;
