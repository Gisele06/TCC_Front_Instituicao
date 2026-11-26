import Abas, { ConteudoAba } from "../../Gerais/Abas/Abas.jsx";
import Input from "../../Gerais/Input/Input.jsx";
import Painel from "../Painel/Painel.jsx";
import { IconeMarcar } from "../../Gerais/Icone/Icone.jsx";
import { iconesBemEstar } from "../../../js/Rotas_BEM_ESTAR/iconesBemEstar.js";
import iconeBusca from "../../../img/icones/busca.png";
import iconeSetaDireita from "../../../img/icones/setaDireita.png";
import "./CardFiltroTurmas.css";

function CardFiltroTurmas({
  abasDosFiltros,
  abaDosFiltros,
  definirAbaDosFiltros,
  busca,
  definirBusca,
  cursosVisiveis,
  selecionados,
  alternarCurso,
  porTurma = false,
}) {
  return (
    <Painel
      className="turmas-painel-filtros"
      titulo="Filtros"
      icone={<img src={iconesBemEstar.filtro} alt="" />}
    >
      <Abas
        className="turmas-filtros-abas"
        tamanho="compacto"
        itens={abasDosFiltros}
        valor={abaDosFiltros}
        aoMudar={definirAbaDosFiltros}
      />

      <Input
        tipo="busca"
        classeName="turmas-busca"
        placeholder={porTurma?"Pesquise por turmas":"Pesquise por cursos"}
        valor={busca}
        aoAlterar={(evento) => definirBusca(evento.target.value)}
        icone={<img src={iconeBusca} alt="" />}
        tamanhoDoIcone="20px"
      />

      <h3 className="turmas-cursos-titulo">{porTurma?"Turmas":"Cursos"}</h3>

      <ConteudoAba chave={abaDosFiltros} className="turmas-cursos-conteudo">
        {cursosVisiveis.length === 0 ? (
          <p className="turmas-cursos-vazio">
            {abaDosFiltros === "selecionados"
              ? porTurma?"Nenhuma turma selecionada.":"Nenhum curso selecionado."
              : porTurma?"Nenhuma turma encontrada.":"Nenhum curso encontrado."}
          </p>
        ) : (
          <ul className="turmas-cursos-lista">
            {cursosVisiveis.map((curso) => {
              const marcado = selecionados.includes(curso.id);
              return (
                <li key={curso.id}>
                  <label className="turmas-curso">
                    <Input
                      tipo="marcacao"
                      marcado={marcado}
                      aoAlterar={() => alternarCurso(curso.id)}
                    />
                    <span className="turmas-curso-caixa">
                      {marcado && <IconeMarcar />}
                    </span>
                    <span className="turmas-curso-nome">{curso.nome}</span>
                    <span className="turmas-curso-quantidade">
                      {curso.turmas} {curso.turmas === 1 ? "turma" : "turmas"}
                    </span>
                    <img src={iconeSetaDireita} alt="" />
                  </label>
                </li>
              );
            })}
          </ul>
        )}
      </ConteudoAba>
    </Painel>
  );
}

export default CardFiltroTurmas;