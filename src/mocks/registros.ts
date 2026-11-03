// Dados fictícios para testar a interface antes da integração.
// Os nomes dos campos seguem o SQL; IDs simulam as chaves estrangeiras.
export const registrosIniciais: Record<string, object[]> = {
  "categorias-redes-apoio": [
    { id: 1, nome: "Saúde mental" },
    { id: 2, nome: "Saúde" },
    { id: 3, nome: "Assistência social" },
    { id: 4, nome: "Proteção" },
  ],
  "redes-apoio": [
    { id: 1, nome: "Clínica Bem-Estar (exemplo)", descricao: "Atendimento psicológico e orientação para adolescentes.", telefone: "(11) 4000-1000", email: "contato@exemplo.com", latitude: null, longitude: null, url_site_ou_rede_social: null, endereco: "Rua das Flores, 100 - Centro", id_categoria_rede_apoio: 1 },
    { id: 2, nome: "Centro de Apoio Familiar (exemplo)", descricao: "Orientação e acompanhamento de famílias e estudantes.", telefone: "(11) 4000-2000", email: null, latitude: null, longitude: null, url_site_ou_rede_social: null, endereco: "Avenida Central, 300 - Centro", id_categoria_rede_apoio: 3 },
    { id: 3, nome: "Espaço Acolher (exemplo)", descricao: "Acolhimento e encaminhamento para serviços de proteção.", telefone: "(11) 4000-3000", email: null, latitude: null, longitude: null, url_site_ou_rede_social: null, endereco: "Rua das Palmeiras, 52 - Centro", id_categoria_rede_apoio: 4 },
  ],
  "tipos-evento": [
    { id: 1, nome: "Festa" },
    { id: 2, nome: "Palestra" },
    { id: 3, nome: "Oficina" },
    { id: 4, nome: "Campanha" },
  ],
  eventos: [
    { id: 1, nome: "Dia da pizza", descricao: "Encontro de integração entre as turmas.", observacoes: null, custo: 0, data_evento: "2026-11-06", horario_inicio: "13:00:00", horario_fim: "14:00:00", local_do_evento: "Refeitório", id_instituicao: 1, id_sala: null, id_tipo_evento: 1 },
    { id: 2, nome: "Cuidando da saúde mental", descricao: "Palestra sobre emoções e bem-estar no ambiente escolar.", observacoes: null, custo: 0, data_evento: "2026-11-10", horario_inicio: "14:00:00", horario_fim: "16:00:00", local_do_evento: "Auditório", id_instituicao: 1, id_sala: 2, id_tipo_evento: 2 },
    { id: 3, nome: "Festival de talentos", descricao: "Atividade cultural dos estudantes.", observacoes: null, custo: 0, data_evento: "2026-11-20", horario_inicio: "09:00:00", horario_fim: "12:00:00", local_do_evento: "Auditório", id_instituicao: 1, id_sala: 2, id_tipo_evento: 1 },
  ],
  comunicados: [
    { id: 1, nome: "Acolhimento emocional", titulo: "Como lidar com dias difíceis?", descricao: "Conheça os espaços de acolhimento disponíveis na instituição.", observacoes: null, url_banner: null, id_instituicao: 1, id_evento: null, id_funcionario: 1 },
    { id: 2, nome: "Semana de integração", titulo: "Participe da semana de integração", descricao: "Teremos atividades para aproximar as turmas.", observacoes: null, url_banner: null, id_instituicao: 1, id_evento: 3, id_funcionario: 1 },
    { id: 3, nome: "Orientações aos estudantes", titulo: "Cuide de você", descricao: "Lembre-se de procurar ajuda sempre que precisar.", observacoes: null, url_banner: null, id_instituicao: 1, id_evento: null, id_funcionario: 1 },
  ],
  "tipos-sala": [
    { id: 1, tipo: "Sala de aula" },
    { id: 2, tipo: "Auditório" },
    { id: 3, tipo: "Laboratório" },
    { id: 4, tipo: "Biblioteca" },
    { id: 5, tipo: "Multiuso" },
  ],
  salas: [
    { id: 1, nome: "B09", descricao: "Sala de aula convencional", capacidade: 28, id_icone: null, id_instituicao: 1, id_tipo_sala: 1 },
    { id: 2, nome: "Auditório", descricao: "Espaço para eventos e palestras", capacidade: 120, id_icone: null, id_instituicao: 1, id_tipo_sala: 2 },
    { id: 3, nome: "Laboratório de Informática", descricao: "Computadores e recursos digitais", capacidade: 32, id_icone: null, id_instituicao: 1, id_tipo_sala: 3 },
    { id: 4, nome: "B10", descricao: "Sala de aula convencional", capacidade: 30, id_icone: null, id_instituicao: 1, id_tipo_sala: 1 },
    { id: 5, nome: "Biblioteca", descricao: "Leitura e estudo", capacidade: 40, id_icone: null, id_instituicao: 1, id_tipo_sala: 4 },
    { id: 6, nome: "Sala Multiuso", descricao: "Atividades em grupo", capacidade: 36, id_icone: null, id_instituicao: 1, id_tipo_sala: 5 },
  ],
  cursos: [
    { id: 1, nome: "Desenvolvimento de Sistemas", id_tipo_curso: 1, id_instituicao: 1 },
    { id: 2, nome: "Administração", id_tipo_curso: 1, id_instituicao: 1 },
    { id: 3, nome: "Redes de Computadores", id_tipo_curso: 1, id_instituicao: 1 },
    { id: 4, nome: "Mecânica", id_tipo_curso: 1, id_instituicao: 1 },
  ],
  turmas: [
    { id: 1, nome: "DS1M", descricao: "Desenvolvimento de Sistemas - manhã", ativa: 1, horario_inicio_aulas: "07:30:00", horario_fim_aulas: "11:30:00", id_curso: 1 },
    { id: 2, nome: "DS2T", descricao: "Desenvolvimento de Sistemas - tarde", ativa: 1, horario_inicio_aulas: "13:00:00", horario_fim_aulas: "17:00:00", id_curso: 1 },
    { id: 3, nome: "ADM1M", descricao: "Administração - manhã", ativa: 1, horario_inicio_aulas: "08:00:00", horario_fim_aulas: "12:00:00", id_curso: 2 },
    { id: 4, nome: "RED1M", descricao: "Redes - manhã", ativa: 1, horario_inicio_aulas: "07:30:00", horario_fim_aulas: "11:30:00", id_curso: 3 },
    { id: 5, nome: "MEC2T", descricao: "Mecânica - tarde", ativa: 0, horario_inicio_aulas: "13:00:00", horario_fim_aulas: "17:00:00", id_curso: 4 },
  ],
  materias: [
    { id: 1, sigla: "ALG", nome: "Algoritmos", descricao: "Introdução à lógica e programação", ativa: 1, id_curso: 1 },
    { id: 2, sigla: "BDD", nome: "Banco de Dados", descricao: "Modelagem e consultas", ativa: 1, id_curso: 1 },
    { id: 3, sigla: "SOP", nome: "Sistemas Operacionais", descricao: "Fundamentos de sistemas", ativa: 1, id_curso: 1 },
    { id: 4, sigla: "ADG", nome: "Administração Geral", descricao: "Conceitos de gestão", ativa: 1, id_curso: 2 },
    { id: 5, sigla: "RED", nome: "Fundamentos de Redes", descricao: "Redes e protocolos", ativa: 1, id_curso: 3 },
    { id: 6, sigla: "MEC", nome: "Mecânica Aplicada", descricao: "Fundamentos da mecânica", ativa: 0, id_curso: 4 },
  ],
  denuncias: [
    { id: 6767, descricao_do_relato: "Gostaria de relatar uma situação de intimidação que aconteceu no pátio.", data_hora: "2026-11-02T10:32:00", local: "Pátio", id_instituicao: 1, id_aluno: 1, id_tipo_denuncia: 1, id_tipo_envolvido: 1, tipo_denuncia: { nome: "Violência/Agressão" }, tipo_envolvido: { tipo: "Alunos" }, ultimo_status: "Em andamento", total_mensagens: 2 },
    { id: 6214, descricao_do_relato: "Gostaria de conversar sobre uma situação recorrente de bullying.", data_hora: "2026-11-01T15:40:00", local: "Escola", id_instituicao: 1, id_aluno: 2, id_tipo_denuncia: 2, id_tipo_envolvido: 1, tipo_denuncia: { nome: "Convivência/Bullying" }, tipo_envolvido: { tipo: "Alunos" }, ultimo_status: "Resolvido", total_mensagens: 2 },
  ],
  "denuncias/6767/mensagens": [
    { id: 1, texto: "Olá, gostaria de conversar sobre o ocorrido.", data_hora: "2026-11-02T10:32:00", enviada_pela_instituicao: 0, id_chat_anonimo: 1 },
    { id: 2, texto: "Estamos aqui para ouvir e ajudar.", data_hora: "2026-11-02T10:40:00", enviada_pela_instituicao: 1, id_chat_anonimo: 1 },
  ],
  "denuncias/6214/mensagens": [
    { id: 3, texto: "Preciso de orientação para lidar com a situação.", data_hora: "2026-11-01T15:40:00", enviada_pela_instituicao: 0, id_chat_anonimo: 2 },
    { id: 4, texto: "Vamos encaminhar seu relato com cuidado.", data_hora: "2026-11-01T15:50:00", enviada_pela_instituicao: 1, id_chat_anonimo: 2 },
  ],
};
