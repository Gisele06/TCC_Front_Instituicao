// Só os caminhos ficam aqui. Troque-os de acordo com as rotas reais do backend.
// O SQL define tabelas, mas não define endpoints HTTP.
export const rotasApi = {
  redesApoio: "redes-apoio",
  categoriasRede: "categorias-redes-apoio",
  eventos: "eventos",
  tiposEvento: "tipos-evento",
  comunicados: "comunicados",
  salas: "salas",
  tiposSala: "tipos-sala",
  turmas: "turmas",
  materias: "materias",
  cursos: "cursos",
  denuncias: "denuncias",
  // Indicadores são agregações calculadas pelo backend, não tabelas do SQL.
  indicadoresHome: "indicadores/home",
  indicadoresBemEstar: "indicadores/bem-estar",
  indicadoresTurmas: "indicadores/bem-estar/turmas",
  mensagensDenuncia: (id: number) => `denuncias/${id}/mensagens`,
} as const;
