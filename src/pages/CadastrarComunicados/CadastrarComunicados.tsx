
import type { FormEvent } from "react";
import EstruturaInstitucional from "../../components/InstitutionFrame/InstitutionFrame";

import iconeCalendario from "../../assets/icons/calendario-evento.png";
import iconeTurmas from "../../assets/icons/turmas-evento.png";
import iconeSetaBaixo from "../../assets/icons/seta-baixo-evento.png";
import iconeSetaVoltar from "../../assets/icons/seta-voltar-evento.png";
import iconeAviso from "../../assets/icons/comunicado-aviso.png";
import iconeRecorrencia from "../../assets/icons/recorrencia-evento.png"

import "./CadastrarComunicados.css";

interface PropriedadesCadastrarComunicados {
    aoNavegar: (pagina: string) => void;
    aoVoltar: () => void;
}

function CadastrarComunicados({
    aoNavegar,
    aoVoltar,
}: PropriedadesCadastrarComunicados) {
    function cadastrarComunicado(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        aoVoltar();
    }

    return (
        <EstruturaInstitucional
            paginaAtiva="comunicados"
            aoNavegar={aoNavegar}
        >
            <main className="cadastrar-comunicados-pagina">
                <header className="cadastrar-comunicados-titulo-principal">
                    <button
                        type="button"
                        className="cadastrar-comunicados-voltar"
                        onClick={aoVoltar}
                        aria-label="Voltar para comunicados"
                    >
                        <img src={iconeSetaVoltar} alt="" />
                    </button>

                    <div>
                        <h1>Criar Comunicado</h1>
                        <p>
                            Preencha as informações abaixo para criar um novo comunicado.
                        </p>
                    </div>
                </header>

                <form
                    className="cadastrar-comunicados-formulario"
                    onSubmit={cadastrarComunicado}
                >
                    <div className="cadastrar-comunicados-area">
                        <section
                            className="cadastrar-comunicados-campos"
                            aria-label="Informações do comunicado"
                        >

                            <div className="cadastrar-comunicados-campo-par">
                                <label className="cadastrar-comunicados-campo">
                                    <span>
                                        Nome do comunicado <i>•</i>
                                    </span>

                                    <input
                                        type="text"
                                        placeholder="Título do comunicado"
                                        required
                                    />
                                </label>

                                <label className="cadastrar-comunicados-campo">
                                    <span>
                                        Tipo <i>•</i>
                                    </span>

                                    <span className="cadastrar-comunicados-selecao-area">
                                        <select defaultValue="" required>
                                            <option value="" disabled>
                                                Selecione os tipos de comunicado
                                            </option>
                                            <option value="aviso">Aviso</option>
                                            <option value="informativo">Informativo</option>
                                            <option value="orientacao">Orientação</option>
                                            <option value="evento">Evento</option>
                                        </select>

                                        <img src={iconeSetaBaixo} alt="" />
                                    </span>
                                </label>
                            </div>

                            <div className="cadastrar-comunicados-campo-par">
                                <label className="cadastrar-comunicados-campo">
                                    <span>
                                        Descrição <i>•</i>
                                    </span>

                                    <textarea
                                        placeholder="Descreva um resumo desse comunicado."
                                        required
                                    />
                                </label>

                                <label className="cadastrar-comunicados-campo">
                                    <span>
                                        Observações <small>(opcional)</small>
                                    </span>

                                    <textarea
                                        placeholder="Descreva observações importantes sobre o comunicado"
                                    />
                                </label>
                            </div>

                            <div className="cadastrar-comunicados-horario-linha">
                                <label className="cadastrar-comunicados-campo">
                                    <span>
                                        Data do comunicado <i>•</i>
                                    </span>

                                    <span className="cadastrar-comunicados-entrada-com-icone">
                                        <img src={iconeCalendario} alt="" />
                                        <input type="date" required />
                                    </span>
                                </label>

                                <label className="cadastrar-comunicados-campo">
                                    <span>
                                        Hora de início <i>•</i>
                                    </span>

                                    <span className="cadastrar-comunicados-entrada-com-icone">
                                        <input type="time" required />
                                    </span>
                                </label>

                                <label className="cadastrar-comunicados-campo">
                                    <span>
                                        Hora de término <small>(opcional)</small>
                                    </span>

                                    <span className="cadastrar-comunicados-entrada-com-icone">
                                        <input type="time" />
                                    </span>
                                </label>
                            </div>
                            <div className="cadastrar-comunicados-campo-par">
                                <label className="cadastrar-comunicados-campo">
                                    <span>
                                        Recorrência <i>•</i>
                                    </span>

                                    <span className="cadastrar-comunicados-selecao-area">
                                        <img src={iconeRecorrencia} alt="" />

                                        <select defaultValue="unica" required>
                                            <option value="unica">Não se repete</option>
                                            <option value="diaria">Diariamente</option>
                                            <option value="semanal">Semanalmente</option>
                                            <option value="mensal">Mensalmente</option>
                                            <option value="anual">Anualmente</option>
                                        </select>

                                        <img src={iconeSetaBaixo} alt="" />
                                    </span>
                                </label>

                                <label className="cadastrar-comunicados-campo">
                                    <span>
                                        Turmas participantes <i>•</i>
                                    </span>

                                    <span className="cadastrar-comunicados-selecao-area cadastrar-comunicados-selecao-icone">
                                        <img src={iconeTurmas} alt="" />

                                        <select defaultValue="" required>
                                            <option value="" disabled>
                                                Selecione as turmas
                                            </option>
                                            <option value="todas">Todas as turmas</option>
                                            <option value="turma-a">Turma A</option>
                                            <option value="turma-b">Turma B</option>
                                            <option value="turma-c">Turma C</option>
                                        </select>

                                        <img src={iconeSetaBaixo} alt="" />
                                    </span>
                                </label>
                            </div>

                        </section>


                        <aside className="cadastrar-comunicados-lateral">
                            

                            
                        </aside>
                    </div>


                    <footer className="cadastrar-comunicados-acoes">
                        <button
                            type="button"
                            className="cadastrar-comunicados-cancelar"
                            onClick={aoVoltar}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="cadastrar-comunicados-salvar"
                        >
                            Cadastrar comunicado
                        </button>
                    </footer>
                </form>
            </main>
        </EstruturaInstitucional>
    );
}

export default CadastrarComunicados;
