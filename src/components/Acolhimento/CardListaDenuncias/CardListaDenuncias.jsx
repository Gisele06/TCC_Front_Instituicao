import Input from "../../Gerais/Input/Input.jsx";
import iconeDenuncia from "../../../img/icones/Acolhimento/denuncia.png";
import iconeConversa from "../../../img/icones/Acolhimento/balaoConversa.png";
import busca from "../../../img/icones/busca.png";
import iconeSeta from "../../../img/icones/setaDireita.png";
import "./CardListaDenuncias.css";

function CardListaDenuncias({
  buscaTexto,
  definirBuscaTexto,
  denuncias,
  definirSelecionada,
}) {
  const filtradas = denuncias.filter((item) =>
    `${item.id} ${item.categoria} ${item.resumo}`
      .toLowerCase()
      .includes(buscaTexto.trim().toLowerCase())
  );

  return (
    <section className="acolhimento-lista">
      <h2>
        <img src={iconeDenuncia} alt="" /> Denúncias
      </h2>

      <Input
        tipo="busca"
        classeName="acolhimento-busca"
        placeholder="Buscar denúncia"
        valor={buscaTexto}
        aoAlterar={(e) => definirBuscaTexto(e.target.value)}
        icone={<img src={busca} alt="" />}
        tamanhoDoIcone="20px"
      />

      <div className="acolhimento-itens">
        {filtradas.length === 0 ? (
          <p className="acolhimento-itens-vazio">
            Nenhuma denúncia encontrada.
          </p>
        ) : (
          filtradas.map((item) => (
            <button
              key={item.id}
              type="button"
              className="acolhimento-item"
              onClick={() => definirSelecionada(item.id)}
            >
              <div className="acolhimento-item-texto">
                <h3>
                  #{item.id} <span>{item.categoria}</span>
                </h3>
                <p>“{item.resumo}”</p>
                <small>
                  <img src={iconeConversa} alt="" /> {item.mensagens} Mensagens
                </small>
              </div>

              <div className="acolhimento-item-lado">
                <small>{item.data}</small>
                <span className="acolhimento-tag-status">{item.status}</span>
              </div>

              <img className="acolhimento-chevron" src={iconeSeta} alt="" />
            </button>
          ))
        )}
      </div>
    </section>
  );
}

export default CardListaDenuncias;