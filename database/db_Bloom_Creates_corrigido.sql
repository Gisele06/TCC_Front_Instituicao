DROP DATABASE IF EXISTS db_senai_bloom;
CREATE DATABASE db_senai_bloom;
USE db_senai_bloom;

#=======================================================
# 1. TABELAS DE APOIO
#=======================================================

#--------tbl_tipo_perfil------
create table tbl_tipo_perfil (
    id      int not null auto_increment primary key,
    nome    varchar(30) not null
);

#--------tbl_tipo_login------

create table tbl_tipo_login (
    id      int not null auto_increment primary key,
    tipo    varchar(15) not null
);

#--------tbl_estado------

create table tbl_estado (
    id      int not null auto_increment primary key,
    nome    varchar(100) not null,
    sigla varchar(10)
);

#--------tbl_tipo_evento------

create table tbl_tipo_evento (
    id      int not null auto_increment primary key,
    nome    varchar(100) not null
);

#--------tbl_tipo_conquista------

create table tbl_tipo_conquista (
    id      int not null auto_increment primary key,
    nome    varchar(30) not null
);


#--------tbl_tipo_sala------

create table tbl_tipo_sala (
    id      int not null auto_increment primary key,
    tipo    varchar(100) not null
);

#--------tbl_tipo_curso------

create table tbl_tipo_curso (
    id      int not null auto_increment primary key,
    nome    varchar(50) not null
);

#--------tbl_intervalo------

create table tbl_intervalo (
    id              int not null auto_increment primary key,
    horario_inicio  time not null,
    horario_fim     time not null
);

#--------tbl_cargo-------

create table tbl_cargo (
    id      int not null auto_increment primary key,
    nome    varchar(80) not null
);

#--------tbl_segmento_educacional-------

create table tbl_segmento_educacional (
    id          int not null auto_increment primary key,
    segmento    varchar(100) not null
);

#--------tbl_turno-------

create table tbl_turno (
    id      int not null auto_increment primary key,
    nome    varchar(15) not null
);

#--------tbl_evidencia-------

create table tbl_evidencia (
    id          int not null auto_increment primary key,
    url_arquivo varchar(255) not null
);

#--------tbl_tipo_envolvido-------

create table tbl_tipo_envolvido (
    id      int not null auto_increment primary key,
    tipo    varchar(50) not null
);

#--------tbl_tipo_denuncia-------

create table tbl_tipo_denuncia (
    id      int not null auto_increment primary key,
    nome    varchar(50) not null
);

#--------tbl_humor-------

create table tbl_humor (
    id          tinyint not null auto_increment primary key,
    nome        varchar(20) not null,
    icone_url   varchar(255) not null
);

#--------tbl_status_tarefa------

create table tbl_status_tarefa (
    id      int not null auto_increment primary key,
    nome    varchar(30) not null
);

#--------tbl_status_convite------

create table tbl_status_convite (
    id      int not null auto_increment primary key,
    nome    varchar(20) not null
);

#--------tbl_fator_impacto------

create table tbl_fator_impacto (
    id      int not null auto_increment primary key,
    nome    varchar(60) not null
);

#--------tbl_fator_influencia------

create table tbl_fator_influencia (
    id      int not null auto_increment primary key,
    nome    varchar(60) not null
);

#--------tbl_categoria_musica------

create table tbl_categoria_musica (
    id      int not null auto_increment primary key,
    nome    varchar(50) not null
);

#--------tbl_categoria_peca------

create table tbl_categoria_peca (
    id      int not null auto_increment primary key,
    nome    varchar(50) not null
);

#--------tbl_tag------

create table tbl_tag (
    id      int not null auto_increment primary key,
    nome    varchar(100) not null
);

#--------tbl_dia_semana------

create table tbl_dia_semana (
    id      int not null auto_increment primary key,
    nome    varchar(15) not null
);

#--------tbl_motivo_reporte------

create table tbl_motivo_reporte (
    id      int not null auto_increment primary key,
    nome    varchar(100) not null
);

#--------tbl_icone------

create table tbl_icone (
    id          int not null auto_increment primary key,
    url_icone   varchar(255) not null
);

#--------tbl_icone_compromisso------

create table tbl_icone_compromisso (
    id          int not null auto_increment primary key,
    icone_url   varchar(255) not null
);

#--------tbl_categoria_rede_apoio------

create table tbl_categoria_rede_apoio (
    id      int not null auto_increment primary key,
    nome    varchar(60) not null
);

#--------tbl_cidade------

create table tbl_cidade (
    id      int not null auto_increment primary key,
    nome    varchar(100) not null
);

#=======================================================
# 2. LOGIN E CADASTRO
#=======================================================

#--------tbl_usuario------

