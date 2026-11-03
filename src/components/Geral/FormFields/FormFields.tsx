import { useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import AreaIcone from "../IconSlot/IconSlot";
import "./FormFields.css";

interface PropriedadesRotuloDoCampo {
  rotulo: string;
  obrigatorio?: boolean;
}

function RotuloDoCampo({ rotulo, obrigatorio }: PropriedadesRotuloDoCampo) {
  return (
    <span className="bloom-campo-rotulo">
      {rotulo}
      {obrigatorio && <span className="bloom-campo-obrigatorio">•</span>}
    </span>
  );
}

interface PropriedadesCampoDeTexto {
  rotulo: string;
  obrigatorio?: boolean;
  textoDeAjuda?: string;
  valor?: string;
  aoMudar?: (valor: string) => void;
  iconeInicial?: ReactNode;
}

export function CampoDeTexto({ rotulo, obrigatorio, textoDeAjuda, valor, aoMudar, iconeInicial }: PropriedadesCampoDeTexto) {
  return (
    <label className="bloom-campo">
      <RotuloDoCampo rotulo={rotulo} obrigatorio={obrigatorio} />
      <span className="bloom-campo-entrada-area">
        {iconeInicial && <AreaIcone icone={iconeInicial} tamanho={16} />}
        <input
          type="text"
          placeholder={textoDeAjuda}
          value={valor}
          onChange={(evento) => aoMudar && aoMudar(evento.target.value)}
        />
      </span>
    </label>
  );
}

interface PropriedadesCampoDeTextoLongo {
  rotulo: string;
  obrigatorio?: boolean;
  textoDeAjuda?: string;
  valor?: string;
  aoMudar?: (valor: string) => void;
}

export function CampoDeTextoLongo({ rotulo, obrigatorio, textoDeAjuda, valor, aoMudar }: PropriedadesCampoDeTextoLongo) {
  return (
    <label className="bloom-campo">
      <RotuloDoCampo rotulo={rotulo} obrigatorio={obrigatorio} />
      <textarea
        rows={4}
        placeholder={textoDeAjuda}
        value={valor}
        onChange={(evento) => aoMudar && aoMudar(evento.target.value)}
      />
    </label>
  );
}

interface PropriedadesCampoDeSenha {
  rotulo: string;
  obrigatorio?: boolean;
  textoDeAjuda?: string;
  valor?: string;
  aoMudar?: (valor: string) => void;
  iconeInicial?: ReactNode;
  iconeAlternancia?: ReactNode;
}

export function CampoDeSenha({
  rotulo,
  obrigatorio,
  textoDeAjuda,
  valor,
  aoMudar,
  iconeInicial,
  iconeAlternancia,
}: PropriedadesCampoDeSenha) {
  const [senhaVisivel, definirSenhaVisivel] = useState(false);

  return (
    <label className="bloom-campo">
      <RotuloDoCampo rotulo={rotulo} obrigatorio={obrigatorio} />
      <span className="bloom-campo-entrada-area">
        {iconeInicial && <AreaIcone icone={iconeInicial} tamanho={16} />}
        <input
          type={senhaVisivel ? "text" : "password"}
          placeholder={textoDeAjuda}
          value={valor}
          onChange={(evento: ChangeEvent<HTMLInputElement>) => aoMudar && aoMudar(evento.target.value)}
        />
        <button
          type="button"
          className="bloom-campo-alternancia"
          onClick={() => definirSenhaVisivel(!senhaVisivel)}
        >
          <AreaIcone icone={iconeAlternancia} rotulo="olho" tamanho={16} />
        </button>
      </span>
    </label>
  );
}

interface OpcaoDeSelecao {
  valor: string;
  rotulo: string;
}

interface PropriedadesCampoDeSelecao {
  rotulo: string;
  obrigatorio?: boolean;
  textoDeAjuda?: string;
  opcoes: OpcaoDeSelecao[];
  aoMudar?: (valor: string) => void;
  iconeSeta?: ReactNode;
}

export function CampoDeSelecao({ rotulo, obrigatorio, textoDeAjuda, opcoes, aoMudar, iconeSeta }: PropriedadesCampoDeSelecao) {
  return (
    <label className="bloom-campo">
      <RotuloDoCampo rotulo={rotulo} obrigatorio={obrigatorio} />
      <span className="bloom-campo-entrada-area">
        <select defaultValue="" onChange={(evento) => aoMudar && aoMudar(evento.target.value)}>
          <option value="" disabled>
            {textoDeAjuda}
          </option>
          {opcoes.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
        <AreaIcone icone={iconeSeta} rotulo="v" tamanho={12} />
      </span>
    </label>
  );
}
