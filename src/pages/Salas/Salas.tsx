import { fonteDisponivel } from "../../services/recursos";
import { useEffect, useMemo, useState } from "react";
import EstruturaInstitucional from "../../components/Geral/InstitutionFrame/InstitutionFrame";
import { ambiente } from "../../config/ambiente";
import { idObrigatorio } from "../../services/recursos";
import type { SecaoAcademica, FiltroStatus, EditorAtual, Sala, Turma, Materia, PropriedadesSalas } from "./types";
import { carregarAcademico, gravarSala, gravarTurma, gravarMateria, type CursoOpcao } from "./data/academico";
import type { TipoSalaRegistro } from "../../types/banco";
import { filtrarItens, atualizarLista, nomeDoCurso, iconeDeSala } from "./utils";
import EditorSala from "./components/EditorSala";
import EditorTurma from "./components/EditorTurma";
import EditorMateria from "./components/EditorMateria";
import { Resumo, SetaDireita, IconePorta } from "./components/ElementosAcademicos";
import iconeBusca from "../../assets/icons/Geral/busca.png";
import iconePessoas from "../../assets/icons/Geral/pessoas.png";
import iconeSala from "../../assets/icons/Salas/lousa-grafico.png";
import iconeLivro from "../../assets/icons/Geral/materia.png";
import "./Salas.css";

