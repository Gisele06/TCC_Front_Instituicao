import { useState } from "react";
import {
  MenuLateral,
  BarraSuperior,
  CabecalhoDePagina,
  Selo,
  Botao,
  ResumoDeIndicadores,
  CartaoDeIndicador,
  CartaoDeLista,
  Abas,
  CampoDeBusca,
  CampoDeTexto,
  CampoDeTextoLongo,
  CampoDeSelecao,
  CalendarioPequeno,
  FaixaDeDestaque,
} from "../components";
import iconeMenu from "../assets/icons/menu.png";
import iconeInicio from "../assets/icons/home.png";
import iconeBemEstar from "../assets/icons/bem-estar.png";
import iconeAcolhimento from "../assets/icons/acolhimento.png";
import iconeEventos from "../assets/icons/eventos.png";
import iconeComunicados from "../assets/icons/comunicados.png";
import iconeGerenciamento from "../assets/icons/gerenciamento.png";
import iconeLogoBloom from "../assets/icons/logo-b.png";
import iconeSino from "../assets/icons/sino.png";
import iconeBusca from "../assets/icons/busca.png";
import iconeCalendario from "../assets/icons/calendario.png";
import iconeTituloCalendario from "../assets/icons/calendario-titulo.png";
import iconeSetaBaixoBarra from "../assets/icons/chevron-down-topbar.png";
import iconeSetaBaixoFormulario from "../assets/icons/chevron-down-form.png";
import iconeSetaDireita from "../assets/icons/chevron-right.png";
import iconeGrafico from "../assets/icons/grafico.png";
import iconePessoas from "../assets/icons/pessoas.png";
import iconePausado from "../assets/icons/pausado.png";
import iconeSorriso from "../assets/icons/sorriso.png";
import iconeSetaCima from "../assets/icons/seta-cima.png";

const semanas = [
  [
    { dia: 29, outroMes: true },
    { dia: 30, outroMes: true },
    { dia: 1 },
    { dia: 2 },
    { dia: 3 },
    { dia: 4 },
    { dia: 5 },
  ],
  [{ dia: 6 }, { dia: 7 }, { dia: 8 }, { dia: 9 }, { dia: 10 }, { dia: 11 }, { dia: 12 }],
  [{ dia: 13 }, { dia: 14 }, { dia: 15 }, { dia: 16 }, { dia: 17 }, { dia: 18 }, { dia: 19 }],
  [{ dia: 20 }, { dia: 21 }, { dia: 22 }, { dia: 23 }, { dia: 24 }, { dia: 25 }, { dia: 26 }],
  [
    { dia: 27 },
    { dia: 28 },
    { dia: 29 },
    { dia: 30 },
    { dia: 31 },
    { dia: 1, outroMes: true },
    { dia: 2, outroMes: true },
  ],
];

const eventos = [
  { id: "1", horario: "14:00", titulo: "Porque me sinto triste?", categoria: "Aviso" },
  { id: "2", horario: "16:00", titulo: "Porque me sinto triste?", categoria: "Evento" },
];

