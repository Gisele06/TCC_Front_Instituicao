import type { DenunciaRegistro } from "../../../types/banco";
import { listarRegistros } from "../../../services/recursos";
import { rotasApi } from "../../../services/rotasApi";

// Os campos de relacionamento são opcionais: a API pode preenchê-los com JOIN.
type DenunciaDaApi = DenunciaRegistro & {
  tipo_denuncia?: { nome: string };
  tipo_envolvido?: { tipo: string };
  ultimo_status?: string;
  total_mensagens?: number;
};

export interface Denuncia {
  id: number;
  categoria: string;
  resumo: string;
  relato: string;
  mensagens?: number;
  data: string;
  status: string;
  local: string;
  envolvidos: string;
}

export async function carregarDenuncias(): Promise<Denuncia[]> {
  const denuncias = await listarRegistros<DenunciaDaApi>(rotasApi.denuncias);
  return denuncias.map((item) => ({
    id: item.id,
    categoria: item.tipo_denuncia?.nome ?? `Tipo #${item.id_tipo_denuncia}`,
    resumo: item.descricao_do_relato.slice(0, 120),
    relato: item.descricao_do_relato,
    mensagens: item.total_mensagens,
    data: item.data_hora ? item.data_hora.replace("T", " ").slice(0, 16) : "Data não informada",
    status: item.ultimo_status ?? "Status não informado",
    local: item.local ?? "Local não informado",
    envolvidos: item.tipo_envolvido?.tipo ?? "Não informado",
  }));
}
