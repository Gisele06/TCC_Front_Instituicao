import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { meses } from "../../../js/Gerais/calendario.js";
import iconeCalendarioEscuro from "../../../img/icones/calendario.png";
import iconeSetaDireita from "../../../img/icones/setaDireita.png";
import "../../Eventos/CardCalendarioEventos/CardCalendarioEventos.css";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const CURVA_SUAVE = [0.22, 1, 0.36, 1];

function montarGradeMes(ano, mes) {
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const diasMesAnterior = new Date(ano, mes, 0).getDate();

  const celulas = [];

  for (let i = primeiroDiaSemana - 1; i >= 0; i--) {
    const dia = diasMesAnterior - i;
    celulas.push({ data: new Date(ano, mes - 1, dia), dia, mesAtual: false });
  }

  for (let dia = 1; dia <= diasNoMes; dia++) {
    celulas.push({ data: new Date(ano, mes, dia), dia, mesAtual: true });
  }

  const totalCelulas = Math.ceil(celulas.length / 7) * 7;
  const restante = totalCelulas - celulas.length;
  for (let dia = 1; dia <= restante; dia++) {
    celulas.push({ data: new Date(ano, mes + 1, dia), dia, mesAtual: false });
  }

  return celulas;
}

function mesmaData(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function CardCalendarioComunicados({
  dataSelecionada,
  aoSelecionarData,
  aoVoltarMes,
  aoAvancarMes,
  verificarDiaComComunicado,
  comunicadosDoDia,
  aoEditarComunicado,
}) {
  const reduzirMovimento = useReducedMotion();
  const [direcao, definirDirecao] = useState(0);

  const ano = dataSelecionada.getFullYear();
  const mes = dataSelecionada.getMonth();
  const diaSelecionado = dataSelecionada.getDate();
  const hoje = useMemo(() => new Date(), []);

  const celulas = useMemo(() => montarGradeMes(ano, mes), [ano, mes]);
  const chaveMes = `${ano}-${mes}`;
  const chaveDia = `${ano}-${mes}-${diaSelecionado}`;
  const dataFormatada = `${diaSelecionado} de ${meses[mes]} de ${ano}`;

  function voltarMes() {
    definirDirecao(-1);
    aoVoltarMes();
  }

  function avancarMes() {
    definirDirecao(1);
    aoAvancarMes();
  }

  function clicarDia(celula) {
    if (!celula.mesAtual) {
      definirDirecao(celula.data < new Date(ano, mes, 1) ? -1 : 1);
    }
    aoSelecionarData(celula.data);
  }

  return (
    <aside
      className="eventos-calendario-painel"
      aria-label="Calendário de comunicados"
    >
      <header className="eventos-cal-topo">
        <img src={iconeCalendarioEscuro} alt="" />
        <h2>Calendário</h2>
      </header>

      <div className="eventos-cal-nav-wrap">
        <div className="eventos-cal-nav">
          <button
            type="button"
            className="eventos-cal-nav-btn"
            aria-label="Mês anterior"
            onClick={voltarMes}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3.5L5.5 8L10 12.5" />
            </svg>
          </button>

          <span className="eventos-cal-mes-rotulo">
            {meses[mes]} {ano}
          </span>

          <button
            type="button"
            className="eventos-cal-nav-btn"
            aria-label="Próximo mês"
            onClick={avancarMes}
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3.5L10.5 8L6 12.5" />
            </svg>
          </button>
        </div>
      </div>

      <div className="eventos-cal-semana" aria-hidden="true">
        {DIAS_SEMANA.map((dia) => (
          <span key={dia}>{dia}</span>
        ))}
      </div>

      <div className="eventos-cal-grade-wrap">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={chaveMes}
            className="eventos-cal-grade"
            initial={
              reduzirMovimento ? false : { opacity: 0, x: direcao * 14 }
            }
            animate={{
              opacity: 1,
              x: 0,
              transition: { duration: 0.22, ease: CURVA_SUAVE },
            }}
            exit={
              reduzirMovimento
                ? undefined
                : {
                    opacity: 0,
                    x: direcao * -14,
                    transition: { duration: 0.15, ease: "easeInOut" },
                  }
            }
          >
            {celulas.map((celula) => {
              const ehHoje = mesmaData(celula.data, hoje);
              const ehSelecionado = mesmaData(celula.data, dataSelecionada);
              const temComunicado =
                verificarDiaComComunicado?.(celula.data) ?? false;
              const chaveCelula = `${celula.data.getFullYear()}-${celula.data.getMonth()}-${celula.dia}`;

              return (
                <button
                  key={chaveCelula}
                  type="button"
                  onClick={() => clicarDia(celula)}
                  aria-pressed={ehSelecionado}
                  aria-label={`${celula.dia} de ${meses[celula.data.getMonth()]} de ${celula.data.getFullYear()}${
                    temComunicado ? ", com comunicado" : ""
                  }`}
                  className={[
                    "eventos-cal-dia",
                    !celula.mesAtual && "eventos-cal-dia--fora",
                    ehHoje && "eventos-cal-dia--hoje",
                    ehSelecionado && "eventos-cal-dia--selecionado",
                    temComunicado && "eventos-cal-dia--com-evento",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <span className="eventos-cal-dia-numero">
                    {String(celula.dia).padStart(2, "0")}
                  </span>
                  {temComunicado && (
                    <span className="eventos-cal-dia-ponto" aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <section className="eventos-cal-dia-lista-secao">
        <header className="eventos-cal-dia-lista-cabecalho">
          <h3>Comunicados do dia</h3>
          <span>{dataFormatada}</span>
        </header>

        <div className="eventos-cal-dia-lista-scroll">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={chaveDia}
              className="eventos-cal-dia-lista"
              initial={reduzirMovimento ? false : { opacity: 0, y: 4 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.2, ease: CURVA_SUAVE },
              }}
              exit={
                reduzirMovimento
                  ? undefined
                  : { opacity: 0, transition: { duration: 0.14 } }
              }
            >
              {!comunicadosDoDia.length ? (
                <p className="eventos-cal-vazio">
                  Nenhum comunicado programado para este dia.
                </p>
              ) : (
                comunicadosDoDia.map((comunicado) => (
                  <button
                    key={comunicado.id}
                    type="button"
                    className="eventos-cal-evento-item"
                    onClick={() => aoEditarComunicado?.(comunicado.id)}
                  >
                    <span className="eventos-cal-evento-hora">
                      {comunicado.horario || "--:--"}
                    </span>

                    <div className="eventos-cal-evento-corpo">
                      <strong className="eventos-cal-evento-titulo">
                        {comunicado.titulo}
                      </strong>
                      <div className="eventos-cal-evento-meta">
                        <span className="eventos-cal-evento-categoria">
                          {comunicado.categoria}
                        </span>
                      </div>
                    </div>

                    <img
                      className="eventos-cal-evento-seta"
                      src={iconeSetaDireita}
                      alt=""
                    />
                  </button>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </aside>
  );
}

export default CardCalendarioComunicados;