create table tbl_usuario (
    id              int not null auto_increment primary key,
    nome            varchar(150) not null,
    email           varchar(254) not null unique,
    data_de_cadastro date not null,
    status_conta    tinyint not null,
    id_tipo_perfil  int not null,

    constraint fk_usuario_tipo_perfil
    foreign key (id_tipo_perfil)
    references tbl_tipo_perfil(id)
);

#--------tbl_credencial------

create table tbl_credencial (
    id                  int not null auto_increment primary key,
    id_usuario          int not null,
    id_tipo_login       int not null,
    senha_hash          varchar(255),
    id_provedor_externo varchar(255),
    criado_em           datetime not null,

    constraint fk_credencial_usuario
    foreign key (id_usuario)
    references tbl_usuario(id),

    constraint fk_credencial_tipo_login
    foreign key (id_tipo_login)
    references tbl_tipo_login(id)
);

#--------tbl_recuperacao_senha------

create table tbl_recuperacao_senha (
    id              int not null auto_increment primary key,
    codigo_hash     varchar(255) not null,
    criado_em       datetime not null,
    expira_em       datetime not null,
    usado_em        datetime,
    id_usuario      int not null,

    constraint fk_usuario_recuperacao_senha
    foreign key (id_usuario)
    references tbl_usuario(id)

); 

#=======================================================
# 3. CONQUISTAS E ALUNO
#=======================================================

#--------tbl_conquista------

create table tbl_conquista (
    id                  int not null auto_increment primary key,
    nome                varchar(100) not null,
    descricao           varchar(255),
    icone_url           varchar(255),
    id_tipo_conquista   int not null,

    constraint fk_conquista_tipo_conquista
    foreign key (id_tipo_conquista)
    references tbl_tipo_conquista(id)
);

#--------tbl_titulo------

create table tbl_titulo (
    id              int not null auto_increment primary key,
    nome            varchar(100) not null,
    url_icone       varchar(255),
    id_conquista    int not null,

    constraint fk_titulo_conquista
    foreign key (id_conquista)
    references tbl_conquista(id)
);

#--------tbl_aluno------

create table tbl_aluno (
    id                      int not null auto_increment primary key,
    foto_de_perfil          varchar(255),
    url_banner              varchar(255),
    apelido                 varchar(50),
    sequencia_atual_login   int not null,
    melhor_sequencia_login  int not null,
    nome_capivara           varchar(50),
    telefone                varchar(15),
    total_de_registros      int not null,
    biografia               varchar(255),
    ultimo_login            date,
    id_usuario              int not null,
    id_titulo_atual         int,

    constraint fk_aluno_usuario
    foreign key (id_usuario)
    references tbl_usuario(id),

    constraint fk_aluno_titulo
    foreign key (id_titulo_atual)
    references tbl_titulo(id)
);

#--------tbl_aluno_conquista------

create table tbl_aluno_conquista (
    id                  int not null auto_increment primary key,
    marco_de_progresso  int not null default 0,
    data_conclusao      datetime,
    id_aluno            int not null,
    id_conquista        int not null,

    constraint uq_aluno_conquista unique (id_aluno, id_conquista),

    constraint fk_aluno_conquista_aluno
    foreign key (id_aluno)
    references tbl_aluno(id),

    constraint fk_aluno_conquista_conquista
    foreign key (id_conquista)
    references tbl_conquista(id)
);

#=======================================================
# 4. INSTITUICAO
#=======================================================

#--------tbl_endereco------

create table tbl_endereco (
    id          int not null auto_increment primary key,
    id_estado   int not null,
    id_cidade   int not null,

    constraint fk_endereco_estado
    foreign key (id_estado)
    references tbl_estado(id),

    constraint fk_endereco_cidade
    foreign key (id_cidade)
    references tbl_cidade(id)
);

#--------tbl_instituicao------

create table tbl_instituicao (
    id              int not null auto_increment primary key,
    nome            varchar(150) not null,
    email           varchar(254) not null,
    telefone        varchar(15),
    descricao       text,
    logo            varchar(255),
    foto_da_unidade varchar(255),
    site            varchar(255),
    id_endereco     int not null,

    constraint fk_instituicao_endereco
    foreign key (id_endereco)
    references tbl_endereco(id)
);

#--------tbl_instituicao_segmento------

create table tbl_instituicao_segmento (
    id                          int not null auto_increment primary key,
    id_instituicao              int not null,
    id_segmento_educacional     int not null,

    constraint fk_instituicao_segmento_instituicao
    foreign key (id_instituicao)
    references tbl_instituicao(id),

    constraint fk_instituicao_segmento_segmento
    foreign key (id_segmento_educacional)
    references tbl_segmento_educacional(id)
);

#--------tbl_funcionario------

create table tbl_funcionario (
    id          int not null auto_increment primary key,
    id_cargo    int not null,
    id_usuario  int not null,
    url_foto    varchar(255),

    constraint fk_funcionario_cargo
    foreign key (id_cargo)
    references tbl_cargo(id),

    constraint fk_funcionario_usuario
    foreign key (id_usuario)
    references tbl_usuario(id)
);

