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

interface PropriedadesCadastro {
  aoVoltar: () => void;
}

interface DadosCadastro {
  nome: string;
  email: string;
  cargo: string;
  instituicao: string;
  segmento: string;
  telefone: string;
  estado: string;
  cidade: string;
  senha: string;
  confirmarSenha: string;
}

const etapasDoCadastro = ["Seus dados", "Sua instituição", "Seu acesso"];

function formatarTelefone(valor: string) {
  const digitos = valor.replace(/\D/g, "").slice(0, 11);

  if (digitos.length <= 2) return digitos ? `(${digitos}` : "";
  if (digitos.length <= 6) return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;

  const limiteLocal = digitos.length > 10 ? 7 : 6;
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, limiteLocal)}-${digitos.slice(limiteLocal)}`;
}

function Cadastro({ aoVoltar }: PropriedadesCadastro) {
  const [etapa, definirEtapa] = useState(1);
  const [dados, definirDados] = useState<DadosCadastro>({
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
  const [senhaVisivel, definirSenhaVisivel] = useState(false);
  const [confirmacaoVisivel, definirConfirmacaoVisivel] = useState(false);
  const [erro, definirErro] = useState("");

  function atualizar<K extends keyof DadosCadastro>(campo: K, valor: DadosCadastro[K]) {
    definirDados((anteriores) => ({ ...anteriores, [campo]: valor }));
    definirErro("");
  }

  function voltarEtapa() {
    definirErro("");
    if (etapa > 1) {
      definirEtapa((anterior) => anterior - 1);
    } else {
      aoVoltar();
    }
  }

  function avancar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if (etapa < etapasDoCadastro.length) {
      definirEtapa((anterior) => anterior + 1);
      return;
    }

    if (dados.senha !== dados.confirmarSenha) {
      definirErro("As senhas não coincidem.");
      return;
    }

    aoVoltar();
  }

  const subtitulos = [
    "Primeiro vamos criar sua conta.",
    "Agora algumas informações sobre sua instituição.",
    "Por fim, crie uma senha forte.",
  ];

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
        className="acesso-cartao acesso-cartao-cadastro acesso-cartao-fluxo"
        aria-labelledby="register-title"
      >
        <div className="acesso-microtitulo">
          <button
            className="acesso-voltar-botao"
            type="button"
            aria-label={etapa === 1 ? "Voltar para o login" : "Voltar para a etapa anterior"}
            onClick={voltarEtapa}
          >
            <img src={iconeSetaVoltar} alt="" />
          </button>
          <span>Criação de conta</span>
          <span className="acesso-microtitulo-linha" />
        </div>

        <h2 className="acesso-titulo" id="register-title">Criar acesso institucional</h2>
        <p className="acesso-subtitulo">{subtitulos[etapa - 1]}</p>

        <EtapasAcesso etapas={etapasDoCadastro} etapaAtual={etapa} />

        <form className="cadastro-formulario cadastro-formulario-fluxo" onSubmit={avancar}>
          {etapa === 1 && (
            <>
              <CampoAcesso id="nome" rotulo="Nome completo" icone="pessoa" className="cadastro-nome-campo">
                <input
                  id="nome"
                  type="text"
                  autoComplete="name"
                  placeholder="Seu nome"
                  value={dados.nome}
                  onChange={(evento) => atualizar("nome", evento.target.value)}
                  required
                />
              </CampoAcesso>

              <div className="cadastro-campos-linha cadastro-campos-linha-fluxo">
                <CampoAcesso id="email-cadastro" rotulo="E-mail" icone="email">
                  <input
                    id="email-cadastro"
                    type="email"
                    autoComplete="email"
                    placeholder="seuemail@instituicao.com"
                    value={dados.email}
                    onChange={(evento) => atualizar("email", evento.target.value)}
                    required
                  />
                </CampoAcesso>

                <CampoAcesso id="cargo" rotulo="Cargo" icone="formacao" className="acesso-campo-selecao">
                  <select
                    id="cargo"
                    value={dados.cargo}
                    onChange={(evento) => atualizar("cargo", evento.target.value)}
                    required
                  >
                    <option value="coordenadora">Coordenadora</option>
                    <option value="coordenador">Coordenador</option>
                    <option value="professor">Professor(a)</option>
                  </select>
                  <IconeAcesso tipo="seta" className="acesso-icone-seta" />
                </CampoAcesso>
              </div>
            </>
          )}

          {etapa === 2 && (
            <>
              <CampoAcesso
                id="instituicao"
                rotulo="Nome da instituição"
                icone="instituicao"
                className="cadastro-campo-instituicao"
              >
                <input
                  id="instituicao"
                  type="text"
                  autoComplete="organization"
                  placeholder="Nome da instituição"
                  value={dados.instituicao}
                  onChange={(evento) => atualizar("instituicao", evento.target.value)}
                  required
                />
              </CampoAcesso>

              <div className="cadastro-campos-linha-fluxo">
                <CampoAcesso id="segmento" rotulo="Segmento educacional" icone="formacao" className="acesso-campo-selecao">
                  <select
                    id="segmento"
                    value={dados.segmento}
                    onChange={(evento) => atualizar("segmento", evento.target.value)}
                    required
                  >
                    <option value="tecnico">Técnico</option>
                    <option value="medio">Ensino Médio</option>
                    <option value="superior">Ensino Superior</option>
                    <option value="pos-graduacao">Pós-graduação</option>
                  </select>
                  <IconeAcesso tipo="seta" className="acesso-icone-seta" />
                </CampoAcesso>

                <CampoAcesso id="telefone" rotulo="Telefone" icone="telefone">
                  <input
                    id="telefone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="(11) 99999-9999"
                    pattern="\(\d{2}\) \d{4,5}-\d{4}"
                    value={dados.telefone}
                    onChange={(evento) => atualizar("telefone", formatarTelefone(evento.target.value))}
                    required
                  />
                </CampoAcesso>
              </div>

              <div className="cadastro-campos-linha-fluxo">
                <CampoAcesso id="estado" rotulo="Estado" icone="estado" className="acesso-campo-selecao">
                  <select
                    id="estado"
                    value={dados.estado}
                    onChange={(evento) => atualizar("estado", evento.target.value)}
                    required
                  >
                    <option>São Paulo</option>
                    <option>Rio de Janeiro</option>
                    <option>Minas Gerais</option>
                    <option>Paraná</option>
                  </select>
                  <IconeAcesso tipo="seta" className="acesso-icone-seta" />
                </CampoAcesso>

                <CampoAcesso id="cidade" rotulo="Cidade" icone="cidade" className="acesso-campo-selecao">
                  <select
                    id="cidade"
                    value={dados.cidade}
                    onChange={(evento) => atualizar("cidade", evento.target.value)}
                    required
                  >
                    <option>Jandira</option>
                    <option>São Paulo</option>
                    <option>Osasco</option>
                    <option>Barueri</option>
                  </select>
                  <IconeAcesso tipo="seta" className="acesso-icone-seta" />
                </CampoAcesso>
              </div>
            </>
          )}

          {etapa === 3 && (
            <>
              <CampoAcesso id="senha-cadastro" rotulo="Senha" icone="cadeado" className="acesso-campo-senha">
                <input
                  id="senha-cadastro"
                  className={senhaVisivel ? "acesso-senha-visivel" : ""}
                  type={senhaVisivel ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Digite sua senha"
                  value={dados.senha}
                  onChange={(evento) => atualizar("senha", evento.target.value)}
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
              <RequisitosSenha senha={dados.senha} />

              <CampoAcesso id="confirmar-senha-cadastro" rotulo="Confirmar senha" icone="cadeado" className="acesso-campo-confirmacao">
                <input
                  id="confirmar-senha-cadastro"
                  className={confirmacaoVisivel ? "acesso-senha-visivel" : ""}
                  type={confirmacaoVisivel ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Confirme sua senha"
                  value={dados.confirmarSenha}
                  onChange={(evento) => atualizar("confirmarSenha", evento.target.value)}
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

          <div className="acesso-envio cadastro-envio">
            <Botao estilo="principal" type="submit">Avançar</Botao>
          </div>
        </form>
      </section>
    </main>
  );
}

export default Cadastro;
