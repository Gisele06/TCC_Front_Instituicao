import { useState, useRef } from "react";
import { autenticarUsuario, autenticarUsuarioGoogle } from "../../js/Rotas_LOGIN/rotas_LOGIN.js";
import { motion, useReducedMotion } from "framer-motion";
import { createPortal } from "react-dom";
import { useGoogleLogin } from "@react-oauth/google";
import Input from "../../components/Gerais/Input/Input.jsx";
import LayoutAutenticacao from "../../components/Login/LayoutAutenticacao/LayoutAutenticacao.jsx";
import Botao from "../../components/Gerais/Botao/Botao.jsx";
import iconeGoogle from "../../img/icones/google.png";
import iconeFacebook from "../../img/icones/facebook.png";
import "./Login.css";

const CURVA_CINEMATICA = [0.16, 1, 0.3, 1];
const FADE_ABA = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.55, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.42, ease: "easeInOut" } },
};

function Login({ aoEntrar, aoCriarConta, aoRecuperarSenha }) {
  const [erro, definirErro] = useState("");
  const [saindo, definirSaindo] = useState(false);

  const entradaIniciada = useRef(false);
  const reduzirMovimento = useReducedMotion();

  function dispararEntrada() {
    if (entradaIniciada.current) return;
    entradaIniciada.current = true;
    if (reduzirMovimento) { aoEntrar(); return; }
    definirSaindo(true);
  }

  async function entrar(evento) {
    evento.preventDefault();
    if (entradaIniciada.current) return;
    const dados = new FormData(evento.currentTarget);
    try {
      if (await autenticarUsuario(dados.get("email"), dados.get("senha"))) {
        dispararEntrada();
      } else {
        definirErro("E-mail ou senha inválidos.");
      }
    } catch (e) {
      definirErro(e.message);
    }
  }

  const loginComGoogle = useGoogleLogin({
    onSuccess: async (resposta) => {
      try {
        await autenticarUsuarioGoogle(resposta.access_token);
        dispararEntrada();
      } catch (e) {
        definirErro(e.message);
      }
    },
    onError: () => definirErro("Não foi possível entrar com Google."),
  });

  return (
    <LayoutAutenticacao>
      <motion.section
        className="acesso-cartao acesso-cartao-login"
        aria-labelledby="login-title"
        initial={false}
        animate={
          saindo
            ? { opacity: 0, scale: 1.06, y: -10, filter: "blur(10px)" }
            : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
        }
        transition={{ duration: reduzirMovimento ? 0 : 0.35, ease: CURVA_CINEMATICA }}
      >
        <motion.div
          className="acesso-cartao-conteudo"
          initial={reduzirMovimento ? false : FADE_ABA.initial}
          animate={FADE_ABA.animate}
          exit={reduzirMovimento ? undefined : FADE_ABA.exit}
        >
          <div className="acesso-microtitulo">
            <span>Acesse sua conta</span>
            <span className="acesso-microtitulo-linha" />
          </div>

          <h2 className="acesso-titulo" id="login-title">
            Que bom ter você de volta.
          </h2>
          <p className="acesso-subtitulo">
            Entre no Bloom para acompanhar o bem-estar da sua instituição.
          </p>

          <form className="acesso-formulario" onSubmit={entrar}>
            <div className="acesso-campos">
              <Input
                id="email"
                nome="email"
                obrigatorio
                tipo="email"
                rotulo="E-mail"
                imagemAcesso="email"
                autocompletar="email"
                placeholder="seuemail@instituicao.com"
              />

              <Input
                id="senha"
                nome="senha"
                obrigatorio
                tipo="senha"
                rotulo="Senha"
                imagemAcesso="cadeado"
                autocompletar="current-password"
                placeholder="Digite sua senha"
                rodape={
                  <button
                    className="acesso-recuperar"
                    type="button"
                    onClick={aoRecuperarSenha}
                  >
                    Esqueci a senha
                  </button>
                }
              />
            </div>

            {erro && (
              <p
                role="alert"
                className="acesso-erro"
                style={{
                  color: "#c23e48",
                  fontSize: "14px",
                  marginTop: "2px",
                  WebkitTextStroke: "0.55px #c23e48",
                }}
              >
                {erro}
              </p>
            )}

            <div className="acesso-envio">
              <Botao estilo="principal" tipo="submit">
                Entrar
              </Botao>
            </div>
          </form>

          <div className="acesso-redes">
            <div className="acesso-redes-botao">
              <button
                type="button"
                className="bloom-botao bloom-botao-contorno"
                onClick={() => loginComGoogle()}
              >
                <img src={iconeGoogle} alt="" />
                Entrar com Google
              </button>
            </div>

            <div className="acesso-redes-botao">
              <button
                type="button"
                className="bloom-botao bloom-botao-contorno"
                disabled
              >
                <img src={iconeFacebook} alt="" />
                Facebook
              </button>
            </div>
          </div>

          <p className="acesso-cadastro">
            Ainda não possui uma conta?{" "}
            <button
              className="acesso-texto-botao"
              type="button"
              onClick={aoCriarConta}
            >
              Criar uma conta
            </button>
          </p>
        </motion.div>
      </motion.section>

      {saindo &&
        createPortal(
          <motion.div
            className="bloom-transicao-login"
            aria-hidden="true"
            initial={{
              clipPath: reduzirMovimento ? "inset(0)" : "inset(0 0 0 100%)",
            }}
            animate={{ clipPath: "inset(0 0 0 0%)" }}
            transition={{
              duration: reduzirMovimento ? 0 : 0.48,
              ease: CURVA_CINEMATICA,
            }}
            onAnimationComplete={() => {
              sessionStorage.setItem("bloom-transicao-entrada", "1");
              aoEntrar();
            }}
          />,
          document.body
        )}
    </LayoutAutenticacao>
  );
}

export default Login;