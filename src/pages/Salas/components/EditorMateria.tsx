import { useState, type FormEvent } from "react";
import type { Materia } from "../types";
import type { CursoOpcao } from "../data/academico";
import { criarId, textoNormalizado } from "../utils";
import { CabecalhoEditor, AcoesFormulario } from "./ElementosAcademicos";
import iconeBusca from "../../../assets/icons/Geral/busca.png";

export default function EditorMateria({ existente, cursosDisponiveis, aoVoltar, aoSalvar }: {
  existente?: Materia;
  cursosDisponiveis: CursoOpcao[];
  aoVoltar: () => void;
  aoSalvar: (materia: Materia) => void;
}) {
  const [buscaCurso, definirBuscaCurso] = useState("");
  const [erroCurso, definirErroCurso] = useState("");
  const [cursoId, definirCursoId] = useState(existente?.cursos[0] ?? "");
  const cursosVisiveis = cursosDisponiveis.filter((curso) =>
    textoNormalizado(curso.nome).includes(textoNormalizado(buscaCurso)),
  );

  function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    if (!cursoId) {
      definirErroCurso("Escolha um curso cadastrado para esta matéria.");
      return;
    }
    definirErroCurso("");
    aoSalvar({
      id: existente?.id ?? criarId("materia"),
      nome: String(dados.get("nome") ?? "").trim(),
      sigla: String(dados.get("sigla") ?? "").trim().toLocaleUpperCase("pt-BR"),
      descricao: String(dados.get("descricao") ?? "").trim(),
      ativa: String(dados.get("status")) !== "inativa",
      cursos: cursoId ? [cursoId] : [],
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
              <span className="academico-ajuda">Selecione um curso</span>
            </div>
            <div className="academico-lista-cursos">
              {cursosVisiveis.map((curso) => (
                <label className="academico-curso-opcao" key={curso.id}>
                  <input type="radio" name="curso" checked={cursoId === curso.id} onChange={() => definirCursoId(curso.id)} />
                  <span>{curso.nome}</span>
                </label>
              ))}
              {cursosVisiveis.length === 0 && <p className="academico-ajuda">Nenhum curso encontrado.</p>}
            </div>
            <p className="academico-ajuda">{cursoId ? "1 curso selecionado" : "Nenhum curso selecionado"}</p>
            {erroCurso && <p role="alert" className="academico-ajuda">{erroCurso}</p>}
          </section>
        </div>
        <AcoesFormulario aoCancelar={aoVoltar} />
      </form>
    </>
  );
}

