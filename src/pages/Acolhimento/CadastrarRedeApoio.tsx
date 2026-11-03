import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import EstruturaInstitucional from "../../components/Geral/InstitutionFrame/InstitutionFrame";
import MapaPlaceholder from "../../components/Geral/MapaPlaceholder/MapaPlaceholder";
import { AcoesFormulario, CabecalhoFormulario, PainelFormulario } from "../../components/Geral/FormLayout/FormLayout";
import { listarCategoriasRede, salvarRede } from "./data/redesApoio";
import type { CategoriaRedeRegistro } from "../../types/banco";
import "./CadastrarRedeApoio.css";

interface Props {
  aoNavegar: (pagina: string) => void;
  aoVoltar: () => void;
}

export default function CadastrarRedeApoio({ aoNavegar, aoVoltar }: Props) {
  const [erro, definirErro] = useState("");
  const [salvando, definirSalvando] = useState(false);
  const [categorias, definirCategorias] = useState<CategoriaRedeRegistro[]>([]);

  useEffect(() => {
    let ativo = true;
    listarCategoriasRede().then((lista) => {
      if (ativo) definirCategorias(lista);
    }).catch((falha: unknown) => {
      if (ativo) definirErro(falha instanceof Error ? falha.message : "Erro ao carregar categorias.");
    });
    return () => { ativo = false; };
  }, []);

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    definirErro("");
    const dados = new FormData(evento.currentTarget);
    const nome = String(dados.get("nome") ?? "").trim();
    const telefone = String(dados.get("telefone") ?? "").trim();
    const endereco = String(dados.get("endereco") ?? "").trim();

    if (!nome || !telefone || !endereco) {
      definirErro("Preencha nome, telefone e endereço.");
      return;
    }

    const idCategoria = Number(dados.get("categoria"));
    if (!categorias.some((categoria) => categoria.id === idCategoria)) {
      definirErro("Selecione uma categoria cadastrada no banco.");
      return;
    }

    definirSalvando(true);
    try {
      await salvarRede({
        nome,
        id_categoria_rede_apoio: idCategoria,
        descricao: String(dados.get("descricao") ?? "").trim() || null,
        telefone,
        email: String(dados.get("email") ?? "").trim() || null,
        url_site_ou_rede_social: String(dados.get("site") ?? "").trim() || null,
        endereco,
        latitude: null,
        longitude: null,
      });
      aoVoltar();
    } catch (falha) {
      definirErro(falha instanceof Error ? falha.message : "Não foi possível cadastrar a rede.");
    } finally {
      definirSalvando(false);
    }
  }

  return (
    <EstruturaInstitucional paginaAtiva="acolhimento" aoNavegar={aoNavegar}>
      <main className="cadastrar-rede-pagina">
        <CabecalhoFormulario
          titulo="Cadastrar rede de apoio"
          descricao="Preencha as informações abaixo para cadastrar uma nova rede de apoio."
          aoVoltar={aoVoltar}
        />
        <form className="cadastrar-rede-formulario" onSubmit={salvar}>
          <div className="cadastrar-rede-grid">
            <PainelFormulario titulo="Informações gerais">
              <div className="cadastrar-rede-campos-duplos">
                <label><span>Nome da rede <b>*</b></span><input name="nome" placeholder="Nome da rede" required maxLength={150} /></label>
                <label><span>Categoria <b>*</b></span>
                  <select name="categoria" required defaultValue="">
                    <option value="" disabled>Selecione uma categoria</option>
                    {categorias.map((categoria) => (
                      <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label><span>Descrição <b>*</b></span>
                <textarea name="descricao" rows={5} placeholder="Descreva o que a rede oferece, público atendido, etc." required maxLength={500} />
              </label>
              <div className="cadastrar-rede-campos-duplos">
                <label><span>Telefone <b>*</b></span><input name="telefone" type="tel" placeholder="(00) 00000-0000" required maxLength={20} /></label>
                <label><span>E-mail <small>(opcional)</small></span><input name="email" type="email" placeholder="exemplo@gmail.com" /></label>
              </div>
              <label><span>Site ou rede social <small>(opcional)</small></span>
                <input name="site" type="url" placeholder="https://" />
              </label>
            </PainelFormulario>

            <PainelFormulario titulo="Localização no mapa">
              <MapaPlaceholder className="cadastrar-rede-mapa" />
              <label><span>Endereço <b>*</b></span>
                <input name="endereco" placeholder="Rua, número, bairro..." autoComplete="street-address" required maxLength={256} />
              </label>
              <p className="cadastrar-rede-ajuda">Coordenadas poderão ser preenchidas quando o mapa for integrado.</p>
            </PainelFormulario>
          </div>
          {erro && <p className="cadastrar-rede-erro" role="alert">{erro}</p>}
          {salvando && <p aria-live="polite">Salvando rede de apoio...</p>}
          <AcoesFormulario aoCancelar={aoVoltar} />
        </form>
      </main>
    </EstruturaInstitucional>
  );
}
