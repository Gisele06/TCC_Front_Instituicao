import type { CategoriaRedeRegistro, RedeApoioRegistro } from "../../../types/banco";
import { listarRegistros, salvarRegistro } from "../../../services/recursos";
import { rotasApi } from "../../../services/rotasApi";

// A categoria vem de tbl_categoria_rede_apoio, não de uma lista fixa no React.
export interface RedeDeApoio {
  id: number;
  nome: string;
  categoria: string;
  idCategoria: number;
  descricao: string;
  telefone: string;
  email: string;
  site: string;
  endereco: string;
  latitude: number | null;
  longitude: number | null;
}

export async function listarCategoriasRede() {
  return listarRegistros<CategoriaRedeRegistro>(rotasApi.categoriasRede);
}

export async function listarRedes(): Promise<RedeDeApoio[]> {
  const [redes, categorias] = await Promise.all([
    listarRegistros<RedeApoioRegistro>(rotasApi.redesApoio),
    listarCategoriasRede(),
  ]);
  const nomes = new Map(categorias.map((categoria) => [categoria.id, categoria.nome]));
  return redes.map((rede) => ({
    id: rede.id,
    nome: rede.nome,
    categoria: nomes.get(rede.id_categoria_rede_apoio) ?? "Categoria não encontrada",
    idCategoria: rede.id_categoria_rede_apoio,
    descricao: rede.descricao ?? "",
    telefone: rede.telefone,
    email: rede.email ?? "",
    site: rede.url_site_ou_rede_social ?? "",
    endereco: rede.endereco,
    latitude: rede.latitude == null ? null : Number(rede.latitude),
    longitude: rede.longitude == null ? null : Number(rede.longitude),
  }));
}

export async function salvarRede(rede: Omit<RedeApoioRegistro, "id">) {
  return salvarRegistro<RedeApoioRegistro>(rotasApi.redesApoio, rede);
}
