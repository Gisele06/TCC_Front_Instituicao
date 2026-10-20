import type { ReactNode } from "react";
import "./BackgroundPanel.css";

interface PropriedadesPainelDeFundo {
  // Quando verdadeiro usa o espaçamento compacto (mesmo comportamento antigo do "fundo-principal-compacto").
  compacto?: boolean;
  className?: string;
  children: ReactNode;
}

// Painel claro que serve de "folha" de conteúdo dentro do fundo cinza.
// Antes esse markup vivia dentro do InstitutionFrame; foi extraído para poder
// ser reaproveitado em qualquer página.
function PainelDeFundo({ compacto = false, className = "", children }: PropriedadesPainelDeFundo) {
  const classes = [
    "fundo-principal",
    compacto ? "fundo-principal-compacto" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="fundo">
      <div className={classes}>{children}</div>
    </div>
  );
}

export default PainelDeFundo;
