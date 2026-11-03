import "./SeletorDeIcones.css";

export interface OpcaoDeIcone {
  id: string;
  nome: string;
  imagem: string;
}

interface Propriedades {
  opcoes: OpcaoDeIcone[];
  selecionado: string;
  aoSelecionar: (id: string) => void;
  titulo?: string;
  className?: string;
}

/** Seletor visual reutilizado nos cadastros; o valor salvo é o id do ícone. */
export default function SeletorDeIcones({
  opcoes,
  selecionado,
  aoSelecionar,
  titulo = "Escolha um ícone",
  className = "",
}: Propriedades) {
  return (
    <div className={`bloom-seletor-icones ${className}`.trim()}>
      <h2>{titulo}</h2>
      <div className="bloom-seletor-icones-grade" role="group" aria-label={titulo}>
        {opcoes.map((opcao) => (
          <button
            key={opcao.id}
            type="button"
            title={opcao.nome}
            className={selecionado === opcao.id ? "selecionado" : ""}
            aria-pressed={selecionado === opcao.id}
            aria-label={opcao.nome}
            onClick={() => aoSelecionar(opcao.id)}
          >
            <img src={opcao.imagem} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}
