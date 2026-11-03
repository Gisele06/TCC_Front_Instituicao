# Integração do frontend Bloom com o banco

Este documento se baseia no arquivo `db_Bloom_Creates (1).sql` enviado pelo grupo.

## O que existe atualmente

- O SQL define **94 tabelas**, chaves primárias e relacionamentos.
- **Não contém dados** (`INSERT INTO`) nem define rotas HTTP.
- O React **não deve se conectar ao MySQL diretamente**: o backend realiza as consultas, valida autenticação/autorização e envia JSON para o frontend.
- `db_Bloom_Creates_corrigido.sql` é uma cópia do SQL, com duas vírgulas adicionadas antes de `CONSTRAINT` em `tbl_avaliacao_materia` e `tbl_diario`. **Não foi executado em servidor MySQL**.
- **Atenção:** o SQL começa com `DROP DATABASE IF EXISTS db_senai_bloom;`. Executá-lo apaga o banco e todos os registros existentes. Use apenas em um ambiente de teste descartável, depois de conferir e guardar backup. Não execute em produção.

## Como ligar a API

1. Copie `.env.example` para `.env` (o `.env` não deve ir para o Git).
2. Para testar sem backend, mantenha `VITE_FONTE_DADOS=mock`. Para usar a API real, configure `VITE_FONTE_DADOS=api` e `VITE_API_BASE_URL=http://localhost:8080/api`.
3. Para testar cadastros com o backend, use IDs de uma instituição e de um funcionário que **realmente existam** em `VITE_INSTITUICAO_ID` e `VITE_FUNCIONARIO_ID`. São apenas campos temporários de desenvolvimento. Na versão com autenticação, o backend deve descobrir esses IDs pela sessão autenticada.
4. Alinhe os caminhos em `src/services/rotasApi.ts` com as rotas construídas pelo grupo. Os caminhos atuais são **propostas de contrato**, não endpoints verificados.
5. As respostas de listagem devem ser arrays de objetos JSON com nomes de campos iguais aos do SQL (por exemplo, `id_categoria_rede_apoio`), ou o grupo deve alterar o mapeador em `src/pages/*/data/`.
6. O frontend faz GET para listar, POST para cadastrar e PUT para editar. A API deve retornar o registro completo com o `id` criado.

## Rotas previstas (a confirmar com o backend)

| Recurso | Método(s) | Resposta esperada |
|---|---|---|
| `redes-apoio` | GET, POST | `tbl_rede_de_apoio` |
| `categorias-redes-apoio` | GET | `tbl_categoria_rede_apoio` |
| `eventos` | GET, POST | `tbl_evento` |
| `tipos-evento` | GET | `tbl_tipo_evento` |
| `comunicados` | GET, POST | `tbl_comunicado` |
| `salas` | GET, POST, PUT | `tbl_sala` |
| `tipos-sala` | GET | `tbl_tipo_sala` |
| `turmas` | GET, POST, PUT | `tbl_turma` |
| `materias` | GET, POST, PUT | `tbl_materia` |
| `cursos` | GET | `tbl_curso` |
| `denuncias` | GET | `tbl_denuncia` com informações relacionadas, quando possível |
| `denuncias/:id/mensagens` | GET, POST | `tbl_mensagem_chat` com autorização no servidor |

### Relações importantes

