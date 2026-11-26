import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { obterCursosDisponiveis } from "../../../js/Rotas_ACADEMICO/rotas_ACADEMICO.js";
import {
  diasDaSemana,
  criarHorario,
  criarId,
} from "../../../js/Rotas_ACADEMICO/gerenciamento.js";
import Input from "../../Gerais/Input/Input.jsx";
import CabecalhoEditor from "../CabecalhoEditor/CabecalhoEditor.jsx";
import AcoesFormulario from "../AcoesFormulario/AcoesFormulario.jsx";
import ModalCodigoTurma from "../ModalCodigoTurma/ModalCodigoTurma.jsx";
import "./EditorTurma.css";

const CURVA_SUAVE = [0.22, 1, 0.36, 1];

function IconeCaderno() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M5.5 3A2.5 2.5 0 0 0 3 5.5v13A2.5 2.5 0 0 0 5.5 21H19a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5.5Zm1.5 2v14H5.5a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5H7Zm3.5 2.5h6a1 1 0 1 1 0 2h-6a1 1 0 1 1 0-2Zm0 4h4.5a1 1 0 1 1 0 2h-4.5a1 1 0 1 1 0-2Z" />
    </svg>
  );
}

function IconeRelogio() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm.9 4.7v4.4l3 1.8a.9.9 0 1 1-.92 1.55l-3.44-2.06a.9.9 0 0 1-.44-.77V7.2a.9.9 0 1 1 1.8 0Z" />
    </svg>
  );
}

function IconeLixeira() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9 3.5A1.5 1.5 0 0 1 10.5 2h3A1.5 1.5 0 0 1 15 3.5V5h4a1 1 0 1 1 0 2h-1v12.5A2.5 2.5 0 0 1 15.5 22h-7A2.5 2.5 0 0 1 6 19.5V7H5a1 1 0 1 1 0-2h4V3.5Zm1.5 1.5h3V3.8h-3V5ZM9.5 9.5a.9.9 0 0 0-.9.9v7.2a.9.9 0 1 0 1.8 0v-7.2a.9.9 0 0 0-.9-.9Zm5 0a.9.9 0 0 0-.9.9v7.2a.9.9 0 1 0 1.8 0v-7.2a.9.9 0 0 0-.9-.9Z" />
    </svg>
  );
}

function IconeChevron({ aberto }) {
  return (
    <svg
      className={`turma-materia-chevron${aberto ? " turma-materia-chevron--aberto" : ""}`}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 6L8 10.5L12.5 6" />
    </svg>
  );
}

