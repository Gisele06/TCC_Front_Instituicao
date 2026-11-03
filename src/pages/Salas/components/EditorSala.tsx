import { useState, type FormEvent } from "react";
import SeletorDeIcones from "../../../components/Geral/SeletorDeIcones/SeletorDeIcones";
import type { Sala } from "../types";
import type { TipoSalaRegistro } from "../../../types/banco";
import { opcoesDeIcones } from "../../../components/Geral/SeletorDeIcones/opcoes";
import { criarId } from "../utils";
import { CabecalhoEditor, AcoesFormulario } from "./ElementosAcademicos";

export default function EditorSala({ existente, tiposSala, aoVoltar, aoSalvar }: {
  existente?: Sala;
  tiposSala: TipoSalaRegistro[];
  aoVoltar: () => void;
  aoSalvar: (sala: Sala) => void;
}) {
  const [icone, definirIcone] = useState(existente?.icone ?? "formacao");

  function enviarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    aoSalvar({
      id: existente?.id ?? criarId("sala"),
      nome: String(dados.get("nome") ?? "").trim(),
      capacidade: Number(dados.get("capacidade")),
      descricao: String(dados.get("descricao") ?? "").trim(),
      tipo: tiposSala.find((tipo) => String(tipo.id) === String(dados.get("tipo")))?.tipo ?? "",
      tipoId: Number(dados.get("tipo")),
      idIcone: existente?.idIcone ?? null,
      icone,
      ativa: String(dados.get("status")) !== "inativa",
    });
  }

  return (
    <>
      <CabecalhoEditor
        titulo={existente ? "Editar Sala" : "Cadastrar Sala"}
        descricao={existente ? "Atualize as informações desta sala." : "Preencha as informações abaixo para criar uma nova sala."}
        aoVoltar={aoVoltar}
      />
      <form className="academico-formulario" onSubmit={enviarFormulario}>
        <div className="academico-form-area">
          <section className="academico-card academico-card-campos" aria-label="Informações da sala">
            <div className="academico-campos-duplos">
              <label className="academico-campo">
                <span>Nome da sala <i>•</i></span>
                <input name="nome" defaultValue={existente?.nome} placeholder="Nome da sala" maxLength={60} required />
              </label>
              <label className="academico-campo">
                <span>Capacidade <i>•</i></span>
                <input name="capacidade" type="number" min="1" max="9999" defaultValue={existente?.capacidade} placeholder="A quantidade máxima de pessoas nela" required />
              </label>
            </div>
            <label className="academico-campo">
              <span>Descrição <small>(opcional)</small></span>
              <textarea name="descricao" rows={4} defaultValue={existente?.descricao} placeholder="Faça uma breve descrição da sala." maxLength={300} />
            </label>
            <div className="academico-campos-duplos academico-campos-sala">
              <label className="academico-campo">
                <span>Tipo <i>•</i></span>
                <select name="tipo" defaultValue={existente?.tipoId ?? ""} required>
                  <option value="" disabled>Selecione o tipo da sala</option>
                  {tiposSala.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.tipo}</option>)}
                </select>
              </label>
              {existente && <p className="academico-ajuda">O banco não possui status de sala.</p>}
            </div>
          </section>

          <section className="academico-card academico-card-icones">
            <SeletorDeIcones opcoes={opcoesDeIcones} selecionado={icone} aoSelecionar={definirIcone} />
          </section>
        </div>
        <AcoesFormulario aoCancelar={aoVoltar} />
      </form>
    </>
  );
}

