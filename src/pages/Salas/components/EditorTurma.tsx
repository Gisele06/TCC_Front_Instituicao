import { useState, type FormEvent } from "react";
import type { Sala, Turma, Materia, Intervalo, HorarioMateria } from "../types";
import { diasDaSemana, criarHorario, type CursoOpcao } from "../data/academico";
import { criarId } from "../utils";
import { CabecalhoEditor, AcoesFormulario, Lixeira } from "./ElementosAcademicos";
import iconeLivro from "../../../assets/icons/Geral/materia.png";

export default function EditorTurma({
  existente,
  salas,
  materias,
  cursosDisponiveis,
  aoVoltar,
  aoSalvar,
}: {
  existente?: Turma;
  salas: Sala[];
  materias: Materia[];
  cursosDisponiveis: CursoOpcao[];
  aoVoltar: () => void;
  aoSalvar: (turma: Turma) => void;
}) {
  const [intervalos, definirIntervalos] = useState<Intervalo[]>(existente?.intervalos ?? []);
  const [horarios, definirHorarios] = useState<HorarioMateria[]>(existente?.horarios ?? []);
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
      cursoId: Number(dados.get("curso")),
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
              <span>Curso <i>•</i></span>
              <select name="curso" defaultValue={existente?.cursoId ?? ""} required>
                <option value="" disabled>Selecione o curso da turma</option>
                {cursosDisponiveis.map((curso) => <option key={curso.id} value={curso.id}>{curso.nome}</option>)}
              </select>
            </label>
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

