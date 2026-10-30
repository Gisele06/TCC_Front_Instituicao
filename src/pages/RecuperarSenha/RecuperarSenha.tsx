import { useState } from "react";
import type { FormEvent } from "react";
import Botao from "../../components/Button/Button";
import {
  CampoAcesso,
  EtapasAcesso,
  IconeAcesso,
  RequisitosSenha,
} from "../../components/AcessoFluxo/AcessoFluxo";
import iconeLogoBloom from "../../assets/icons/logo-b.png";
import imagemDeFundoDoAcesso from "../../assets/images/login-hero.png";
import iconeSetaVoltar from "../../assets/icons/seta-voltar.png";
import "../auth.css";

interface PropriedadesRecuperarSenha {
  aoVoltar: () => void;
}

const etapasDaRecuperacao = ["E-mail", "Troca de senha"];

function RecuperarSenha({ aoVoltar }: PropriedadesRecuperarSenha) {
  const [etapa, definirEtapa] = useState(1);
  const [email, definirEmail] = useState("");
  const [senha, definirSenha] = useState("");
  const [confirmarSenha, definirConfirmarSenha] = useState("");
  const [senhaVisivel, definirSenhaVisivel] = useState(false);
  const [confirmacaoVisivel, definirConfirmacaoVisivel] = useState(false);
  const [erro, definirErro] = useState("");

  function voltarEtapa() {
    definirErro("");
    if (etapa === 2) {
      definirEtapa(1);
    } else {
      aoVoltar();
    }
  }

  function avancar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (etapa === 1) {
      definirEtapa(2);
      return;
    }

    if (senha !== confirmarSenha) {
      definirErro("As senhas não coincidem.");
      return;
    }

    aoVoltar();
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

      <section
        className="acesso-cartao acesso-cartao-recuperacao acesso-cartao-fluxo"
        aria-labelledby="recovery-title"
      >
        <div className="acesso-microtitulo">
          <button
            className="acesso-voltar-botao"
            type="button"
            aria-label={etapa === 1 ? "Voltar para o login" : "Voltar para o e-mail"}
            onClick={voltarEtapa}
          >
            <img src={iconeSetaVoltar} alt="" />
          </button>
          <span>Redefinir senha</span>
          <span className="acesso-microtitulo-linha" />
        </div>

        <h2 className="acesso-titulo" id="recovery-title">Redefinição de senha</h2>
        <p className="acesso-subtitulo">Primeiro insira o e-mail da instituição.</p>

        <EtapasAcesso etapas={etapasDaRecuperacao} etapaAtual={etapa} />

        <form className="recuperacao-formulario" onSubmit={avancar}>
          {etapa === 1 ? (
            <CampoAcesso id="email-recuperacao" rotulo="E-mail" icone="email" className="recuperacao-campo-email">
              <input
                id="email-recuperacao"
                type="email"
                autoComplete="email"
                placeholder="seuemail@instituicao.com"
                value={email}
                onChange={(evento) => definirEmail(evento.target.value)}
                required
              />
            </CampoAcesso>
          ) : (
            <>
              <CampoAcesso id="senha-recuperacao" rotulo="Senha" icone="cadeado" className="acesso-campo-senha">
                <input
                  id="senha-recuperacao"
                  className={senhaVisivel ? "acesso-senha-visivel" : ""}
                  type={senhaVisivel ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Digite sua senha"
                  value={senha}
                  onChange={(evento) => {
                    definirSenha(evento.target.value);
                    definirErro("");
                  }}
                  pattern="(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}"
                  title="Use ao menos 8 caracteres, com letra maiúscula, número e símbolo."
                  required
                />
                <button
                  className="acesso-senha-alternancia"
                  type="button"
                  aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={senhaVisivel}
                  onClick={() => definirSenhaVisivel((visivel) => !visivel)}
                >
                  <IconeAcesso tipo="olho" />
                </button>
              </CampoAcesso>
              <RequisitosSenha senha={senha} />

              <CampoAcesso id="confirmar-senha-recuperacao" rotulo="Confirmar senha" icone="cadeado" className="acesso-campo-confirmacao">
                <input
                  id="confirmar-senha-recuperacao"
                  className={confirmacaoVisivel ? "acesso-senha-visivel" : ""}
                  type={confirmacaoVisivel ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirme sua senha"
                  value={confirmarSenha}
                  onChange={(evento) => {
                    definirConfirmarSenha(evento.target.value);
                    definirErro("");
                  }}
                  required
                />
                <button
                  className="acesso-senha-alternancia"
                  type="button"
                  aria-label={confirmacaoVisivel ? "Ocultar confirmação da senha" : "Mostrar confirmação da senha"}
                  aria-pressed={confirmacaoVisivel}
                  onClick={() => definirConfirmacaoVisivel((visivel) => !visivel)}
                >
                  <IconeAcesso tipo="olho" />
                </button>
              </CampoAcesso>
              {erro && <p className="acesso-erro" role="alert">{erro}</p>}
            </>
          )}

          <div className="acesso-envio">
            <Botao estilo="principal" type="submit">Avançar</Botao>
          </div>
        </form>
      </section>
    </main>
  );
}

export default RecuperarSenha;
