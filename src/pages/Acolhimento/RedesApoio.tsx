import { fonteDisponivel } from "../../services/recursos";
import { useEffect, useMemo, useState } from "react";
import MapaPlaceholder from "../../components/Geral/MapaPlaceholder/MapaPlaceholder";
import CartaoRedeApoio from "./components/CartaoRedeApoio";
import { listarRedes, type RedeDeApoio } from "./data/redesApoio";
import buscaIcone from "../../assets/icons/Geral/busca.png";
import redeIcone from "../../assets/icons/Acolhimento/world-markets.png";
import "./RedesApoio.css";

interface Props {
  aoCadastrar: () => void;
}

export default function RedesApoio({ aoCadastrar }: Props) {
  const [categoria, definirCategoria] = useState("Todas");
  const [pesquisa, definirPesquisa] = useState("");
  const [selecionada, definirSelecionada] = useState<RedeDeApoio | null>(null);
  const [redes, definirRedes] = useState<RedeDeApoio[]>([]);
  const [erro, definirErro] = useState("");
  const [carregando, definirCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    listarRedes()
      .then((dados) => { if (ativo) definirRedes(dados); })
      .catch((falha: unknown) => {
        if (ativo) definirErro(falha instanceof Error ? falha.message : "Erro ao carregar redes de apoio.");
      })
      .finally(() => { if (ativo) definirCarregando(false); });
    return () => { ativo = false; };
  }, []);

  const categorias = ["Todas", ...new Set(redes.map((rede) => rede.categoria))];

  const resultados = useMemo(() => redes.filter((rede) => {
    const correspondeCategoria = categoria === "Todas" || rede.categoria === categoria;
    const texto = `${rede.nome} ${rede.categoria} ${rede.descricao} ${rede.endereco}`.toLocaleLowerCase("pt-BR");
    return correspondeCategoria && texto.includes(pesquisa.trim().toLocaleLowerCase("pt-BR"));
  }), [redes, categoria, pesquisa]);

  return (
    <>
      <div className="redes-apoio-indicadores" aria-label="Resumo das redes de apoio">
        <span><strong>{fonteDisponivel() && !erro && !carregando ? redes.length : "—"}</strong> Cadastradas</span>
        <span><strong>—</strong> Próximas</span>
        <span><strong>—</strong> Disponíveis</span>
      </div>

      <div className="redes-apoio-layout">
        <section className="redes-apoio-painel" aria-label="Redes de apoio">
          <h2><img src={redeIcone} alt="" /> Redes de apoio</h2>
          <div className="redes-apoio-filtros" role="group" aria-label="Filtrar categoria">
            {categorias.map((opcao) => (
              <button
                key={opcao}
                className={categoria === opcao ? "ativo" : ""}
                type="button"
                aria-pressed={categoria === opcao}
                onClick={() => definirCategoria(opcao)}
              >
                {opcao}
              </button>
            ))}
          </div>
          <div className="redes-apoio-ferramentas">
            <label>
              <img src={buscaIcone} alt="" />
              <input
                value={pesquisa}
                onChange={(evento) => definirPesquisa(evento.target.value)}
                type="search"
                placeholder="Buscar redes de apoio"
              />
            </label>
            <button type="button" onClick={aoCadastrar}>Cadastrar</button>
          </div>
          <div className="redes-apoio-lista">
            {!fonteDisponivel() && <p className="redes-apoio-vazio">Configure VITE_API_BASE_URL no modo API para carregar as redes do banco.</p>}
            {carregando && <p className="redes-apoio-vazio">Carregando redes de apoio...</p>}
            {erro && <p className="redes-apoio-vazio" role="alert">{erro}</p>}
            {!carregando && !erro && fonteDisponivel() && (resultados.length ? resultados.map((rede) => (
              <CartaoRedeApoio key={rede.id} rede={rede} aoSelecionar={() => definirSelecionada(rede)} />
            )) : <p className="redes-apoio-vazio">Nenhuma rede cadastrada ou encontrada.</p>)}
          </div>
        </section>
        <section className="redes-apoio-mapa" aria-label="Mapa de localização">
          <MapaPlaceholder />
        </section>
      </div>

      {selecionada && (
        <div className="redes-apoio-modal-fundo" onClick={() => definirSelecionada(null)}>
          <section className="redes-apoio-modal" role="dialog" aria-modal="true" aria-label={`Detalhes de ${selecionada.nome}`} onClick={(evento) => evento.stopPropagation()}>
            <button type="button" className="redes-apoio-modal-fechar" aria-label="Fechar detalhes" onClick={() => definirSelecionada(null)}>×</button>
            <h2>{selecionada.nome}</h2>
            <p><strong>Categoria:</strong> {selecionada.categoria}</p>
            <p>{selecionada.descricao}</p>
            <p><strong>Endereço:</strong> {selecionada.endereco}</p>
            <p><strong>Telefone:</strong> {selecionada.telefone}</p>
            {selecionada.email && <p><strong>E-mail:</strong> {selecionada.email}</p>}
          </section>
        </div>
      )}
    </>
  );
}
