import iconeLogoBloom from "../../../img/icones/logo-b.png";
import imagemDeFundoDoAcesso from "../../../img/sistema/fundoAcesso.png";
import "./LayoutAutenticacao.css";

function LayoutAutenticacao({ children }) {
  return (
    <main className="acesso-pagina">
      <img className="acesso-fundo" src={imagemDeFundoDoAcesso} alt="" />

      <div className="acesso-marca" aria-label="Bloom Institucional">
        <img className="acesso-marca-simbolo" src={iconeLogoBloom} alt="" />
        <span className="acesso-marca-nome">
          <strong>loom</strong>
          <span>Institucional</span>
        </span>
      </div>

      <h1 className="acesso-titulo-principal">
        Bem estar que transforma
        <br />
        comunidades acadêmicas.
      </h1>
      {children}
    </main>
  );
}

export default LayoutAutenticacao;