#--------tbl_funcionario_instituicao------

create table tbl_funcionario_instituicao (
    id              int not null auto_increment primary key,
    id_instituicao  int not null,
    id_funcionario  int not null,

    constraint fk_funcionario_instituicao_instituicao
    foreign key (id_instituicao)
    references tbl_instituicao(id),

    constraint fk_funcionario_instituicao_funcionario
    foreign key (id_funcionario)
    references tbl_funcionario(id)
);

#=======================================================
# 5. GERENCIAMENTO INSTITUCIONAL
#=======================================================

#--------tbl_curso------

create table tbl_curso (
    id              int not null auto_increment primary key,
    nome            varchar(100) not null,
    id_tipo_curso   int not null,
    id_instituicao  int not null,

    constraint fk_curso_tipo_curso
    foreign key (id_tipo_curso)
    references tbl_tipo_curso(id),

    constraint fk_curso_instituicao
    foreign key (id_instituicao)
    references tbl_instituicao(id)
);

#--------tbl_materia------

create table tbl_materia (
    id          int not null auto_increment primary key,
    sigla       varchar(10) not null,
    nome        varchar(100) not null,
    descricao   text,
    ativa       tinyint not null default 1,
    id_curso    int not null,

    constraint fk_materia_curso
    foreign key (id_curso)
    references tbl_curso(id)
);

#--------tbl_turma------

create table tbl_turma (
    id                  int not null auto_increment primary key,
    nome                varchar(50) not null,
    descricao           text,
    ativa               tinyint not null default 1,
    horario_inicio_aulas time not null,
    horario_fim_aulas   time not null,
    id_curso            int not null,

    constraint fk_turma_curso
    foreign key (id_curso)
    references tbl_curso(id)
);

#--------tbl_turma_intervalo------

create table tbl_turma_intervalo (
    id              int not null auto_increment primary key,
    id_intervalo    int not null,
    id_turma        int not null,

    constraint fk_turma_intervalo_intervalo
    foreign key (id_intervalo)
    references tbl_intervalo(id),

    constraint fk_turma_intervalo_turma
    foreign key (id_turma)
    references tbl_turma(id)
);

#--------tbl_sala------

create table tbl_sala (
    id              int not null auto_increment primary key,
    nome            varchar(150) not null,
    capacidade      int not null,
    descricao       text,
    id_icone        int,
    id_instituicao  int not null,
    id_tipo_sala    int not null,

    constraint fk_sala_icone
    foreign key (id_icone)
    references tbl_icone(id),

    constraint fk_sala_instituicao
    foreign key (id_instituicao)
    references tbl_instituicao(id),

    constraint fk_sala_tipo_sala
    foreign key (id_tipo_sala)
    references tbl_tipo_sala(id)
);

#=======================================================
# 6. ALUNO X INSTITUICAO
#=======================================================

#--------tbl_materia_turma------

create table tbl_materia_turma (
    id              int not null auto_increment primary key,
    id_materia      int not null,
    id_turma        int not null,
    horario_inicio  time not null,
    horario_fim     time not null,
    id_sala         int not null,

    constraint fk_materia_turma_materia
    foreign key (id_materia)
    references tbl_materia(id),

    constraint fk_materia_turma_turma
    foreign key (id_turma)
    references tbl_turma(id),

    constraint fk_materia_turma_sala
    foreign key (id_sala)
    references tbl_sala(id)
);

#--------tbl_dia_materia------

create table tbl_dia_materia (
    id                  int not null auto_increment primary key,
    id_dia_semana       int not null,
    id_materia_turma    int not null,

    constraint fk_dia_materia_dia_semana
    foreign key (id_dia_semana)
    references tbl_dia_semana(id),

    constraint fk_dia_materia_materia_turma
    foreign key (id_materia_turma)
    references tbl_materia_turma(id)
);

#--------tbl_convite------

create table tbl_convite (
    id                  int not null auto_increment primary key,
    codigo              varchar(20) not null unique,
    data_de_geracao     datetime not null,
    data_de_utilizacao  datetime,
    data_de_expiracao   datetime not null,
    id_instituicao      int not null,
    id_status            int not null,

    constraint fk_convite_instituicao
    foreign key (id_instituicao)
    references tbl_instituicao(id),

    constraint fk_convite_status_convite
    foreign key (id_status)
    references tbl_status_convite(id)
);

#--------tbl_matricula------

