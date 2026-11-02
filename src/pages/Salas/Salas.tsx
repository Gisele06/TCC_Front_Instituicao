import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import EstruturaInstitucional from "../../components/InstitutionFrame/InstitutionFrame";
import iconeBusca from "../../assets/icons/busca.png";
import iconeCalendario from "../../assets/icons/calendar.png";
import iconeComunicado from "../../assets/icons/comunicados.png";
import iconePessoa from "../../assets/icons/pessoa.png";
import iconeCoracao from "../../assets/icons/coracao.png";
import iconeFormacao from "../../assets/icons/formacao.png";
import iconePessoas from "../../assets/icons/pessoas.png";
import iconeEscudo from "../../assets/icons/cadeado.png";
import iconeLivro from "../../assets/icons/materia.png";
import iconeFolha from "../../assets/icons/bem-estar.png";
import iconeFlor from "../../assets/icons/acolhimento.png";
import iconeSala from "../../assets/icons/lousa-grafico.png";
import iconeVoltar from "../../assets/icons/seta-voltar.png";
import "./Salas.css";

type SecaoAcademica = "salas" | "turmas" | "materias";
type FiltroStatus = "todas" | "ativas" | "inativas";

interface Sala {
  id: string;
  nome: string;
  capacidade: number;
  descricao: string;
  tipo: string;
  icone: string;
  ativa: boolean;
}

interface Intervalo {
  id: string;
  inicio: string;
  fim: string;
}

interface HorarioMateria {
  id: string;
  materiaId: string;
  dias: string[];
  inicio: string;
  fim: string;
  salaId: string;
}

interface Turma {
  id: string;
  nome: string;
  descricao: string;
  ativa: boolean;
  inicio: string;
  fim: string;
  intervalos: Intervalo[];
  horarios: HorarioMateria[];
}

interface Materia {
  id: string;
  nome: string;
  sigla: string;
  descricao: string;
  ativa: boolean;
  cursos: string[];
}

interface PropriedadesSalas {
  aoNavegar: (pagina: string) => void;
}

interface EditorAtual {
  secao: SecaoAcademica;
  id?: string;
}

const cursosDisponiveis = [
  { id: "administracao", nome: "Administração" },
  { id: "engenharia", nome: "Engenharia" },
  { id: "informatica", nome: "Informática" },
  { id: "historia", nome: "História" },
];

const diasDaSemana = ["Seg", "Ter", "Qua", "Qui", "Sex"];

const iconesDeSala = [
  { id: "calendario", nome: "Calendário", imagem: iconeCalendario },
  { id: "comunicado", nome: "Comunicados", imagem: iconeComunicado },
  { id: "pessoa", nome: "Pessoa", imagem: iconePessoa },
  { id: "coracao", nome: "Bem-estar", imagem: iconeCoracao },
  { id: "formacao", nome: "Formação", imagem: iconeFormacao },
  { id: "pessoas", nome: "Pessoas", imagem: iconePessoas },
  { id: "escudo", nome: "Proteção", imagem: iconeEscudo },
  { id: "livro", nome: "Livro", imagem: iconeLivro },
  { id: "folha", nome: "Natureza", imagem: iconeFolha },
  { id: "flor", nome: "Acolhimento", imagem: iconeFlor },
];

