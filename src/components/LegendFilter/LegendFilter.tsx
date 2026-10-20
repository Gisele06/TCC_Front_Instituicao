import "./LegendFilter.css";

interface ItemDeLegenda {
  valor: string;
  rotulo: string;
  // Cor do ponto. Quando ausente o item não mostra ponto (ex.: "Geral").
  cor?: string;
}

interface PropriedadesFiltroDeLegenda {
  itens: ItemDeLegenda[];
  valor: string;
  aoMudar: (valor: string) => void;
}

// Linha de filtros em formato de pílula, cada um com um ponto colorido
// (Geral, Bem, Regular, Atenção, Alerta).
function FiltroDeLegenda({ itens, valor, aoMudar }: PropriedadesFiltroDeLegenda) {
  return (
    <div className="bloom-filtro-legenda">
      {itens.map((item) => (
        <button
          key={item.valor}
          type="button"
          className={
            item.valor === valor
              ? "bloom-filtro-legenda-item estado-ativo"
              : "bloom-filtro-legenda-item"
          }
          onClick={() => aoMudar(item.valor)}
        >
          {item.cor && (
            <span
              className="bloom-filtro-legenda-amostra"
              style={{ background: item.cor }}
              aria-hidden="true"
            />
          )}
          <span>{item.rotulo}</span>
        </button>
      ))}
    </div>
  );
}

export default FiltroDeLegenda;
