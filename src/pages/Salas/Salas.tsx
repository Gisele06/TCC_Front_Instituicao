
import { useState } from "react";
import EstruturaInstitucional from "../../components/InstitutionFrame/InstitutionFrame";

import iconeTurmas from "../../assets/icons/pessoas.png";
import lousaGrafico from "../../assets/icons/lousa-grafico.png";
import materia from "../../assets/icons/materia.png"
import "./Salas.css";

interface PropriedadesSalas {
  aoNavegar: (pagina: string) => void;
}

const abas = [
  { nome: "Salas", icone: lousaGrafico },
  { nome: "Turmas", icone: iconeTurmas },
  { nome: "Matérias", icone: materia },
];

function Salas({ aoNavegar }: PropriedadesSalas) {
  const [abaAtiva, definirAbaAtiva] = useState("Salas");

  return (
    <EstruturaInstitucional
      paginaAtiva="academico"
      aoNavegar={aoNavegar}
    >
      <main className="salas-pagina">
        <header className="salas-titulo-principal">
          <div>
            <h1>Salas</h1>
            <p>Gerencie e visualize as salas da instituição.</p>
          </div>
        </header>

        <section className="salas-painel">
          <div className="salas-abas">
            {abas.map((aba) => (
              <button
                key={aba.nome}
                type="button"
                className={abaAtiva === aba.nome ? "estado-selecionado" : ""}
                onClick={() => definirAbaAtiva(aba.nome)}
              >
                <img src={aba.icone} alt="" />
                <span>{aba.nome}</span>
              </button>
            ))}

          </div>
          
        </section>
      </main>
    </EstruturaInstitucional>
  );
}

export default Salas;