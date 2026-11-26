import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  COORDENADA_PADRAO,
  formatarDistancia,
  obterEstiloCategoria,
  obterLocalizacaoUsuario,
} from "../../../js/Rotas_ACOLHIMENTO/mapaApoio.js";
import "./MapaRedesApoio.css";

function criarHtmlPino({ sigla, cor, ativo = false, destaqueSelecao = false }) {
  return `
    <div class="bloom-mapa-pino${ativo ? " bloom-mapa-pino--ativo" : ""}${
      destaqueSelecao ? " bloom-mapa-pino--selecao" : ""
    }">
      ${ativo ? '<span class="bloom-mapa-pino-pulso"></span>' : ""}
      <div class="bloom-mapa-pino-gota">
        <span class="bloom-mapa-pino-nucleo" style="color:${cor}">
          ${sigla}
        </span>
      </div>
    </div>
  `;
}

function criarIconeLeaflet(opcoes) {
  return L.divIcon({
    className: "bloom-mapa-pino-wrapper",
    html: criarHtmlPino(opcoes),
    iconSize: [42, 52],
    iconAnchor: [21, 50],
  });
}

function criarIconeUsuario() {
  return L.divIcon({
    className: "bloom-mapa-usuario-wrapper",
    html: '<div class="bloom-mapa-usuario"><span class="bloom-mapa-usuario-pulso"></span><span class="bloom-mapa-usuario-ponto"></span></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

function MapaRedesApoio({
  modo = "visualizacao",
  redes = [],
  redeSelecionadaId = null,
  aoSelecionarRede,
  aoEditarRede,
  pontoSelecionado = null,
  categoriaPonto = "Saúde mental",
  aoEscolherPonto,
  localizacaoUsuario = null,
  carregandoEndereco = false,
  className = "",
}) {
  const containerRef = useRef(null);
  const mapaRef = useRef(null);
  const camadaMarcadoresRef = useRef(null);
  const marcadorUsuarioRef = useRef(null);
  const centralizouUsuarioRef = useRef(false);
  const aoEscolherPontoRef = useRef(aoEscolherPonto);
  const [localizando, definirLocalizando] = useState(false);

  aoEscolherPontoRef.current = aoEscolherPonto;

  const redeAtiva =
    modo === "visualizacao"
      ? redes.find((r) => r.id === redeSelecionadaId) || null
      : null;

  // Inicializa o mapa Leaflet com OpenStreetMap (sem chave de API)
  useEffect(() => {
    const elemento = containerRef.current;
    if (!elemento || mapaRef.current) return;

    const origem =
      pontoSelecionado?.lat != null
        ? pontoSelecionado
        : localizacaoUsuario || COORDENADA_PADRAO;

    const mapa = L.map(elemento, {
      center: [origem.lat, origem.lng],
      zoom: 14,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "© OpenStreetMap",
    }).addTo(mapa);

    camadaMarcadoresRef.current = L.layerGroup().addTo(mapa);
    mapaRef.current = mapa;
    centralizouUsuarioRef.current = Boolean(
      pontoSelecionado?.lat != null || localizacaoUsuario
    );

    if (modo === "selecao") {
      mapa.on("click", (evento) => {
        aoEscolherPontoRef.current?.({
          lat: evento.latlng.lat,
          lng: evento.latlng.lng,
          origem: "mapa",
        });
      });
    }

    const observador = new ResizeObserver(() => {
      mapa.invalidateSize({ animate: false });
    });
    observador.observe(elemento);

    return () => {
      observador.disconnect();
      mapa.remove();
      mapaRef.current = null;
      camadaMarcadoresRef.current = null;
      marcadorUsuarioRef.current = null;
      centralizouUsuarioRef.current = false;
    };
  }, [modo]);

  // Marca a localização real do computador e centraliza no primeiro carregamento
  useEffect(() => {
    const mapa = mapaRef.current;
    if (!mapa || !localizacaoUsuario) return;

    if (marcadorUsuarioRef.current) {
      marcadorUsuarioRef.current.setLatLng([
        localizacaoUsuario.lat,
        localizacaoUsuario.lng,
      ]);
    } else {
      marcadorUsuarioRef.current = L.marker(
        [localizacaoUsuario.lat, localizacaoUsuario.lng],
        {
          icon: criarIconeUsuario(),
          interactive: false,
          zIndexOffset: 50,
        }
      ).addTo(mapa);
    }

    if (
      !centralizouUsuarioRef.current &&
      !redeAtiva &&
      pontoSelecionado?.lat == null
    ) {
      centralizouUsuarioRef.current = true;
      mapa.setView([localizacaoUsuario.lat, localizacaoUsuario.lng], 14, {
        animate: true,
      });
    }
  }, [localizacaoUsuario, redeAtiva, pontoSelecionado?.lat]);

  // Atualiza marcadores no modo visualização
  useEffect(() => {
    const mapa = mapaRef.current;
    const camada = camadaMarcadoresRef.current;
    if (!mapa || !camada || modo !== "visualizacao") return;

    camada.clearLayers();

    redes.forEach((rede) => {
      if (rede.latitude == null || rede.longitude == null) return;
      const estilo = obterEstiloCategoria(rede.categoria);
      const ativo = rede.id === redeSelecionadaId;

      const marcador = L.marker([rede.latitude, rede.longitude], {
        icon: criarIconeLeaflet({
          sigla: estilo.sigla,
          cor: estilo.cor,
          ativo,
        }),
        zIndexOffset: ativo ? 500 : 100,
      });

      marcador.on("click", () => {
        aoSelecionarRede?.(rede);
      });

      marcador.addTo(camada);
    });
  }, [redes, redeSelecionadaId, modo, aoSelecionarRede]);

  // Centraliza suavemente ao selecionar uma rede na lista
  useEffect(() => {
    const mapa = mapaRef.current;
    if (!mapa || modo !== "visualizacao" || !redeAtiva) return;
    if (redeAtiva.latitude == null || redeAtiva.longitude == null) return;

    mapa.flyTo([redeAtiva.latitude, redeAtiva.longitude], 15, {
      duration: 0.65,
      easeLinearity: 0.25,
    });
  }, [redeAtiva, modo]);

  // Atualiza pino arrastável no modo seleção (cadastro/edição)
  useEffect(() => {
    const mapa = mapaRef.current;
    const camada = camadaMarcadoresRef.current;
    if (!mapa || !camada || modo !== "selecao") return;

    camada.clearLayers();

    if (pontoSelecionado?.lat == null || pontoSelecionado?.lng == null) return;

    const estilo = obterEstiloCategoria(categoriaPonto);
    const marcador = L.marker([pontoSelecionado.lat, pontoSelecionado.lng], {
      draggable: true,
      icon: criarIconeLeaflet({
        sigla: estilo.sigla,
        cor: estilo.cor,
        ativo: true,
        destaqueSelecao: true,
      }),
    }).addTo(camada);

    marcador.on("dragend", () => {
      const pos = marcador.getLatLng();
      aoEscolherPontoRef.current?.({
        lat: pos.lat,
        lng: pos.lng,
        origem: "mapa",
      });
    });

    mapa.flyTo(
      [pontoSelecionado.lat, pontoSelecionado.lng],
      Math.max(mapa.getZoom(), 15),
      {
        duration: 0.55,
        easeLinearity: 0.25,
      }
    );
  }, [pontoSelecionado?.lat, pontoSelecionado?.lng, categoriaPonto, modo]);

  function darZoom(delta) {
    const mapa = mapaRef.current;
    if (!mapa) return;
    mapa.setZoom(mapa.getZoom() + delta, { animate: true });
  }

  async function centralizarLocalizacao() {
    const mapa = mapaRef.current;
    if (!mapa) return;

    definirLocalizando(true);
    const coords = await obterLocalizacaoUsuario({ forcarAtualizacao: true });
    definirLocalizando(false);

    const destino = coords || localizacaoUsuario || COORDENADA_PADRAO;
    mapa.flyTo([destino.lat, destino.lng], 15, { duration: 0.65 });

    if (modo === "selecao" && coords) {
      aoEscolherPonto?.({ lat: coords.lat, lng: coords.lng, origem: "mapa" });
    }
  }

  return (
    <div className={`bloom-mapa-container${className ? ` ${className}` : ""}`}>
      <div ref={containerRef} className="bloom-mapa-canvas" />

      <div className="bloom-mapa-controles" aria-label="Controles do mapa">
        <button
          type="button"
          className={`bloom-mapa-controle-btn${
            localizando ? " bloom-mapa-controle-btn--girando" : ""
          }`}
          title="Centralizar na minha localização"
          aria-label="Centralizar na minha localização"
          onClick={centralizarLocalizacao}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="4" />
            <circle cx="12" cy="12" r="8.5" strokeDasharray="3 3" />
          </svg>
        </button>

        <span className="bloom-mapa-controle-divisor" aria-hidden="true" />

        <button
          type="button"
          className="bloom-mapa-controle-btn"
          title="Aproximar"
          aria-label="Aproximar mapa"
          onClick={() => darZoom(1)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="12" y1="6" x2="12" y2="18" />
            <line x1="6" y1="12" x2="18" y2="12" />
          </svg>
        </button>

        <button
          type="button"
          className="bloom-mapa-controle-btn"
          title="Afastar"
          aria-label="Afastar mapa"
          onClick={() => darZoom(-1)}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="6" y1="12" x2="18" y2="12" />
          </svg>
        </button>
      </div>

      {modo === "selecao" && (
        <div className="bloom-mapa-dica">
          {carregandoEndereco
            ? "Buscando endereço no mapa..."
            : pontoSelecionado
              ? "Clique no mapa ou arraste o pino para ajustar"
              : "Clique no mapa para marcar a localização"}
        </div>
      )}

      {modo === "visualizacao" && redeAtiva && (
        <div className="bloom-mapa-resumo">
          <div className="bloom-mapa-resumo-topo">
            <div>
              <strong>{redeAtiva.nome}</strong>
              <span>{redeAtiva.categoria}</span>
            </div>
            <button
              type="button"
              className="bloom-mapa-resumo-fechar"
              aria-label="Fechar resumo"
              onClick={() => aoSelecionarRede?.(null)}
            >
              ×
            </button>
          </div>

          <p className="bloom-mapa-resumo-endereco">
            {redeAtiva.endereco}
            {redeAtiva.distanciaKm != null && (
              <> • {formatarDistancia(redeAtiva.distanciaKm)}</>
            )}
          </p>

          <div className="bloom-mapa-resumo-rodape">
            <span className="bloom-mapa-resumo-telefone">
              {redeAtiva.telefone || "Sem telefone"}
            </span>
            {aoEditarRede && (
              <button
                type="button"
                className="bloom-mapa-resumo-editar"
                onClick={() => aoEditarRede(redeAtiva)}
              >
                Editar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MapaRedesApoio;