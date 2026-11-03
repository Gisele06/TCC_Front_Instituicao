import type { SVGProps } from "react";

// Setas e "check" em SVG. Os ícones de bem-estar (carinhas, lua, pizza...) ficam em
// assets/icons e são importados em IconesBemEstar.ts.

type PropriedadesIcone = SVGProps<SVGSVGElement>;

const base = { viewBox: "0 0 24 24", fill: "none", "aria-hidden": true } as const;

interface PropriedadesSeta extends PropriedadesIcone {
  sentido?: "cima" | "baixo";
}

export function IconeSetaVariacao({ sentido = "cima", ...props }: PropriedadesSeta) {
  return (
    <svg {...base} {...props}>
      <g
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={sentido === "baixo" ? "rotate(180 12 12)" : undefined}
      >
        <path d="M12 20.5V4.5" />
        <path d="M5.8 10.6L12 4.4l6.2 6.2" />
      </g>
    </svg>
  );
}

export function IconeMarcar(props: PropriedadesIcone) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
