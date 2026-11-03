import { useEffect, useState, type FormEvent } from "react";
import EstruturaInstitucional from "../../components/Geral/InstitutionFrame/InstitutionFrame";

import iconeCalendario from "../../assets/icons/Geral/calendario-evento.png";
import iconeRelogio from "../../assets/icons/Geral/relogio-evento.png";
import iconeRecorrencia from "../../assets/icons/Geral/recorrencia-evento.png";
import iconeTurmas from "../../assets/icons/Geral/turmas-evento.png";
import iconeSetaBaixo from "../../assets/icons/Geral/seta-baixo-evento.png";
import iconeSetaVoltar from "../../assets/icons/Geral/seta-voltar-evento.png";
import iconeCalendarioComSinal from "../../assets/icons/CadastrarEvento/calendario-adicionar.png";
import SeletorDeIcones from "../../components/Geral/SeletorDeIcones/SeletorDeIcones";
import { opcoesDeIcones } from "../../components/Geral/SeletorDeIcones/opcoes";

import { adicionarEvento, listarTiposEvento } from "../Eventos/data/eventos";
import { ambiente } from "../../config/ambiente";
import { idObrigatorio } from "../../services/recursos";
import type { TipoEventoRegistro } from "../../types/banco";
import "./CadastrarEvento.css";

interface PropriedadesCadastroDeEvento {
  aoNavegar: (pagina: string) => void;
  aoVoltar: () => void;
}