const salasIniciais: Sala[] = [
  { id: "sala-b09", nome: "B09", descricao: "Sala de aula convencional", capacidade: 28, tipo: "Sala de aula", icone: "formacao", ativa: true },
  { id: "sala-auditorio", nome: "Auditório", descricao: "Espaço para apresentações e eventos", capacidade: 120, tipo: "Auditório", icone: "pessoas", ativa: true },
  { id: "sala-lab-info", nome: "Laboratório de Informática", descricao: "Computadores e recursos digitais", capacidade: 32, tipo: "Laboratório", icone: "livro", ativa: true },
  { id: "sala-b10", nome: "B10", descricao: "Sala de aula convencional", capacidade: 30, tipo: "Sala de aula", icone: "calendario", ativa: true },
  { id: "sala-lab-ciencias", nome: "Laboratório de Ciências", descricao: "Espaço para atividades práticas", capacidade: 24, tipo: "Laboratório", icone: "folha", ativa: true },
  { id: "sala-biblioteca", nome: "Biblioteca", descricao: "Leitura e estudo individual", capacidade: 40, tipo: "Biblioteca", icone: "livro", ativa: true },
  { id: "sala-b11", nome: "B11", descricao: "Sala de aula convencional", capacidade: 28, tipo: "Sala de aula", icone: "pessoa", ativa: true },
  { id: "sala-multiuso", nome: "Sala Multiuso", descricao: "Atividades em grupo e projetos", capacidade: 36, tipo: "Multiuso", icone: "coracao", ativa: true },
  { id: "sala-b12", nome: "B12", descricao: "Em manutenção", capacidade: 28, tipo: "Sala de aula", icone: "formacao", ativa: false },
  { id: "sala-lab-antigo", nome: "Laboratório 2", descricao: "Equipamentos em atualização", capacidade: 24, tipo: "Laboratório", icone: "escudo", ativa: false },
  { id: "sala-anexo", nome: "Anexo A", descricao: "Sala temporariamente fechada", capacidade: 20, tipo: "Sala de aula", icone: "pessoa", ativa: false },
  { id: "sala-b13", nome: "B13", descricao: "Em reforma", capacidade: 28, tipo: "Sala de aula", icone: "calendario", ativa: false },
];

const materiasIniciais: Materia[] = [
  { id: "mat-matematica", nome: "Matemática", sigla: "MAT", descricao: "Fundamentos de matemática", ativa: true, cursos: ["engenharia", "administracao", "informatica"] },
  { id: "mat-sistemas", nome: "Sistemas Operacionais", sigla: "SOP", descricao: "Sistemas operacionais e redes", ativa: true, cursos: ["informatica"] },
  { id: "mat-algoritmos", nome: "Algoritmos", sigla: "ALG", descricao: "Lógica e programação", ativa: true, cursos: ["informatica", "engenharia"] },
  { id: "mat-administracao", nome: "Administração Geral", sigla: "ADG", descricao: "Princípios de gestão", ativa: true, cursos: ["administracao"] },
  { id: "mat-fisica", nome: "Física", sigla: "FIS", descricao: "Mecânica e movimento", ativa: true, cursos: ["engenharia"] },
  { id: "mat-historia", nome: "História do Brasil", sigla: "HBR", descricao: "Formação social brasileira", ativa: true, cursos: ["historia"] },
  { id: "mat-estatistica", nome: "Estatística", sigla: "EST", descricao: "Análise de dados", ativa: true, cursos: ["engenharia", "administracao"] },
  { id: "mat-banco", nome: "Banco de Dados", sigla: "BDD", descricao: "Modelagem e consulta de dados", ativa: true, cursos: ["informatica"] },
  { id: "mat-quimica", nome: "Química", sigla: "QUI", descricao: "Química geral", ativa: false, cursos: ["engenharia"] },
  { id: "mat-filosofia", nome: "Filosofia", sigla: "FIL", descricao: "Pensamento e sociedade", ativa: false, cursos: ["historia"] },
  { id: "mat-marketing", nome: "Marketing", sigla: "MKT", descricao: "Comunicação e mercado", ativa: false, cursos: ["administracao"] },
  { id: "mat-geometria", nome: "Geometria", sigla: "GEO", descricao: "Geometria plana e espacial", ativa: false, cursos: ["engenharia", "informatica"] },
];

function criarHorario(id: string, materiaId = "mat-matematica", salaId = "sala-b09"): HorarioMateria {
  return { id, materiaId, dias: [...diasDaSemana], inicio: "08:00", fim: "09:00", salaId };
}

