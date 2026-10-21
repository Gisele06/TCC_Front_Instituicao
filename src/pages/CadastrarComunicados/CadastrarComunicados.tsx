import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, MouseEvent } from "react";
import EstruturaInstitucional from "../../components/InstitutionFrame/InstitutionFrame";

import iconeCalendario from "../../assets/icons/calendario-evento.png";
import iconeTurmas from "../../assets/icons/turmas-evento.png";
import iconeSetaBaixo from "../../assets/icons/seta-baixo-evento.png";
import iconeSetaVoltar from "../../assets/icons/seta-voltar-evento.png";
import iconeRecorrencia from "../../assets/icons/recorrencia-evento.png";

import "./CadastrarComunicados.css";

interface PropriedadesCadastrarComunicados {
    aoNavegar: (pagina: string) => void;
    aoVoltar: () => void;
}

type ComandoFormatacao = "bold" | "italic" | "formatBlock";

function CadastrarComunicados({
    aoNavegar,
    aoVoltar,
}: PropriedadesCadastrarComunicados) {
    const entradaImagemRef = useRef<HTMLInputElement>(null);
    const editorCorpoRef = useRef<HTMLDivElement>(null);
    const campoCorpoRef = useRef<HTMLInputElement>(null);
    const [imagemSelecionada, setImagemSelecionada] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (imagemSelecionada) {
                URL.revokeObjectURL(imagemSelecionada);
            }
        };
    }, [imagemSelecionada]);

    function cadastrarComunicado(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault();
        sincronizarCorpo();
        aoVoltar();
    }

    function selecionarImagem(evento: ChangeEvent<HTMLInputElement>) {
        const arquivo = evento.currentTarget.files?.[0];

        if (!arquivo || !arquivo.type.startsWith("image/")) {
            return;
        }

        setImagemSelecionada(URL.createObjectURL(arquivo));
    }

    function sincronizarCorpo() {
        if (editorCorpoRef.current && campoCorpoRef.current) {
            campoCorpoRef.current.value = editorCorpoRef.current.innerHTML;
        }
    }

    function aplicarFormatacao(
        comando: ComandoFormatacao,
        valor?: string,
    ) {
        editorCorpoRef.current?.focus();
        document.execCommand(comando, false, valor);
        sincronizarCorpo();
    }

    function preservarFocoEditor(evento: MouseEvent<HTMLButtonElement>) {
        evento.preventDefault();
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
                                        name="nome"
                                        placeholder="Título do comunicado"
                                        required
                                    />
                                </label>

                                <label className="cadastrar-comunicados-campo">
                                    <span>
                                        Tipo <i>•</i>
                                    </span>

                                    <span className="cadastrar-comunicados-selecao-area">
                                        <select name="tipo" defaultValue="" required>
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
                                        name="descricao"
                                        placeholder="Descreva um resumo desse comunicado."
                                        required
                                    />
                                </label>

                                <label className="cadastrar-comunicados-campo">
                                    <span>
                                        Observações <small>(opcional)</small>
                                    </span>

                                    <textarea
                                        name="observacoes"
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
                                        <input type="date" name="data" required />
                                    </span>
                                </label>

                                <label className="cadastrar-comunicados-campo">
                                    <span>
                                        Hora de início <i>•</i>
                                    </span>

                                    <span className="cadastrar-comunicados-entrada-com-icone">
                                        <input type="time" name="horaInicio" required />
                                    </span>
                                </label>

                                <label className="cadastrar-comunicados-campo">
                                    <span>
                                        Hora de término <small>(opcional)</small>
                                    </span>

                                    <span className="cadastrar-comunicados-entrada-com-icone">
                                        <input type="time" name="horaTermino" />
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

                                        <select
                                            name="recorrencia"
                                            defaultValue="unica"
                                            required
                                        >
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

                                        <select
                                            name="turmas"
                                            defaultValue=""
                                            required
                                        >
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

                        <aside
                            className="cadastrar-comunicados-lateral"
                            aria-labelledby="cadastrar-comunicados-corpo-titulo"
                        >
                            <h2
                                className="cadastrar-comunicados-corpo-titulo"
                                id="cadastrar-comunicados-corpo-titulo"
                            >
                                Corpo do comunicado
                            </h2>

                            <input
                                ref={entradaImagemRef}
                                className="cadastrar-comunicados-entrada-imagem"
                                type="file"
                                name="imagem"
                                accept="image/*"
                                onChange={selecionarImagem}
                                aria-label="Escolher imagem para o comunicado"
                            />

                            <button
                                className="cadastrar-comunicados-adicionar-imagem"
                                type="button"
                                onClick={() => entradaImagemRef.current?.click()}
                                aria-label={
                                    imagemSelecionada
                                        ? "Trocar imagem do comunicado"
                                        : "Escolher imagem para o comunicado"
                                }
                            >
                                {imagemSelecionada ? (
                                    <img
                                        className="cadastrar-comunicados-imagem-previa"
                                        src={imagemSelecionada}
                                        alt="Prévia da imagem selecionada"
                                    />
                                ) : (
                                    <svg
                                        className="cadastrar-comunicados-icone-imagem"
                                        viewBox="0 0 48 48"
                                        role="img"
                                        aria-label="Ícone de imagem"
                                    >
                                        <rect
                                            x="3"
                                            y="3"
                                            width="42"
                                            height="42"
                                            rx="7"
                                            fill="currentColor"
                                        />
                                        <circle cx="33" cy="14" r="3.5" fill="#f7f6ef" />
                                        <path
                                            d="M10 34l9-10 7 7 4-4 8 8v3H10z"
                                            fill="#f7f6ef"
                                        />
                                    </svg>
                                )}

                                <span className="cadastrar-comunicados-texto-imagem">
                                    {imagemSelecionada
                                        ? "Clique para trocar a imagem"
                                        : "Clique para escolher uma imagem"}
                                </span>
                            </button>

                            <div
                                className="cadastrar-comunicados-barra-formatacao"
                                role="toolbar"
                                aria-label="Formatação do corpo do comunicado"
                            >
                                <button
                                    type="button"
                                    onMouseDown={preservarFocoEditor}
                                    onClick={() =>
                                        aplicarFormatacao("formatBlock", "<h2>")
                                    }
                                    aria-label="Aplicar título"
                                >
                                    Título
                                </button>
                                <button
                                    type="button"
                                    onMouseDown={preservarFocoEditor}
                                    onClick={() =>
                                        aplicarFormatacao("formatBlock", "<h3>")
                                    }
                                    aria-label="Aplicar subtítulo"
                                >
                                    Subtítulo
                                </button>
                                <button
                                    type="button"
                                    className="cadastrar-comunicados-formatacao-negrito"
                                    onMouseDown={preservarFocoEditor}
                                    onClick={() => aplicarFormatacao("bold")}
                                    aria-label="Aplicar negrito"
                                >
                                    B
                                </button>
                                <button
                                    type="button"
                                    className="cadastrar-comunicados-formatacao-italico"
                                    onMouseDown={preservarFocoEditor}
                                    onClick={() => aplicarFormatacao("italic")}
                                    aria-label="Aplicar itálico"
                                >
                                    I
                                </button>
                            </div>

                            <div
                                ref={editorCorpoRef}
                                className="cadastrar-comunicados-editor-corpo"
                                contentEditable
                                suppressContentEditableWarning
                                role="textbox"
                                aria-label="Digite o conteúdo do comunicado"
                                aria-multiline="true"
                                data-placeholder="Digite o conteúdo do comunicado"
                                onInput={sincronizarCorpo}
                                onBlur={sincronizarCorpo}
                            />

                            <input
                                ref={campoCorpoRef}
                                type="hidden"
                                name="corpo"
                            />
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
                            Salvar
                        </button>
                    </footer>
                </form>
            </main>
        </EstruturaInstitucional>
    );
}

export default CadastrarComunicados;