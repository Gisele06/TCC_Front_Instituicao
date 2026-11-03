import type { ReactNode } from "react";
import "./Panel.css";

interface PropriedadesPainel {
  titulo?: string;
  icone?: ReactNode;
  className?: string;
  children: ReactNode;
}

function Painel({ titulo, icone, className = "", children }: PropriedadesPainel) {
  return (
    <section className={"bloom-painel " + className}>
      {titulo && (
        <h2 className="bloom-painel-titulo">
          {icone && <span className="bloom-painel-titulo-icone">{icone}</span>}
          {titulo}
        </h2>
      )}
      {children}
    </section>
  );
}

export default Painel;
