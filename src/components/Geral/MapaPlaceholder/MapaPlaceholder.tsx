import type { ReactNode } from "react";
import "./MapaPlaceholder.css";

interface PropriedadesMapa {
  children?: ReactNode;
  className?: string;
  descricao?: string;
}

/**
 * Reserva o espaço do mapa sem renderizar imagens, ruas ou marcadores.
 * Mais tarde, substitua o interior deste componente pelo Google Maps.
 */
export default function MapaPlaceholder({
  children,
  className = "",
  descricao = "O mapa será exibido aqui quando a integração estiver disponível.",
}: PropriedadesMapa) {
  return (
    <div className={`bloom-mapa-placeholder ${className}`.trim()} aria-label="Área reservada para o mapa">
      {children ?? <span>{descricao}</span>}
    </div>
  );
}
