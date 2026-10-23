import EstruturaInstitucional from "../../components/InstitutionFrame/InstitutionFrame";
import iconeTurmas from "../../assets/icons/pessoas.png";
import iconeMaterias from "../../assets/icons/materia.png";
import iconePessoas from "../../assets/icons/pessoas.png";
import iconePausado from "../../assets/icons/pausado.png";
import iconeBusca from "../../assets/icons/busca.png";
import "./Salas.css";

interface PropriedadesSalas {
  aoNavegar: (pagina: string) => void;
}

const abas = [
  { nome: "Salas", icone: "salas" },
  { nome: "Turmas", icone: iconeTurmas },
  { nome: "Matérias", icone: iconeMaterias },
];

const indicadores = [
  { valor: "12", rotulo: "Cadastradas", icone: "salas" },
  { valor: "8", rotulo: "Ativas", icone: iconePessoas },
  { valor: "4", rotulo: "Inativas", icone: iconePausado },
];

const salasExemplo = [
  {
    id: "b09",
    nome: "B09",
    descricao: "Sala de aula convencional.",
    capacidade: 16,
    tipo: "sala",
  },
  {
    id: "auditorio",
    nome: "Auditório",
    descricao: "Salão para apresentações",
    capacidade: 32,
    tipo: "auditorio",
  },
];

const usosDasSalas = [
  { id: "uso-1", horario: "08:00 - 10:00", sala: "B09", evento: "Vai uma pizza aí!", alunos: 25 },
  { id: "uso-2", horario: "08:00 - 10:00", sala: "B09", evento: "Vai uma pizza aí!", alunos: 25 },
  { id: "uso-3", horario: "08:00 - 10:00", sala: "B09", evento: "Vai uma pizza aí!", alunos: 25 },
];

function Salas({ aoNavegar }: PropriedadesSalas) {
  return (
    <EstruturaInstitucional paginaAtiva="academico" aoNavegar={aoNavegar}>
      <main className="salas-pagina" aria-label="Gerenciamento de salas">
        <header className="salas-titulo-principal">
          <h1>Gerenciamento</h1>
          <p>Organize as salas, turmas e matérias.</p>
        </header>

        <div className="salas-layout">
          <section className="salas-coluna-principal">
            <nav className="salas-abas" aria-label="Navegação acadêmica">
              {abas.map((aba) => (
                <span
                  key={aba.nome}
                  className={aba.nome === "Salas" ? "estado-selecionado" : ""}
                  aria-current={aba.nome === "Salas" ? "page" : undefined}
                >
                  {aba.icone === "salas" ? (
                    <svg viewBox="0 0 40 40" aria-hidden="true">
                      <rect x="3" y="4" width="34" height="27" rx="3" />
                      <path className="salas-icone-detalhe" d="m9 23 7-7 5 4 9-10" />
                      <path className="salas-icone-base" d="M5 35h30" />
                    </svg>
                  ) : (
                    <img src={aba.icone} alt="" />
                  )}
                  <span>{aba.nome}</span>
                </span>
              ))}
            </nav>

            <section className="salas-resumos" aria-label="Resumo das salas">
              {indicadores.map((indicador) => (
                <div className="salas-resumo" key={indicador.rotulo}>
                  {indicador.icone === "salas" ? (
                    <svg viewBox="0 0 40 40" aria-hidden="true">
                      <rect x="3" y="4" width="34" height="27" rx="3" />
                      <path className="salas-icone-detalhe" d="m9 23 7-7 5 4 9-10" />
                      <path className="salas-icone-base" d="M5 35h30" />
                    </svg>
                  ) : (
                    <img src={indicador.icone} alt="" />
                  )}
                  <strong>{indicador.valor}</strong>
                  <span>{indicador.rotulo}</span>
                </div>
              ))}
            </section>

            <section className="salas-painel" aria-label="Lista de salas">
              <div className="salas-controles">
                <div className="salas-filtros" aria-label="Filtros de sala">
                  <span className="estado-selecionado">Todas</span>
                  <span>Ativas</span>
                  <span>Inativas</span>
                </div>

                <div className="salas-busca-linha">
                  <div className="salas-busca" aria-label="Buscar sala">
                    <img src={iconeBusca} alt="" />
                    <span>Buscar sala</span>
                  </div>

                  <div className="salas-botao-nova">Nova Sala</div>
                </div>
              </div>

              <div className="salas-lista">
                {salasExemplo.map((sala) => (
                  <article className="salas-item" key={sala.id}>
                    <div className="salas-item-icone" aria-hidden="true">
                      {sala.tipo === "auditorio" ? (
                        <svg viewBox="0 0 40 40">
                          <rect x="3" y="4" width="34" height="8" rx="3" />
                          <path d="M8 16h24v14H8z" />
                          <path className="salas-icone-detalhe" d="M12 20h9m-9 5h6m9-5h-3m3 5h-3" />
                          <path d="M18 30v6m-6 0h16" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 40 40">
                          <rect x="3" y="4" width="34" height="27" rx="3" />
                          <path className="salas-icone-detalhe" d="m9 23 7-7 5 4 9-10" />
                          <path className="salas-icone-base" d="M5 35h30" />
                        </svg>
                      )}
                    </div>

                    <div className="salas-item-informacoes">
                      <h2>{sala.nome}</h2>
                      <p>{sala.descricao}</p>
                      <span className="salas-capacidade">
                        <img src={iconePessoas} alt="" />
                        Capacidade: {sala.capacidade}
                      </span>
                    </div>

                    <span className="salas-status">Ativa</span>

                    <span className="salas-item-seta" aria-hidden="true">
                      <svg viewBox="0 0 24 24">
                        <path d="m9 5 7 7-7 7" />
                      </svg>
                    </span>
                  </article>
                ))}
              </div>
            </section>
          </section>

          <aside className="salas-uso">
            <h2 className="salas-uso-titulo">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path d="M5 3h19a2 2 0 0 1 2 2v24H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                <path className="salas-uso-porta-detalhe" d="M22 3v26" />
                <circle className="salas-uso-porta-detalhe" cx="17" cy="16" r="1" />
              </svg>
              Uso das salas
            </h2>

            <ol className="salas-uso-lista">
              {usosDasSalas.map((uso) => (
                <li className="salas-uso-item" key={uso.id}>
                  <span className="salas-uso-marcador salas-uso-marcador-horario" aria-hidden="true" />
                  <span className="salas-uso-horario">{uso.horario}</span>

                  <article className="salas-uso-cartao">
                    <span className="salas-uso-marcador salas-uso-marcador-meio" aria-hidden="true" />

                    <div className="salas-uso-sala-icone" aria-hidden="true">
                      <svg viewBox="0 0 40 40">
                        <rect x="3" y="4" width="34" height="27" rx="3" />
                        <path className="salas-icone-detalhe" d="m9 23 7-7 5 4 9-10" />
                        <path className="salas-icone-base" d="M5 35h30" />
                      </svg>
                    </div>

                    <div className="salas-uso-informacoes">
                      <strong className="salas-uso-nome">{uso.sala}</strong>
                      <span className="salas-uso-status">Em uso</span>
                      <p>Evento: {uso.evento}</p>
                      <span className="salas-uso-alunos">
                        <img src={iconePessoas} alt="" />
                        {uso.alunos} alunos
                      </span>
                    </div>
                  </article>

                  <span className="salas-uso-marcador salas-uso-marcador-fim" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </main>
    </EstruturaInstitucional>
  );
}

export default Salas;