create table tbl_matricula (
    id              int not null auto_increment primary key,
    data_de_entrada date not null,
    ativa            tinyint not null default 1,
    id_aluno        int not null,
    id_turma        int not null,
    id_turno        int not null,
    id_instituicao  int not null,
    nivel           int not null default 1,
    xp_atual        bigint not null default 0,

    constraint fk_matricula_aluno
    foreign key (id_aluno)
    references tbl_aluno(id),

    constraint fk_matricula_turma
    foreign key (id_turma)
    references tbl_turma(id),

    constraint fk_matricula_turno
    foreign key (id_turno)
    references tbl_turno(id),

    constraint fk_matricula_instituicao
    foreign key (id_instituicao)
    references tbl_instituicao(id)
);

#--------tbl_materia_aluno------

create table tbl_materia_aluno (
    id          int not null auto_increment primary key,
    id_materia  int not null,
    id_aluno    int not null,

    constraint uq_materia_aluno unique (id_materia, id_aluno),

    constraint fk_materia_aluno_materia
    foreign key (id_materia)
    references tbl_materia(id),

    constraint fk_materia_aluno_aluno
    foreign key (id_aluno)
    references tbl_aluno(id)
);

#--------tbl_foto------

create table tbl_foto (
    id          int not null auto_increment primary key,
    url_foto    varchar(255) not null
);

#--------tbl_avaliacao_materia------

create table tbl_avaliacao_materia (
    id                  int not null auto_increment primary key,
    data_avaliacao      date not null,
    descricao           text,
    id_materia_aluno    int not null,
    id_humor            tinyint not null,
    foto_url            varchar(255),
    imagem_url          varchar(45),
    marca_pagina        tinyint not null,
    cor_marca_pagina    varchar(30),

    constraint fk_avaliacao_materia_materia_aluno
    foreign key (id_materia_aluno)
    references tbl_materia_aluno(id),

    constraint fk_avaliacao_materia_humor
    foreign key (id_humor)
    references tbl_humor(id)
);

#--------tbl_foto_avaliacao------

create table tbl_foto_avaliacao (
    id                  int not null auto_increment primary key,
    id_avaliacao_materia int not null,
    id_foto             int not null,

    constraint fk_foto_avaliacao_avaliacao_materia
    foreign key (id_avaliacao_materia)
    references tbl_avaliacao_materia(id),

    constraint fk_foto_avaliacao_foto
    foreign key (id_foto)
    references tbl_foto(id)
);

#--------tbl_avaliacao_fator_impacto------

create table tbl_avaliacao_fator_impacto (
    id                  int not null auto_increment primary key,
    id_avaliacao_materia int not null,
    id_fator_impacto    int not null,

    constraint fk_avaliacao_fator_impacto_avaliacao_materia
    foreign key (id_avaliacao_materia)
    references tbl_avaliacao_materia(id),

    constraint fk_avaliacao_fator_impacto_fator_impacto
    foreign key (id_fator_impacto)
    references tbl_fator_impacto(id)
);

#--------tbl_avaliacao------

create table tbl_avaliacao (
    id                  int not null auto_increment primary key,
    id_avaliacao_materia int not null,
    id_fator_influencia int not null,

    constraint fk_avaliacao_avaliacao_materia
    foreign key (id_avaliacao_materia)
    references tbl_avaliacao_materia(id),

    constraint fk_avaliacao_fator_influencia
    foreign key (id_fator_influencia)
    references tbl_fator_influencia(id)
);

#--------tbl_tarefa_diaria------

create table tbl_tarefa_diaria (
    id              int not null auto_increment primary key,
    nome            varchar(100) not null,
    xp_recompensa   int not null,
    id_instituicao  int not null,

    constraint fk_tarefa_diaria_instituicao
    foreign key (id_instituicao)
    references tbl_instituicao(id)
);

#--------tbl_matricula_tarefa------

create table tbl_matricula_tarefa (
    id                  int not null auto_increment primary key,
    data_conclusao      datetime not null,
    data_referencia     date not null,
    id_tarefa_diaria    int not null,
    id_matricula        int not null,

    constraint uq_matricula_tarefa_dia
    unique (id_matricula, id_tarefa_diaria, data_referencia),

    constraint fk_matricula_tarefa_tarefa_diaria
    foreign key (id_tarefa_diaria)
    references tbl_tarefa_diaria(id),

    constraint fk_matricula_tarefa_matricula
    foreign key (id_matricula)
    references tbl_matricula(id)
);

#=======================================================
# 7. CALENDARIO INTELIGENTE
#=======================================================

#--------tbl_compromisso------

create table tbl_compromisso (
    id              int not null auto_increment primary key,
    titulo          varchar(100) not null,
    data_e_hora     datetime not null,
    descricao       text,
    expectativa     text,
    experiencia     text,
    concluido_em    datetime,
    id_aluno        int not null,
    id_icone        int not null,
    id_humor_antes  tinyint,
    id_humor_depois tinyint,

    constraint fk_compromisso_aluno
    foreign key (id_aluno)
    references tbl_aluno(id),

    constraint fk_compromisso_icone
    foreign key (id_icone)
    references tbl_icone_compromisso(id),

    constraint fk_compromisso_humor_antes
    foreign key (id_humor_antes)
    references tbl_humor(id),

    constraint fk_compromisso_humor_depois
    foreign key (id_humor_depois)
    references tbl_humor(id)
);

