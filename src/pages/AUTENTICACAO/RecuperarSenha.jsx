import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../components/Gerais/Input/Input.jsx";
import LayoutAutenticacao from "../../components/Login/LayoutAutenticacao/LayoutAutenticacao.jsx";
import {
  validarRecuperacao,
  iniciarRecuperacao,
  redefinirSenha,
} from "../../js/Rotas_RECUPERAR_SENHA/rotas_RECUPERAR_SENHA.js";
import Botao from "../../components/Gerais/Botao/Botao.jsx";
import RequisitosSenha from "../../components/Login/RequisitosSenha/RequisitosSenha.jsx";
import iconeSetaVoltar from "../../img/icones/seta-voltar.png";
import "./RecuperarSenha.css";

const CURVA_SUAVE = [0.22, 1, 0.36, 1];
const TRANSICAO_FADE = { duration: 0.22, ease: "easeOut" };

const etapasDaRecuperacao = [
  { numero: 1, rotulo: "E-mail" },
  { numero: 2, rotulo: "Nova senha" },
];

const subtitulosRecuperacao = [
  "Informe o e-mail institucional vinculado à sua conta.",
  "Crie uma nova senha segura para recuperar seu acesso.",
  "Tudo pronto! Sua senha foi atualizada com sucesso.",
];

const variantesSlide = {
  entrar: (direcao) => ({
    opacity: 0,
    x: direcao > 0 ? 44 : -44,
  }),
  centro: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: CURVA_SUAVE },
  },
  sair: (direcao) => ({
    opacity: 0,
    x: direcao > 0 ? -44 : 44,
    transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
  }),
};

function CheckAnimado({ tamanho = 16, traco = 2.8, atraso = 0.08 }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d="M5 12.8L9.6 17.4L19 7.6"
        stroke="currentColor"
        strokeWidth={traco}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          pathLength: { duration: 0.34, delay: atraso, ease: CURVA_SUAVE },
          opacity: { duration: 0.12, delay: atraso },
        }}
      />
    </svg>
  );
}

