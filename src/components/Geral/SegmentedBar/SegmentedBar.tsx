import "./SegmentedBar.css";

export interface SegmentoDaBarra {
  rotulo: string;
  /** Porcentagem mostrada na legenda. */
  valor: number;
  cor: string;
  /** Largura do trecho na barra, em %. Se não vier, usa o próprio valor. */
  largura?: number;
}

interface PropriedadesBarraSegmentada {
  segmentos: SegmentoDaBarra[];
  className?: string;
}

function BarraSegmentada({ segmentos, className = "" }: PropriedadesBarraSegmentada) {
  const larguras = segmentos.map((segmento) => segmento.largura ?? segmento.valor);
  const total = larguras.reduce((soma, largura) => soma + largura, 0) || 1;
  let acumulado = 0;

  return (
    <div className={"bloom-barra-segmentada " + className}>
      <div className="bloom-barra-segmentada-trilho" role="img" aria-label="Distribuição">
        {segmentos.map((segmento, indice) => {
          const inicio = (acumulado / total) * 100;
          const parte = (larguras[indice] / total) * 100;
          acumulado += larguras[indice];
          const ultimo = indice === segmentos.length - 1;

          return (
            <span
              key={segmento.rotulo}
              className="bloom-barra-segmentada-parte"
              style={{
                left: `${inicio}%`,
                // Cada parte entra por baixo da próxima, e a ponta arredondada dela aparece por cima.
                width: ultimo ? `${parte}%` : `calc(${parte}% + var(--barra-arredondamento) * var(--un))`,
                background: segmento.cor,
                zIndex: segmentos.length - indice,
              }}
            />
          );
        })}
      </div>

      <ul className="bloom-barra-segmentada-legenda">
        {segmentos.map((segmento) => (
          <li key={segmento.rotulo}>
            <strong>{segmento.valor}%</strong>
            <span>
              <i style={{ background: segmento.cor }} />
              {segmento.rotulo}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BarraSegmentada;
