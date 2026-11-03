# Bloom Institucional — Frontend

Frontend do TCC Bloom, desenvolvido com **React, TypeScript e Vite**.

O projeto mantém o visual das referências do grupo (base de 1920 × 1080), com componentes organizados por tela. As partes compartilhadas ficam em `components/Geral`, e cada tela tem seus próprios estilos.

## Como executar

É necessário ter Node.js instalado (recomendado: versão LTS atual).

```bash
npm ci
cp .env.example .env
npm run dev
```

No Windows, o segundo comando pode ser feito copiando o arquivo `.env.example` e renomeando a cópia para `.env`.

Para validar o código:

```bash
npm run build
npm run lint
```

> Se a instalação de dependências vier de outro computador ou sistema operacional, remova `node_modules` e rode `npm ci` novamente. Essa pasta não deve ir para o Git.

## Organização das pastas

```text
src/
├── App.tsx                       # Navegação entre telas
├── assets/
│   ├── icons/
│   │   ├── Geral/                # Ícones usados em mais de uma tela
│   │   ├── Acolhimento/
│   │   ├── BemEstar/
│   │   ├── Home/
│   │   └── ...                   # Ícones exclusivos de cada área
│   └── images/
├── components/
│   ├── Geral/
│   │   ├── InstitutionFrame/     # Layout com menu e barra superior
│   │   ├── FormLayout/           # Cabeçalho, painel e ações de formulário
│   │   ├── SeletorDeIcones/      # Grade de ícones reutilizável
│   │   ├── MapaPlaceholder/      # Área vazia reservada para mapa futuro
│   │   └── ...                   # Outros componentes compartilhados
│   └── index.ts                  # Exportações dos componentes existentes
├── pages/
│   ├── Acolhimento/
│   │   ├── Denuncias.tsx         # Aba de denúncias e navegação
│   │   ├── RedesApoio.tsx        # Aba de redes de apoio
│   │   ├── CadastrarRedeApoio.tsx
│   │   ├── components/           # Cards e chat próprios dessa tela
│   │   └── data/                 # Serviços e adaptação de registros do banco
│   ├── BemEstar/
│   ├── Eventos/
│   ├── CadastrarEvento/
│   ├── Comunicados/
│   ├── CadastrarComunicados/
│   ├── Salas/
│   │   ├── Salas.tsx             # Listagem, filtros e navegação do gerenciamento
│   │   ├── components/           # Formulários de sala, turma e matéria
│   │   ├── data/                 # Consultas e adaptação de registros
│   │   ├── types.ts              # Contratos dos dados acadêmicos
│   │   └── utils.ts
│   ├── Login/
│   ├── Cadastro/
│   ├── RecuperarSenha/
│   └── Home/
├── config/ambiente.ts            # Leitura das variáveis do .env
├── hooks/                        # Hooks reutilizáveis
├── services/api.ts               # Cliente HTTP base
├── index.css                     # Paleta, tipografia e medidas globais
└── types/
```

## Variáveis de ambiente

Configure o arquivo `.env` com base em `.env.example`:

| Variável | Para que serve |
| --- | --- |
| `VITE_FONTE_DADOS` | `mock` para exemplos locais ou `api` para dados reais (padrão: `mock`) |\n| `VITE_API_BASE_URL` | URL base do backend, por exemplo `http://localhost:8080/api` |
| `VITE_GOOGLE_CLIENT_ID` | Identificador público do OAuth do Google |
| `VITE_GOOGLE_MAPS_API_KEY` | Chave **pública e restrita** do Maps, quando o mapa for integrado |
| `VITE_INSTITUICAO_ID` | ID de instituição existente para testes; o servidor deve validar a sessão |
| `VITE_FUNCIONARIO_ID` | ID de funcionário existente para testes; o servidor deve validar a sessão |
| `VITE_DEMO_MODE` | `true` habilita a navegação de demonstração sem autenticação real |

**Atenção:** qualquer variável iniciada com `VITE_` pode ser vista no navegador. Não coloque senha, token privado, `client_secret` ou chave de servidor nesse arquivo. Guarde segredos e validações no backend. O `.env` está no `.gitignore`; compartilhe só o `.env.example`.

## Dados e integração com o MySQL

O frontend foi atualizado com base no esquema SQL enviado pelo grupo. **O SQL não contém dados reais nem endpoints**, apenas 94 definições de tabelas. Por padrão, **as telas usam registros fictícios**, compatíveis com os nomes de campos e vínculos do SQL. Os dados de demonstração não são reais e não são enviados ao MySQL.

**Confira `database/INTEGRACAO.md`**: contém os caminhos esperados, contratos das tabelas, limitações e orientações importantes de segurança.

Tipos de registro estão em `src/types/banco.ts`, caminhos da API em `src/services/rotasApi.ts` e requisições HTTP em `src/services/api.ts`. Os módulos `pages/*/data/` transformam a resposta JSON no formato de cada tela.

