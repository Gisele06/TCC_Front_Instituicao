import { useEffect, useRef, useState } from "react";
import Input from "../../Input/Input.jsx";
import {
  obterUsuarioLogado,
  atualizarPerfil,
} from "../../../../js/Rotas_LOGIN/rotas_LOGIN.js";
import { lerImagemLocal } from "../../../../js/Gerais/arquivos.js";
import Icone from "../../Icone/Icone.jsx";
import "./PerfilCard.css";

function PerfilCard({ foto, nomeUsuario, cargoUsuario, iconeSeta, aoSair }) {
  const [aberto, definirAberto] = useState(false);
  const [editar, definirEditar] = useState(false);
  const [erro, definirErro] = useState("");
  const [novaFoto, definirFoto] = useState(null);
  const [novoBanner, definirBanner] = useState(null);
  const containerRef = useRef(null);
  const usuario = obterUsuarioLogado();

  useEffect(() => {
    if (!aberto) return;

    function aoClicarFora(evento) {
      if (!containerRef.current?.contains(evento.target)) {
        definirAberto(false);
        definirEditar(false);
      }
    }

    function aoPressionarEsc(evento) {
      if (evento.key === "Escape") {
        definirAberto(false);
        definirEditar(false);
      }
    }

    document.addEventListener("mousedown", aoClicarFora);
    window.addEventListener("keydown", aoPressionarEsc);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      window.removeEventListener("keydown", aoPressionarEsc);
    };
  }, [aberto]);

  function salvar(evento) {
    evento.preventDefault();
    const dados = Object.fromEntries(new FormData(evento.currentTarget));
    delete dados.arquivo;
    delete dados.arquivoBanner;
    if(novoBanner) dados.banner=novoBanner;
    if (novaFoto) dados.foto = novaFoto;
    try {
      atualizarPerfil(dados);
      definirEditar(false);
      definirAberto(false);
    } catch (e) {
      definirErro(e.message);
    }
  }

  return (
    <div className="bloom-barra-superior-usuario" ref={containerRef}>
      <button
        type="button"
        className="bloom-barra-superior-usuario-gatilho"
        aria-label="Opções da conta"
        aria-expanded={aberto}
        onClick={() => {
          definirAberto((estado) => {
            if (estado) definirEditar(false);
            return !estado;
          });
        }}
      >
        <Icone
          icone={foto}
          rotulo="foto de perfil"
          tamanho="48px"
          className="bloom-barra-superior-retrato"
        />
        <div className="bloom-barra-superior-usuario-informacao">
          <span className="bloom-barra-superior-usuario-nome">
            {nomeUsuario}
          </span>
          <span className="bloom-barra-superior-usuario-cargo">
            {cargoUsuario}
          </span>
        </div>
        <span
          className={`bloom-barra-superior-usuario-seta ${
            aberto ? "bloom-barra-superior-usuario-seta--aberta" : ""
          }`}
        >
          <Icone icone={iconeSeta} rotulo="v" tamanho="13px" />
        </span>
      </button>

      {aberto && (
        <div className="perfil-opcoes">
          {!editar ? (
            <>
              <button
                type="button"
                onClick={() => {
                  definirEditar(true);
                  definirErro("");
                  definirFoto(null);
                  definirBanner(null);
                }}
              >
                Editar perfil
              </button>
              <button type="button" onClick={aoSair}>
                Sair da conta
              </button>
            </>
          ) : (
            <form onSubmit={salvar}>
              <label>
                Nome
                <Input
                  tipo="texto"
                  nome="nome"
                  valorInicial={usuario.nome}
                  obrigatorio
                />
              </label>
              <label>
                Cargo
                <Input
                  tipo="texto"
                  nome="cargo"
                  valorInicial={usuario.cargo}
                  obrigatorio
                />
              </label>
              <label>
                Instituição
                <Input
                  tipo="texto"
                  nome="instituicao"
                  valorInicial={usuario.instituicao}
                />
              </label>
              <label>
                Telefone
                <Input
                  tipo="telefone"
                  nome="telefone"
                  valorInicial={usuario.telefone}
                />
              </label>
              <label>
                Foto
                <Input
                  tipo="arquivo"
                  nome="arquivo"
                  aceitar="image/*"
                  aoAlterar={async (e) => {
                    try {
                      definirFoto(await lerImagemLocal(e.target.files?.[0]));
                    } catch (erroFoto) {
                      definirErro(erroFoto.message);
                    }
                  }}
                />
              </label>
              <label>Banner da instituição
                <Input tipo="arquivo" nome="arquivoBanner" aceitar="image/*" aoAlterar={async e=>{try{definirBanner(await lerImagemLocal(e.target.files?.[0]));}catch(erroBanner){definirErro(erroBanner.message);}}}/>
              </label>
              {erro && <p role="alert">{erro}</p>}
              <button type="submit">Salvar</button>
              <button type="button" onClick={() => definirEditar(false)}>
                Cancelar
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default PerfilCard;