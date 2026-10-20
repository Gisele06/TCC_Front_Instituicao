import type { FormEvent } from "react";
import EstruturaInstitucional from "../../components/InstitutionFrame/InstitutionFrame";

import iconeCalendario from "../../assets/icons/calendario-evento.png";
import iconeRelogio from "../../assets/icons/relogio-evento.png";
import iconeRecorrencia from "../../assets/icons/recorrencia-evento.png";
import iconeTurmas from "../../assets/icons/turmas-evento.png";
import iconeSetaBaixo from "../../assets/icons/seta-baixo-evento.png";
import iconeSetaVoltar from "../../assets/icons/seta-voltar-evento.png";
import iconeCalendarioComSinal from "../../assets/icons/calendario-adicionar.png";

import "./CadastrarEvento.css";

interface PropriedadesCadastroDeEvento {
  aoNavegar: (pagina: string) => void;
  aoVoltar: () => void;
}

function CadastrarEvento({ aoNavegar, aoVoltar }: PropriedadesCadastroDeEvento) {
  function voltarParaEventos(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    aoVoltar();
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

        <form className="cadastrar-evento-formulario" onSubmit={voltarParaEventos}>
          <div className="cadastrar-evento-area">
            <section className="cadastrar-evento-campos" aria-label="Informações do evento">
              <div className="cadastrar-evento-campo-par">
                <label className="cadastrar-evento-campo">
                  <span>Nome do evento <i>•</i></span>
                  <input
                    placeholder="Nome do evento"
                  />
                </label>

                <label className="cadastrar-evento-campo">
                  <span>Tipo <i>•</i></span>
                  <span className="cadastrar-evento-selecao-area">
                    <select defaultValue="">
                      <option value="" disabled>Selecione os tipos do evento</option>
                      <option>Palestra</option>
                      <option>Oficina</option>
                      <option>Campanha</option>
                      <option>Festa</option>
                      <option>Reunião</option>
                    </select>
                    <img src={iconeSetaBaixo} alt="" />
                  </span>
                </label>
              </div>

              <div className="cadastrar-evento-campo-par">
                <label className="cadastrar-evento-campo">
                  <span>Descrição <i>•</i></span>
                  <textarea
                    placeholder="Descreva o evento, objetivo e informações."
                  />
                </label>

                <label className="cadastrar-evento-campo">
                  <span>Observações <small>(opcional)</small></span>
                  <textarea
                    placeholder="Descreva observações importantes sobre o evento."
                  />
                </label>
              </div>

              <div className="cadastrar-evento-horario-linha">
                <label className="cadastrar-evento-campo">
                  <span>Data do evento <i>•</i></span>
                  <span className="cadastrar-evento-entrada-com-icone">
                    <img src={iconeCalendario} alt="" />
                    <input type="text" placeholder="dd/mm/aa" />
                  </span>
                </label>

                <label className="cadastrar-evento-campo">
                  <span>Hora de início <i>•</i></span>
                  <span className="cadastrar-evento-entrada-com-icone">
                    <img src={iconeRelogio} alt="" />
                    <input type="text" placeholder="--:--" />
                  </span>
                </label>

                <label className="cadastrar-evento-campo">
                  <span>Hora de término <i>•</i></span>
                  <span className="cadastrar-evento-entrada-com-icone">
                    <img src={iconeRelogio} alt="" />
                    <input type="text" placeholder="--:--" />
                  </span>
                </label>
              </div>

              <div className="cadastrar-evento-campo-par">
                <label className="cadastrar-evento-campo">
                  <span>Recorrência <small>(opcional)</small></span>
                  <span className="cadastrar-evento-selecao-area cadastrar-evento-selecao-icone">
                    <img src={iconeRecorrencia} alt="" />
                    <select defaultValue="Não se repete">
                      <option>Não se repete</option>
                      <option>Todo dia</option>
                      <option>Toda semana</option>
                      <option>Todo mês</option>
                    </select>
                    <img src={iconeSetaBaixo} alt="" />
                  </span>
                </label>

                <label className="cadastrar-evento-campo">
                  <span>Turmas participantes</span>
                  <span className="cadastrar-evento-selecao-area cadastrar-evento-selecao-icone">
                    <img src={iconeTurmas} alt="" />
                    <select defaultValue="">
                      <option value="">Selecione as turmas que vão participar</option>
                      <option>Turma 1</option>
                      <option>Turma 2</option>
                      <option>Todas as salas</option>
                    </select>
                    <img src={iconeSetaBaixo} alt="" />
                  </span>
                </label>
              </div>
            </section>

            <aside className="cadastrar-evento-lateral">
              <div className="cadastrar-evento-adicionar-imagem">
                <span>Adicionar imagem</span>
              </div>

              <section className="cadastrar-evento-comunicado">
                <h2>Comunicado do evento</h2>
                <p>Crie o comunicado do evento.</p>
                <img src={iconeCalendarioComSinal} alt="" />
                <span className="cadastrar-evento-comunicado-acao">Criar comunicado</span>
              </section>
            </aside>
          </div>

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
