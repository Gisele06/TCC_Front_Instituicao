import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Input from "../../components/Gerais/Input/Input.jsx";
import LayoutAutenticacao from "../../components/Login/LayoutAutenticacao/LayoutAutenticacao.jsx";
import {
  validarCadastro,
  cadastrarUsuario,
} from "../../js/Rotas_CADASTRO/rotas_CADASTRO.js";
import Botao from "../../components/Gerais/Botao/Botao.jsx";
import RequisitosSenha from "../../components/Login/RequisitosSenha/RequisitosSenha.jsx";
import iconeSetaVoltar from "../../img/icones/seta-voltar.png";
import "./Cadastro.css";

const CURVA_SUAVE = [0.22, 1, 0.36, 1];
const TRANSICAO_FADE = { duration: 0.22, ease: "easeOut" };

const etapasDoCadastro = [
  { numero: 1, rotulo: "Seus dados" },
  { numero: 2, rotulo: "Instituição" },
  { numero: 3, rotulo: "Acesso" },
];

const subtitulos = [
  "Primeiro vamos preencher seus dados pessoais.",
  "Agora conte um pouco sobre a sua instituição.",
  "Por fim, crie uma senha segura para o seu acesso.",
  "Tudo pronto! Seu cadastro institucional foi concluído.",
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

function CheckAnimado({ tamanho = 15, traco = 2.8, atraso = 0.08 }) {
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

function EtapasCadastro({ etapaAtual, aoSelecionarEtapa }) {
  return (
    <div className="cad-etapas" role="list" aria-label="Etapas do cadastro">
      {etapasDoCadastro.map((item, indice) => {
        const concluida = etapaAtual > item.numero;
        const ativa = etapaAtual === item.numero;
        const podeVoltar = concluida && etapaAtual < 4;
        const linhaPreenchida = etapaAtual > item.numero;
        const ehUltima = indice === etapasDoCadastro.length - 1;

        return (
          <div
            className={`cad-etapa-bloco ${ehUltima ? "cad-etapa-bloco--final" : ""}`}
            key={item.numero}
            role="listitem"
          >
            <button
              type="button"
              className={`cad-etapa-item ${
                concluida
                  ? "cad-etapa-item--concluida"
                  : ativa
                    ? "cad-etapa-item--ativa"
                    : "cad-etapa-item--pendente"
              }`}
              disabled={!podeVoltar}
              onClick={() => podeVoltar && aoSelecionarEtapa(item.numero)}
            >
              <motion.span
                className="cad-etapa-badge"
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
                      className="cad-etapa-badge-inner"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.7, opacity: 0 }}
                      transition={{ duration: 0.2, ease: CURVA_SUAVE }}
                    >
                      <CheckAnimado tamanho={15} traco={3} atraso={0.08} />
                    </motion.span>
                  ) : (
                    <motion.span
                      key={`num-${item.numero}`}
                      className="cad-etapa-badge-inner"
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
                className="cad-etapa-rotulo"
                animate={{
                  color: concluida ? "#3d745a" : ativa ? "#173733" : "#8a9f9c",
                }}
                transition={{ duration: 0.25 }}
              >
                {item.rotulo}
              </motion.span>
            </button>

            {!ehUltima && (
              <span className="cad-etapa-trilha" aria-hidden="true">
                <motion.span
                  className="cad-etapa-trilha-preenchimento"
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

function Cadastro({ aoVoltar }) {
  const [etapa, definirEtapa] = useState(1);
  const [direcao, definirDirecao] = useState(1);
  const [dados, definirDados] = useState({
    nome: "",
    email: "",
    cargo: "coordenadora",
    instituicao: "",
    segmento: "tecnico",
    telefone: "",
    estado: "São Paulo",
    cidade: "Jandira",
    senha: "",
    confirmarSenha: "",
  });
  const [erro, definirErro] = useState("");

  function atualizar(campo, valor) {
    definirDados((anteriores) => ({
      ...anteriores,
      [campo]: valor,
    }));
    definirErro("");
  }

  function irParaEtapa(novaEtapa) {
    definirErro("");
    definirDirecao(novaEtapa >= etapa ? 1 : -1);
    definirEtapa(novaEtapa);
  }

  function voltarEtapa() {
    definirErro("");
    if (etapa > 1 && etapa < 4) {
      irParaEtapa(etapa - 1);
    } else {
      aoVoltar();
    }
  }

  async function avancar(evento) {
    evento.preventDefault();

    if (etapa < etapasDoCadastro.length) {
      irParaEtapa(etapa + 1);
      return;
    }

    if (etapa === etapasDoCadastro.length) {
      if (!validarCadastro(dados)) {
        definirErro("As senhas não coincidem. Verifique e tente novamente.");
        return;
      }
      try {
        if (!(await cadastrarUsuario(dados))) {
          definirErro("E-mail já cadastrado ou dados inválidos.");
          return;
        }
      } catch (e) {
        definirErro(e.message);
        return;
      }
      irParaEtapa(4);
      return;
    }

    aoVoltar();
  }

  const temConfirmacao = dados.confirmarSenha.length > 0;
  const senhasIguais = temConfirmacao && dados.senha === dados.confirmarSenha;

  const textoBotao =
    etapa < etapasDoCadastro.length
      ? "Continuar"
      : etapa === etapasDoCadastro.length
        ? "Criar conta"
        : "Voltar para o login";

  return (
    <LayoutAutenticacao>
      <section
        className="acesso-cartao acesso-cartao-cadastro acesso-cartao-fluxo"
        aria-labelledby="register-title"
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
                etapa === 1 || etapa === 4
                  ? "Voltar para o login"
                  : "Voltar para a etapa anterior"
              }
              onClick={voltarEtapa}
            >
              <img src={iconeSetaVoltar} alt="" />
            </button>
            <span>Criação de conta</span>
            <span className="acesso-microtitulo-linha" />
          </div>

          <h2 className="acesso-titulo" id="register-title">
            Criar acesso institucional
          </h2>

          <div className="acesso-subtitulo-caixa">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={`sub-cad-${etapa}`}
                className="acesso-subtitulo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                {subtitulos[etapa - 1]}
              </motion.p>
            </AnimatePresence>
          </div>

          <EtapasCadastro
            etapaAtual={etapa}
            aoSelecionarEtapa={(destino) => irParaEtapa(destino)}
          />

          <form
            className="cadastro-formulario cadastro-formulario-fluxo"
            onSubmit={avancar}
          >
            <div className="cadastro-viewport">
              <AnimatePresence mode="wait" custom={direcao} initial={false}>
                <motion.div
                  key={`etapa-cad-${etapa}`}
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
                        rotulo="Nome completo"
                        imagemAcesso="pessoa"
                        classeCampo="cadastro-nome-campo"
                        id="nome"
                        tipo="texto"
                        autocompletar="name"
                        placeholder="Seu nome completo"
                        valor={dados.nome}
                        aoAlterar={(evento) =>
                          atualizar("nome", evento.target.value)
                        }
                        obrigatorio
                      />

                      <div className="cadastro-campos-linha cadastro-campos-linha-fluxo">
                        <Input
                          rotulo="E-mail institucional"
                          imagemAcesso="email"
                          id="email-cadastro"
                          tipo="email"
                          autocompletar="email"
                          placeholder="seuemail@instituicao.com"
                          valor={dados.email}
                          aoAlterar={(evento) =>
                            atualizar("email", evento.target.value)
                          }
                          obrigatorio
                        />

                        <Input
                          rotulo="Cargo"
                          imagemAcesso="formacao"
                          classeCampo="acesso-campo-selecao"
                          tipo="selecao"
                          id="cargo"
                          valor={dados.cargo}
                          aoAlterar={(evento) =>
                            atualizar("cargo", evento.target.value)
                          }
                          obrigatorio
                        >
                          <option value="coordenadora">Coordenadora</option>
                          <option value="coordenador">Coordenador</option>
                          <option value="professor">Professor(a)</option>
                        </Input>
                      </div>

                      <div className="cad-dica-caixa">
                        <span className="cad-dica-icone" aria-hidden="true">
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
                        <div className="cad-dica-textos">
                          <strong>Acesso exclusivo para gestores</strong>
                          <p>
                            Utilize seu e-mail institucional para vincular sua
                            conta ao painel de acompanhamento da escola.
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  {etapa === 2 && (
                    <>
                      <Input
                        rotulo="Nome da instituição"
                        imagemAcesso="instituicao"
                        classeCampo="cadastro-campo-instituicao"
                        id="instituicao"
                        tipo="texto"
                        autocompletar="organization"
                        placeholder="Nome da instituição"
                        valor={dados.instituicao}
                        aoAlterar={(evento) =>
                          atualizar("instituicao", evento.target.value)
                        }
                        obrigatorio
                      />

                      <div className="cadastro-campos-linha-fluxo">
                        <Input
                          rotulo="Segmento educacional"
                          imagemAcesso="formacao"
                          classeCampo="acesso-campo-selecao"
                          tipo="selecao"
                          id="segmento"
                          valor={dados.segmento}
                          aoAlterar={(evento) =>
                            atualizar("segmento", evento.target.value)
                          }
                          obrigatorio
                        >
                          <option value="tecnico">Técnico</option>
                          <option value="medio">Ensino Médio</option>
                          <option value="superior">Ensino Superior</option>
                          <option value="pos-graduacao">Pós-graduação</option>
                        </Input>

                        <Input
                          rotulo="Telefone"
                          imagemAcesso="telefone"
                          id="telefone"
                          tipo="telefone"
                          autocompletar="tel"
                          inputMode="tel"
                          placeholder="(11) 99999-9999"
                          padrao="\(\d{2}\) \d{4,5}-\d{4}"
                          valor={dados.telefone}
                          aoAlterar={(evento) =>
                            atualizar("telefone", evento.target.value)
                          }
                          obrigatorio
                        />
                      </div>

                      <div className="cadastro-campos-linha-fluxo">
                        <Input
                          rotulo="Estado"
                          imagemAcesso="estado"
                          classeCampo="acesso-campo-selecao"
                          tipo="selecao"
                          id="estado"
                          valor={dados.estado}
                          aoAlterar={(evento) =>
                            atualizar("estado", evento.target.value)
                          }
                          obrigatorio
                        >
                          <option>São Paulo</option>
                          <option>Rio de Janeiro</option>
                          <option>Minas Gerais</option>
                          <option>Paraná</option>
                        </Input>

                        <Input
                          rotulo="Cidade"
                          imagemAcesso="cidade"
                          classeCampo="acesso-campo-selecao"
                          tipo="selecao"
                          id="cidade"
                          valor={dados.cidade}
                          aoAlterar={(evento) =>
                            atualizar("cidade", evento.target.value)
                          }
                          obrigatorio
                        >
                          <option>Jandira</option>
                          <option>São Paulo</option>
                          <option>Osasco</option>
                          <option>Barueri</option>
                        </Input>
                      </div>
                    </>
                  )}

                  {etapa === 3 && (
                    <>
                      <Input
                        rotulo="Senha"
                        imagemAcesso="cadeado"
                        classeCampo="acesso-campo-senha"
                        tipo="senha"
                        id="senha-cadastro"
                        autocompletar="new-password"
                        placeholder="Digite sua senha"
                        valor={dados.senha}
                        aoAlterar={(evento) =>
                          atualizar("senha", evento.target.value)
                        }
                        padrao="(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}"
                        titulo="Use ao menos 8 caracteres, com letra maiúscula, número e símbolo."
                        obrigatorio
                      />
                      <RequisitosSenha senha={dados.senha} />

                      <Input
                        rotulo="Confirmar senha"
                        imagemAcesso="cadeado"
                        classeCampo="acesso-campo-confirmacao"
                        tipo="senha"
                        id="confirmar-senha-cadastro"
                        autocompletar="new-password"
                        placeholder="Confirme sua senha"
                        valor={dados.confirmarSenha}
                        aoAlterar={(evento) =>
                          atualizar("confirmarSenha", evento.target.value)
                        }
                        obrigatorio
                      />

                      <div className="cad-status-linha">
                        <AnimatePresence mode="wait">
                          {erro ? (
                            <motion.p
                              key="erro-cad"
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
                              key={senhasIguais ? "ok-cad" : "diff-cad"}
                              className={`cad-match-status ${
                                senhasIguais
                                  ? "cad-match-status--ok"
                                  : "cad-match-status--aviso"
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

                  {etapa === 4 && (
                    <div className="cad-sucesso-caixa">
                      <motion.div
                        className="cad-sucesso-circulo"
                        initial={{ scale: 0.72, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.36, ease: CURVA_SUAVE }}
                      >
                        <CheckAnimado tamanho={32} traco={3} atraso={0.14} />
                      </motion.div>

                      <h3 className="cad-sucesso-titulo">Conta criada!</h3>
                      <p className="cad-sucesso-texto">
                        O acesso institucional de{" "}
                        <strong>
                          {dados.instituicao || "sua instituição"}
                        </strong>{" "}
                        foi registrado para <strong>{dados.email}</strong>. Você
                        já pode fazer login na plataforma.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="acesso-envio cadastro-envio">
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

export default Cadastro;
