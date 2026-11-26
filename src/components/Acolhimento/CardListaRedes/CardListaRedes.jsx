import Abas from "../../Gerais/Abas/Abas.jsx";
import Input from "../../Gerais/Input/Input.jsx";
import {
  formatarDistancia,
  obterEstiloCategoria,
} from "../../../js/Rotas_ACOLHIMENTO/mapaApoio.js";
import iconeRedesApoio from "../../../img/icones/Acolhimento/redesApoio.png";
import iconeBusca from "../../../img/icones/busca.png";
import iconeSeta from "../../../img/icones/setaDireita.png";
import "./CardListaRedes.css";

function IconeSaudeMental() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 4a3.5 3.5 0 0 0-3.5 3.5c0 .7.2 1.3.5 1.8A3.5 3.5 0 0 0 5 12.2a3.5 3.5 0 0 0 2.5 3.4V18a2 2 0 0 0 4 0V4Z" />
      <path d="M14.5 4a3.5 3.5 0 0 1 3.5 3.5c0 .7-.2 1.3-.5 1.8a3.5 3.5 0 0 1 1.5 2.9 3.5 3.5 0 0 1-2.5 3.4V18a2 2 0 0 1-4 0V4Z" />
    </svg>
  );
}

function IconeSaude() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 20.5s-7.5-4.7-9.2-9.2C1.6 8 3.7 4.5 7.2 4.5c2 0 3.7 1.1 4.8 2.7 1.1-1.6 2.8-2.7 4.8-2.7 3.5 0 5.6 3.5 4.4 6.8-1.7 4.5-9.2 9.2-9.2 9.2Z" />
    </svg>
  );
}

function IconeAssistencia() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <circle cx="8.5" cy="7.5" r="2.7" />
      <circle cx="15.5" cy="7.5" r="2.7" />
      <path d="M3.5 18.5c0-2.8 2.2-4.8 5-4.8s5 2 5 4.8H3.5Zm10 0c0-2.8 2.2-4.8 5-4.8 1.2 0 2.3.4 3.2 1.1v3.7h-8.2Z" />
    </svg>
  );
}

function IconeProtecao() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.5 4.5 5.8v5.9c0 4.8 3.2 9.1 7.5 10.3 4.3-1.2 7.5-5.5 7.5-10.3V5.8L12 2.5Z" />
    </svg>
  );
}

const FILTROS_CATEGORIA = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "Saúde mental", rotulo: "Saúde mental", icone: <IconeSaudeMental /> },
  { valor: "Saúde", rotulo: "Saúde", icone: <IconeSaude /> },
  { valor: "Assistência social", rotulo: "Assistência social", icone: <IconeAssistencia /> },
  { valor: "Proteção", rotulo: "Proteção", icone: <IconeProtecao /> },
];

function CardListaRedes({
  redes,
  categoriaAtiva,
  definirCategoriaAtiva,
  buscaTexto,
  definirBuscaTexto,
  aoCadastrar,
  aoSelecionarRede,
}) {
  return (
    <section className="redes-lista-painel">
      <h2 className="redes-lista-titulo">
        <img src={iconeRedesApoio} alt="" />
        Redes de apoio
      </h2>

      <div className="redes-filtros-faixa">
        <Abas
          className="redes-filtros-abas"
          tamanho="compacto"
          itens={FILTROS_CATEGORIA}
          valor={categoriaAtiva}
          aoMudar={definirCategoriaAtiva}
        />
      </div>

      <div className="redes-barra-acoes">
        <Input
          tipo="busca"
          classeName="redes-busca"
          placeholder="Buscar redes de apoio"
          valor={buscaTexto}
          aoAlterar={(e) => definirBuscaTexto(e.target.value)}
          icone={<img src={iconeBusca} alt="" />}
          tamanhoDoIcone="19px"
        />

        <button
          type="button"
          className="redes-botao-cadastrar"
          onClick={aoCadastrar}
        >
          Cadastrar
        </button>
      </div>

      <div className="redes-itens">
        {redes.length === 0 ? (
          <p className="redes-itens-vazio">
            Nenhuma rede de apoio encontrada para esse filtro.
          </p>
        ) : (
          redes.map((rede) => {
            const estilo = obterEstiloCategoria(rede.categoria);

            return (
              <button
                key={rede.id}
                type="button"
                className="redes-item"
                onClick={() => aoSelecionarRede(rede)}
              >
                <span
                  className="redes-item-avatar"
                  style={{
                    borderColor: estilo.cor,
                    background: estilo.fundo,
                    color: estilo.cor,
                  }}
                >
                  {rede.logo ? (
                    <img src={rede.logo} alt="" />
                  ) : (
                    <span>{estilo.sigla}</span>
                  )}
                </span>

                <div className="redes-item-corpo">
                  <h3>{rede.nome}</h3>
                  <strong className="redes-item-categoria">
                    {rede.categoria}
                  </strong>
                  {rede.descricao && (
                    <p className="redes-item-descricao">{rede.descricao}</p>
                  )}

                  <div className="redes-item-meta">
                    <span className="redes-item-meta-dado">
                      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M12 22s8-6.2 8-13a8 8 0 1 0-16 0c0 6.8 8 13 8 13Z" />
                        <circle cx="12" cy="9" r="2.6" fill="#f8f7f0" />
                      </svg>
                      <span>{rede.endereco}</span>
                    </span>

                    {rede.distanciaKm != null && (
                      <span className="redes-item-meta-dado redes-item-distancia">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                          <path d="M16 3l5 5-13 13-5-5L16 3z" />
                          <path d="M13 6l2 2M10 9l2 2M7 12l2 2" />
                        </svg>
                        <span>{formatarDistancia(rede.distanciaKm)}</span>
                      </span>
                    )}
                  </div>
                </div>

                <img className="redes-item-seta" src={iconeSeta} alt="" />
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}

export default CardListaRedes;