const turmasIniciais: Turma[] = [
  { id: "turma-1a", nome: "1º Ano A", descricao: "Turma do período da manhã", ativa: true, inicio: "08:00", fim: "12:00", intervalos: [], horarios: [criarHorario("horario-1a")] },
  { id: "turma-1b", nome: "1º Ano B", descricao: "Turma do período da manhã", ativa: true, inicio: "08:00", fim: "12:00", intervalos: [], horarios: [criarHorario("horario-1b", "mat-sistemas", "sala-lab-info")] },
  { id: "turma-2a", nome: "2º Ano A", descricao: "Turma do período da manhã", ativa: true, inicio: "08:00", fim: "12:00", intervalos: [], horarios: [criarHorario("horario-2a", "mat-algoritmos", "sala-lab-info")] },
  { id: "turma-2b", nome: "2º Ano B", descricao: "Turma do período da tarde", ativa: true, inicio: "13:00", fim: "17:00", intervalos: [], horarios: [criarHorario("horario-2b", "mat-fisica", "sala-b10")] },
  { id: "turma-3a", nome: "3º Ano A", descricao: "Turma do período da manhã", ativa: true, inicio: "08:00", fim: "12:00", intervalos: [], horarios: [criarHorario("horario-3a", "mat-administracao", "sala-b11")] },
  { id: "turma-3b", nome: "3º Ano B", descricao: "Turma do período da tarde", ativa: true, inicio: "13:00", fim: "17:00", intervalos: [], horarios: [criarHorario("horario-3b", "mat-historia", "sala-b10")] },
  { id: "turma-4a", nome: "4º Ano A", descricao: "Turma do período da manhã", ativa: true, inicio: "08:00", fim: "12:00", intervalos: [], horarios: [criarHorario("horario-4a", "mat-estatistica", "sala-b09")] },
  { id: "turma-4b", nome: "4º Ano B", descricao: "Turma do período da tarde", ativa: true, inicio: "13:00", fim: "17:00", intervalos: [], horarios: [criarHorario("horario-4b", "mat-banco", "sala-lab-info")] },
  { id: "turma-5a", nome: "5º Ano A", descricao: "Turma inativa", ativa: false, inicio: "08:00", fim: "12:00", intervalos: [], horarios: [criarHorario("horario-5a", "mat-matematica", "sala-b12")] },
  { id: "turma-5b", nome: "5º Ano B", descricao: "Turma inativa", ativa: false, inicio: "13:00", fim: "17:00", intervalos: [], horarios: [criarHorario("horario-5b", "mat-historia", "sala-anexo")] },
  { id: "turma-6a", nome: "6º Ano A", descricao: "Turma inativa", ativa: false, inicio: "08:00", fim: "12:00", intervalos: [], horarios: [criarHorario("horario-6a", "mat-fisica", "sala-b13")] },
  { id: "turma-6b", nome: "6º Ano B", descricao: "Turma inativa", ativa: false, inicio: "13:00", fim: "17:00", intervalos: [], horarios: [criarHorario("horario-6b", "mat-algoritmos", "sala-b12")] },
];

function lerDadosSalvos<T>(chave: string, valorInicial: T): T {
  try {
    const conteudo = window.localStorage.getItem(chave);
    return conteudo ? (JSON.parse(conteudo) as T) : valorInicial;
  } catch {
    return valorInicial;
  }
}

function usarDadosSalvos<T>(chave: string, valorInicial: T) {
  const [valor, definirValor] = useState<T>(() => lerDadosSalvos(chave, valorInicial));

  useEffect(() => {
    try {
      window.localStorage.setItem(chave, JSON.stringify(valor));
    } catch {
      // O fluxo continua disponível mesmo quando o navegador bloqueia o armazenamento.
    }
  }, [chave, valor]);

  return [valor, definirValor] as const;
}

function criarId(prefixo: string) {
  return prefixo + "-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 7);
}

