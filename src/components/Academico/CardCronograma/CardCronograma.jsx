import { useMemo } from "react";
import iconeSala from "../../../img/icones/lousa-grafico.png";
import "./CardCronograma.css";

function CardCronograma({ turmas = [], salas = [], materias = [] }) {
  const itensCronograma = useMemo(() => {
    return turmas
      .filter((turma) => turma.ativa && turma.horarios?.length > 0)
      .map((turma) => {
        const horario = turma.horarios[0];
        const sala = salas.find((item) => item.id === horario.salaId);
        const materia = materias.find((item) => item.id === horario.materiaId);
        return {
          id: turma.id,
          inicio: horario.inicio || "--:--",
          fim: horario.fim || "--:--",
          salaNome: sala?.nome ?? "Sala a definir",
          materiaNome: materia?.nome ?? turma.nome,
          turmaNome: turma.nome,
        };
      })
      .sort((a, b) => String(a.inicio).localeCompare(String(b.inicio)));
  }, [turmas, salas, materias]);

  return (
    <aside className="academico-cronograma" aria-label="Cronograma de aulas">
      <header className="academico-cronograma-topo">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 2h14v20H5a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z" />
          <path className="detalhe" d="M16 2v20m-3-11h.1" />
        </svg>
        <h2>Cronograma</h2>
      </header>

      {itensCronograma.length === 0 ? (
        <p className="academico-cronograma-vazio">
          Nenhuma aula ativa com horário definido no momento.
        </p>
      ) : (
        <ol className="academico-cronograma-lista">
          {itensCronograma.map((item) => (
            <li key={item.id}>
              <span className="academico-cronograma-horario">
                {item.inicio}–{item.fim}
              </span>
              <article className="academico-cronograma-card">
                <span className="academico-cronograma-icone" aria-hidden="true">
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
                </span>
                <div className="academico-cronograma-texto">
                  <strong>{item.salaNome}</strong>
                  <small>{item.materiaNome}</small>
                </div>
              </article>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}

export default CardCronograma;