#--------tbl_etapa_tarefa------

create table tbl_etapa_tarefa (
    id              int not null auto_increment primary key,
    concluida       tinyint not null default 0,
    data_conclusao  datetime,
    id_compromisso  int not null,

    constraint fk_etapa_tarefa_compromisso
    foreign key (id_compromisso)
    references tbl_compromisso(id)
);

#=======================================================
# 8. POMODORO
#=======================================================

#--------tbl_tarefa------

create table tbl_tarefa (
    id                  int not null auto_increment primary key,
    nome                varchar(100) not null,
    ciclos_totais       int not null,
    ciclos_concluidos   int not null default 0,
    id_aluno            int not null,
    id_status_tarefa    int not null,

    constraint fk_tarefa_aluno
    foreign key (id_aluno)
    references tbl_aluno(id),

    constraint fk_tarefa_status_tarefa
    foreign key (id_status_tarefa)
    references tbl_status_tarefa(id)
);

#--------tbl_pomodoro------

create table tbl_pomodoro (
    id              int not null auto_increment primary key,
    tempo_de_estudo int not null,
    pausa_curta     int not null,
    pausa_longa     int not null,
    ciclos_totais   int not null
);

#--------tbl_pomodoro_tarefa------

create table tbl_pomodoro_tarefa (
    id          int not null auto_increment primary key,
    id_pomodoro int not null,
    id_tarefa   int not null,

    constraint fk_pomodoro_tarefa_pomodoro
    foreign key (id_pomodoro)
    references tbl_pomodoro(id),

    constraint fk_pomodoro_tarefa_tarefa
    foreign key (id_tarefa)
    references tbl_tarefa(id)
);

#=======================================================
# 9. DIARIO
#=======================================================

#--------tbl_diario------

create table tbl_diario (
    id                  int not null auto_increment primary key,
    data_hora_registro  datetime not null,
    relato_do_dia       text,
    audio_url           varchar(255),
    id_aluno            int not null,
    id_humor            tinyint not null,
    marca_pagina        tinyint not null,
    cor_marca_pagina    varchar(30),

    constraint fk_diario_aluno
    foreign key (id_aluno)
    references tbl_aluno(id),

    constraint fk_diario_humor
    foreign key (id_humor)
    references tbl_humor(id)
);

#--------tbl_foto_diario------

create table tbl_foto_diario (
    id          int not null auto_increment primary key,
    id_foto     int not null,
    id_diario   int not null,

    constraint fk_foto_diario_foto
    foreign key (id_foto)
    references tbl_foto(id),

    constraint fk_foto_diario_diario
    foreign key (id_diario)
    references tbl_diario(id)
);

#--------tbl_diario_fator_impacto------

create table tbl_diario_fator_impacto (
    id                  int not null auto_increment primary key,
    id_diario           int not null,
    id_fator_impacto    int not null,

    constraint fk_diario_fator_impacto_diario
    foreign key (id_diario)
    references tbl_diario(id),

    constraint fk_diario_fator_impacto_fator_impacto
    foreign key (id_fator_impacto)
    references tbl_fator_impacto(id)
);

#=======================================================
# 10. MUSICA
#=======================================================

#--------tbl_musica------

create table tbl_musica (
    id                  int not null auto_increment primary key,
    capa                varchar(255),
    titulo              varchar(150) not null,
    artista             varchar(150),
    referencia_audio    varchar(255) not null,
    id_categoria_musica int not null,
    id_aluno            int not null,

    constraint fk_musica_categoria_musica
    foreign key (id_categoria_musica)
    references tbl_categoria_musica(id),

    constraint fk_musica_aluno
    foreign key (id_aluno)
    references tbl_aluno(id)
);

#--------tbl_aluno_musica_favorita------

create table tbl_aluno_musica_favorita (
    id          int not null auto_increment primary key,
    id_musica   int not null,
    id_aluno    int not null,

    constraint uq_aluno_musica_favorita unique (id_musica, id_aluno),

    constraint fk_aluno_musica_favorita_musica
    foreign key (id_musica)
    references tbl_musica(id),

    constraint fk_aluno_musica_favorita_aluno
    foreign key (id_aluno)
    references tbl_aluno(id)
);

#=======================================================
# 11. ANOTACOES
#=======================================================

#--------tbl_categoria_anotacao------

create table tbl_categoria_anotacao (
    id              int not null auto_increment primary key,
    nome            varchar(50) not null,
    descricao       varchar(140),
    url_foto_capa   varchar(255)
);

#--------tbl_anotacao------

