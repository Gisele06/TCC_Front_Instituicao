import { useMemo, useState, type FormEvent } from "react";
import CabecalhoDePagina from "../../components/PageHeader/PageHeader";
import Painel from "../../components/Panel/Panel";
import AbasSegmentadas from "../../components/SegmentedTabs/SegmentedTabs";
import InformationCard from "../../components/Acolhimento/InformationCard/InformationCard";
import world from "../../assets/icons/Acolhimento/world-markets.png";
import check from "../../assets/icons/Acolhimento/check-mark.png";
import people from "../../assets/icons/Acolhimento/people.png";
import busca from "../../assets/icons/busca.png";
import "./RedesApoio.css";

export type CategoriaRede = "Saúde mental" | "Saúde" | "Assistência social" | "Proteção";

export interface RedeApoio {
  id: number | string;
  nome: string;
  categoria: CategoriaRede;
  descricao: string;
  telefone: string;
  email?: string;
  site?: string;
  endereco: string;
  cep: string;
  distanciaKm?: number;
  disponivel?: boolean;
  proxima?: boolean;
}

export type NovaRedeApoio = Omit<RedeApoio, "id" | "distanciaKm" | "disponivel" | "proxima">;

interface Props {
  redes?: RedeApoio[];
  aoCadastrar?: (rede: NovaRedeApoio) => void | Promise<void>;
  aoSelecionar?: (rede: RedeApoio) => void;
}

const redesIniciais: RedeApoio[] = [
  {
    id: 1,
    nome: "Clínica bem-estar",
    categoria: "Saúde mental",
    descricao: "Atendimento psicológico e psiquiátrico para crianças e adolescentes.",
    telefone: "(11) 0000-0000",
    endereco: "Rua das flores, 245 - Centro",
    cep: "00000-000",
    distanciaKm: 2.3,
    disponivel: true,
    proxima: true
  },
  {
    id: 2,
    nome: "Centro de apoio familiar",
    categoria: "Assistência social",
    descricao: "Serviço de atendimento voltado para orientar, proteger e fortalecer famílias.",
    telefone: "(11) 0000-0000",
    endereco: "Rua Elton Silva, 1000 - Centro",
    cep: "00000-000",
    distanciaKm: 3.1,
    disponivel: true,
    proxima: true
  }
];

const categorias: CategoriaRede[] = ["Saúde mental", "Saúde", "Assistência social", "Proteção"];

const formularioVazio: NovaRedeApoio = {
  nome: "",
  categoria: "Saúde mental",
  descricao: "",
  telefone: "",
  email: "",
  site: "",
  endereco: "",
  cep: ""
};

