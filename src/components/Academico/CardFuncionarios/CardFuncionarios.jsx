import { useState } from "react";
import Abas, { ConteudoAba } from "../../Gerais/Abas/Abas.jsx";
import Input from "../../Gerais/Input/Input.jsx";
import iconeBusca from "../../../img/icones/busca.png";
import iconeSetaDireita from "../../../img/icones/setaDireita.png";
import "./CardFuncionarios.css";

const OPCOES_FILTRO = [
  { valor: "todas", rotulo: "Todos" },
  { valor: "ativas", rotulo: "Ativos" },
  { valor: "inativas", rotulo: "Inativos" },
];

function obterIniciais(nome = "") {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "F";
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

function CardFuncionarios({
  funcionarios = [],
  filtro = "todas",
  definirFiltro,
  busca = "",
  definirBusca,
  definirEditor,
  alternarStatusFuncionario,
  aoRedefinirSenha,
}) {
  const [reenviadoId, definirReenviadoId] = useState(null);

  function lidarRedefinirSenha(funcionario) {
    const confirmado = window.confirm(
      `Enviar link de redefinição de senha para ${funcionario.email}?`,
    );
    if (!confirmado) return;

    aoRedefinirSenha?.(funcionario);
    definirReenviadoId(funcionario.id);
    setTimeout(() => {
      definirReenviadoId((atual) => (atual === funcionario.id ? null : atual));
    }, 3000);
  }

  return (
    <section
      className="academico-lista-painel academico-funcionarios-painel"
      aria-label="Lista de funcionários"
    >
      <div className="academico-controles">
        <div className="academico-filtros-faixa">
          <Abas
            className="academico-filtros-abas"
            tamanho="compacto"
            itens={OPCOES_FILTRO}
            valor={filtro}
            aoMudar={definirFiltro}
          />
        </div>

        <div className="academico-busca-linha">
          <Input
            tipo="busca"
            classeName="academico-busca"
            valor={busca}
            aoAlterar={(evento) => definirBusca?.(evento.target.value)}
            placeholder="Buscar funcionário"
            aria-label="Buscar funcionário"
            icone={<img src={iconeBusca} alt="" />}
            tamanhoDoIcone="19px"
          />

          <button
            type="button"
            className="academico-botao-principal academico-botao-novo"
            onClick={() => definirEditor?.({ secao: "funcionarios" })}
          >
            Novo Funcionário
          </button>
        </div>
      </div>

      <ConteudoAba
        chave={`funcionarios-${filtro}`}
        className="academico-lista-wrap"
      >
        <div className="academico-lista">
          {funcionarios.length === 0 ? (
            <div className="academico-lista-vazia">
              <strong>Nenhum funcionário encontrado</strong>
              <span>
                {busca.trim() || filtro !== "todas"
                  ? "Altere a busca ou o filtro para ver outros registros."
                  : "Clique em Novo Funcionário para cadastrar o primeiro."}
              </span>
            </div>
          ) : (
            funcionarios.map((funcionario) => {
              const senhaEnviada = reenviadoId === funcionario.id;

              return (
                <article
                  key={funcionario.id}
                  className={`academico-item academico-item-funcionario${
                    funcionario.ativa ? "" : " academico-item--inativo"
                  }`}
                >
                  <button
                    type="button"
                    className="academico-item-principal"
                    onClick={() =>
                      definirEditor?.({
                        secao: "funcionarios",
                        id: funcionario.id,
                      })
                    }
                    aria-label={`Editar funcionário ${funcionario.nome}`}
                  >
                    <span className="academico-funcionario-avatar">
                      {funcionario.foto ? (
                        <img src={funcionario.foto} alt="" />
                      ) : (
                        <span>{obterIniciais(funcionario.nome)}</span>
                      )}
                    </span>

                    <span className="academico-item-informacoes">
                      <strong>{funcionario.nome}</strong>
                      <span>
                        {funcionario.email}
                        {funcionario.cargo ? ` · ${funcionario.cargo}` : ""}
                      </span>
                    </span>
                  </button>

                  <button
                    type="button"
                    className={`academico-status academico-status--clicavel${
                      funcionario.ativa ? "" : " inativo"
                    }`}
                    onClick={() => alternarStatusFuncionario?.(funcionario.id)}
                    title={
                      funcionario.ativa
                        ? "Clique para desativar"
                        : "Clique para ativar"
                    }
                    aria-label={`${
                      funcionario.ativa ? "Desativar" : "Ativar"
                    } funcionário ${funcionario.nome}`}
                  >
                    {funcionario.ativa ? "Ativo" : "Inativo"}
                  </button>

                  <button
                    type="button"
                    className={`academico-botao-redefinir${
                      senhaEnviada ? " academico-botao-redefinir--enviado" : ""
                    }`}
                    onClick={() => lidarRedefinirSenha(funcionario)}
                  >
                    {senhaEnviada ? "Link enviado" : "Redefinir senha"}
                  </button>

                  <button
                    type="button"
                    className="academico-seta"
                    onClick={() =>
                      definirEditor?.({
                        secao: "funcionarios",
                        id: funcionario.id,
                      })
                    }
                    aria-label={`Abrir ${funcionario.nome}`}
                  >
                    <img src={iconeSetaDireita} alt="" />
                  </button>
                </article>
              );
            })
          )}
        </div>
      </ConteudoAba>
    </section>
  );
}

export default CardFuncionarios;