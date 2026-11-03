import type { ReactNode } from "react";
import "./MainBackground.css";

interface PropriedadesFundoPrincipal {
  /** Versão com menos espaço entre a barra superior e o conteúdo. Usada em todas as páginas, menos no início. */
  compacto?: boolean;
  className?: string;
  children: ReactNode;
}

// O quadro arredondado claro que fica por cima do fundo e guarda a barra superior e a página.
function FundoPrincipal({ compacto = false, className = "", children }: PropriedadesFundoPrincipal) {
  const classes = ["fundo-principal", compacto ? "fundo-principal-compacto" : "", className].filter(Boolean).join(" ");

  return <div className={classes}>{children}</div>;
}

export default FundoPrincipal;