function CadastrarEvento({ aoNavegar, aoVoltar }: PropriedadesCadastroDeEvento) {
  const [icone, definirIcone] = useState("calendario");
  const [erro, definirErro] = useState("");
  const [salvando, definirSalvando] = useState(false);
  const [tipos, definirTipos] = useState<TipoEventoRegistro[]>([]);

  useEffect(() => {
    let ativo = true;
    listarTiposEvento().then((lista) => {
      if (ativo) definirTipos(lista);
    }).catch((falha: unknown) => {
      if (ativo) definirErro(falha instanceof Error ? falha.message : "Não foi possível carregar tipos de evento.");
    });
    return () => { ativo = false; };
  }, []);

  async function salvarEvento(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const dados = new FormData(evento.currentTarget);
    const inicio = String(dados.get("horaInicio") ?? "");
    const fim = String(dados.get("horaFim") ?? "");
    if (inicio >= fim) {
      definirErro("O término precisa ser depois do horário de início.");
      return;
    }

    const tipoId = Number(dados.get("categoria"));
    if (!tipos.some((tipo) => tipo.id === tipoId)) {
      definirErro("Selecione um tipo de evento cadastrado no banco.");
      return;
    }
    definirSalvando(true);
    try {
      await adicionarEvento({
        nome: String(dados.get("titulo") ?? "").trim(),
        id_tipo_evento: tipoId,
        id_instituicao: idObrigatorio(ambiente.idInstituicao, "ID da instituição"),
        descricao: String(dados.get("descricao") ?? "").trim() || null,
        observacoes: String(dados.get("observacoes") ?? "").trim() || null,
        data_evento: String(dados.get("data") ?? ""),
        horario_inicio: inicio,
        horario_fim: fim,
        local_do_evento: String(dados.get("local") ?? "").trim() || null,
        custo: 0,
        id_sala: null,
      });
      aoVoltar();
    } catch (falha) {
      definirErro(falha instanceof Error ? falha.message : "Não foi possível cadastrar o evento.");
    } finally {
      definirSalvando(false);
    }
  }

  return (
    <EstruturaInstitucional paginaAtiva="eventos" aoNavegar={aoNavegar}>
      <main className="cadastrar-evento-pagina">
        <header className="cadastrar-evento-titulo-principal">
          <button type="button" className="cadastrar-evento-voltar" onClick={aoVoltar} aria-label="Voltar para eventos">
            <img src={iconeSetaVoltar} alt="" />
          </button>
          <div>
            <h1>Cadastrar Evento</h1>
            <p>Preencha as informações abaixo para criar um novo evento.</p>
          </div>
        </header>

        <form className="cadastrar-evento-formulario" onSubmit={salvarEvento}>
          <div className="cadastrar-evento-area">
            <section className="cadastrar-evento-campos" aria-label="Informações do evento">
              <div className="cadastrar-evento-campo-par">
                <label className="cadastrar-evento-campo">
                  <span>Nome do evento <i>•</i></span>
                  <input name="titulo" required maxLength={90} placeholder="Nome do evento" />
                </label>

                <label className="cadastrar-evento-campo">
                  <span>Tipo <i>•</i></span>
                  <span className="cadastrar-evento-selecao-area">
                    <select name="categoria" defaultValue="" required>
                      <option value="" disabled>Selecione os tipos do evento</option>
                      {tipos.map((tipo) => <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>)}
                    </select>
                    <img src={iconeSetaBaixo} alt="" />
                  </span>
                </label>
              </div>

              <div className="cadastrar-evento-campo-par">
                <label className="cadastrar-evento-campo">
                  <span>Descrição <i>•</i></span>
                  <textarea name="descricao" required placeholder="Descreva o evento, objetivo e informações." />
                </label>

                <label className="cadastrar-evento-campo">
                  <span>Observações <small>(opcional)</small></span>
                  <textarea name="observacoes" placeholder="Descreva observações importantes sobre o evento." />
                </label>
              </div>

              <div className="cadastrar-evento-horario-linha">
                <label className="cadastrar-evento-campo">
                  <span>Data do evento <i>•</i></span>
                  <span className="cadastrar-evento-entrada-com-icone">
                    <img src={iconeCalendario} alt="" />
                    <input name="data" type="date" required />
                  </span>
                </label>

                <label className="cadastrar-evento-campo">
                  <span>Hora de início <i>•</i></span>
                  <span className="cadastrar-evento-entrada-com-icone">
                    <img src={iconeRelogio} alt="" />
                    <input name="horaInicio" type="time" required />
                  </span>
                </label>

                <label className="cadastrar-evento-campo">
                  <span>Hora de término <i>•</i></span>
                  <span className="cadastrar-evento-entrada-com-icone">
                    <img src={iconeRelogio} alt="" />
                    <input name="horaFim" type="time" required />
                  </span>
                </label>
              </div>

              <div className="cadastrar-evento-campo-par">
                <label className="cadastrar-evento-campo">
                  <span>Local do evento <small>(opcional)</small></span>
                  <span className="cadastrar-evento-selecao-area cadastrar-evento-selecao-icone">
                    <img src={iconeRecorrencia} alt="" />
                    <input name="local" maxLength={150} placeholder="Ex.: auditório ou pátio" />
                  </span>
                </label>

                <label className="cadastrar-evento-campo">
                  <span>Turmas participantes <small>(ainda sem tabela de vínculo)</small></span>
                  <span className="cadastrar-evento-selecao-area cadastrar-evento-selecao-icone">
                    <img src={iconeTurmas} alt="" />
                    <select disabled title="O SQL ainda não relaciona eventos e turmas.">
                      <option>Integração pendente</option>
                    </select>
                    <img src={iconeSetaBaixo} alt="" />
                  </span>
                </label>
              </div>
            </section>

            <aside className="cadastrar-evento-lateral">
              <SeletorDeIcones
                className="cadastrar-evento-icones"
                selecionado={icone}
                aoSelecionar={definirIcone}
                opcoes={opcoesDeIcones}
              />
              <input type="hidden" name="icone" value={icone} />
              <p>O ícone é apenas visual; tbl_evento não possui campo de ícone.</p>

              <section className="cadastrar-evento-comunicado">
                <h2>Comunicado do evento</h2>
                <p>Crie o comunicado do evento.</p>
                <img src={iconeCalendarioComSinal} alt="" />
                <span className="cadastrar-evento-comunicado-acao">Criar comunicado</span>
              </section>
            </aside>
          </div>

          {erro && <p role="alert" className="cadastrar-evento-erro">{erro}</p>}
          {salvando && <p aria-live="polite">Salvando evento...</p>}
          <footer className="cadastrar-evento-acoes">
            <button type="button" className="cadastrar-evento-cancelar" onClick={aoVoltar}>Cancelar</button>
            <button type="submit" className="cadastrar-evento-salvar">Salvar</button>
          </footer>
        </form>
      </main>
    </EstruturaInstitucional>
  );
}

export default CadastrarEvento;