export default function RedesApoio({ redes, aoCadastrar, aoSelecionar }: Props) {
  const [cadastroAberto, setCadastroAberto] = useState(false);
  const [registrosLocais, setRegistrosLocais] = useState<RedeApoio[]>([]);
  const [categoria, setCategoria] = useState("Todas");
  const [buscaTexto, setBuscaTexto] = useState("");
  const [formulario, setFormulario] = useState<NovaRedeApoio>(formularioVazio);
  const [salvando, setSalvando] = useState(false);

  const lista = redes ?? [...redesIniciais, ...registrosLocais];
  const filtradas = useMemo(() => lista.filter((rede) =>
    (categoria === "Todas" || rede.categoria === categoria) &&
    `${rede.nome} ${rede.categoria} ${rede.descricao} ${rede.endereco}`.toLowerCase().includes(buscaTexto.toLowerCase())
  ), [lista, categoria, buscaTexto]);

  function atualizar(campo: keyof NovaRedeApoio, valor: string) {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
  }

  async function salvar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setSalvando(true);
    try {
      if (aoCadastrar) {
        await aoCadastrar(formulario);
      } else {
        setRegistrosLocais((anterior) => [...anterior, { ...formulario, id: Date.now(), disponivel: true }]);
      }
      setFormulario(formularioVazio);
      setCadastroAberto(false);
    } finally {
      setSalvando(false);
    }
  }

  if (cadastroAberto) {
    return (
      <div className="redes-apoio-cadastro">
        <div className="redes-apoio-cabecalho">
          <button type="button" className="redes-apoio-voltar" onClick={() => setCadastroAberto(false)} aria-label="Voltar" />
          <CabecalhoDePagina titulo="Cadastrar rede de apoio" subtitulo="Preencha as informações abaixo para cadastrar uma nova rede de apoio." />
        </div>
        <form onSubmit={salvar} className="redes-apoio-formulario">
          <Painel titulo="Informações gerais" icone={<img src={world} alt="" />} className="redes-apoio-painel">
            <div className="redes-apoio-campos">
              <label><span>Nome da rede <b>*</b></span><input required placeholder="Nome da rede" value={formulario.nome} onChange={(e) => atualizar("nome", e.target.value)} /></label>
              <label><span>Categoria <b>*</b></span><select required value={formulario.categoria} onChange={(e) => atualizar("categoria", e.target.value)}>{categorias.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
              <label className="redes-apoio-largura"><span>Descrição <b>*</b></span><textarea required placeholder="Descreva o que a rede oferece, público atendido, etc..." value={formulario.descricao} onChange={(e) => atualizar("descricao", e.target.value)} /></label>
              <label><span>Telefone <b>*</b></span><input required type="tel" placeholder="(00) 00000-0000" value={formulario.telefone} onChange={(e) => atualizar("telefone", e.target.value)} /></label>
              <label><span>Email <small>(opcional)</small></span><input type="email" placeholder="exemplo@gmail.com" value={formulario.email} onChange={(e) => atualizar("email", e.target.value)} /></label>
              <label className="redes-apoio-largura"><span>Site ou rede social <small>(opcional)</small></span><input type="url" placeholder="http://..." value={formulario.site} onChange={(e) => atualizar("site", e.target.value)} /></label>
            </div>
          </Painel>
          <Painel titulo="Localização no mapa" icone={<span>●</span>} className="redes-apoio-painel">
            <div className="redes-apoio-mapa redes-apoio-mapa-cadastro" aria-label="Espaço reservado para o mapa" />
            <div className="redes-apoio-campos redes-apoio-endereco">
              <label><span>Endereço <b>*</b></span><input required placeholder="Rua, número, bairro..." value={formulario.endereco} onChange={(e) => atualizar("endereco", e.target.value)} /></label>
              <label><span>CEP <b>*</b></span><input required placeholder="00000-000" value={formulario.cep} onChange={(e) => atualizar("cep", e.target.value)} /></label>
            </div>
          </Painel>
          <div className="redes-apoio-acoes">
            <button type="button" className="redes-apoio-cancelar" onClick={() => setCadastroAberto(false)}>Cancelar</button>
            <button type="submit" className="redes-apoio-primario" disabled={salvando}>{salvando ? "Salvando..." : "Salvar"}</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="redes-apoio-conteudo">
      <div className="redes-apoio-indicadores">
        <InformationCard icon={world} value={redes ? lista.length : 15} label="Cadastradas" />
        <InformationCard icon={people} value={redes ? lista.filter((rede) => rede.proxima).length : 3} label="Próximas" />
        <InformationCard icon={check} value={redes ? lista.filter((rede) => rede.disponivel).length : 9} label="Disponíveis" />
      </div>
      <div className="redes-apoio-colunas">
        <Painel titulo="Redes de apoio" icone={<img src={world} alt="" />} className="redes-apoio-painel redes-apoio-lista">
          <AbasSegmentadas
            className="redes-apoio-filtros"
            tamanho="compacto"
            itens={["Todas", ...categorias].map((item) => ({ valor: item, rotulo: item }))}
            valor={categoria}
            aoMudar={setCategoria}
          />
          <div className="redes-apoio-pesquisa">
            <label><img src={busca} alt="" /><input placeholder="Buscar redes de apoio" value={buscaTexto} onChange={(e) => setBuscaTexto(e.target.value)} /></label>
            <button type="button" className="redes-apoio-primario" onClick={() => setCadastroAberto(true)}>Cadastrar</button>
          </div>
          <div className="redes-apoio-resultados">
            {filtradas.map((rede) => (
              <button type="button" key={rede.id} className="redes-apoio-item" onClick={() => aoSelecionar?.(rede)}>
                <span className="redes-apoio-avatar"><img src={world} alt="" /></span>
                <span className="redes-apoio-item-corpo">
                  <strong>{rede.nome}</strong>
                  <span className="redes-apoio-categoria">{rede.categoria}</span>
                  <span className="redes-apoio-descricao">{rede.descricao}</span>
                  <small>⌖ {rede.endereco}{rede.distanciaKm != null && `　 ↗ ${rede.distanciaKm.toLocaleString("pt-BR")} km`}</small>
                </span>
              </button>
            ))}
            {filtradas.length === 0 && <p className="redes-apoio-vazio">Nenhuma rede encontrada.</p>}
          </div>
        </Painel>
        <div className="redes-apoio-painel redes-apoio-painel-mapa">
          <div className="redes-apoio-mapa" aria-label="Espaço reservado para o mapa" />
        </div>
      </div>
    </div>
  );
}
