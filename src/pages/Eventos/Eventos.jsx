import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TituloSecao from "../../components/Gerais/Cabecalho/TituloSecao/TituloSecao.jsx";
import CardCalendarioEventos from "../../components/Eventos/CardCalendarioEventos/CardCalendarioEventos.jsx";
import CardListaEventos from "../../components/Eventos/CardListaEventos/CardListaEventos.jsx";
import { dataLocal, ocorreNaData } from "../../js/Gerais/calendario.js";
import {
  obterEventosDeExemplo,
  atualizarEvento,
  excluirEvento,
} from "../../js/Rotas_EVENTOS/rotas_EVENTOS.js";
import "./Eventos.css";

const CATEGORIAS_EVENTOS = [
  { valor: "Todos", rotulo: "Todos" },
  { valor: "Palestra", rotulo: "Palestras" },
  { valor: "Oficina", rotulo: "Oficinas" },
  { valor: "Campanha", rotulo: "Campanhas" },
  { valor: "Festa", rotulo: "Festas" },
  { valor: "Reunião", rotulo: "Reuniões" },
];

function Eventos({ aoCriarEvento }) {
  const navegar = useNavigate();
  const [dataSelecionada, definirDataSelecionada] = useState(() => new Date());
  const eventos = obterEventosDeExemplo();

  const eventosDoDia = useMemo(() => {
    const chaveDia = dataLocal(dataSelecionada);
    return eventos
      .filter((item) => ocorreNaData(item, chaveDia))
      .map((item) => ({ ...item, horario: item.horaInicio }))
      .sort((a, b) => String(a.horario || "").localeCompare(String(b.horario || "")));
  }, [eventos, dataSelecionada]);

  function verificarDiaComEvento(dataObjeto) {
    const chave = dataLocal(dataObjeto);
    return eventos.some((item) => ocorreNaData(item, chave));
  }

  function mudarMes(delta) {
    definirDataSelecionada(
      (atual) => new Date(atual.getFullYear(), atual.getMonth() + delta, 1)
    );
  }

  function editar(id) {
    navegar(`/eventos/cadastrarEvento?id=${encodeURIComponent(id)}`);
  }

  function ocultar(item) {
    try {
      atualizarEvento(item.id, { oculto: !item.oculto });
    } catch (e) {
      window.alert(e.message);
    }
  }

  function reenviar(item) {
    try {
      atualizarEvento(item.id, { reenviadoEm: new Date().toISOString() });
      window.alert(
        "Reenvio registrado localmente. Nenhuma notificação real foi enviada."
      );
    } catch (e) {
      window.alert(e.message);
    }
  }

  function excluir(id) {
    if (window.confirm("Excluir definitivamente?")) {
      try {
        excluirEvento(id);
      } catch (e) {
        window.alert(e.message);
      }
    }
  }

  return (
    <main className="eventos-pagina">
      <TituloSecao
        titulo="Eventos"
        subtitulo="Acompanhe os eventos da instituição e mantenha seus alunos informados."
      />

      <div className="eventos-area">
        <CardListaEventos
          categorias={CATEGORIAS_EVENTOS}
          eventosDeExemplo={eventos}
          aoCriarEvento={aoCriarEvento}
          aoEditar={editar}
          aoOcultar={ocultar}
          aoReenviar={reenviar}
          aoExcluir={excluir}
        />

        <CardCalendarioEventos
          dataSelecionada={dataSelecionada}
          aoSelecionarData={definirDataSelecionada}
          aoVoltarMes={() => mudarMes(-1)}
          aoAvancarMes={() => mudarMes(1)}
          verificarDiaComEvento={verificarDiaComEvento}
          eventosDoDia={eventosDoDia}
          aoEditarEvento={editar}
        />
      </div>
    </main>
  );
}

export default Eventos;