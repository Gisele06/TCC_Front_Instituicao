import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CardInformacao from "../../../components/Acolhimento/CardEstatisticas/CardInformacao/CardInformacao.jsx";
import CardListaRedes from "../../../components/Acolhimento/CardListaRedes/CardListaRedes.jsx";
import MapaRedesApoio from "../../../components/Acolhimento/MapaRedesApoio/MapaRedesApoio.jsx";
import { obterRedesApoio } from "../../../js/Rotas_ACOLHIMENTO/rotas_ACOLHIMENTO.js";
import {
  COORDENADA_PADRAO,
  calcularDistanciaKm,
  enriquecerRede,
  lerLocalizacaoEmCache,
  obterLocalizacaoUsuario,
} from "../../../js/Rotas_ACOLHIMENTO/mapaApoio.js";
import iconePrancheta from "../../../img/icones/prancheta.png";
import iconeLocal from "../../../img/icones/Acolhimento/local.png";
import iconeCheck from "../../../img/icones/Acolhimento/marcacao.png";
import "./RedesApoio.css";

function RedesApoio() {
  const navegar = useNavigate();
  const redesBrutas = obterRedesApoio();

  const [categoriaAtiva, definirCategoriaAtiva] = useState("todas");
  const [buscaTexto, definirBuscaTexto] = useState("");
  const [redeSelecionadaId, definirRedeSelecionadaId] = useState(null);
  const [localizacaoUsuario, definirLocalizacaoUsuario] = useState(() =>
    lerLocalizacaoEmCache()
  );

  useEffect(() => {
    let ativo = true;
    obterLocalizacaoUsuario().then((coords) => {
      if (ativo && coords) definirLocalizacaoUsuario(coords);
    });
    return () => {
      ativo = false;
    };
  }, []);

  const referenciaOrigem = localizacaoUsuario || COORDENADA_PADRAO;

  const redes = useMemo(
    () =>
      redesBrutas.map((item, indice) => {
        const enriquecida = enriquecerRede(item, indice, referenciaOrigem);
        return {
          ...enriquecida,
          distanciaKm: calcularDistanciaKm(referenciaOrigem, {
            lat: enriquecida.latitude,
            lng: enriquecida.longitude,
          }),
        };
      }),
    [redesBrutas, referenciaOrigem]
  );

  const redesFiltradas = useMemo(() => {
    const termo = buscaTexto.trim().toLowerCase();
    return redes.filter((rede) => {
      const bateCategoria =
        categoriaAtiva === "todas" ||
        rede.categoria.toLowerCase() === categoriaAtiva.toLowerCase();
      if (!bateCategoria) return false;
      if (!termo) return true;
      return `${rede.nome} ${rede.categoria} ${rede.descricao || ""} ${rede.endereco}`
        .toLowerCase()
        .includes(termo);
    });
  }, [redes, categoriaAtiva, buscaTexto]);

  const totalProximas = redes.filter(
    (r) => r.distanciaKm != null && r.distanciaKm <= 5
  ).length;
  const totalDisponiveis = redes.filter((r) => r.disponivel !== false).length;

  function abrirCadastro() {
    navegar("/acolhimento/cadastrarRedeApoio");
  }

  function abrirEdicao(rede) {
    navegar("/acolhimento/cadastrarRedeApoio", {
      state: { rede },
    });
  }

  return (
    <div className="redes-apoio-bloco">
      <div className="redes-apoio-estatisticas">
        <CardInformacao
          icone={iconePrancheta}
          valor={redes.length}
          rotulo="Cadastradas"
        />
        <CardInformacao
          icone={iconeLocal}
          valor={totalProximas}
          rotulo="Próximas"
        />
        <CardInformacao
          icone={iconeCheck}
          valor={totalDisponiveis}
          rotulo="Disponíveis"
        />
      </div>

      <div className="redes-apoio-colunas">
        <CardListaRedes
          redes={redesFiltradas}
          categoriaAtiva={categoriaAtiva}
          definirCategoriaAtiva={definirCategoriaAtiva}
          buscaTexto={buscaTexto}
          definirBuscaTexto={definirBuscaTexto}
          aoCadastrar={abrirCadastro}
          aoSelecionarRede={(rede) => definirRedeSelecionadaId(rede.id)}
        />

        <div className="redes-apoio-mapa-card">
          <MapaRedesApoio
            modo="visualizacao"
            redes={redesFiltradas}
            redeSelecionadaId={redeSelecionadaId}
            aoSelecionarRede={(rede) =>
              definirRedeSelecionadaId(rede ? rede.id : null)
            }
            aoEditarRede={abrirEdicao}
            localizacaoUsuario={localizacaoUsuario}
          />
        </div>
      </div>
    </div>
  );
}

export default RedesApoio;