export const COORDENADA_PADRAO = {
  lat: -23.5489,
  lng: -46.9327,
};

const CHAVE_CACHE_LOCALIZACAO = "bloom_localizacao_usuario";

export function lerLocalizacaoEmCache() {
  try {
    const salvo = sessionStorage.getItem(CHAVE_CACHE_LOCALIZACAO);
    if (!salvo) return null;
    const { lat, lng } = JSON.parse(salvo);
    if (Number.isFinite(lat) && Number.isFinite(lng)) return { lat, lng };
  } catch {
    // Ignora indisponibilidade de sessionStorage
  }
  return null;
}

export function obterLocalizacaoUsuario({ forcarAtualizacao = false } = {}) {
  return new Promise((resolve) => {
    if (!forcarAtualizacao) {
      const emCache = lerLocalizacaoEmCache();
      if (emCache) {
        resolve(emCache);
        return;
      }
    }

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        const coords = {
          lat: posicao.coords.latitude,
          lng: posicao.coords.longitude,
        };
        try {
          sessionStorage.setItem(
            CHAVE_CACHE_LOCALIZACAO,
            JSON.stringify(coords)
          );
        } catch {
          // Ignora erro de escrita
        }
        resolve(coords);
      },
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 }
    );
  });
}

export const CATEGORIAS_APOIO = [
  {
    valor: "Saúde mental",
    rotulo: "Saúde mental",
    cor: "#2f9b78",
    fundo: "#e6f4ee",
    sigla: "SM",
  },
  {
    valor: "Saúde",
    rotulo: "Saúde",
    cor: "#2e73b0",
    fundo: "#e7f1fa",
    sigla: "SA",
  },
  {
    valor: "Assistência social",
    rotulo: "Assistência social",
    cor: "#d9822b",
    fundo: "#fbf1e4",
    sigla: "AS",
  },
  {
    valor: "Proteção",
    rotulo: "Proteção",
    cor: "#7d64b8",
    fundo: "#f1ecfa",
    sigla: "PR",
  },
];

export function obterEstiloCategoria(categoria = "") {
  const normalizada = categoria.trim().toLowerCase();
  return (
    CATEGORIAS_APOIO.find((c) => c.valor.toLowerCase() === normalizada) ||
    CATEGORIAS_APOIO[0]
  );
}

export function formatarTelefone(valor = "") {
  const digitos = String(valor).replace(/\D/g, "").slice(0, 11);
  if (digitos.length <= 2) return digitos ? `(${digitos}` : "";
  if (digitos.length <= 6) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2)}`;
  }
  if (digitos.length <= 10) {
    return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 6)}-${digitos.slice(6)}`;
  }
  return `(${digitos.slice(0, 2)}) ${digitos.slice(2, 7)}-${digitos.slice(7)}`;
}

export function formatarCep(valor = "") {
  const digitos = String(valor).replace(/\D/g, "").slice(0, 8);
  if (digitos.length <= 5) return digitos;
  return `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
}

export function calcularDistanciaKm(origem, destino) {
  if (!origem || !destino || destino.lat == null || destino.lng == null) {
    return null;
  }
  const R = 6371;
  const dLat = ((destino.lat - origem.lat) * Math.PI) / 180;
  const dLng = ((destino.lng - origem.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((origem.lat * Math.PI) / 180) *
      Math.cos((destino.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatarDistancia(km) {
  if (km == null || Number.isNaN(km)) return "";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1).replace(".", ",")} km`;
}

export function enriquecerRede(
  rede,
  indice = 0,
  referencia = COORDENADA_PADRAO
) {
  const base = referencia || COORDENADA_PADRAO;
  const deslocamentos = [
    { lat: 0.006, lng: -0.007 },
    { lat: -0.009, lng: 0.01 },
    { lat: 0.011, lng: 0.012 },
    { lat: -0.011, lng: -0.01 },
  ];
  const fallback = deslocamentos[indice % deslocamentos.length];
  const lat = Number(rede.latitude ?? rede.lat);
  const lng = Number(rede.longitude ?? rede.lng);

  return {
    ...rede,
    categoria: rede.categoria || "Saúde mental",
    endereco: rede.endereco || rede.local || "Endereço não informado",
    telefone: rede.telefone || rede.contato || "",
    latitude:
      Number.isFinite(lat) && lat !== 0 ? lat : base.lat + fallback.lat,
    longitude:
      Number.isFinite(lng) && lng !== 0 ? lng : base.lng + fallback.lng,
  };
}