create table tbl_anotacao (
    id                      int not null auto_increment primary key,
    titulo                  varchar(100) not null,
    url_foto_capa           varchar(255),
    texto_conteudo          text,
    ultima_atualizacao      datetime not null,
    id_aluno                int not null,
    id_categoria_anotacao   int not null,

    constraint fk_anotacao_aluno
    foreign key (id_aluno)
    references tbl_aluno(id),

    constraint fk_anotacao_categoria_anotacao
    foreign key (id_categoria_anotacao)
    references tbl_categoria_anotacao(id)
);

#=======================================================
# 12. EXERCICIOS DE RELAXAMENTO
#=======================================================

#--------tbl_exercicio------

create table tbl_exercicio (
    id                  int not null auto_increment primary key,
    nome                varchar(100) not null,
    descricao           text,
    icone_url           varchar(255),
    duracao_minutos     int,
    url_imagem_fundo    varchar(255)
);

#--------tbl_etapa------

create table tbl_etapa (
    id              int not null auto_increment primary key,
    ordem           int not null,
    titulo          varchar(60) not null,
    instrucao       text not null,
    dica            varchar(60),
    midia_url       varchar(255),
    id_exercicio    int not null,

    constraint uq_etapa_exercicio_ordem unique (id_exercicio, ordem),

    constraint fk_etapa_exercicio
    foreign key (id_exercicio)
    references tbl_exercicio(id)
);

#--------tbl_aluno_exercicio------

create table tbl_aluno_exercicio (
    id              int not null auto_increment primary key,
    data_hora       datetime not null,
    id_exercicio    int not null,
    id_aluno        int not null,

    constraint fk_aluno_exercicio_exercicio
    foreign key (id_exercicio)
    references tbl_exercicio(id),

    constraint fk_aluno_exercicio_aluno
    foreign key (id_aluno)
    references tbl_aluno(id)
);

#=======================================================
# 13. CAPIVARA (SKINS, PECAS E ROUPAS)
#=======================================================

#--------tbl_conjunto_capivara------

create table tbl_conjunto_capivara (
    id              int not null auto_increment primary key,
    nome            varchar(100) not null,
    imagem_url      varchar(255),
    id_conquista    int,

    constraint fk_conjunto_capivara_conquista
    foreign key (id_conquista)
    references tbl_conquista(id)
);

#--------tbl_peca_capivara------

create table tbl_peca_capivara (
    id                      int not null auto_increment primary key,
    nome                    varchar(100) not null,
    imagem_url              varchar(255),
    id_conjunto_capivara    int,
    id_categoria_peca       int not null,

    constraint fk_peca_capivara_conjunto_capivara
    foreign key (id_conjunto_capivara)
    references tbl_conjunto_capivara(id),

    constraint fk_peca_capivara_categoria_peca
    foreign key (id_categoria_peca)
    references tbl_categoria_peca(id)
);

#--------tbl_aluno_peca_equipada------

create table tbl_aluno_peca_equipada (
    id                  int not null auto_increment primary key,
    id_aluno            int not null,
    id_peca_capivara    int not null,
    id_categoria_peca   int not null,

    constraint uq_aluno_peca_equipada_categoria unique (id_aluno, id_categoria_peca),

    constraint fk_aluno_peca_equipada_aluno
    foreign key (id_aluno)
    references tbl_aluno(id),

    constraint fk_aluno_peca_equipada_peca_capivara
    foreign key (id_peca_capivara)
    references tbl_peca_capivara(id),

    constraint fk_aluno_peca_equipada_categoria_peca
    foreign key (id_categoria_peca)
    references tbl_categoria_peca(id)
);

#=======================================================
# 14. CHATBOT
#=======================================================

#--------tbl_conversa_chatbot------

create table tbl_conversa_chatbot (
    id          int not null auto_increment primary key,
    data_inicio datetime not null,
    id_aluno    int not null,

    constraint fk_conversa_chatbot_aluno
    foreign key (id_aluno)
    references tbl_aluno(id)
);

#--------tbl_mensagem_chatbot------

create table tbl_mensagem_chatbot (
    id                  int not null auto_increment primary key,
    texto               text not null,
    data_hora           datetime not null,
    enviada_pelo_aluno  tinyint not null,
    id_conversa_chatbot int not null,

    constraint fk_mensagem_chatbot_conversa_chatbot
    foreign key (id_conversa_chatbot)
    references tbl_conversa_chatbot(id)
);

#--------tbl_preview_conversa------

create table tbl_preview_conversa (
    id          int not null auto_increment primary key,
    titulo      varchar(45),
    texto_base  text,
    icone_url   varchar(255),
    descricao   varchar(100)
);

#=======================================================
# 15. EVENTOS E COMUNICADOS
#=======================================================

#--------tbl_evento------

