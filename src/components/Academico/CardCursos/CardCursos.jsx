import Input from "../../Gerais/Input/Input.jsx";
import iconeBusca from "../../../img/icones/busca.png";
import iconeSetaDireita from "../../../img/icones/setaDireita.png";
import "./CardCursos.css";

function IconeCurso() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M22 10 12 5 2 10l10 5 10-5Z" />
      <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
    </svg>
  );
}

function CardCursos({
  cursos = [],
  materias = [],
  turmas = [],
  busca = "",
  definirBusca,
  definirEditor,
}) {
  return (
    <section
      className="academico-lista-painel academico-cursos-lista-painel"
      aria-label="Lista de cursos"
    >
      <div className="academico-controles">
        <div className="academico-busca-linha">
          <Input
            tipo="busca"
            classeName="academico-busca"
            valor={busca}
            aoAlterar={(evento) => definirBusca?.(evento.target.value)}
            placeholder="Buscar curso"
            aria-label="Buscar curso"
            icone={<img src={iconeBusca} alt="" />}
            tamanhoDoIcone="19px"
          />

          <button
            type="button"
            className="academico-botao-principal academico-botao-novo"
            onClick={() => definirEditor?.({ secao: "cursos" })}
          >
            Novo curso
          </button>
        </div>
      </div>

      <div className="academico-lista">
        {cursos.length === 0 ? (
          <div className="academico-lista-vazia">
            <strong>Nenhum curso encontrado</strong>
            <span>
              {busca.trim()
                ? "Altere a busca para ver outros cursos."
                : "Clique em Novo curso para cadastrar o primeiro."}
            </span>
          </div>
        ) : (
          cursos.map((curso) => {
            const qtdMaterias = materias.filter((m) =>
              m.cursos?.includes(curso.id),
            ).length;
            const qtdTurmas = turmas.filter(
              (t) => t.cursoId === curso.id,
            ).length;

            return (
              <article className="academico-item" key={curso.id}>
                <button
                  className="academico-item-principal"
                  type="button"
                  onClick={() =>
                    definirEditor?.({ secao: "cursos", id: curso.id })
                  }
                  aria-label={`Editar curso ${curso.nome}`}
                >
                  <span className="academico-item-icone academico-curso-item-icone">
                    <IconeCurso />
                  </span>
                  <span className="academico-item-informacoes">
                    <strong>{curso.nome}</strong>
                    <span>
                      {qtdMaterias}{" "}
                      {qtdMaterias === 1 ? "matéria" : "matérias"} · {qtdTurmas}{" "}
                      {qtdTurmas === 1 ? "turma" : "turmas"}
                    </span>
                  </span>
                </button>

                <button
                  className="academico-seta"
                  type="button"
                  onClick={() =>
                    definirEditor?.({ secao: "cursos", id: curso.id })
                  }
                  aria-label={`Abrir ${curso.nome}`}
                >
                  <img src={iconeSetaDireita} alt="" />
                </button>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

export default CardCursos;