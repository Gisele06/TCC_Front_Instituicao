import EstruturaInstitucional from "../../components/InstitutionFrame/InstitutionFrame";
import FaixaDeDestaque from "../../components/HeroBanner/HeroBanner";
import CartaoDeIndicador from "../../components/StatCard/StatCard";
import CartaoDeLista from "../../components/ListItemCard/ListItemCard";

import iconeSetaDireita from "../../assets/icons/chevron-right.png";
import iconeSorriso from "../../assets/icons/sorriso.png";
import iconePessoas from "../../assets/icons/pessoas.png";
import iconeSetaCima from "../../assets/icons/seta-cima.png";
import imagemDeMontanhas from "../../assets/images/hero-mountains.png";
import iconeCoracao from "../../assets/icons/coracao.png";
import iconeBarras from "../../assets/icons/barras.png";
import iconeCalendarioComPontos from "../../assets/icons/calendario-pontos.png";
import iconeTituloCalendario from "../../assets/icons/calendario-titulo.png";
import iconeHistorico from "../../assets/icons/historico.png";
import iconeMensagem from "../../assets/icons/mensagem.png";
import iconeComunidade from "../../assets/icons/comunidade.png";
import iconeNota from "../../assets/icons/nota.png";
import iconeRaio from "../../assets/icons/raio.png";

import "./Home.css";

function EtiquetaDeData({ dia, mes }: { dia: string; mes: string }) {
  return (
    <div className="inicio-data-selo">
      <span className="inicio-data-selo-dia">{dia}</span>
      <span className="inicio-data-selo-mes">{mes}</span>
    </div>
  );
}

function TituloDoPainel({ icone, texto }: { icone?: string; texto: string }) {
  return (
    <span className="inicio-painel-titulo">
      {icone && <img src={icone} alt="" />}
      {texto}
    </span>
  );
}

function IconeDeLocal() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22s8-6.2 8-13a8 8 0 1 0-16 0c0 6.8 8 13 8 13Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

interface PropriedadesInicio {
  aoNavegar: (pagina: string) => void;
  aoCriarEvento: () => void;
}

