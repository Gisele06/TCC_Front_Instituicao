import { useState, type FormEvent } from "react";
import Botao from "../../components/Geral/Button/Button";
import iconeLogoBloom from "../../assets/icons/Geral/logo-b.png";
import imagemDeFundoDoAcesso from "../../assets/images/Geral/login-hero.png";
import iconeCarta from "../../assets/icons/Geral/carta.png";
import iconeCadeado from "../../assets/icons/Geral/cadeado.png";
import iconeGoogle from "../../assets/icons/Login/google.png";
import iconeFacebook from "../../assets/icons/Login/facebook.png";
import iconeOlho from "../../assets/icons/Geral/olho.png";
import { useGoogleLogin } from "@react-oauth/google";
import { ambiente } from "../../config/ambiente";
import "./Login.css";

interface PropriedadesAcesso {
  aoEntrar: () => void;
  aoCriarConta: () => void;
  aoRecuperarSenha: () => void;
  googleDisponivel?: boolean;
}

function BotaoGoogle({ aoEntrar, aoErro }: { aoEntrar: () => void; aoErro: (mensagem: string) => void }) {
  const entrarComGoogle = useGoogleLogin({
    onSuccess: () => {
      if (ambiente.modoDemonstracao) {
        aoEntrar();
      } else {
        aoErro("O Google retornou a autorização. Falta integrar a validação do token no backend.");
      }
    },
    onError: () => aoErro("Não foi possível fazer login com o Google."),
  });

  return (
    <button type="button" className="bloom-botao bloom-botao-contorno" onClick={() => entrarComGoogle()}>
      <img src={iconeGoogle} alt="" /> Entrar com Google
    </button>
  );
}

function Acesso({ aoEntrar, aoCriarConta, aoRecuperarSenha, googleDisponivel = false }: PropriedadesAcesso) {
  const [mensagem, definirMensagem] = useState("");
  const [mostrarSenha, definirMostrarSenha] = useState(false);

  function entrar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (ambiente.modoDemonstracao) {
      aoEntrar();
    } else {
      definirMensagem("O login por e-mail precisa ser conectado ao backend.");
    }
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
                <input id="email" name="email" type="email" required placeholder="seuemail@instituicao.com" />
              </span>
            </label>

            <div className="acesso-campo">
              <label htmlFor="senha">Senha</label>
              <span className="acesso-entrada-area">
                <img className="acesso-entrada-icone" src={iconeCadeado} alt="" />
                <input
                  id="senha"
                  name="senha"
                  required
                  type={mostrarSenha ? "text" : "password"}
                  placeholder="Digite sua senha"
                />
                <button className="acesso-senha-alternancia" type="button" onClick={() => definirMostrarSenha((atual) => !atual)} aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}>
                  <img src={iconeOlho} alt="" />
                </button>
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
            {googleDisponivel
              ? <BotaoGoogle aoEntrar={aoEntrar} aoErro={definirMensagem} />
              : (
                <button type="button" className="bloom-botao bloom-botao-contorno" disabled title="Configure VITE_GOOGLE_CLIENT_ID no .env">
                  <img src={iconeGoogle} alt="" /> Google não configurado
                </button>
              )}
          </div>
          <div className="acesso-redes-botao">
            <button type="button" className="bloom-botao bloom-botao-contorno" disabled title="Login com Facebook ainda não integrado">
              <img src={iconeFacebook} alt="" /> Entrar com Facebook
            </button>
          </div>
          {mensagem && <p role="alert" className="acesso-erro">{mensagem}</p>}
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
