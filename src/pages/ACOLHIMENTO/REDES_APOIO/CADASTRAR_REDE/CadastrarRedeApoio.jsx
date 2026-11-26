import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../../../components/Gerais/Input/Input.jsx";
import MapaRedesApoio from "../../../../components/Acolhimento/MapaRedesApoio/MapaRedesApoio.jsx";
import {
  cadastrarRedeApoio,
  atualizarRedeApoio,
  excluirRedeApoio,
} from "../../../../js/Rotas_ACOLHIMENTO/rotas_ACOLHIMENTO.js";
import {
  CATEGORIAS_APOIO,
  buscarEnderecosPorTexto,
  buscarEnderecoPorCoordenada,
  buscarEnderecoPorCep,
  formatarCep,
  formatarTelefone,
  lerLocalizacaoEmCache,
  obterLocalizacaoUsuario,
} from "../../../../js/Rotas_ACOLHIMENTO/mapaApoio.js";
import iconeRedesApoio from "../../../../img/icones/Acolhimento/redesApoio.png";
import iconeLocal from "../../../../img/icones/Acolhimento/local.png";
import "./CadastrarRedeApoio.css";

function CadastrarRedeApoio() {
  const navegar = useNavigate();
  const location = useLocation();
  const redeEdicao = location.state?.rede || null;
  const modoEdicao = Boolean(redeEdicao?.id);

  const [nome, definirNome] = useState(redeEdicao?.nome || "");
  const [categoria, definirCategoria] = useState(redeEdicao?.categoria || "");
  const [descricao, definirDescricao] = useState(redeEdicao?.descricao || "");
  const [telefone, definirTelefone] = useState(
    formatarTelefone(redeEdicao?.telefone || redeEdicao?.contato || "")
  );
  const [email, definirEmail] = useState(redeEdicao?.email || "");
  const [site, definirSite] = useState(redeEdicao?.site || "");
  const [endereco, definirEndereco] = useState(redeEdicao?.endereco || "");
  const [cep, definirCep] = useState(formatarCep(redeEdicao?.cep || ""));
  const [ponto, definirPonto] = useState(
    redeEdicao?.latitude != null && redeEdicao?.longitude != null
      ? { lat: Number(redeEdicao.latitude), lng: Number(redeEdicao.longitude) }
      : null
  );
  const [localizacaoUsuario, definirLocalizacaoUsuario] = useState(() =>
    lerLocalizacaoEmCache()
  );

  const [sugestoes, definirSugestoes] = useState([]);
  const [buscandoSugestoes, definirBuscandoSugestoes] = useState(false);
  const [carregandoMapa, definirCarregandoMapa] = useState(false);
  const [erro, definirErro] = useState("");

  const ignorarProximaBuscaRef = useRef(false);
  const caixaEnderecoRef = useRef(null);

  function voltarParaRedes() {
    navegar("/acolhimento?aba=redesApoio");
  }

  // Captura a localização real do computador ao abrir a tela
  useEffect(() => {
    let ativo = true;
    obterLocalizacaoUsuario().then((coords) => {
      if (ativo && coords) definirLocalizacaoUsuario(coords);
    });
    return () => {
      ativo = false;
    };
  }, []);

  // Fecha sugestões ao clicar fora
  useEffect(() => {
    if (!sugestoes.length) return;
    function aoClicarFora(evento) {
      if (!caixaEnderecoRef.current?.contains(evento.target)) {
        definirSugestoes([]);
      }
    }
    document.addEventListener("mousedown", aoClicarFora);
    return () => document.removeEventListener("mousedown", aoClicarFora);
  }, [sugestoes.length]);

  // Digitar o endereço busca sugestões próximas à localização real
  useEffect(() => {
    if (ignorarProximaBuscaRef.current) {
      ignorarProximaBuscaRef.current = false;
      return;
    }

    const consulta = endereco.trim();
    if (consulta.length < 4) {
      definirSugestoes([]);
      return;
    }

    const controlador = new AbortController();
    const temporizador = setTimeout(async () => {
      try {
        definirBuscandoSugestoes(true);
        const resultados = await buscarEnderecosPorTexto(
          consulta,
          controlador.signal,
          localizacaoUsuario
        );
        definirSugestoes(resultados);
      } catch {
        // Ignora abortos durante digitação rápida
      } finally {
        definirBuscandoSugestoes(false);
      }
    }, 450);

    return () => {
      clearTimeout(temporizador);
      controlador.abort();
    };
  }, [endereco, localizacaoUsuario]);

  // Clicar ou arrastar no mapa preenche Endereço e CEP automaticamente
  async function aoEscolherPontoNoMapa({ lat, lng }) {
    definirPonto({ lat, lng });
    definirSugestoes([]);
    definirCarregandoMapa(true);

    try {
      const resultado = await buscarEnderecoPorCoordenada(lat, lng);
      if (resultado) {
        ignorarProximaBuscaRef.current = true;
        if (resultado.endereco) definirEndereco(resultado.endereco);
        if (resultado.cep) definirCep(resultado.cep);
      }
    } catch {
      // Mantém a coordenada selecionada
    } finally {
      definirCarregandoMapa(false);
    }
  }

  // Digitar os 8 dígitos do CEP preenche Endereço e posiciona no mapa
  async function aoAlterarCep(valor) {
    const formatado = formatarCep(valor);
    definirCep(formatado);

    const digitos = formatado.replace(/\D/g, "");
    if (digitos.length !== 8) return;

    definirCarregandoMapa(true);
    try {
      const resultado = await buscarEnderecoPorCep(digitos);
      if (resultado) {
        ignorarProximaBuscaRef.current = true;
        if (resultado.endereco) definirEndereco(resultado.endereco);
        if (resultado.lat != null && resultado.lng != null) {
          definirPonto({ lat: resultado.lat, lng: resultado.lng });
        }
      }
    } catch {
      // Falha silenciosa se ViaCEP/Nominatim não responderem
    } finally {
      definirCarregandoMapa(false);
    }
  }

  function aoSelecionarSugestao(item) {
    ignorarProximaBuscaRef.current = true;
    definirEndereco(item.rotulo);
    if (item.cep) definirCep(item.cep);
    definirPonto({ lat: item.lat, lng: item.lng });
    definirSugestoes([]);
  }

  function salvar(evento) {
    evento.preventDefault();
    definirErro("");

    if (
      !nome.trim() ||
      !categoria ||
      !descricao.trim() ||
      !telefone.trim() ||
      !endereco.trim() ||
      !cep.trim()
    ) {
      definirErro("Preencha todos os campos obrigatórios.");
      return;
    }

    const payload = {
      nome: nome.trim(),
      categoria,
      descricao: descricao.trim(),
      telefone: telefone.trim(),
      contato: telefone.trim(),
      email: email.trim(),
      site: site.trim(),
      endereco: endereco.trim(),
      cep: cep.trim(),
      latitude: ponto?.lat ?? null,
      longitude: ponto?.lng ?? null,
    };

    try {
      if (modoEdicao) {
        atualizarRedeApoio(redeEdicao.id, payload);
      } else {
        cadastrarRedeApoio(payload);
      }
      voltarParaRedes();
    } catch (e) {
      definirErro(e.message || "Não foi possível salvar a rede de apoio.");
    }
  }

  function excluir() {
    if (!modoEdicao) return;
    if (!window.confirm("Deseja realmente excluir esta rede de apoio?")) return;
    try {
      excluirRedeApoio(redeEdicao.id);
      voltarParaRedes();
    } catch (e) {
      definirErro(e.message || "Não foi possível excluir a rede de apoio.");
    }
  }

  return (
    <main className="cadastrar-rede-pagina">
      <header className="cadastrar-rede-cabecalho">
        <button
          type="button"
          className="cadastrar-rede-voltar"
          aria-label="Voltar para redes de apoio"
          onClick={voltarParaRedes}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="11 18 5 12 11 6" />
          </svg>
        </button>

        <div className="cadastrar-rede-cabecalho-texto">
          <h1>
            {modoEdicao ? "Editar rede de apoio" : "Cadastrar rede de apoio"}
          </h1>
          <p>
            {modoEdicao
              ? "Atualize os dados ou ajuste a localização da instituição no mapa."
              : "Preencha as informações abaixo para cadastrar uma nova rede de apoio."}
          </p>
        </div>
      </header>

      <form className="cadastrar-rede-formulario" onSubmit={salvar}>
        <div className="cadastrar-rede-grade">
          <section className="cadastrar-rede-card">
            <h2 className="cadastrar-rede-card-titulo">
              <img src={iconeRedesApoio} alt="" />
              Informações gerais
            </h2>

            <div className="cadastrar-rede-linha-dupla">
              <label className="cadastrar-rede-campo">
                <span className="cadastrar-rede-rotulo">
                  Nome da rede <em>*</em>
                </span>
                <input
                  type="text"
                  placeholder="Nome da rede"
                  value={nome}
                  onChange={(e) => definirNome(e.target.value)}
                  required
                />
              </label>

              <div className="cadastrar-rede-campo">
                <span className="cadastrar-rede-rotulo">
                  Categoria <em>*</em>
                </span>
                <Input
                  id="rede-categoria"
                  tipo="selecao"
                  nome="categoria"
                  rotulo="Categoria"
                  placeholder="Selecione as categorias"
                  valor={categoria}
                  aoAlterar={(e) => definirCategoria(e.target.value)}
                  obrigatorio
                  classeCampo="cadastrar-rede-select-bloom"
                >
                  {CATEGORIAS_APOIO.map((cat) => (
                    <option key={cat.valor} value={cat.valor}>
                      {cat.rotulo}
                    </option>
                  ))}
                </Input>
              </div>
            </div>

            <label className="cadastrar-rede-campo cadastrar-rede-campo--cresce">
              <span className="cadastrar-rede-rotulo">
                Descrição <em>*</em>
              </span>
              <textarea
                placeholder="Descreva o que a rede oferece, público atendido, etc..."
                value={descricao}
                onChange={(e) => definirDescricao(e.target.value)}
                required
              />
            </label>

            <div className="cadastrar-rede-linha-dupla">
              <label className="cadastrar-rede-campo">
                <span className="cadastrar-rede-rotulo">
                  Telefone <em>*</em>
                </span>
                <div className="cadastrar-rede-input-icone">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.3 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.3 1l-2.2 2.2Z" />
                  </svg>
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={telefone}
                    onChange={(e) =>
                      definirTelefone(formatarTelefone(e.target.value))
                    }
                    required
                  />
                </div>
              </label>

              <label className="cadastrar-rede-campo">
                <span className="cadastrar-rede-rotulo">
                  Email <small>(opcional)</small>
                </span>
                <div className="cadastrar-rede-input-icone">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v.4l8 5 8-5V7H4Zm16 10V9.7l-7.5 4.7a1 1 0 0 1-1 0L4 9.7V17h16Z" />
                  </svg>
                  <input
                    type="email"
                    placeholder="exemplo@gmail.com"
                    value={email}
                    onChange={(e) => definirEmail(e.target.value)}
                  />
                </div>
              </label>
            </div>

            <label className="cadastrar-rede-campo">
              <span className="cadastrar-rede-rotulo">
                Site ou rede social <small>(opcional)</small>
              </span>
              <div className="cadastrar-rede-input-icone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7" />
                  <path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7" />
                </svg>
                <input
                  type="text"
                  placeholder="https://..."
                  value={site}
                  onChange={(e) => definirSite(e.target.value)}
                />
              </div>
            </label>
          </section>

          <section className="cadastrar-rede-card">
            <h2 className="cadastrar-rede-card-titulo">
              <img src={iconeLocal} alt="" />
              Localização no mapa
            </h2>

            <div className="cadastrar-rede-mapa-wrap">
              <MapaRedesApoio
                modo="selecao"
                pontoSelecionado={ponto}
                categoriaPonto={categoria || "Saúde mental"}
                aoEscolherPonto={aoEscolherPontoNoMapa}
                localizacaoUsuario={localizacaoUsuario}
                carregandoEndereco={carregandoMapa}
              />
            </div>

            <div className="cadastrar-rede-endereco-box" ref={caixaEnderecoRef}>
              <label className="cadastrar-rede-campo">
                <span className="cadastrar-rede-rotulo">
                  Endereço <em>*</em>
                  {buscandoSugestoes && (
                    <small className="cadastrar-rede-status-busca">
                      procurando no mapa...
                    </small>
                  )}
                </span>
                <div className="cadastrar-rede-input-icone">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 22s8-6.2 8-13a8 8 0 1 0-16 0c0 6.8 8 13 8 13Z" />
                    <circle cx="12" cy="9" r="2.6" fill="#faf9f2" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Rua, número, bairro..."
                    value={endereco}
                    onChange={(e) => definirEndereco(e.target.value)}
                    required
                  />
                </div>
              </label>

              {sugestoes.length > 0 && (
                <ul className="cadastrar-rede-sugestoes" role="listbox">
                  {sugestoes.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => aoSelecionarSugestao(item)}
                      >
                        <strong>{item.rotulo}</strong>
                        {item.detalhe && <span>{item.detalhe}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label className="cadastrar-rede-campo cadastrar-rede-campo-cep">
              <span className="cadastrar-rede-rotulo">
                Cep <em>*</em>
              </span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="00000-000"
                value={cep}
                onChange={(e) => aoAlterarCep(e.target.value)}
                required
              />
            </label>
          </section>
        </div>

        <footer className="cadastrar-rede-rodape">
          <div className="cadastrar-rede-rodape-esquerda">
            {erro && (
              <p className="cadastrar-rede-erro" role="alert">
                {erro}
              </p>
            )}
            {modoEdicao && (
              <button
                type="button"
                className="cadastrar-rede-btn-excluir"
                onClick={excluir}
              >
                Excluir rede
              </button>
            )}
          </div>

          <div className="cadastrar-rede-rodape-acoes">
            <button
              type="button"
              className="cadastrar-rede-btn-cancelar"
              onClick={voltarParaRedes}
            >
              Cancelar
            </button>
            <button type="submit" className="cadastrar-rede-btn-salvar">
              Salvar
            </button>
          </div>
        </footer>
      </form>
    </main>
  );
}

export default CadastrarRedeApoio;