function montarEnderecoCurto(address = {}, displayName = "") {
  const rua = address.road || address.pedestrian || address.suburb || "";
  const numero = address.house_number ? `, ${address.house_number}` : "";
  const bairro =
    address.suburb || address.neighbourhood || address.city_district || "";
  const cidade = address.city || address.town || address.municipality || "";

  if (rua) {
    const partes = [`${rua}${numero}`];
    if (bairro && bairro !== rua) partes.push(bairro);
    else if (cidade) partes.push(cidade);
    return partes.join(" - ");
  }
  return displayName.split(",").slice(0, 3).join(",").trim();
}

export async function buscarEnderecosPorTexto(
  texto,
  signal,
  referencia = null
) {
  const consulta = texto.trim();
  if (consulta.length < 3) return [];

  const params = new URLSearchParams({
    q: consulta,
    format: "jsonv2",
    addressdetails: "1",
    countrycodes: "br",
    limit: "5",
    "accept-language": "pt-BR",
  });

  if (referencia?.lat != null && referencia?.lng != null) {
    const delta = 0.18;
    params.set(
      "viewbox",
      `${referencia.lng - delta},${referencia.lat + delta},${referencia.lng + delta},${referencia.lat - delta}`
    );
  }

  const resposta = await fetch(
    `https://nominatim.openstreetmap.org/search?${params.toString()}`,
    { signal }
  );
  if (!resposta.ok) return [];

  const lista = await resposta.json();
  return lista.map((item) => ({
    id: item.place_id,
    rotulo: montarEnderecoCurto(item.address, item.display_name),
    detalhe: [
      item.address?.city || item.address?.town || item.address?.municipality,
      item.address?.state,
    ]
      .filter(Boolean)
      .join(" - "),
    cep: formatarCep(item.address?.postcode || ""),
    lat: Number(item.lat),
    lng: Number(item.lon),
  }));
}

export async function buscarEnderecoPorCoordenada(lat, lng, signal) {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    format: "jsonv2",
    addressdetails: "1",
    "accept-language": "pt-BR",
  });

  const resposta = await fetch(
    `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
    { signal }
  );
  if (!resposta.ok) return null;

  const dados = await resposta.json();
  if (!dados || dados.error) return null;

  return {
    endereco: montarEnderecoCurto(dados.address, dados.display_name),
    cep: formatarCep(dados.address?.postcode || ""),
  };
}

export async function buscarEnderecoPorCep(cep, signal) {
  const limpo = String(cep).replace(/\D/g, "");
  if (limpo.length !== 8) return null;

  const respViaCep = await fetch(`https://viacep.com.br/ws/${limpo}/json/`, {
    signal,
  });
  if (!respViaCep.ok) return null;
  const viaCep = await respViaCep.json();
  if (viaCep.erro) return null;

  const enderecoFormatado = [viaCep.logradouro, viaCep.bairro]
    .filter(Boolean)
    .join(" - ");

  const consultaGeo = [
    viaCep.logradouro,
    viaCep.bairro,
    viaCep.localidade,
    viaCep.uf,
    "Brasil",
  ]
    .filter(Boolean)
    .join(", ");

  const resultados = await buscarEnderecosPorTexto(consultaGeo, signal);
  const primeiro = resultados[0] || null;

  return {
    endereco: enderecoFormatado || viaCep.localidade || "",
    cep: formatarCep(limpo),
    lat: primeiro?.lat ?? null,
    lng: primeiro?.lng ?? null,
  };
}