create table tbl_evento (
    id              int not null auto_increment primary key,
    nome            varchar(150) not null,
    descricao       text,
    observacoes     text,
    custo           decimal(8,2) not null default 0,
    data_evento     date not null,
    horario_inicio  time not null,
    horario_fim     time not null,
    local_do_evento varchar(150),
    id_instituicao  int not null,
    id_sala         int,
    id_tipo_evento  int not null,

    constraint fk_evento_instituicao
    foreign key (id_instituicao)
    references tbl_instituicao(id),

    constraint fk_evento_sala
    foreign key (id_sala)
    references tbl_sala(id),

    constraint fk_evento_tipo_evento
    foreign key (id_tipo_evento)
    references tbl_tipo_evento(id)
);

#--------tbl_tag_evento------

create table tbl_tag_evento (
    id          int not null auto_increment primary key,
    id_evento   int not null,
    id_tag      int not null,

    constraint fk_tag_evento_evento
    foreign key (id_evento)
    references tbl_evento(id),

    constraint fk_tag_evento_tag
    foreign key (id_tag)
    references tbl_tag(id)
);

#--------tbl_comunicado------

create table tbl_comunicado (
    id              int not null auto_increment primary key,
    nome            varchar(150) not null,
    titulo          varchar(100),
    descricao       text,
    observacoes     text,
    url_banner      varchar(255),
    id_instituicao  int not null,
    id_evento       int,
    id_funcionario  int not null,

    constraint fk_comunicado_instituicao
    foreign key (id_instituicao)
    references tbl_instituicao(id),

    constraint fk_comunicado_evento
    foreign key (id_evento)
    references tbl_evento(id),

    constraint fk_comunicado_funcionario
    foreign key (id_funcionario)
    references tbl_funcionario(id)
);

#--------tbl_comentario------

create table tbl_comentario (
    id                  int not null auto_increment primary key,
    texto               varchar(1000) not null,
    data_hora           datetime not null,
    id_usuario          int not null,
    id_comunicado       int not null,
    id_comentario_pai   int,

    constraint fk_comentario_usuario
    foreign key (id_usuario)
    references tbl_usuario(id),

    constraint fk_comentario_comunicado
    foreign key (id_comunicado)
    references tbl_comunicado(id),

    constraint fk_comentario_comentario_pai
    foreign key (id_comentario_pai)
    references tbl_comentario(id)
);

#--------tbl_comentario_favorito------

create table tbl_comentario_favorito (
    id              int not null auto_increment primary key,
    id_comentario   int not null,
    id_aluno        int not null,

    constraint uq_comentario_favorito unique (id_comentario, id_aluno),

    constraint fk_comentario_favorito_comentario
    foreign key (id_comentario)
    references tbl_comentario(id),

    constraint fk_comentario_favorito_aluno
    foreign key (id_aluno)
    references tbl_aluno(id)
);

#--------tbl_reporte_comentario------

create table tbl_reporte_comentario (
    id                  int not null auto_increment primary key,
    data_hora           datetime not null,
    id_comentario       int not null,
    id_aluno            int not null,
    id_motivo_reporte   int not null,

    constraint uq_reporte_comentario unique (id_comentario, id_aluno),

    constraint fk_reporte_comentario_comentario
    foreign key (id_comentario)
    references tbl_comentario(id),

    constraint fk_reporte_comentario_aluno
    foreign key (id_aluno)
    references tbl_aluno(id),

    constraint fk_reporte_comentario_motivo_reporte
    foreign key (id_motivo_reporte)
    references tbl_motivo_reporte(id)
);

#=======================================================
# 16. REDES DE APOIO
#=======================================================

#--------tbl_rede_de_apoio------

create table tbl_rede_de_apoio (
    id                      int not null auto_increment primary key,
    nome                    varchar(150) not null,
    descricao               text,
    telefone                varchar(20) not null,
    email                   varchar(254),
    latitude                decimal(8,6),
    longitude               decimal(9,6),
    url_site_ou_rede_social varchar(255),
    endereco                varchar(256) not null,
    id_categoria_rede_apoio int not null,

    constraint fk_rede_de_apoio_categoria_rede_apoio
    foreign key (id_categoria_rede_apoio)
    references tbl_categoria_rede_apoio(id)
);

#--------tbl_instituicao_rede_apoio------

create table tbl_instituicao_rede_apoio (
    id              int not null auto_increment primary key,
    id_instituicao  int not null,
    id_rede_de_apoio int not null,

    constraint fk_instituicao_rede_apoio_instituicao
    foreign key (id_instituicao)
    references tbl_instituicao(id),

    constraint fk_instituicao_rede_apoio_rede_de_apoio
    foreign key (id_rede_de_apoio)
    references tbl_rede_de_apoio(id)
);

#=======================================================
# 17. DENUNCIAR BULLYING
#=======================================================

#--------tbl_denuncia------