function textoNormalizado(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function Salas({ aoNavegar }: PropriedadesSalas) {
  const [secao, definirSecao] = useState<SecaoAcademica>("salas");
  const [filtro, definirFiltro] = useState<FiltroStatus>("todas");
  const [busca, definirBusca] = useState("");
  const [editor, definirEditor] = useState<EditorAtual | null>(null);
  const [salas, definirSalas] = usarDadosSalvos("bloom-academico-salas", salasIniciais);
  const [turmas, definirTurmas] = usarDadosSalvos("bloom-academico-turmas", turmasIniciais);
  const [materias, definirMaterias] = usarDadosSalvos("bloom-academico-materias", materiasIniciais);

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

  function salvarSala(sala: Sala) {
    definirSalas((atuais) => atualizarLista(atuais, sala));
    definirEditor(null);
  }

  function salvarTurma(turma: Turma) {
    definirTurmas((atuais) => atualizarLista(atuais, turma));
    definirEditor(null);
  }

  function salvarMateria(materia: Materia) {
    definirMaterias((atuais) => atualizarLista(atuais, materia));
    definirEditor(null);
  }

  function alternarStatusSala(id: string) {
    definirSalas((atuais) => atuais.map((item) => item.id === id ? { ...item, ativa: !item.ativa } : item));
  }

  function alternarStatusTurma(id: string) {
    definirTurmas((atuais) => atuais.map((item) => item.id === id ? { ...item, ativa: !item.ativa } : item));
  }

  function alternarStatusMateria(id: string) {
    definirMaterias((atuais) => atuais.map((item) => item.id === id ? { ...item, ativa: !item.ativa } : item));
  }

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
        {editor ? (
          <>
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
              <Resumo valor={String(quantidadeTotal)} rotulo="Cadastradas" icone="grafico" />
              <Resumo valor={String(quantidadeAtivas)} rotulo="Ativas" icone="pessoas" />
              <Resumo valor={String(quantidadeInativas)} rotulo="Inativas" icone="pausado" />
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
                      <span className={"academico-status " + (sala.ativa ? "" : "inativo")}>{sala.ativa ? "Ativa" : "Inativa"}</span>
                      <button
                        type="button"
                        className="academico-botao-status"
                        onClick={() => alternarStatusSala(sala.id)}
                        aria-label={(sala.ativa ? "Desativar " : "Ativar ") + "sala " + sala.nome}
                      >
                        {sala.ativa ? "Desativar" : "Ativar"}
                      </button>
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
                        <span>{materia.cursos.length ? materia.cursos.map(nomeDoCurso).join(" · ") : "Nenhum curso relacionado"}</span>
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

function filtrarItens<T extends { ativa: boolean }>(
  itens: T[],
  busca: string,
  filtro: FiltroStatus,
  campos: (item: T) => string[],
) {
  const termo = textoNormalizado(busca.trim());
  return itens.filter((item) => {
    const correspondeStatus = filtro === "todas" || (filtro === "ativas" ? item.ativa : !item.ativa);
    const correspondeBusca = !termo || campos(item).some((campo) => textoNormalizado(campo).includes(termo));
    return correspondeStatus && correspondeBusca;
  });
}

function atualizarLista<T extends { id: string }>(atuais: T[], item: T) {
  return atuais.some((registro) => registro.id === item.id)
    ? atuais.map((registro) => registro.id === item.id ? item : registro)
    : [item, ...atuais];
}

function nomeDoCurso(id: string) {
  return cursosDisponiveis.find((curso) => curso.id === id)?.nome ?? id;
}

function iconeDeSala(id: string) {
  return iconesDeSala.find((icone) => icone.id === id)?.imagem ?? iconeFormacao;
}

function Resumo({ valor, rotulo, icone }: { valor: string; rotulo: string; icone: string }) {
  return (
    <div className="academico-resumo">
      {icone === "grafico" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2" y="2" width="20" height="16" rx="2" />
          <path d="m5 14 4-4 3 2 5-6" />
          <path d="M4 22h16" className="academico-grafico-base" />
        </svg>
      ) : icone === "pausado" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="6" height="18" rx="1" />
          <rect x="15" y="3" width="6" height="18" rx="1" />
        </svg>
      ) : (
        <img src={iconePessoas} alt="" />
      )}
      <strong>{valor}</strong>
      <span>{rotulo}</span>
    </div>
  );
}

function CabecalhoEditor({ titulo, descricao, aoVoltar }: { titulo: string; descricao: string; aoVoltar: () => void }) {
  return (
    <header className="academico-editor-titulo">
      <button type="button" onClick={aoVoltar} aria-label="Voltar para gerenciamento">
        <img src={iconeVoltar} alt="" />
      </button>
      <div>
        <h1>{titulo}</h1>
        <p>{descricao}</p>
      </div>
    </header>
  );
}

function AcoesFormulario({ aoCancelar, textoSalvar = "Salvar" }: { aoCancelar: () => void; textoSalvar?: string }) {
  return (
    <footer className="academico-acoes">
      <button type="button" className="academico-botao-secundario" onClick={aoCancelar}>Cancelar</button>
      <button type="submit" className="academico-botao-principal">{textoSalvar}</button>
    </footer>
  );
}

function EditorSala({ existente, aoVoltar, aoSalvar }: { existente?: Sala; aoVoltar: () => void; aoSalvar: (sala: Sala) => void }) {
  const [icone, definirIcone] = useState(existente?.icone ?? "formacao");

  function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    aoSalvar({
      id: existente?.id ?? criarId("sala"),
      nome: String(dados.get("nome") ?? "").trim(),
      capacidade: Number(dados.get("capacidade")),
      descricao: String(dados.get("descricao") ?? "").trim(),
      tipo: String(dados.get("tipo") ?? ""),
      icone,
      ativa: String(dados.get("status")) !== "inativa",
    });
  }

  return (
    <>
      <CabecalhoEditor
        titulo={existente ? "Editar Sala" : "Cadastrar Sala"}
        descricao={existente ? "Atualize as informações desta sala." : "Preencha as informações abaixo para criar uma nova sala."}
        aoVoltar={aoVoltar}
      />
      <form className="academico-formulario" onSubmit={enviarFormulario}>
        <div className="academico-form-area">
          <section className="academico-card academico-card-campos" aria-label="Informações da sala">
            <div className="academico-campos-duplos">
              <label className="academico-campo">
                <span>Nome da sala <i>•</i></span>
                <input name="nome" defaultValue={existente?.nome} placeholder="Nome da sala" maxLength={60} required />
              </label>
              <label className="academico-campo">
                <span>Capacidade <i>•</i></span>
                <input name="capacidade" type="number" min="1" max="9999" defaultValue={existente?.capacidade} placeholder="A quantidade máxima de pessoas nela" required />
              </label>
            </div>
            <label className="academico-campo">
              <span>Descrição <small>(opcional)</small></span>
              <textarea name="descricao" rows={4} defaultValue={existente?.descricao} placeholder="Faça uma breve descrição da sala." maxLength={300} />
            </label>
            <div className="academico-campos-duplos academico-campos-sala">
              <label className="academico-campo">
                <span>Tipo <i>•</i></span>
                <select name="tipo" defaultValue={existente?.tipo ?? ""} required>
                  <option value="" disabled>Selecione o tipo da sala</option>
                  <option>Sala de aula</option>
                  <option>Laboratório</option>
                  <option>Auditório</option>
                  <option>Biblioteca</option>
                  <option>Multiuso</option>
                  <option>Outro</option>
                </select>
              </label>
              {existente && (
                <label className="academico-campo">
                  <span>Status <i>•</i></span>
                  <select name="status" defaultValue={existente.ativa ? "ativa" : "inativa"}>
                    <option value="ativa">Ativa</option>
                    <option value="inativa">Inativa</option>
                  </select>
                </label>
              )}
            </div>
          </section>

          <section className="academico-card academico-card-icones" aria-labelledby="academico-icone-titulo">
            <h2 id="academico-icone-titulo">Escolha um ícone</h2>
            <div className="academico-grade-icones">
              {iconesDeSala.map((opcao) => (
                <button
                  key={opcao.id}
                  type="button"
                  className={icone === opcao.id ? "selecionado" : ""}
                  onClick={() => definirIcone(opcao.id)}
                  aria-label={opcao.nome}
                  aria-pressed={icone === opcao.id}
                  title={opcao.nome}
                >
                  <img src={opcao.imagem} alt="" />
                </button>
              ))}
            </div>
          </section>
        </div>
        <AcoesFormulario aoCancelar={aoVoltar} />
      </form>
    </>
  );
}

function EditorTurma({
  existente,
  salas,
  materias,
  aoVoltar,
  aoSalvar,
}: {
  existente?: Turma;
  salas: Sala[];
  materias: Materia[];
  aoVoltar: () => void;
  aoSalvar: (turma: Turma) => void;
}) {
  const [intervalos, definirIntervalos] = useState<Intervalo[]>(existente?.intervalos ?? []);
  const [horarios, definirHorarios] = useState<HorarioMateria[]>(existente?.horarios ?? [criarHorario(criarId("horario"), materias[0]?.id ?? "", salas[0]?.id ?? "")]);
  const [erro, definirErro] = useState("");

  function alterarIntervalo(id: string, campo: "inicio" | "fim", valor: string) {
    definirIntervalos((atuais) => atuais.map((item) => item.id === id ? { ...item, [campo]: valor } : item));
  }

  function alterarHorario(id: string, campo: keyof HorarioMateria, valor: string | string[]) {
    definirHorarios((atuais) => atuais.map((item) => item.id === id ? { ...item, [campo]: valor } : item));
  }

  function alternarDia(id: string, dia: string) {
    definirHorarios((atuais) => atuais.map((item) => {
      if (item.id !== id) return item;
      const dias = item.dias.includes(dia) ? item.dias.filter((valor) => valor !== dia) : [...item.dias, dia];
      return { ...item, dias };
    }));
  }

  function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    const inicio = String(dados.get("inicio") ?? "");
    const fim = String(dados.get("fim") ?? "");
    if (inicio >= fim) {
      definirErro("O fim da aula deve ser depois do começo.");
      return;
    }
    if (horarios.some((item) => !item.dias.length || item.inicio >= item.fim || !item.materiaId || !item.salaId)) {
      definirErro("Confira os dias, horários, matéria e sala de cada item.");
      return;
    }
    if (intervalos.some((item) => item.inicio && item.fim && item.inicio >= item.fim)) {
      definirErro("O fim de cada intervalo deve ser depois do começo.");
      return;
    }
    definirErro("");
    aoSalvar({
      id: existente?.id ?? criarId("turma"),
      nome: String(dados.get("nome") ?? "").trim(),
      descricao: String(dados.get("descricao") ?? "").trim(),
      ativa: String(dados.get("status")) !== "inativa",
      inicio,
      fim,
      intervalos,
      horarios,
    });
  }

  return (
    <>
      <CabecalhoEditor
        titulo={existente ? "Editar Turma" : "Cadastrar Turma"}
        descricao={existente ? "Atualize os horários e as matérias desta turma." : "Preencha as informações abaixo para criar uma nova turma."}
        aoVoltar={aoVoltar}
      />
      <form className="academico-formulario" onSubmit={enviarFormulario}>
        <div className="academico-form-area academico-form-area-turma">
          <section className="academico-card academico-card-campos academico-card-turma" aria-label="Informações da turma">
            <div className="academico-campos-duplos">
              <label className="academico-campo">
                <span>Nome da turma <i>•</i></span>
                <input name="nome" defaultValue={existente?.nome} placeholder="Nome da turma" maxLength={60} required />
              </label>
              <label className="academico-campo">
                <span>Status <i>•</i></span>
                <select name="status" defaultValue={existente?.ativa === false ? "inativa" : "ativa"}>
                  <option value="ativa">Ativa</option>
                  <option value="inativa">Inativa</option>
                </select>
              </label>
            </div>
            <label className="academico-campo">
              <span>Descrição <small>(opcional)</small></span>
              <textarea name="descricao" rows={3} defaultValue={existente?.descricao} placeholder="Adicione uma breve descrição da turma." maxLength={300} />
            </label>
            <div className="academico-campos-duplos">
              <label className="academico-campo">
                <span>Começo da aula <i>•</i></span>
                <input name="inicio" type="time" defaultValue={existente?.inicio ?? "08:00"} required />
              </label>
              <label className="academico-campo">
                <span>Fim da aula <i>•</i></span>
                <input name="fim" type="time" defaultValue={existente?.fim ?? "12:00"} required />
              </label>
            </div>

            <div className="academico-intervalos">
              <div className="academico-linha-titulo">
                <h2>Intervalos</h2>
                <button type="button" className="academico-botao-pequeno" onClick={() => definirIntervalos((atuais) => [...atuais, { id: criarId("intervalo"), inicio: "", fim: "" }])}>Adicionar</button>
              </div>
              {intervalos.length === 0 ? (
                <p className="academico-ajuda">Nenhum intervalo cadastrado.</p>
              ) : intervalos.map((intervalo, indice) => (
                <div className="academico-intervalo" key={intervalo.id}>
                  <strong>{indice + 1}º Intervalo</strong>
                  <label>Começo <input type="time" value={intervalo.inicio} onChange={(evento) => alterarIntervalo(intervalo.id, "inicio", evento.target.value)} /></label>
                  <label>Fim <input type="time" value={intervalo.fim} onChange={(evento) => alterarIntervalo(intervalo.id, "fim", evento.target.value)} /></label>
                  <button type="button" className="academico-excluir" onClick={() => definirIntervalos((atuais) => atuais.filter((item) => item.id !== intervalo.id))} aria-label={"Remover " + (indice + 1) + "º intervalo"}><Lixeira /></button>
                </div>
              ))}
            </div>
          </section>

          <section className="academico-card academico-card-materias" aria-labelledby="academico-materias-titulo">
            <div className="academico-linha-titulo">
              <h2 id="academico-materias-titulo"><img src={iconeLivro} alt="" /> Matérias da turma</h2>
              <button type="button" className="academico-botao-pequeno" onClick={() => definirHorarios((atuais) => [...atuais, criarHorario(criarId("horario"), materias[0]?.id ?? "", salas[0]?.id ?? "")])}>Adicionar</button>
            </div>
            {horarios.length === 0 && <p className="academico-ajuda">Adicione ao menos uma matéria à turma.</p>}
            <div className="academico-horarios-lista">
              {horarios.map((horario, indice) => (
                <article className="academico-horario-card" key={horario.id}>
                  <div className="academico-horario-cabecalho">
                    <label className="academico-campo academico-campo-materia">
                      {indice === 0 && <span>Matéria <i>•</i></span>}
                      <select value={horario.materiaId} onChange={(evento) => alterarHorario(horario.id, "materiaId", evento.target.value)} required aria-label="Matéria da turma">
                        <option value="" disabled>Selecione a matéria</option>
                        {materias.map((materia) => <option key={materia.id} value={materia.id}>{materia.nome}</option>)}
                      </select>
                    </label>
                    {horarios.length > 1 && (
                      <button type="button" className="academico-excluir" onClick={() => definirHorarios((atuais) => atuais.filter((item) => item.id !== horario.id))} aria-label={"Remover matéria " + (indice + 1)}><Lixeira /></button>
                    )}
                  </div>
                  <div className="academico-dias">
                    <span>Dias de aula</span>
                    <div>
                      {diasDaSemana.map((dia) => (
                        <button key={dia} type="button" className={horario.dias.includes(dia) ? "selecionado" : ""} aria-pressed={horario.dias.includes(dia)} onClick={() => alternarDia(horario.id, dia)}>{dia}</button>
                      ))}
                    </div>
                  </div>
                  <div className="academico-horario-duplo">
                    <label className="academico-campo">
                      <span>Começo da aula <i>•</i></span>
                      <input type="time" value={horario.inicio} onChange={(evento) => alterarHorario(horario.id, "inicio", evento.target.value)} required />
                    </label>
                    <label className="academico-campo">
                      <span>Fim da aula <i>•</i></span>
                      <input type="time" value={horario.fim} onChange={(evento) => alterarHorario(horario.id, "fim", evento.target.value)} required />
                    </label>
                  </div>
                  <label className="academico-campo">
                    <span>Sala <i>•</i></span>
                    <select value={horario.salaId} onChange={(evento) => alterarHorario(horario.id, "salaId", evento.target.value)} required>
                      <option value="" disabled>Selecione a sala</option>
                      {salas.map((sala) => <option key={sala.id} value={sala.id}>{sala.nome}</option>)}
                    </select>
                  </label>
                </article>
              ))}
            </div>
          </section>
        </div>
        {erro && <p className="academico-erro" role="alert">{erro}</p>}
        <AcoesFormulario aoCancelar={aoVoltar} />
      </form>
    </>
  );
}