function MostruarioDeComponentes() {
  const [idAtivoMenu, definirIdAtivoMenu] = useState("inicio");
  const [abaAtiva, definirAbaAtiva] = useState("panorama");
  const [diaSelecionado, definirDiaSelecionado] = useState(10);

  return (
    <div>
      <MenuLateral
        iconeMenu={<img src={iconeMenu} alt="" />}
        itens={[
          { id: "inicio", rotulo: "Inicio", icone: <img src={iconeInicio} alt="" /> },
          { id: "bem-estar", rotulo: "Bem-estar", icone: <img src={iconeBemEstar} alt="" /> },
          { id: "acolhimento", rotulo: "Acolhimento", icone: <img src={iconeAcolhimento} alt="" /> },
          { id: "eventos", rotulo: "Eventos", icone: <img src={iconeEventos} alt="" /> },
          { id: "comunicados", rotulo: "Comunicados", icone: <img src={iconeComunicados} alt="" /> },
          { id: "gerenciamento", rotulo: "Gerenciamento", icone: <img src={iconeGerenciamento} alt="" /> },
        ]}
        idAtivo={idAtivoMenu}
        aoSelecionar={definirIdAtivoMenu}
      />

      <BarraSuperior
        tituloMarca="Bloom"
        iconeMarca={<img src={iconeLogoBloom} alt="" />}
        subtituloMarca="Institucional"
        iconeBusca={<img src={iconeBusca} alt="" />}
        rotuloDaData="06 jul, 2026"
        quantidadeDeAvisos={2}
        nomeUsuario="Fernando Leonid"
        cargoUsuario="Coordenador"
        iconeSino={<img src={iconeSino} alt="" />}
        iconeCalendario={<img src={iconeCalendario} alt="" />}
        iconeSeta={<img src={iconeSetaBaixoBarra} alt="" />}
      />

      <CabecalhoDePagina
        titulo="Bem-estar"
        subtitulo="Acompanhe o bem-estar dos estudantes"
        acoes={<Botao>Novo evento</Botao>}
      />

      <Abas
        itens={[
          { valor: "panorama", rotulo: "Panorama geral" },
          { valor: "turmas", rotulo: "Turmas" },
        ]}
        valor={abaAtiva}
        aoMudar={definirAbaAtiva}
      />

      <CampoDeBusca textoDeAjuda="Buscar sala" icone={<img src={iconeBusca} alt="" />} />

      <ResumoDeIndicadores
        itens={[
          { id: "cadastradas", valor: 12, rotulo: "Cadastradas", icone: <img src={iconeGrafico} alt="" /> },
          { id: "ativas", valor: 8, rotulo: "Ativas", icone: <img src={iconePessoas} alt="" /> },
          { id: "inativas", valor: 4, rotulo: "Inativas", icone: <img src={iconePausado} alt="" /> },
        ]}
      />

      <CartaoDeIndicador
        icone={<img src={iconeSorriso} alt="" />}
        rotulo="Indice bem-estar"
        textoDoSelo="Bom"
        valor="78%"
        iconeDaVariacao={<img src={iconeSetaCima} alt="" />}
        textoDaVariacao="8% de aumento nesse mes"
        iconeSeta={<img src={iconeSetaDireita} alt="" />}
        aoClicar={() => {}}
      />

      <Selo estilo="bom">Bom</Selo>
      <Selo estilo="aviso">Atenção</Selo>
      <Selo estilo="alerta">Alerta</Selo>

      <CartaoDeLista
        iconeInicial={<img src={iconeGrafico} alt="" />}
        titulo="B09"
        subtitulo="Sala de aula convencional"
        conteudoFinal={<img src={iconeSetaDireita} alt="" width={16} height={16} />}
        aoClicar={() => {}}
      />

      <CampoDeTexto rotulo="Nome da sala" obrigatorio textoDeAjuda="Nome da sala" />
      <CampoDeTextoLongo rotulo="Descricao" textoDeAjuda="Faca uma breve descricao" />
      <CampoDeSelecao
        rotulo="Tipo"
        obrigatorio
        textoDeAjuda="Selecione o tipo da sala"
        iconeSeta={<img src={iconeSetaBaixoFormulario} alt="" />}
        opcoes={[
          { valor: "convencional", rotulo: "Sala de aula convencional" },
          { valor: "auditorio", rotulo: "Auditorio" },
        ]}
      />

      <CalendarioPequeno
        titulo="Calendário"
        iconeDoTitulo={<img src={iconeTituloCalendario} alt="" />}
        mesExibido="Julho 2026"
        iconeProximo={<img src={iconeSetaDireita} alt="" />}
        semanas={semanas}
        diaDeHoje={6}
        diaSelecionado={diaSelecionado}
        diasComEvento={[8, 10]}
        aoSelecionarDia={definirDiaSelecionado}
        tituloDosEventos="Comunicados do dia"
        dataDosEventos="10 de Julho de 2026"
        eventos={eventos}
      />

      <FaixaDeDestaque tituloDeBoasVindas="Ola, Manoel!" textoDeBoasVindas="Algum outro texto legal vai ficar aqui." />
    </div>
  );
}

export default MostruarioDeComponentes;
