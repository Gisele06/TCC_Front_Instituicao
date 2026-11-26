import iconeCheck from "../../../img/icones/marcacao.png";
import "./RequisitosSenha.css";

function RequisitosSenha({ senha }) {
  const requisitos = [
    { texto: "Pelo menos 8 caracteres.", atendido: senha.length >= 8 },
    {
      texto: "Combine letras com números.",
      atendido: /[a-z]/i.test(senha) && /\d/.test(senha),
    },
    {
      texto: "Inclua pelo menos um símbolo especial.",
      atendido: /[^a-z\d]/i.test(senha),
    },
    {
      texto: "Pelo menos uma letra maiúscula.",
      atendido: /[A-Z]/.test(senha),
    },
  ];

  return (
    <ul className="acesso-requisitos" aria-label="Requisitos da senha">
      {requisitos.map(({ texto, atendido }) => (
        <li
          className={atendido ? "acesso-requisito acesso-requisito-atendido" : "acesso-requisito"}
          key={texto}
        >
          <span className="acesso-requisito-marcador" aria-hidden="true">
            {atendido && <img src={iconeCheck} alt="" />}
          </span>
          <span>{texto}</span>
        </li>
      ))}
    </ul>
  );
}

export default RequisitosSenha;
