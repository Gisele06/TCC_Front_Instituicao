import { ambiente } from "../../../config/ambiente";
import { requisicaoApi } from "../../../services/api";

export interface ProgramacaoComunicado {
  comunicadoId: number;
  tipo: string;
  data: string;
  horaInicio: string;
  horaFim: string;
  recorrencia: string;
  turmas: string[];
  corpo: string;
}
const chave = "bloom-comunicados-programacao-v1";
export async function salvarProgramacao(dados: ProgramacaoComunicado) {
  if (ambiente.fonteDados === "api") {
    return requisicaoApi<ProgramacaoComunicado>(`comunicados/${dados.comunicadoId}/programacao`, { method: "PUT", body: JSON.stringify(dados) });
  }
  const atuais = carregarProgramacoesLocais();
  localStorage.setItem(chave, JSON.stringify([...atuais.filter(item => item.comunicadoId !== dados.comunicadoId), dados]));
  return dados;
}
export function carregarProgramacoesLocais(): ProgramacaoComunicado[] {
  try {
    const salvos = JSON.parse(localStorage.getItem(chave) || "[]") as ProgramacaoComunicado[];
    if (salvos.length) return salvos;
    const data = new Date();
    const hoje = data.toISOString().slice(0,10);
    return [
      { comunicadoId: 1, tipo: "aviso", data: hoje, horaInicio: "09:00", horaFim: "10:00", recorrencia: "unica", turmas: ["1"], corpo: "" },
      { comunicadoId: 2, tipo: "informativo", data: hoje, horaInicio: "14:00", horaFim: "15:00", recorrencia: "semanal", turmas: ["1", "2"], corpo: "" },
      { comunicadoId: 3, tipo: "orientacao", data: hoje, horaInicio: "16:00", horaFim: "17:00", recorrencia: "unica", turmas: ["3"], corpo: "" },
    ];
  }
  catch { return []; }
}

export function ocorreNoDia(dataInicial: string, recorrencia: string, dia: string): boolean {
  if (!dataInicial || !dia || dia < dataInicial) return false;
  if (dia === dataInicial) return true;
  const inicio = new Date(`${dataInicial}T12:00:00`);
  const atual = new Date(`${dia}T12:00:00`);
  const dias = Math.round((atual.getTime() - inicio.getTime()) / 86400000);
  if (recorrencia === "diaria") return dias > 0;
  if (recorrencia === "semanal") return dias % 7 === 0;
  if (recorrencia === "mensal") return inicio.getDate() === atual.getDate();
  if (recorrencia === "anual") return inicio.getDate() === atual.getDate() && inicio.getMonth() === atual.getMonth();
  return false;
}
