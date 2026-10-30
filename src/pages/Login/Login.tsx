import type { FormEvent } from "react";
import Botao from "../../components/Button/Button";
import iconeLogoBloom from "../../assets/icons/logo-b.png";
import imagemDeFundoDoAcesso from "../../assets/images/login-hero.png";
import iconeCarta from "../../assets/icons/carta.png";
import iconeCadeado from "../../assets/icons/cadeado.png";
import iconeGoogle from "../../assets/icons/google.png";
import iconeFacebook from "../../assets/icons/facebook.png";
import iconeOlho from "../../assets/icons/olho.png";
import { useGoogleLogin } from '@react-oauth/google'; // Alterado de GoogleLogin para useGoogleLogin
import "../auth.css";

interface PropriedadesAcesso {
  aoEntrar: () => void;
  aoCriarConta: () => void;
  aoRecuperarSenha: () => void;
}

function Acesso({ aoEntrar, aoCriarConta, aoRecuperarSenha }: PropriedadesAcesso) {
  function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    aoEntrar();
  }

  // Configuração do gatilho de login para o seu botão customizado
  const loginComGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Sucesso! Dados do token:", tokenResponse);
      // Redireciona o usuário para a tela "inicio" após o login aceito
      aoEntrar(); 
    },
    onError: (error) => {
      console.log("Erro ao logar com o Google:", error);
    },
  });

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

      <section className="acesso-cartao" aria-labelledby="login-title">
        <div className="acesso-microtitulo">
          <span>Acesse sua conta</span>
          <span className="acesso-microtitulo-linha" />
        </div>

        <h2 className="acesso-titulo" id="login-title">Que bom ter você de volta.</h2>
        <p className="acesso-subtitulo">Entre no Bloom para acompanhar o bem-estar da sua instituição.</p>

        <form className="acesso-formulario" onSubmit={entrar}>
          <div className="acesso-campos">
            <label className="acesso-campo" htmlFor="email">
              E-mail
              <span className="acesso-entrada-area">
                <img className="acesso-entrada-icone" src={iconeCarta} alt="" />
                <input id="email" type="email" placeholder="seuemail@instituicao.com" />
              </span>
            </label>

            <div className="acesso-campo">
              <label htmlFor="senha">Senha</label>
              <span className="acesso-entrada-area">
                <img className="acesso-entrada-icone" src={iconeCadeado} alt="" />
                <input
                  id="senha"
                  type="password"
                  placeholder="Digite sua senha"
                />
                <span className="acesso-senha-alternancia" aria-hidden="true">
                  <img src={iconeOlho} alt="" />
                </span>
              </span>
              <button
                className="acesso-recuperar"
                type="button"
                onClick={aoRecuperarSenha}
              >
                Esqueci a senha
              </button>
            </div>
          </div>

          <div className="acesso-envio">
            <Botao estilo="principal" type="submit">Entrar</Botao>
          </div>
        </form>

        <div className="acesso-redes">
          <div className="acesso-redes-botao">
            {/* Adicionado o onClick para disparar o login e cursor pointer para indicar clique */}
            <span 
              className="bloom-botao bloom-botao-contorno" 
              onClick={() => loginComGoogle()}
              style={{ cursor: 'pointer' }}
            >
              <img src={iconeGoogle} alt=""/>
              Entrar com Google
            </span>
          </div>

          <div className="acesso-redes-botao">
            <span className="bloom-botao bloom-botao-contorno">
              <img src={iconeFacebook} alt="" />
              Entrar com Facebook
            </span>
          </div>
        </div>

        <p className="acesso-cadastro">
          Ainda não possui uma conta?{" "}
          <button className="acesso-texto-botao" type="button" onClick={aoCriarConta}>
            Criar uma conta
          </button>
        </p>
      </section>
    </main>
  );
}

export default Acesso;