create table tbl_denuncia (
    id                  int not null auto_increment primary key,
    descricao_do_relato text not null,
    data_hora           datetime not null,
    local               varchar(100),
    id_instituicao      int not null,
    id_aluno            int not null,
    id_tipo_denuncia    int not null,
    id_tipo_envolvido   int not null,

    constraint fk_denuncia_instituicao
    foreign key (id_instituicao)
    references tbl_instituicao(id),

    constraint fk_denuncia_aluno
    foreign key (id_aluno)
    references tbl_aluno(id),

    constraint fk_denuncia_tipo_denuncia
    foreign key (id_tipo_denuncia)
    references tbl_tipo_denuncia(id),

    constraint fk_denuncia_tipo_envolvido
    foreign key (id_tipo_envolvido)
    references tbl_tipo_envolvido(id)
);

#--------tbl_local_ocorrencia------

create table tbl_local_ocorrencia (
    id              int not null auto_increment primary key,
    nome            varchar(45) not null,
    id_denuncia     int not null,

    constraint fk_local_ocorrencia_denuncia
    foreign key (id_denuncia)
    references tbl_denuncia(id)
);

#--------tbl_denuncia_evidencia------

create table tbl_denuncia_evidencia (
    id              int not null auto_increment primary key,
    id_denuncia     int not null,
    id_evidencia    int not null,

    constraint fk_denuncia_evidencia_denuncia
    foreign key (id_denuncia)
    references tbl_denuncia(id),

    constraint fk_denuncia_evidencia_evidencia
    foreign key (id_evidencia)
    references tbl_evidencia(id)
);

#--------tbl_historico_status_denuncia------

create table tbl_historico_status_denuncia (
    id          int not null auto_increment primary key,
    data_hora   datetime not null,
    id_denuncia int not null,
    nome        varchar(60) not null,

    constraint fk_historico_status_denuncia_denuncia
    foreign key (id_denuncia)
    references tbl_denuncia(id)
);

#--------tbl_chat_anonimo------

create table tbl_chat_anonimo (
    id                  int not null auto_increment primary key,
    data_de_abertura    datetime not null,
    id_denuncia         int not null unique,
    id_historico_status int not null,

    constraint fk_chat_anonimo_denuncia
    foreign key (id_denuncia)
    references tbl_denuncia(id),

    constraint fk_chat_anonimo_historico_status
    foreign key (id_historico_status)
    references tbl_historico_status_denuncia(id)
);

#--------tbl_mensagem_chat------

create table tbl_mensagem_chat (
    id                          int not null auto_increment primary key,
    texto                       text not null,
    data_hora                   datetime not null,
    enviada_pela_instituicao   tinyint not null,
    id_chat_anonimo             int not null,

    constraint fk_mensagem_chat_chat_anonimo
    foreign key (id_chat_anonimo)
    references tbl_chat_anonimo(id)
);


#=======================================================
# 18. NOTIFICACOES E PREFERENCIAS
#=======================================================

#--------tbl_notificacao------

create table tbl_notificacao (
    id              int not null auto_increment primary key,
    titulo          varchar(150) not null,
    mensagem        varchar(255) not null,
    imagem_url      varchar(255),
    lida            tinyint not null default 0,
    data_hora       datetime not null,
    id_comunicado   int,
    id_aluno        int not null,

    constraint fk_notificacao_comunicado
    foreign key (id_comunicado)
    references tbl_comunicado(id),

    constraint fk_notificacao_aluno
    foreign key (id_aluno)
    references tbl_aluno(id)
);

#--------tbl_preferencia_aluno------

create table tbl_preferencia_aluno (
    id                      int not null auto_increment primary key,
    receber_notificacoes    tinyint not null default 1,
    som_notificacao         tinyint not null default 1,
    notif_conquistas        tinyint not null default 1,
    notif_titulos           tinyint not null default 1,
    notif_skins             tinyint not null default 1,
    notif_tarefas           tinyint not null default 1,
    notif_avaliacao_dia     tinyint not null default 1,
    notif_exercicios        tinyint not null default 1,
    notif_pomodoro          tinyint not null default 1,
    notif_comunicados       tinyint not null default 1,
    notif_eventos           tinyint not null default 1,
    horario_silencio_ativo  tinyint not null default 0,
    horario_silencio_inicio time,
    horario_silencio_fim    time,
    musica_ao_entrar        tinyint not null default 1,
    efeitos_sonoros         tinyint not null default 1,
    volume_musica           tinyint unsigned not null default 70,
    volume_sons             tinyint unsigned not null default 70,
    id_aluno                int not null unique,

    constraint fk_preferencia_aluno_aluno
    foreign key (id_aluno)
    references tbl_aluno(id)
);

-- conta quantas tabelas foram criadas
SELECT COUNT(*) AS total_tabelas
FROM information_schema.tables
WHERE table_schema = DATABASE()
  AND table_type = 'BASE TABLE';