function EditorTurma({
  existente,
  salas = [],
  materias = [],
  aoVoltar,
  aoSalvar,
}) {
  const cursosDisponiveis = obterCursosDisponiveis();

  const [nome, definirNome] = useState(existente?.nome ?? "");
  const [status, definirStatus] = useState(
    existente?.ativa === false ? "inativa" : "ativa",
  );
  const [cursoId, definirCursoId] = useState(existente?.cursoId || "");
  const [descricao, definirDescricao] = useState(existente?.descricao ?? "");
  const [inicio, definirInicio] = useState(existente?.inicio ?? "");
  const [fim, definirFim] = useState(existente?.fim ?? "");
  const [intervalos, definirIntervalos] = useState(existente?.intervalos ?? []);
  const [mostrarCodigo, definirMostrarCodigo] = useState(false);
  const [horarios, definirHorarios] = useState(() =>
    existente?.horarios?.length
      ? existente.horarios
      : [
          {
            ...criarHorario(
              criarId("horario"),
              materias[0]?.id ?? "",
              salas[0]?.id ?? "",
            ),
            inicio: "",
            fim: "",
          },
        ],
  );
  const [abertos, definirAbertos] = useState(() => {
    const primeiro = existente?.horarios?.[0]?.id;
    return primeiro ? { [primeiro]: true } : null;
  });
  const [erro, definirErro] = useState("");

  function estaAberto(id, indice) {
    if (abertos === null) return indice === 0;
    return Boolean(abertos[id]);
  }

  function alternarCardMateria(id, indice) {
    definirAbertos((atuais) => {
      const base =
        atuais === null
          ? Object.fromEntries(horarios.map((h, i) => [h.id, i === 0]))
          : atuais;
      return { ...base, [id]: !base[id] };
    });
  }

  function adicionarIntervalo() {
    definirIntervalos((atuais) => [
      ...atuais,
      { id: criarId("intervalo"), inicio: "", fim: "" },
    ]);
  }

  function alterarIntervalo(id, campo, valor) {
    definirIntervalos((atuais) =>
      atuais.map((item) =>
        item.id === id ? { ...item, [campo]: valor } : item,
      ),
    );
  }

  function removerIntervalo(id) {
    definirIntervalos((atuais) => atuais.filter((item) => item.id !== id));
  }

  function adicionarMateria() {
    const novo = {
      ...criarHorario(
        criarId("horario"),
        materias[0]?.id ?? "",
        salas[0]?.id ?? "",
      ),
      inicio: "",
      fim: "",
    };
    definirHorarios((atuais) => [...atuais, novo]);
    definirAbertos((atuais) => {
      const base =
        atuais === null
          ? Object.fromEntries(horarios.map((h, i) => [h.id, i === 0]))
          : atuais;
      return { ...base, [novo.id]: true };
    });
  }

  function alterarHorario(id, campo, valor) {
    definirHorarios((atuais) =>
      atuais.map((item) =>
        item.id === id ? { ...item, [campo]: valor } : item,
      ),
    );
  }

  function removerHorario(id) {
    definirHorarios((atuais) => atuais.filter((item) => item.id !== id));
  }

  function alternarDia(id, dia) {
    definirHorarios((atuais) =>
      atuais.map((item) => {
        if (item.id !== id) return item;
        const dias = item.dias.includes(dia)
          ? item.dias.filter((valor) => valor !== dia)
          : [...item.dias, dia];
        return { ...item, dias };
      }),
    );
  }

  function enviarFormulario(evento) {
    evento.preventDefault();
    definirErro("");

    if (!nome.trim()) {
      definirErro("Informe o nome da turma.");
      return;
    }

    if (!inicio || !fim || inicio >= fim) {
      definirErro("O fim da aula deve ser depois do começo.");
      return;
    }

    if (horarios.length === 0) {
      definirErro("Adicione ao menos uma matéria à turma.");
      return;
    }

    if (
      horarios.some(
        (item) =>
          !item.dias.length ||
          !item.inicio ||
          !item.fim ||
          item.inicio >= item.fim ||
          !item.materiaId ||
          !item.salaId,
      )
    ) {
      definirErro("Confira os dias, horários, matéria e sala de cada item.");
      return;
    }

    if (
      intervalos.some(
        (item) =>
          (item.inicio && !item.fim) ||
          (!item.inicio && item.fim) ||
          (item.inicio && item.fim && item.inicio >= item.fim),
      )
    ) {
      definirErro("O fim de cada intervalo deve ser depois do começo.");
      return;
    }

    aoSalvar({
      id: existente?.id ?? criarId("turma"),
      nome: nome.trim(),
      descricao: descricao.trim(),
      ativa: status !== "inativa",
      inicio,
      fim,
      cursoId,
      intervalos,
      horarios,
    });
  }

  return (
    <>
      <CabecalhoEditor
        titulo={existente ? "Editar Turma" : "Cadastrar Turma"}
        descricao={
          existente
            ? "Atualize os horários e as matérias desta turma."
            : "Preencha as informações abaixo para criar uma nova turma."
        }
        aoVoltar={aoVoltar}
      />

      <form
        className="academico-formulario academico-formulario-turma"
        onSubmit={enviarFormulario}
        noValidate
      >
        <div className="academico-form-area academico-form-area-turma">
          <section
            className="academico-card academico-card-campos academico-card-turma"
            aria-label="Informações da turma"
          >
            <div className="turma-topo-linha">
              <label className="academico-campo">
                <span>
                  Nome da turma <em>•</em>
                </span>
                <Input
                  tipo="texto"
                  nome="nome"
                  valor={nome}
                  aoAlterar={(e) => definirNome(e.target.value)}
                  placeholder="Nome da turma"
                  comprimentoMaximo={60}
                  obrigatorio
                />
              </label>

              <div className="academico-campo">
                <span>
                  Curso <small>(opcional)</small>
                </span>
                <Input
                  id="turma-curso"
                  tipo="selecao"
                  nome="cursoId"
                  rotulo="Curso da turma"
                  placeholder="Sem curso"
                  valor={cursoId}
                  aoAlterar={(e) => definirCursoId(e.target.value)}
                  classeCampo="academico-popover"
                >
                  <option value="">Sem curso</option>
                  {cursosDisponiveis.map((curso) => (
                    <option key={curso.id} value={curso.id}>
                      {curso.nome}
                    </option>
                  ))}
                </Input>
              </div>

              <div className="academico-campo">
                <span>Status</span>
                <Input
                  id="turma-status"
                  tipo="selecao"
                  nome="status"
                  rotulo="Status da turma"
                  valor={status}
                  aoAlterar={(e) => definirStatus(e.target.value)}
                  classeCampo="academico-popover"
                >
                  <option value="ativa">Ativa</option>
                  <option value="inativa">Inativa</option>
                </Input>
              </div>
            </div>

            <label className="academico-campo turma-campo-descricao">
              <span>
                Descrição <small>(opcional)</small>
              </span>
              <Input
                tipo="textoLongo"
                nome="descricao"
                linhas={4}
                valor={descricao}
                aoAlterar={(e) => definirDescricao(e.target.value)}
                placeholder="Adicione uma breve descrição da turma."
                comprimentoMaximo={300}
              />
            </label>

            <div className="academico-campos-duplos">
              <div className="academico-campo">
                <span>
                  Começo da aula <em>•</em>
                </span>
                <Input
                  id="turma-inicio"
                  nome="inicio"
                  tipo="horario"
                  placeholder="--:--"
                  valor={inicio}
                  aoAlterar={(e) => definirInicio(e.target.value)}
                  iconeEsquerda={<IconeRelogio />}
                  obrigatorio
                  classeCampo="academico-popover"
                />
              </div>

              <div className="academico-campo">
                <span>
                  Fim da aula <em>•</em>
                </span>
                <Input
                  id="turma-fim"
                  nome="fim"
                  tipo="horario"
                  placeholder="--:--"
                  valor={fim}
                  aoAlterar={(e) => definirFim(e.target.value)}
                  iconeEsquerda={<IconeRelogio />}
                  obrigatorio
                  classeCampo="academico-popover"
                />
              </div>
            </div>

            {existente && (
              <div className="turma-convite-box">
                <div className="turma-convite-texto">
                  <strong>Código de convite da turma</strong>
                  <span>
                    Gere um código temporário (15 min) para novos estudantes
                    entrarem.
                  </span>
                </div>
                <button
                  type="button"
                  className="turma-botao-gerar-codigo"
                  onClick={() => definirMostrarCodigo(true)}
                >
                  Gerar código
                </button>
              </div>
            )}

            <div className="academico-intervalos">
              <div className="academico-linha-titulo">
                <h2>Intervalos</h2>
                <button
                  type="button"
                  className="turma-botao-adicionar"
                  onClick={adicionarIntervalo}
                >
                  Adicionar
                </button>
              </div>

              {intervalos.length === 0 ? (
                <p className="academico-ajuda">Nenhum intervalo cadastrado.</p>
              ) : (
                <div className="academico-intervalos-lista">
                  <AnimatePresence initial={false}>
                    {intervalos.map((intervalo, indice) => (
                      <motion.div
                        key={intervalo.id}
                        className="academico-intervalo"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, ease: CURVA_SUAVE }}
                      >
                        <strong>{indice + 1}º Intervalo</strong>

                        <div className="academico-intervalo-campo">
                          <span>Começo</span>
                          <Input
                            tipo="horario"
                            placeholder="--:--"
                            valor={intervalo.inicio}
                            aoAlterar={(evento) =>
                              alterarIntervalo(
                                intervalo.id,
                                "inicio",
                                evento.target.value,
                              )
                            }
                            iconeEsquerda={<IconeRelogio />}
                            classeCampo="academico-popover turma-popover-horario"
                          />
                        </div>

                        <div className="academico-intervalo-campo">
                          <span>Fim</span>
                          <Input
                            tipo="horario"
                            placeholder="--:--"
                            valor={intervalo.fim}
                            aoAlterar={(evento) =>
                              alterarIntervalo(
                                intervalo.id,
                                "fim",
                                evento.target.value,
                              )
                            }
                            iconeEsquerda={<IconeRelogio />}
                            classeCampo="academico-popover turma-popover-horario"
                          />
                        </div>

                        <button
                          type="button"
                          className="turma-botao-lixeira"
                          onClick={() => removerIntervalo(intervalo.id)}
                          aria-label={`Remover ${indice + 1}º intervalo`}
                          title="Remover intervalo"
                        >
                          <IconeLixeira />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </section>

          <section
            className="academico-card academico-card-materias"
            aria-labelledby="academico-materias-titulo"
          >
            <div className="academico-linha-titulo">
              <h2
                id="academico-materias-titulo"
                className="turma-materias-titulo"
              >
                <span className="turma-icone-caderno" aria-hidden="true">
                  <IconeCaderno />
                </span>
                Matérias da turma
              </h2>

              <button
                type="button"
                className="turma-botao-adicionar"
                onClick={adicionarMateria}
              >
                Adicionar
              </button>
            </div>

            {horarios.length === 0 ? (
              <p className="academico-ajuda">
                Adicione ao menos uma matéria à turma.
              </p>
            ) : (
              <div className="academico-horarios-lista">
                {horarios.map((horario, indice) => {
                  const aberto = estaAberto(horario.id, indice);
                  const salaSelecionada = salas.find(
                    (s) => s.id === horario.salaId,
                  );

                  return (
                    <article
                      className={`academico-horario-card${
                        aberto ? " academico-horario-card--aberto" : ""
                      }`}
                      key={horario.id}
                    >
                      <div className="academico-horario-cabecalho">
                        <span
                          className="turma-icone-caderno turma-icone-caderno--item"
                          aria-hidden="true"
                        >
                          <IconeCaderno />
                        </span>

                        <div className="turma-materia-select-wrap">
                          <Input
                            tipo="selecao"
                            rotulo="Matéria da turma"
                            placeholder="Selecione a matéria"
                            valor={horario.materiaId}
                            aoAlterar={(evento) =>
                              alterarHorario(
                                horario.id,
                                "materiaId",
                                evento.target.value,
                              )
                            }
                            obrigatorio
                            classeCampo="turma-materia-titulo-select"
                          >
                            {materias.map((materia) => (
                              <option key={materia.id} value={materia.id}>
                                {materia.nome}
                              </option>
                            ))}
                          </Input>
                        </div>

                        <div className="turma-horario-cabecalho-acoes">
                          <button
                            type="button"
                            className="turma-botao-lixeira"
                            onClick={() => removerHorario(horario.id)}
                            aria-label={`Remover matéria ${indice + 1}`}
                            title="Remover matéria"
                          >
                            <IconeLixeira />
                          </button>

                          <button
                            type="button"
                            className="turma-botao-expandir"
                            aria-expanded={aberto}
                            aria-label={
                              aberto ? "Recolher matéria" : "Expandir matéria"
                            }
                            onClick={() =>
                              alternarCardMateria(horario.id, indice)
                            }
                          >
                            <IconeChevron aberto={aberto} />
                          </button>
                        </div>
                      </div>

                      {!aberto && (
                        <p className="turma-horario-resumo-fechado">
                          {horario.dias.length
                            ? horario.dias.join(", ")
                            : "Sem dias"}
                          {horario.inicio && horario.fim
                            ? ` · ${horario.inicio}–${horario.fim}`
                            : ""}
                          {salaSelecionada ? ` · ${salaSelecionada.nome}` : ""}
                        </p>
                      )}

                      <AnimatePresence initial={false}>
                        {aberto && (
                          <motion.div
                            className="turma-horario-corpo"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.22, ease: CURVA_SUAVE }}
                          >
                            <div className="turma-horario-corpo-interno">
                              <div className="academico-dias">
                                <span>Dias de aula</span>
                                <div>
                                  {diasDaSemana.map((dia) => (
                                    <button
                                      key={dia}
                                      type="button"
                                      className={
                                        horario.dias.includes(dia)
                                          ? "selecionado"
                                          : ""
                                      }
                                      aria-pressed={horario.dias.includes(dia)}
                                      onClick={() =>
                                        alternarDia(horario.id, dia)
                                      }
                                    >
                                      {dia}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="academico-horario-duplo">
                                <div className="academico-campo">
                                  <span>Começo da aula</span>
                                  <Input
                                    tipo="horario"
                                    placeholder="--:--"
                                    valor={horario.inicio}
                                    aoAlterar={(evento) =>
                                      alterarHorario(
                                        horario.id,
                                        "inicio",
                                        evento.target.value,
                                      )
                                    }
                                    iconeEsquerda={<IconeRelogio />}
                                    obrigatorio
                                    classeCampo="academico-popover turma-popover-horario"
                                  />
                                </div>

                                <div className="academico-campo">
                                  <span>Fim da aula</span>
                                  <Input
                                    tipo="horario"
                                    placeholder="--:--"
                                    valor={horario.fim}
                                    aoAlterar={(evento) =>
                                      alterarHorario(
                                        horario.id,
                                        "fim",
                                        evento.target.value,
                                      )
                                    }
                                    iconeEsquerda={<IconeRelogio />}
                                    obrigatorio
                                    classeCampo="academico-popover turma-popover-horario"
                                  />
                                </div>
                              </div>

                              <div className="academico-campo">
                                <span>Sala</span>
                                <Input
                                  tipo="selecao"
                                  rotulo="Sala da aula"
                                  placeholder="Selecione a sala"
                                  valor={horario.salaId}
                                  aoAlterar={(evento) =>
                                    alterarHorario(
                                      horario.id,
                                      "salaId",
                                      evento.target.value,
                                    )
                                  }
                                  obrigatorio
                                  classeCampo="academico-popover turma-popover-horario"
                                >
                                  {salas.map((sala) => (
                                    <option key={sala.id} value={sala.id}>
                                      {sala.nome}
                                    </option>
                                  ))}
                                </Input>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <AcoesFormulario aoCancelar={aoVoltar} erro={erro} />
      </form>

      <ModalCodigoTurma
        turma={
          mostrarCodigo
            ? { ...existente, nome: nome.trim() || existente.nome }
            : null
        }
        aoFechar={() => definirMostrarCodigo(false)}
      />
    </>
  );
}

export default EditorTurma;
