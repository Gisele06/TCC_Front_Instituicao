import "./AcoesFormulario.css";

function AcoesFormulario({
  aoCancelar,
  aoExcluir,
  erro,
  textoSalvar = "Salvar",
  textoExcluir = "Excluir",
}) {
  return (
    <footer className="academico-acoes">
      <div className="academico-acoes-esquerda">
        {erro && (
          <p className="academico-acoes-erro" role="alert">
            {erro}
          </p>
        )}
        {aoExcluir && (
          <button
            type="button"
            className="academico-botao-excluir-rodape"
            onClick={aoExcluir}
          >
            {textoExcluir}
          </button>
        )}
      </div>

      <div className="academico-acoes-direita">
        <button
          type="button"
          className="academico-botao-secundario"
          onClick={aoCancelar}
        >
          Cancelar
        </button>
        <button type="submit" className="academico-botao-principal">
          {textoSalvar}
        </button>
      </div>
    </footer>
  );
}

export default AcoesFormulario;