Por padrão, `VITE_FONTE_DADOS=mock` e `VITE_API_BASE_URL` fica em branco. Assim os cadastros de teste funcionam sem backend, usando `localStorage`. Para integrar depois, mude para `VITE_FONTE_DADOS=api`, preencha a URL e combine as rotas com o backend. **No modo API, erros de conexão são mostrados: não ocorre fallback silencioso para dados fictícios.** O navegador nunca deve receber a senha do MySQL.

> **Importante:** `database/db_Bloom_Creates_corrigido.sql` ainda contém `DROP DATABASE`. Isso apaga todos os dados existentes. Não execute esse script em um banco com dados importantes.

O login de demonstração não implementa a sessão do backend; a autenticação real precisa ser feita pelo grupo antes de expor denúncias ou mensagens.

## Mapa de redes de apoio

Como combinado, **não há desenho de mapa** no projeto.

A área da referência foi reservada com `src/components/Geral/MapaPlaceholder/MapaPlaceholder.tsx`. A aba `RedesApoio.tsx` e a tela `CadastrarRedeApoio.tsx` usam esse componente. Ele mantém o tamanho do mapa no layout e exibe apenas uma mensagem discreta.

Quando forem integrar Google Maps (ou outra biblioteca):

1. Instalem a biblioteca escolhida e configurem sua chave pública **restrita por domínio e API**.
2. Criem o componente de mapa real e coloquem-no no lugar do conteúdo do `MapaPlaceholder` (ou usem a propriedade `children` dele).
3. Conectem os endereços/posições vindos do backend; não inventem coordenadas no frontend.
4. Tratem os estados sem chave, carregando, erro e mapa vazio.

O valor `VITE_GOOGLE_MAPS_API_KEY` está reservado, mas **nenhuma chamada ao Google Maps é feita por enquanto**.

## Autenticação

O botão do Google só é habilitado se `VITE_GOOGLE_CLIENT_ID` estiver configurado. No modo demonstração, o login permite navegar pelo sistema; isso **não é autenticação de produção**. Para produção, o backend precisa receber/validar a credencial do Google, criar uma sessão e proteger os endpoints. O login com Facebook está desabilitado porque ainda não existe integração.

## Regras de organização para manter o projeto limpo

- Um componente usado em mais de uma tela vai para `components/Geral`.
- Um componente exclusivo fica em `pages/NomeDaTela/components`.
- Os ícones seguem o mesmo critério em `assets/icons/Geral` ou `assets/icons/NomeDaTela`.
- Cada tela tem seu próprio CSS, mesmo onde há estilos parecidos. As variáveis globais de cores e tipografia ficam em `src/index.css`.
- Os nomes do código estão em português sempre que isso facilita a leitura pelo grupo.
- Comentários explicam decisões ou integrações; não repetem o que o código já mostra.

## Observações sobre o estágio do frontend

- As telas existentes do ZIP original foram mantidas e reorganizadas.
- A aba Redes de apoio e o formulário Cadastrar rede de apoio foram acrescentados.
- Os filtros e as buscas de Redes, Eventos e Comunicados funcionam na interface.
- Dados fictícios das telas principais ficam em `src/mocks/registros.ts` e `src/mocks/indicadores.ts`. Os serviços são compartilhados com a API. Os cálculos reais dos indicadores, notificações, reenvios e autenticação dependem do backend.
- O layout foi desenvolvido tomando as referências como direção, mas a revisão visual pixel a pixel em navegador real e a integração com a API ainda são etapas do grupo.

## Testar cadastros sem backend

Com `VITE_FONTE_DADOS=mock`, os registros de demonstração aparecem nas listagens e os cadastros básicos são guardados **somente no `localStorage` do navegador**. Os registros não estão no arquivo SQL e não serão enviados ao banco.

Para limpar os cadastros de teste, abra o console do navegador (F12) e execute:

```js
Object.keys(localStorage)
  .filter((chave) => chave.startsWith("bloom-mock-v2:"))
  .forEach((chave) => localStorage.removeItem(chave));
location.reload();
```

Ao ativar o backend:

1. Troque `VITE_FONTE_DADOS=mock` por `VITE_FONTE_DADOS=api` no `.env` e reinicie `npm run dev`.
2. Preencha `VITE_API_BASE_URL` e ajuste `src/services/rotasApi.ts`.
3. Confira se os endpoints retornam os formatos descritos em `src/types/banco.ts` e `src/services/indicadores.ts`.
4. Combine com o grupo a autenticação, autorização e o cálculo dos indicadores; o SQL define tabelas, **não regras para essas métricas**.

Dados sensíveis de estudantes e denúncias não devem ser guardados em `localStorage` em produção. O modo mock serve apenas para testar o layout.
