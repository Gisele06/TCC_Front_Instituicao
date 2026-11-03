import type { RedeDeApoio } from "../data/redesApoio";
import iconeCoracao from "../../../assets/icons/Geral/coracao.png";
import iconePessoas from "../../../assets/icons/Geral/pessoas.png";
import iconeSeta from "../../../assets/icons/Geral/chevron-right.png";

interface Propriedades {
  rede: RedeDeApoio;
  aoSelecionar: () => void;
}

export default function CartaoRedeApoio({ rede, aoSelecionar }: Propriedades) {
  const icon = rede.categoria === "Assistência social" ? iconePessoas : iconeCoracao;
  return (
    <button type="button" className="rede-apoio-item" onClick={aoSelecionar}>
      <span className="rede-apoio-item-icone"><img src={icon} alt="" /></span>
      <span className="rede-apoio-item-conteudo">
        <strong>{rede.nome}</strong>
        <small>{rede.categoria}</small>
        <span>{rede.descricao}</span>
        <small>{rede.endereco} · {rede.telefone}</small>
      </span>
      <img className="rede-apoio-item-seta" src={iconeSeta} alt="" />
    </button>
  );
}
