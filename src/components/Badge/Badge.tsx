import type { ReactNode } from "react";
import "./Badge.css";

type EstiloSelo = "bom" | "aviso" | "alerta" | "informacao" | "neutro";

interface PropriedadesSelo {
  estilo?: EstiloSelo;
  children: ReactNode;
}

function Selo({ estilo = "neutro", children }: PropriedadesSelo) {
  return <span className={"bloom-selo bloom-selo-" + estilo}>{children}</span>;
}

export default Selo;
