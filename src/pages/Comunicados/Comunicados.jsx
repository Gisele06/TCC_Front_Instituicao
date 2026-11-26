import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TituloSecao from "../../components/Gerais/Cabecalho/TituloSecao/TituloSecao.jsx";
import CardCalendarioComunicados from "../../components/Comunicados/CardCalendarioComunicados/CardCalendarioComunicados.jsx";
import CardListaComunicados from "../../components/Comunicados/CardListaComunicados/CardListaComunicados.jsx";
import { dataLocal, ocorreNaData } from "../../js/Gerais/calendario.js";
import {
  obterComunicadosDeExemplo,
  atualizarComunicado,
  excluirComunicado,
} from "../../js/Rotas_COMUNICADOS/rotas_COMUNICADOS.js";
import iconeAviso from "../../img/icones/comunicado-aviso.png";
import iconeOrientacao from "../../img/icones/comunicado-orientacao.png";
import iconeComunicadoEvento from "../../img/icones/comunicado-evento.png";
import "./Comunicados.css";

const CATEGORIAS_COMUNICADOS = [
  { valor: "Todos", rotulo: "Todos" },
  { valor: "Aviso", rotulo: "Avisos" },
  { valor: "Informativo", rotulo: "Informativos" },
  { valor: "Orientação", rotulo: "Orientações" },
  { valor: "Evento", rotulo: "Eventos" },
];

const MAPA_ICONES = {
  iconeAviso,
  iconeOrientacao,
  iconeComunicadoEvento,
};

function Comunicados({ aoCriarComunicado }) {
  const navegar = useNavigate();
  const [dataSelecionada, definirDataSelecionada] = useState(() => new Date());

  const comunicados = useMemo(
    () =>
      obterComunicadosDeExemplo().map((item) => ({
        ...item,
        icone: MAPA_ICONES[item.icone] || iconeAviso,
      })),
    [],
  );

  const comunicadosDoDia = useMemo(() => {
    const chaveDia = dataLocal(dataSelecionada);
    return comunicados
      .filter((item) => ocorreNaData(item, chaveDia))
      .map((item) => ({ ...item, horario: item.horaInicio }))
      .sort((a, b) =>
        String(a.horario || "").localeCompare(String(b.horario || "")),
      );
  }, [comunicados, dataSelecionada]);

  function verificarDiaComComunicado(dataObjeto) {
    const chave = dataLocal(dataObjeto);
    return comunicados.some((item) => ocorreNaData(item, chave));
  }

  function mudarMes(delta) {
    definirDataSelecionada(
      (atual) => new Date(atual.getFullYear(), atual.getMonth() + delta, 1),
    );
  }

  function editar(id) {
    navegar(`/comunicados/cadastrarComunicado?id=${encodeURIComponent(id)}`);
  }

  function ocultar(item) {
    try {
      atualizarComunicado(item.id, { oculto: !item.oculto });
    } catch (e) {
      window.alert(e.message);
    }
  }

  function reenviar(item) {
    try {
      atualizarComunicado(item.id, { reenviadoEm: new Date().toISOString() });
      window.alert(
        "Reenvio registrado localmente. Nenhuma notificação real foi enviada.",
      );
    } catch (e) {
      window.alert(e.message);
    }
  }

  function excluir(id) {
    if (window.confirm("Excluir definitivamente?")) {
      try {
        excluirComunicado(id);
      } catch (e) {
        window.alert(e.message);
      }
    }
  }

  return (
    <main className="comunicados-pagina">
      <TituloSecao
        titulo="Comunicados"
        subtitulo="Acompanhe os comunicados publicados pela instituição."
      />

      <div className="comunicados-area">
        <CardListaComunicados
          categorias={CATEGORIAS_COMUNICADOS}
          comunicadosDeExemplo={comunicados}
          aoCriarComunicado={aoCriarComunicado}
          aoEditar={editar}
          aoOcultar={ocultar}
          aoReenviar={reenviar}
          aoExcluir={excluir}
        />

        <CardCalendarioComunicados
          dataSelecionada={dataSelecionada}
          aoSelecionarData={definirDataSelecionada}
          aoVoltarMes={() => mudarMes(-1)}
          aoAvancarMes={() => mudarMes(1)}
          verificarDiaComComunicado={verificarDiaComComunicado}
          comunicadosDoDia={comunicadosDoDia}
          aoEditarComunicado={editar}
        />
      </div>
    </main>
  );
}

export default Comunicados;