function Salas({ aoNavegar }: PropriedadesSalas) {
  const [secao, definirSecao] = useState<SecaoAcademica>("salas");
  const [filtro, definirFiltro] = useState<FiltroStatus>("todas");
  const [busca, definirBusca] = useState("");
  const [editor, definirEditor] = useState<EditorAtual | null>(null);
  const [salas, definirSalas] = useState<Sala[]>([]);
  const [turmas, definirTurmas] = useState<Turma[]>([]);
  const [materias, definirMaterias] = useState<Materia[]>([]);
  const [cursos, definirCursos] = useState<CursoOpcao[]>([]);
  const [tiposSala, definirTiposSala] = useState<TipoSalaRegistro[]>([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState("");

  useEffect(() => {
    let ativo = true;
    carregarAcademico()
      .then((dados) => {
        if (!ativo) return;
        definirSalas(dados.salas);
        definirTurmas(dados.turmas);
        definirMaterias(dados.materias);
        definirCursos(dados.cursos);
        definirTiposSala(dados.tiposSala);
      })
      .catch((falha: unknown) => {
        if (ativo) definirErro(falha instanceof Error ? falha.message : "Erro ao carregar gerenciamento.");
      })
      .finally(() => { if (ativo) definirCarregando(false); });
    return () => { ativo = false; };
  }, []);

  const itemSala = editor?.secao === "salas" ? salas.find((item) => item.id === editor.id) : undefined;
  const itemTurma = editor?.secao === "turmas" ? turmas.find((item) => item.id === editor.id) : undefined;
  const itemMateria = editor?.secao === "materias" ? materias.find((item) => item.id === editor.id) : undefined;

  const salasFiltradas = useMemo(
    () => filtrarItens(salas, busca, filtro, (item) => [item.nome, item.descricao, item.tipo]),
    [salas, busca, filtro],
  );
  const turmasFiltradas = useMemo(
    () => filtrarItens(turmas, busca, filtro, (item) => [item.nome, item.descricao]),
    [turmas, busca, filtro],
  );
  const materiasFiltradas = useMemo(
    () => filtrarItens(materias, busca, filtro, (item) => [item.nome, item.sigla, item.descricao]),
    [materias, busca, filtro],
  );

  function mudarSecao(novaSecao: SecaoAcademica) {
    definirSecao(novaSecao);
    definirFiltro("todas");
    definirBusca("");
  }

  // IDs novos são criados pelo banco; o frontend só usa o ID recebido da API.
  function idParaEdicao(id: string) {
    return /^\\d+$/.test(id) ? Number(id) : undefined;
  }

  async function salvarSala(sala: Sala) {
    definirErro("");
    try {
      const resposta = await gravarSala({
        nome: sala.nome,
        capacidade: sala.capacidade,
        descricao: sala.descricao || null,
        id_icone: sala.idIcone ?? null, // Preserva o ícone atual até mapear o seletor com tbl_icone.
        id_instituicao: idObrigatorio(ambiente.idInstituicao, "ID da instituição"),
        id_tipo_sala: idObrigatorio(sala.tipoId ?? 0, "tipo de sala"),
      }, idParaEdicao(sala.id));
      definirSalas((atuais) => atualizarLista(atuais, { ...sala, id: String(resposta.id) }));
      definirEditor(null);
    } catch (falha) {
      definirErro(falha instanceof Error ? falha.message : "Não foi possível salvar a sala.");
    }
  }

  async function salvarTurma(turma: Turma) {
    definirErro("");
    if (turma.intervalos.length || turma.horarios.length) {
      definirErro("Os horários e intervalos precisam de rotas específicas no backend antes de serem salvos.");
      return;
    }
    try {
      const resposta = await gravarTurma({
        nome: turma.nome,
        descricao: turma.descricao || null,
        ativa: turma.ativa ? 1 : 0,
        horario_inicio_aulas: turma.inicio,
        horario_fim_aulas: turma.fim,
        id_curso: idObrigatorio(turma.cursoId ?? 0, "curso"),
      }, idParaEdicao(turma.id));
      definirTurmas((atuais) => atualizarLista(atuais, { ...turma, id: String(resposta.id) }));
      definirEditor(null);
    } catch (falha) {
      definirErro(falha instanceof Error ? falha.message : "Não foi possível salvar a turma.");
    }
  }

  async function salvarMateria(materia: Materia) {
    definirErro("");
    if (materia.cursos.length !== 1) {
      definirErro("Escolha exatamente um curso para a matéria, como definido no SQL.");
      return;
    }
    try {
      const resposta = await gravarMateria({
        nome: materia.nome,
        sigla: materia.sigla,
        descricao: materia.descricao || null,
        ativa: materia.ativa ? 1 : 0,
        id_curso: idObrigatorio(Number(materia.cursos[0]), "curso"),
      }, idParaEdicao(materia.id));
      definirMaterias((atuais) => atualizarLista(atuais, { ...materia, id: String(resposta.id) }));
      definirEditor(null);
    } catch (falha) {
      definirErro(falha instanceof Error ? falha.message : "Não foi possível salvar a matéria.");
    }
  }

  async function alternarStatusTurma(id: string) {
    const turma = turmas.find((item) => item.id === id);
    if (turma) await salvarTurma({ ...turma, ativa: !turma.ativa });
  }

  async function alternarStatusMateria(id: string) {
    const materia = materias.find((item) => item.id === id);
    if (materia) await salvarMateria({ ...materia, ativa: !materia.ativa });
  }

  const dadosDisponiveis = fonteDisponivel() && !erro && !carregando;
  const quantidadeTotal = secao === "salas" ? salas.length : secao === "turmas" ? turmas.length : materias.length;
  const quantidadeAtivas = secao === "salas"
    ? salas.filter((item) => item.ativa).length
    : secao === "turmas"
      ? turmas.filter((item) => item.ativa).length
      : materias.filter((item) => item.ativa).length;
  const quantidadeInativas = quantidadeTotal - quantidadeAtivas;
  const rotuloEntidade = secao === "salas" ? "sala" : secao === "turmas" ? "turma" : "matéria";
  const rotuloPlural = secao === "salas" ? "salas" : secao === "turmas" ? "turmas" : "matérias";

  return (
    <EstruturaInstitucional paginaAtiva="academico" aoNavegar={aoNavegar}>
      <main className="academico-pagina" aria-label="Gerenciamento acadêmico">
        {!fonteDisponivel() && <p role="status">Configure VITE_API_BASE_URL no modo API para consultar os dados acadêmicos.</p>}
        {carregando && <p role="status">Carregando dados acadêmicos...</p>}
        {erro && <p role="alert">{erro}</p>}
        {editor ? (
          <>
            {editor.secao === "salas" && (
              <EditorSala
                existente={itemSala}
                tiposSala={tiposSala}
                aoVoltar={() => definirEditor(null)}
                aoSalvar={salvarSala}
              />
            )}
            {editor.secao === "turmas" && (
              <EditorTurma
                existente={itemTurma}
                salas={salas.filter((item) => item.ativa)}
                materias={materias.filter((item) => item.ativa)}
                cursosDisponiveis={cursos}
                aoVoltar={() => definirEditor(null)}
                aoSalvar={salvarTurma}
              />
            )}
            {editor.secao === "materias" && (
              <EditorMateria
                existente={itemMateria}
                cursosDisponiveis={cursos}
                aoVoltar={() => definirEditor(null)}
                aoSalvar={salvarMateria}
              />
            )}
          </>
        ) : (
          <>
            <header className="academico-titulo-principal">
              <h1>Gerenciamento</h1>
              <p>Organize as salas, turmas e matérias.</p>
            </header>

            <div className="academico-abas" role="tablist" aria-label="Gerenciamento acadêmico">
              {([
                { id: "salas", rotulo: "Salas", imagem: iconeSala },
                { id: "turmas", rotulo: "Turmas", imagem: iconePessoas },
                { id: "materias", rotulo: "Matérias", imagem: iconeLivro },
              ] as const).map((aba) => (
                <button
                  key={aba.id}
                  type="button"
                  role="tab"
                  aria-selected={secao === aba.id}
                  className={secao === aba.id ? "selecionada" : ""}
                  onClick={() => mudarSecao(aba.id)}
                >
                  <img src={aba.imagem} alt="" />
                  {aba.rotulo}
                </button>
              ))}
            </div>

            <section className="academico-resumos" aria-label={"Resumo de " + rotuloPlural}>
              <Resumo valor={dadosDisponiveis ? String(quantidadeTotal) : "—"} rotulo="Cadastradas" icone="grafico" />
              <Resumo valor={secao === "salas" || !dadosDisponiveis ? "—" : String(quantidadeAtivas)} rotulo="Ativas" icone="pessoas" />
              <Resumo valor={secao === "salas" || !dadosDisponiveis ? "—" : String(quantidadeInativas)} rotulo="Inativas" icone="pausado" />
            </section>

            <div className={"academico-layout " + (secao === "materias" ? "academico-layout-materias" : "")}>
              <section className="academico-lista-painel" aria-label={"Lista de " + rotuloPlural}>
                <div className="academico-controles">
                  <div className="academico-filtros" role="group" aria-label="Filtrar por status">
                    {([
                      { id: "todas", rotulo: "Todas" },
                      { id: "ativas", rotulo: "Ativas" },
                      { id: "inativas", rotulo: "Inativas" },
                    ] as const).map((opcao) => (
                      <button
                        key={opcao.id}
                        type="button"
                        className={filtro === opcao.id ? "selecionado" : ""}
                        aria-pressed={filtro === opcao.id}
                        onClick={() => definirFiltro(opcao.id)}
                        disabled={secao === "salas" && opcao.id !== "todas"}
                        title={secao === "salas" ? "O banco não possui status de sala." : undefined}
                      >
                        {opcao.rotulo}
                      </button>
                    ))}
                  </div>

                  <div className="academico-busca-linha">
                    <label className="academico-busca">
                      <img src={iconeBusca} alt="" />
                      <input
                        type="search"
                        value={busca}
                        onChange={(evento) => definirBusca(evento.target.value)}
                        placeholder={"Buscar " + rotuloEntidade}
                        aria-label={"Buscar " + rotuloEntidade}
                      />
                    </label>
                    <button
                      type="button"
                      className="academico-botao-principal academico-botao-novo"
                      onClick={() => definirEditor({ secao })}
                    >
                      Nova {secao === "salas" ? "Sala" : secao === "turmas" ? "Turma" : "Matéria"}
                    </button>
                  </div>
                </div>

                <div className="academico-lista">
                  {secao === "salas" && salasFiltradas.map((sala) => (
                    <article className="academico-item" key={sala.id}>
                      <button className="academico-item-principal" type="button" onClick={() => definirEditor({ secao, id: sala.id })} aria-label={"Editar sala " + sala.nome}>
                        <span className="academico-item-icone"><img src={iconeDeSala(sala.icone)} alt="" /></span>
                        <span className="academico-item-informacoes">
                          <strong>{sala.nome}</strong>
                          <span>{sala.tipo} · Capacidade: {sala.capacidade}</span>
                          <small>{sala.descricao}</small>
                        </span>
                      </button>
                      <span className="academico-status">Cadastrada</span>
                      <button className="academico-seta" type="button" onClick={() => definirEditor({ secao, id: sala.id })} aria-label={"Abrir " + sala.nome}>
                        <SetaDireita />
                      </button>
                    </article>
                  ))}

                  {secao === "turmas" && turmasFiltradas.map((turma) => {
                    const horario = turma.horarios[0];
                    const sala = salas.find((item) => item.id === horario?.salaId);
                    const materia = materias.find((item) => item.id === horario?.materiaId);
                    return (
                      <article className="academico-item" key={turma.id}>
                        <button className="academico-item-principal" type="button" onClick={() => definirEditor({ secao, id: turma.id })} aria-label={"Editar turma " + turma.nome}>
                          <span className="academico-item-icone"><img src={iconePessoas} alt="" /></span>
                          <span className="academico-item-informacoes">
                            <strong>{turma.nome}</strong>
                            <span>{materia?.nome ?? "Sem matéria"} · {sala?.nome ?? "Sem sala"}</span>
                            <small>{turma.inicio}–{turma.fim} · {turma.descricao || "Sem descrição"}</small>
                          </span>
                        </button>
                        <span className={"academico-status " + (turma.ativa ? "" : "inativo")}>{turma.ativa ? "Ativa" : "Inativa"}</span>
                        <button type="button" className="academico-botao-status" onClick={() => alternarStatusTurma(turma.id)} aria-label={(turma.ativa ? "Desativar " : "Ativar ") + "turma " + turma.nome}>
                          {turma.ativa ? "Desativar" : "Ativar"}
                        </button>
                        <button className="academico-seta" type="button" onClick={() => definirEditor({ secao, id: turma.id })} aria-label={"Abrir " + turma.nome}>
                          <SetaDireita />
                        </button>
                      </article>
                    );
                  })}

                  {secao === "materias" && materiasFiltradas.map((materia) => (
                    <article className="academico-item academico-item-materia" key={materia.id}>
                      <button className="academico-item-principal" type="button" onClick={() => definirEditor({ secao, id: materia.id })} aria-label={"Editar matéria " + materia.nome}>
                        <span className="academico-item-icone"><img src={iconeSala} alt="" /></span>
                        <span className="academico-item-informacoes">
                          <strong>{materia.nome}</strong>
                          <small>{materia.descricao || materia.sigla}</small>
                        </span>
                      </button>
                      <div className="academico-cursos-resumo">
                        <strong>Cursos</strong>
                        <span>{materia.cursos.length ? materia.cursos.map((id) => nomeDoCurso(id, cursos)).join(" · ") : "Nenhum curso relacionado"}</span>
                      </div>
                      <button
                        type="button"
                        className={"academico-status " + (materia.ativa ? "" : "inativo")}
                        onClick={() => alternarStatusMateria(materia.id)}
                        aria-label={(materia.ativa ? "Desativar " : "Ativar ") + "matéria " + materia.nome}
                        title={materia.ativa ? "Clique para desativar" : "Clique para ativar"}
                      >
                        {materia.ativa ? "Ativa" : "Inativa"}
                      </button>
                      <button className="academico-seta" type="button" onClick={() => definirEditor({ secao, id: materia.id })} aria-label={"Abrir " + materia.nome}>
                        <SetaDireita />
                      </button>
                    </article>
                  ))}

                  {((secao === "salas" && salasFiltradas.length === 0)
                    || (secao === "turmas" && turmasFiltradas.length === 0)
                    || (secao === "materias" && materiasFiltradas.length === 0)) && (
                    <div className="academico-lista-vazia">
                      <strong>Nenhum resultado encontrado</strong>
                      <span>Altere a busca ou o filtro para ver outros registros.</span>
                    </div>
                  )}
                </div>
              </section>

              {secao !== "materias" && (
                <aside className="academico-cronograma" aria-label="Cronograma de aulas">
                  <h2><IconePorta /> Cronograma</h2>
                  <ol>
                    {turmas
                      .filter((turma) => turma.ativa && turma.horarios.length > 0)
                      .slice(0, 3)
                      .map((turma) => {
                        const horario = turma.horarios[0];
                        const sala = salas.find((item) => item.id === horario.salaId);
                        const materia = materias.find((item) => item.id === horario.materiaId);
                        return (
                          <li key={turma.id}>
                            <span className="academico-cronograma-horario">{horario.inicio}–{horario.fim}</span>
                            <article>
                              <span className="academico-cronograma-icone"><img src={iconeSala} alt="" /></span>
                              <span>
                                <strong>{sala?.nome ?? "Sala a definir"}</strong>
                                <small>{materia?.nome ?? turma.nome}</small>
                              </span>
                            </article>
                          </li>
                        );
                      })}
                  </ol>
                </aside>
              )}
            </div>
          </>
        )}
      </main>
    </EstruturaInstitucional>
  );
}


export default Salas;