function Inicio({ aoNavegar, aoCriarEvento }: PropriedadesInicio) {
  const acoesRapidas = [
    { rotulo: "Avaliações do dia", icone: iconeHistorico },
    { rotulo: "Enviar mensagem", icone: iconeMensagem },
    { rotulo: "Locais de acolhimento", icone: iconeComunidade },
    { rotulo: "Criar evento", icone: iconeCalendarioComPontos },
    { rotulo: "Criar turma", icone: iconeNota },
  ];

  const eventos = [
    {
      dia: "06",
      mes: "Jul",
      titulo: "Dia da pizza",
      informacao: "13:00 - 14:00 | D83T, T4, M2",
      local: "Refeitório",
    },
    {
      dia: "10",
      mes: "Jul",
      titulo: "Porque me sinto triste?",
      informacao: "14:00 - 16:00 | Todas as salas",
      local: "B09",
    },
    {
      dia: "20",
      mes: "Ago",
      titulo: "Festival de talentos",
      informacao: "O dia todo | Adm, D83T, DS2M, T1...",
      local: "Auditório",
    },
  ];

  const dadosRecentes = [
    { rotulo: "Total de alunos", valor: "345", icone: iconeHistorico },
    { rotulo: "Avaliações realizadas", valor: "428", icone: iconeNota },
    {
      rotulo: "Eventos feitos no mês",
      valor: "9",
      icone: iconeCalendarioComPontos,
    },
    { rotulo: "Mensagens enviadas", valor: "3", icone: iconeMensagem },
  ];

  return (
    <EstruturaInstitucional paginaAtiva="inicio" aoNavegar={aoNavegar}>
      <div className="inicio-conteudo">
        <div className="inicio-superior-secao">
          <div className="inicio-superior-esquerdo">
            <FaixaDeDestaque
              textoAcimaDoTitulo="Bem-vindo de volta,"
              tituloDeBoasVindas="Olá, Manoel!"
              textoDeBoasVindas="Algum outro texto legal vai ficar aqui."
              imagemDeFundo={<img src={imagemDeMontanhas} alt="" />}
            />

            <div className="inicio-indicadores">
              <CartaoDeIndicador
                icone={<img src={iconeSorriso} alt="" />}
                rotulo="Índice bem-estar"
                textoDoSelo="Bom"
                valor="78%"
                iconeDaVariacao={<img src={iconeSetaCima} alt="" />}
                textoDaVariacao="8% de aumento nesse mês"
                iconeSeta={<img src={iconeSetaDireita} alt="" />}
              />
              <CartaoDeIndicador
                icone={<img src={iconePessoas} alt="" />}
                rotulo="Participação"
                textoDoSelo="Bom"
                valor="67%"
                iconeDaVariacao={<img src={iconeSetaCima} alt="" />}
                textoDaVariacao="12% de aumento nesse mês"
                iconeSeta={<img src={iconeSetaDireita} alt="" />}
              />
              <CartaoDeIndicador
                icone={<img src={iconeCoracao} alt="" />}
                rotulo="Turmas em atenção"
                textoDoSelo="Bom"
                valor="3"
                iconeDaVariacao={<img src={iconeSetaCima} alt="" />}
                textoDaVariacao="2% de aumento nesse mês"
                iconeSeta={<img src={iconeSetaDireita} alt="" />}
              />
            </div>
          </div>

          <div className="inicio-painel inicio-rapida-acoes">
            <div className="inicio-painel-cabecalho">
              <TituloDoPainel icone={iconeRaio} texto="Ações rápidas" />
            </div>
            <div className="inicio-rapida-acao-lista">
              {acoesRapidas.map((acao) => (
                <div className="inicio-rapida-acao-linha" key={acao.rotulo}>
                  <span className="inicio-rapida-acao-icone">
                    <img src={acao.icone} alt="" />
                  </span>
                  {acao.rotulo === "Criar evento" ? (
                    <button
                      className="inicio-rapida-acao-botao"
                      type="button"
                      onClick={aoCriarEvento}
                    >
                      <span>{acao.rotulo}</span>
                      <img src={iconeSetaDireita} alt="" />
                    </button>
                  ) : (
                    <div className="inicio-rapida-acao-botao">
                      <span>{acao.rotulo}</span>
                      <img src={iconeSetaDireita} alt="" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="inicio-inferior">
          <div className="inicio-painel inicio-grafico-cartao">
            <div className="inicio-painel-cabecalho">
              <TituloDoPainel icone={iconeBarras} texto="Visão geral" />
              <span className="inicio-grafico-periodo">Últimos 30 dias</span>
            </div>

            <svg
              viewBox="0 0 600 170"
              className="inicio-grafico-vetor"
              preserveAspectRatio="none"
            >
              <g className="inicio-grafico-grade">
                <path d="M48 20H598 M48 50H598 M48 80H598 M48 110H598 M48 140H598" />
              </g>
              <g className="inicio-grafico-eixo-rotulo">
                <text x="4" y="24">
                  100
                </text>
                <text x="9" y="54">
                  75
                </text>
                <text x="9" y="84">
                  50
                </text>
                <text x="9" y="114">
                  25
                </text>
                <text x="16" y="144">
                  0
                </text>
                <text x="48" y="163">
                  15/06
                </text>
                <text x="132" y="163">
                  22/06
                </text>
                <text x="218" y="163">
                  29/06
                </text>
                <text x="304" y="163">
                  06/07
                </text>
                <text x="390" y="163">
                  13/07
                </text>
                <text x="476" y="163">
                  20/07
                </text>
                <text x="562" y="163">
                  27/07
                </text>
              </g>
            </svg>

            <div className="inicio-grafico-legenda">
              <span className="inicio-grafico-legenda-item">
                <span className="inicio-grafico-ponto inicio-grafico-ponto-verde"></span>
                Bem-estar
              </span>
              <span className="inicio-grafico-legenda-item">
                <span className="inicio-grafico-ponto inicio-grafico-ponto-azul"></span>
                Participação
              </span>
              <span className="inicio-grafico-legenda-item">
                <span className="inicio-grafico-ponto inicio-grafico-ponto-roxo"></span>
                Turmas em atenção
              </span>
            </div>
          </div>

          <div className="inicio-painel inicio-eventos-cartao">
            <div className="inicio-painel-cabecalho">
              <TituloDoPainel
                icone={iconeCalendarioComPontos}
                texto="Eventos"
              />
              <button
                type="button"
                className="inicio-eventos-atalho"
                onClick={() => aoNavegar("eventos")}
              >
                Ver todos
                <img src={iconeSetaDireita} alt="" />
              </button>
            </div>
            <div className="inicio-evento-lista">
              {eventos.map((evento) => (
                <div className="inicio-evento-linha" key={evento.titulo}>
                  <EtiquetaDeData dia={evento.dia} mes={evento.mes} />
                  <div className="inicio-evento-detalhes">
                    <span className="inicio-evento-titulo">
                      {evento.titulo}
                    </span>
                    <span className="inicio-evento-informacao">
                      {evento.informacao}
                    </span>
                    <span className="inicio-evento-local">
                      <IconeDeLocal />
                      {evento.local}
                    </span>
                  </div>
                  <img
                    className="inicio-evento-seta"
                    src={iconeSetaDireita}
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="inicio-painel inicio-dados-recentes">
            <div className="inicio-painel-cabecalho">
              <TituloDoPainel
                icone={iconeTituloCalendario}
                texto="Dados recentes"
              />
            </div>
            <div className="inicio-painel-lista">
              {dadosRecentes.map((dado) => (
                <CartaoDeLista
                  key={dado.rotulo}
                  iconeInicial={dado.icone && <img src={dado.icone} alt="" />}
                  tamanhoDoIconeInicial={32}
                  titulo={dado.rotulo}
                  conteudoFinal={<span>{dado.valor}</span>}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </EstruturaInstitucional>
  );
}

export default Inicio;
