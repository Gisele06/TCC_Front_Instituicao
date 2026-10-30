import type { ReactNode } from "react";
import iconeCadeado from "../../assets/icons/cadeado.png";
import iconeCarta from "../../assets/icons/carta.png";
import iconeCheck from "../../assets/icons/check.png";
import iconeCidade from "../../assets/icons/cidade.png";
import iconeEstado from "../../assets/icons/estado.png";
import iconeSetaBaixo from "../../assets/icons/chevron-down-form.png";
import iconeFormacao from "../../assets/icons/formacao.png";
import iconeInstituicao from "../../assets/icons/instituicao.png";
import iconeOlho from "../../assets/icons/olho.png";
import iconePessoa from "../../assets/icons/pessoa.png";
import iconeTelefone from "../../assets/icons/telefone.png";
import "./AcessoFluxo.css";

export type TipoIconeAcesso =
  | "pessoa"
  | "instituicao"
  | "formacao"
  | "telefone"
  | "email"
  | "estado"
  | "cidade"
  | "cadeado"
  | "olho"
  | "seta"
  | "check";

const imagensDosIcones: Record<TipoIconeAcesso, string> = {
  pessoa: iconePessoa,
  instituicao: iconeInstituicao,
  formacao: iconeFormacao,
  telefone: iconeTelefone,
  email: iconeCarta,
  estado: iconeEstado,
  cidade: iconeCidade,
  cadeado: iconeCadeado,
  olho: iconeOlho,
  seta: iconeSetaBaixo,
  check: iconeCheck,
};

interface PropriedadesIconeAcesso {
  tipo: TipoIconeAcesso;
  className?: string;
}

export function IconeAcesso({ tipo, className = "" }: PropriedadesIconeAcesso) {
  return <img className={className} src={imagensDosIcones[tipo]} alt="" />;
}

interface PropriedadesEtapasAcesso {
  etapas: string[];
  etapaAtual: number;
}

export function EtapasAcesso({ etapas, etapaAtual }: PropriedadesEtapasAcesso) {
  return (
    <ol
      className="acesso-etapas"
      aria-label={`Etapa ${etapaAtual} de ${etapas.length}`}
    >
      {etapas.map((rotulo, indice) => {
        const numero = indice + 1;
        const concluida = numero < etapaAtual;
        const atual = numero === etapaAtual;

        return (
          <li
            className="acesso-etapa"
            key={rotulo}
            aria-current={atual ? "step" : undefined}
          >
            {numero <= etapaAtual && (
              <span
                className={`acesso-etapa-marcador${concluida ? " acesso-etapa-marcador-concluida" : ""}`}
                aria-label={concluida ? "Concluída" : `Etapa ${numero}`}
              >
                {concluida ? <IconeAcesso tipo="check" /> : numero}
              </span>
            )}
            <span className="acesso-etapa-rotulo">{rotulo}</span>
            {indice < etapas.length - 1 && (
              <span className="acesso-etapa-linha" aria-hidden="true" />
            )}
          </li>
        );
      })}
    </ol>
  );
}

interface PropriedadesRequisitosSenha {
  senha: string;
}

export function RequisitosSenha({ senha }: PropriedadesRequisitosSenha) {
  const requisitos = [
    { texto: "Pelo menos 8 caracteres.", atendido: senha.length >= 8 },
    {
      texto: "Combine letras com números.",
      atendido: /[a-z]/i.test(senha) && /\d/.test(senha),
    },
    {
      texto: "Inclua pelo menos um símbolo especial.",
      atendido: /[^a-z\d]/i.test(senha),
    },
    {
      texto: "Pelo menos uma letra maiúscula.",
      atendido: /[A-Z]/.test(senha),
    },
  ];

  return (
    <ul className="acesso-requisitos" aria-label="Requisitos da senha">
      {requisitos.map(({ texto, atendido }) => (
        <li
          className={atendido ? "acesso-requisito acesso-requisito-atendido" : "acesso-requisito"}
          key={texto}
        >
          <span className="acesso-requisito-marcador" aria-hidden="true">
            {atendido && <IconeAcesso tipo="check" />}
          </span>
          <span>{texto}</span>
        </li>
      ))}
    </ul>
  );
}

interface PropriedadesCampoAcesso {
  id: string;
  rotulo: string;
  icone: TipoIconeAcesso;
  children: ReactNode;
  className?: string;
}

export function CampoAcesso({
  id,
  rotulo,
  icone,
  children,
  className = "",
}: PropriedadesCampoAcesso) {
  return (
    <div className={`acesso-campo ${className}`.trim()}>
      <label className="acesso-campo-rotulo" htmlFor={id}>
        {rotulo}
      </label>
      <span className="acesso-entrada-area">
        <IconeAcesso tipo={icone} className="acesso-entrada-icone" />
        {children}
      </span>
    </div>
  );
}
