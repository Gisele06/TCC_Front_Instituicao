import type { FormEvent } from "react";
import iconeLogoBloom from "../../assets/icons/logo-b.png";
import imagemDeFundoDoAcesso from "../../assets/images/login-hero.png";
import iconeCarta from "../../assets/icons/carta.png";
import iconeSeta from "../../assets/icons/chevron-down-form.png";
import iconeSetaVoltar from "../../assets/icons/seta-voltar.png";
import "../auth.css";

interface PropriedadesCadastro {
  aoVoltar: () => void;
}

function Cadastro({ aoVoltar }: PropriedadesCadastro) {
  function avancar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
  }

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
        Bem estar que transforma<br />comunidades acadêmicas.
      </h1>

      <section className="acesso-cartao acesso-cartao-cadastro" aria-labelledby="register-title">
        <div className="acesso-microtitulo">
          <button className="acesso-voltar-botao" type="button" aria-label="Voltar para o login" onClick={aoVoltar}>
            <img src={iconeSetaVoltar} alt="" />
          </button>
          <span>Criação de conta</span>
          <span className="acesso-microtitulo-linha" />
        </div>

        <h2 className="acesso-titulo" id="register-title">Criar acesso institucional</h2>
        <p className="acesso-subtitulo">Primeiro vamos criar sua conta.</p>

        <div className="cadastro-etapas" aria-label="Etapa 1 de 3: Seus dados">
          <span className="cadastro-etapa-numero">1</span>
          <span className="cadastro-etapa-rotulo">Seus dados</span>
          <span className="cadastro-etapa-linha" />
          <span className="cadastro-etapa-rotulo">Sua instituição</span>
          <span className="cadastro-etapa-linha" />
          <span className="cadastro-etapa-rotulo">Seu acesso</span>
        </div>

        <form className="cadastro-formulario" onSubmit={avancar}>
          <label className="acesso-campo cadastro-nome-campo" htmlFor="nome">
            Nome completo
            <span className="acesso-entrada-area">
              <svg className="acesso-entrada-icone" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="currentColor" d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z" />
              </svg>
              <input id="nome" type="text" placeholder="Seu nome" />
            </span>
          </label>

          <div className="cadastro-campos-linha">
            <label className="acesso-campo" htmlFor="email-cadastro">
              E-mail
              <span className="acesso-entrada-area">
                <img className="acesso-entrada-icone" src={iconeCarta} alt="" />
                <input id="email-cadastro" type="email" placeholder="seuemail@instituicao.com" />
              </span>
            </label>

            <label className="acesso-campo" htmlFor="cargo">
              Cargo
              <span className="acesso-entrada-area">
                <img className="acesso-entrada-icone" src={iconeCarta} alt="" />
                <select id="cargo" defaultValue="coordenadora">
                  <option value="coordenadora">Coordenadora</option>
                  <option value="coordenador">Coordenador</option>
                  <option value="professor">Professor(a)</option>
                </select>
                <img className="acesso-selecao-seta" src={iconeSeta} alt="" />
              </span>
            </label>
          </div>

          <div className="acesso-envio cadastro-envio">
            <span className="bloom-botao bloom-botao-principal">Avançar</span>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Cadastro;