function EditorMateria({ existente, aoVoltar, aoSalvar }: { existente?: Materia; aoVoltar: () => void; aoSalvar: (materia: Materia) => void }) {
  const [buscaCurso, definirBuscaCurso] = useState("");
  const [cursos, definirCursos] = useState<string[]>(existente?.cursos ?? []);
  const cursosVisiveis = cursosDisponiveis.filter((curso) => textoNormalizado(curso.nome).includes(textoNormalizado(buscaCurso)));
  const todosVisiveisSelecionados = cursosVisiveis.length > 0 && cursosVisiveis.every((curso) => cursos.includes(curso.id));

  function alternarCurso(id: string) {
    definirCursos((atuais) => atuais.includes(id) ? atuais.filter((curso) => curso !== id) : [...atuais, id]);
  }

  function alternarTodos() {
    if (todosVisiveisSelecionados) {
      const idsVisiveis = new Set(cursosVisiveis.map((curso) => curso.id));
      definirCursos((atuais) => atuais.filter((id) => !idsVisiveis.has(id)));
    } else {
      definirCursos((atuais) => Array.from(new Set([...atuais, ...cursosVisiveis.map((curso) => curso.id)])));
    }
  }

  function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    aoSalvar({
      id: existente?.id ?? criarId("materia"),
      nome: String(dados.get("nome") ?? "").trim(),
      sigla: String(dados.get("sigla") ?? "").trim().toLocaleUpperCase("pt-BR"),
      descricao: String(dados.get("descricao") ?? "").trim(),
      ativa: String(dados.get("status")) !== "inativa",
      cursos,
    });
  }

  return (
    <>
      <CabecalhoEditor
        titulo={existente ? "Editar Matéria" : "Cadastrar Matéria"}
        descricao={existente ? "Atualize os dados e cursos relacionados à matéria." : "Preencha as informações abaixo para criar uma nova matéria."}
        aoVoltar={aoVoltar}
      />
      <form className="academico-formulario" onSubmit={enviarFormulario}>
        <div className="academico-form-area">
          <section className="academico-card academico-card-campos" aria-label="Informações da matéria">
            <div className="academico-campos-duplos">
              <label className="academico-campo">
                <span>Nome da matéria <i>•</i></span>
                <input name="nome" defaultValue={existente?.nome} placeholder="Nome da matéria" maxLength={80} required />
              </label>
              <label className="academico-campo">
                <span>Sigla <i>•</i></span>
                <input name="sigla" defaultValue={existente?.sigla} placeholder="Digite a sigla da matéria" maxLength={8} required />
              </label>
            </div>
            <label className="academico-campo">
              <span>Descrição <small>(opcional)</small></span>
              <textarea name="descricao" rows={4} defaultValue={existente?.descricao} placeholder="Faça uma breve descrição da matéria." maxLength={300} />
            </label>
            <label className="academico-campo academico-campo-status">
              <span>Status <i>•</i></span>
              <select name="status" defaultValue={existente?.ativa === false ? "inativa" : "ativa"}>
                <option value="ativa">Ativa</option>
                <option value="inativa">Inativa</option>
              </select>
            </label>
          </section>

          <section className="academico-card academico-card-cursos" aria-labelledby="academico-cursos-titulo">
            <h2 id="academico-cursos-titulo">Cursos relacionados</h2>
            <div className="academico-cursos-controles">
              <label className="academico-busca">
                <img src={iconeBusca} alt="" />
                <input type="search" value={buscaCurso} onChange={(evento) => definirBuscaCurso(evento.target.value)} placeholder="Buscar curso" aria-label="Buscar curso relacionado" />
              </label>
              <button type="button" onClick={alternarTodos}>{todosVisiveisSelecionados ? "Desmarcar todos" : "Selecionar todos"}</button>
            </div>
            <div className="academico-lista-cursos">
              {cursosVisiveis.map((curso) => (
                <label className="academico-curso-opcao" key={curso.id}>
                  <input type="checkbox" checked={cursos.includes(curso.id)} onChange={() => alternarCurso(curso.id)} />
                  <span>{curso.nome}</span>
                </label>
              ))}
              {cursosVisiveis.length === 0 && <p className="academico-ajuda">Nenhum curso encontrado.</p>}
            </div>
            <p className="academico-ajuda">{cursos.length} {cursos.length === 1 ? "curso selecionado" : "cursos selecionados"}</p>
          </section>
        </div>
        <AcoesFormulario aoCancelar={aoVoltar} />
      </form>
    </>
  );
}

function SetaDireita() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg>;
}

function IconePorta() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 2h14v20H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
      <path className="detalhe" d="M16 2v20m-3-11h.1" />
    </svg>
  );
}

function Lixeira() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3m3 0-1 13H7L6 7m4 4v5m4-5v5" /></svg>;
}

export default Salas;