- `tbl_rede_de_apoio.id_categoria_rede_apoio` aponta para `tbl_categoria_rede_apoio.id`. O frontend não fixa mais nomes de categorias.
- `tbl_materia.id_curso` aponta para **um curso**. A tela de matéria permite selecionar só um curso, diferente do protótipo anterior.
- `tbl_turma.id_curso` é obrigatório, além de `horario_inicio_aulas` e `horario_fim_aulas`.
- `tbl_sala` possui `id_tipo_sala` e `id_icone`, **mas não possui `ativa`**. Por isso o frontend não permite ativar/desativar salas. O seletor visual de ícones precisa ser associado aos IDs de `tbl_icone` para persistir a escolha.
- `tbl_evento` não possui recorrência nem ligação direta com as turmas participantes. Esses controles foram desabilitados; as informações não serão falsamente enviadas ao servidor.
- `tbl_comunicado` não possui data, horário nem categoria/tipo de comunicado. A tela não atribui datas ou categorias inventadas; a vinculação a evento depende de `id_evento`. O backend deverá relacionar `id_funcionario` ao usuário logado, e `url_banner` exigirá fluxo real de upload.
- Para horários e intervalos de turma, ainda serão necessárias rotas próprias ou um payload composto para `tbl_turma_intervalo`, `tbl_intervalo`, `tbl_materia_turma` e `tbl_dia_materia`. A tela não descarta silenciosamente esses dados: impede gravá-los até que a integração esteja definida.
- `tbl_denuncia` não armazena diretamente o nome do tipo, envolvidos, status atual ou contagem de mensagens. A API pode enriquecer o retorno com `tipo_denuncia`, `tipo_envolvido`, `ultimo_status` e `total_mensagens` usando os relacionamentos definidos no banco.
- Estatísticas de bem-estar, estresse, sobrecarga, pertencimento e distribuição exigem **regras de cálculo** que não estão descritas no SQL. As telas mantêm o espaço para os componentes, mas não exibem números e curvas fictícios.

## Proteção de dados

**Denúncias, mensagens e avaliações de estudantes são dados sensíveis.** Antes de usar dados reais:

- Exija autenticação, autorização por instituição e função do usuário em **todos** os endpoints.
- Não confie em `id_instituicao`, `id_aluno` ou `id_funcionario` enviados pelo navegador para definir a permissão.
- Não coloque credenciais do banco de dados nem segredos OAuth em variáveis `VITE_`; elas são públicas no JavaScript compilado.
- O chat anônimo depende de regras reais de privacidade no servidor. A interface por si só não garante anonimato.
- Configure CORS e proteção contra CSRF conforme o método de autenticação escolhido.
- Não envie dados de estudantes ou denúncias para provedores externos sem necessidade e autorização apropriada.

## O que muda visualmente sem API

- Em `mock`, as listagens mostram registros **fictícios** definidos em `src/mocks/registros.ts`.
- Indicadores exibem **números simulados** de `src/mocks/indicadores.ts`, sem relação com dados reais.
- Cadastros básicos usam `localStorage` com o prefixo `bloom-mock-v2:` para simular a persistência.
- Em `api`, listagens, salvamentos e indicadores dependem exclusivamente do backend, sem misturar dados fictícios.
- O mapa continua sendo somente um espaço vazio para integrar Google Maps depois.
- A navegação demonstrativa continua disponível via `VITE_DEMO_MODE=true`. Ela **não equivale a autenticação real**.

Depois que o backend estiver pronto, combine com o grupo a forma exata das respostas JSON e atualize o mapeamento se houver diferenças.

## Modo demonstração (mock)

Os arquivos `src/mocks/registros.ts` e `src/mocks/indicadores.ts` têm exemplos para desenvolvimento; **não são `INSERT` nem registros reais do banco**. O mock permite listar e gravar eventos, comunicados, redes de apoio, salas, turmas e matérias sem servidor. O mapa continua vazio.

A origem é selecionada exclusivamente por `VITE_FONTE_DADOS` no `.env`:

- `mock` (padrão): dados locais, que podem ser reiniciados limpando o `localStorage` com prefixo `bloom-mock-v2:`.
- `api`: `src/services/recursos.ts` executa HTTP via `src/services/api.ts` e `src/services/rotasApi.ts`. Os endpoints são sugestões, não rotas já implementadas.

Os exemplos de indicadores (Home e Bem-estar) são retornados por `src/services/indicadores.ts`. Em modo API, os endpoints de métricas agregadas (`indicadores/home`, `indicadores/bem-estar`, `indicadores/bem-estar/turmas`) devem ser implementados ou ajustados pelo backend. Seus cálculos **não podem ser deduzidos apenas a partir do esquema SQL**.
