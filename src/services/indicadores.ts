import { ambiente } from "../config/ambiente";
import { bemEstarTurmasMock, painelHomeMock, panoramaBemEstarMock } from "../mocks/indicadores";
import { requisicaoApi } from "./api";
import { rotasApi } from "./rotasApi";

export type PainelHome = typeof painelHomeMock;
export type PanoramaBemEstar = typeof panoramaBemEstarMock;
export type BemEstarTurmas = typeof bemEstarTurmasMock;

export function carregarPainelHome(): Promise<PainelHome> {
  return ambiente.fonteDados === "mock"
    ? Promise.resolve(structuredClone(painelHomeMock))
    : requisicaoApi<PainelHome>(rotasApi.indicadoresHome);
}

export function carregarPanoramaBemEstar(): Promise<PanoramaBemEstar> {
  return ambiente.fonteDados === "mock"
    ? Promise.resolve(structuredClone(panoramaBemEstarMock))
    : requisicaoApi<PanoramaBemEstar>(rotasApi.indicadoresBemEstar);
}

export function carregarBemEstarTurmas(): Promise<BemEstarTurmas> {
  return ambiente.fonteDados === "mock"
    ? Promise.resolve(structuredClone(bemEstarTurmasMock))
    : requisicaoApi<BemEstarTurmas>(rotasApi.indicadoresTurmas);
}
