import type { ReactNode } from "react";
import "./BackgroundPanel.css";

interface PropriedadesPainelDeFundo {
  compacto?: boolean;
  className?: string;
  children: ReactNode;
}

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