function EtapasRecuperacao({ etapaAtual, aoSelecionarEtapa }) {
  return (
    <div className="rec-etapas" role="list" aria-label="Etapas da redefinição">
      {etapasDaRecuperacao.map((item, indice) => {
        const concluida = etapaAtual > item.numero;
        const ativa = etapaAtual === item.numero;
        const podeVoltar = concluida && etapaAtual < 3;
        const linhaPreenchida = etapaAtual > item.numero;

        return (
          <div className="rec-etapa-bloco" key={item.numero} role="listitem">
            <button
              type="button"
              className={`rec-etapa-item ${
                concluida
                  ? "rec-etapa-item--concluida"
                  : ativa
                    ? "rec-etapa-item--ativa"
                    : "rec-etapa-item--pendente"
              }`}
              disabled={!podeVoltar}
              onClick={() => podeVoltar && aoSelecionarEtapa(item.numero)}
            >
              <motion.span
                className="rec-etapa-badge"
                animate={{
                  backgroundColor: concluida
                    ? "#548d72"
                    : ativa
                      ? "#173733"
                      : "#ecebe1",
                  borderColor: concluida
                    ? "#548d72"
                    : ativa
                      ? "#173733"
                      : "#d5d3c5",
                  color: concluida || ativa ? "#ffffff" : "#7e9491",
                  scale: ativa ? 1 : 0.96,
                }}
                transition={{ duration: 0.28, ease: CURVA_SUAVE }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {concluida ? (
                    <motion.span
                      key={`check-${item.numero}`}
                      className="rec-etapa-badge-inner"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.2, ease: CURVA_SUAVE }}
                    >
                      <CheckAnimado tamanho={16} traco={3} atraso={0.08} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key={`num-${item.numero}`}
                      className="rec-etapa-badge-inner"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.18, ease: CURVA_SUAVE }}
                    >
                      {item.numero}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.span>

              <motion.span
                className="rec-etapa-rotulo"
                animate={{
                  color: concluida ? "#3d745a" : ativa ? "#173733" : "#8a9f9c",
                }}
                transition={{ duration: 0.25 }}
              >
                {item.rotulo}
              </motion.span>
            </button>

            {indice < etapasDaRecuperacao.length - 1 && (
              <span className="rec-etapa-trilha" aria-hidden="true">
                <motion.span
                  className="rec-etapa-trilha-preenchimento"
                  initial={false}
                  animate={{ scaleX: linhaPreenchida ? 1 : 0 }}
                  transition={{ duration: 0.38, ease: CURVA_SUAVE }}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function RecuperarSenha({ aoVoltar }) {
  const [etapa, definirEtapa] = useState(1);
  const [direcao, definirDirecao] = useState(1);
  const [email, definirEmail] = useState("");
  const [senha, definirSenha] = useState("");
  const [confirmarSenha, definirConfirmarSenha] = useState("");
  const [erro, definirErro] = useState("");
  const [codigoDemo, definirCodigoDemo] = useState("");
  const [codigo, definirCodigo] = useState("");

  function irParaEtapa(novaEtapa) {
    definirErro("");
    definirDirecao(novaEtapa >= etapa ? 1 : -1);
    definirEtapa(novaEtapa);
  }

  function voltarEtapa() {
    definirErro("");
    if (etapa === 2) {
      irParaEtapa(1);
    } else {
      aoVoltar();
    }
  }

  async function avancar(evento) {
    evento.preventDefault();

    if (etapa === 1) {
      try {
        const resultado = await iniciarRecuperacao(email);
        if (!resultado) {
          definirErro("Conta local não encontrada.");
          return;
        }
        definirCodigoDemo(resultado);
        definirCodigo("");
      } catch (e) {
        definirErro(e.message);
        return;
      }
      irParaEtapa(2);
      return;
    }

    if (etapa === 2) {
      if (!validarRecuperacao(senha, confirmarSenha)) {
        definirErro("As senhas não coincidem. Verifique e tente novamente.");
        return;
      }
      try {
        if (!(await redefinirSenha(email, codigo, senha, confirmarSenha))) {
          definirErro("Código inválido ou expirado. Reinicie a recuperação.");
          return;
        }
      } catch (e) {
        definirErro(e.message);
        return;
      }
      irParaEtapa(3);
      return;
    }

    aoVoltar();
  }

  const temConfirmacao = confirmarSenha.length > 0;
  const senhasIguais = temConfirmacao && senha === confirmarSenha;

  const textoBotao =
    etapa === 1
      ? "Continuar"
      : etapa === 2
        ? "Redefinir senha"
        : "Voltar para o login";

  return (
    <LayoutAutenticacao>
      <section
        className="acesso-cartao acesso-cartao-recuperacao acesso-cartao-fluxo"
        aria-labelledby="recovery-title"
      >
        <motion.div
          className="acesso-cartao-conteudo"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 0.55, ease: "easeOut" },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 0.42, ease: "easeInOut" },
          }}
        >
          <div className="acesso-microtitulo">
            <button
              className="acesso-voltar-botao"
              type="button"
              aria-label={
                etapa === 2 ? "Voltar para o e-mail" : "Voltar para o login"
              }
              onClick={voltarEtapa}
            >
              <img src={iconeSetaVoltar} alt="" />
            </button>
            <span>Redefinir senha</span>
            <span className="acesso-microtitulo-linha" />
          </div>

          <h2 className="acesso-titulo" id="recovery-title">
            Redefinição de senha
          </h2>

          <div className="acesso-subtitulo-caixa">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`sub-rec-${etapa}`}
                className="acesso-subtitulo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {subtitulosRecuperacao[etapa - 1]}
              </motion.p>
            </AnimatePresence>
          </div>

          <EtapasRecuperacao
            etapaAtual={etapa}
            aoSelecionarEtapa={(destino) => irParaEtapa(destino)}
          />

          <form className="recuperacao-formulario" onSubmit={avancar}>
            <div className="recuperacao-viewport">
              <AnimatePresence mode="wait" custom={direcao} initial={false}>
                <motion.div
                  key={`etapa-rec-${etapa}`}
                  custom={direcao}
                  variants={variantesSlide}
                  initial="entrar"
                  animate="centro"
                  exit="sair"
                  className="acesso-etapa-conteudo"
                >
                  {etapa === 1 && (
                    <>
                      <Input
                        rotulo="E-mail institucional"
                        imagemAcesso="email"
                        classeCampo="recuperacao-campo-email"
                        id="email-recuperacao"
                        tipo="email"
                        autocompletar="email"
                        placeholder="seuemail@instituicao.com"
                        valor={email}
                        aoAlterar={(evento) =>
                          definirEmail(evento.target.value)
                        }
                        obrigatorio
                      />

                      <div className="rec-dica-caixa">
                        <span className="rec-dica-icone" aria-hidden="true">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.1"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                            <path d="M9.5 12.2l1.8 1.8 3.7-3.8" />
                          </svg>
                        </span>
                        <div className="rec-dica-textos">
                          <strong>Recuperação demonstrativa</strong>
                          <p>
                            Use o mesmo e-mail cadastrado na sua instituição
                            para liberar a criação da nova senha na próxima
                            etapa.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {etapa === 2 && (
                    <>
                      <p>
                        Simulação local, sem envio de e-mail. Código de teste:{" "}
                        {codigoDemo}
                      </p>
                      <Input
                        tipo="texto"
                        rotulo="Código de teste"
                        valor={codigo}
                        aoAlterar={(e) => definirCodigo(e.target.value)}
                        obrigatorio
                      />
                      <div className="rec-email-resumo">
                        <span className="rec-email-resumo-info">
                          <span className="rec-email-resumo-rotulo">Conta</span>
                          <strong className="rec-email-resumo-valor">
                            {email}
                          </strong>
                        </span>
                        <button
                          type="button"
                          className="rec-email-alterar"
                          onClick={() => irParaEtapa(1)}
                        >
                          Alterar
                        </button>
                      </div>

                      <Input
                        rotulo="Nova senha"
                        imagemAcesso="cadeado"
                        classeCampo="acesso-campo-senha"
                        tipo="senha"
                        id="senha-recuperacao"
                        autocompletar="new-password"
                        placeholder="Digite sua nova senha"
                        valor={senha}
                        aoAlterar={(evento) => {
                          definirSenha(evento.target.value);
                          definirErro("");
                        }}
                        padrao="(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}"
                        titulo="Use ao menos 8 caracteres, com letra maiúscula, número e símbolo."
                        obrigatorio
                      />
                      <RequisitosSenha senha={senha} />

                      <Input
                        rotulo="Confirmar nova senha"
                        imagemAcesso="cadeado"
                        classeCampo="acesso-campo-confirmacao"
                        tipo="senha"
                        id="confirmar-senha-recuperacao"
                        autocompletar="new-password"
                        placeholder="Confirme sua nova senha"
                        valor={confirmarSenha}
                        aoAlterar={(evento) => {
                          definirConfirmarSenha(evento.target.value);
                          definirErro("");
                        }}
                        obrigatorio
                      />

                      <div className="rec-status-linha">
                        <AnimatePresence mode="wait">
                          {erro ? (
                            <motion.p
                              key="erro-rec"
                              className="acesso-erro"
                              role="alert"
                              initial={{ opacity: 0, y: -3 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -3 }}
                              transition={{ duration: 0.18 }}
                            >
                              {erro}
                            </motion.p>
                          ) : temConfirmacao ? (
                            <motion.p
                              key={senhasIguais ? "ok-rec" : "diff-rec"}
                              className={`rec-match-status ${
                                senhasIguais
                                  ? "rec-match-status--ok"
                                  : "rec-match-status--aviso"
                              }`}
                              initial={{ opacity: 0, y: -3 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -3 }}
                              transition={{ duration: 0.18 }}
                            >
                              {senhasIguais
                                ? "As senhas coincidem."
                                : "As senhas ainda não coincidem."}
                            </motion.p>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    </>
                  )}

                  {etapa === 3 && (
                    <div className="rec-sucesso-caixa">
                      <motion.div
                        className="rec-sucesso-circulo"
                        initial={{ scale: 0.72, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.36, ease: CURVA_SUAVE }}
                      >
                        <CheckAnimado tamanho={32} traco={3} atraso={0.14} />
                      </motion.div>

                      <h3 className="rec-sucesso-titulo">Senha redefinida!</h3>
                      <p className="rec-sucesso-texto">
                        A nova senha para <strong>{email}</strong> já está
                        ativa. Você já pode entrar novamente na plataforma.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="acesso-envio">
              <Botao estilo="principal" tipo="submit">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={textoBotao}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.16 }}
                  >
                    {textoBotao}
                  </motion.span>
                </AnimatePresence>
              </Botao>
            </div>
          </form>
        </motion.div>
      </section>
    </LayoutAutenticacao>
  );
}

export default RecuperarSenha;
