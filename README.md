# Projeto Prático (Front End) — Pets & Tutores (React + TypeScript)

**Candidato:** João Pedro Ritter  
**Repositório:** `joaopedroritter047428`  
**Vaga/Perfil:** Analista de TI — Engenheiro da Computação (Sênior)  
**Etapa:** Projeto Profissional — **Projeto 2 (Front End / SPA)**

Aplicação SPA em **React + TypeScript** que consome a API pública de Pets e Tutores, permitindo **listar, cadastrar, editar, excluir, vincular/desvincular** e **enviar fotos** conforme especificação do edital.

- **Swagger oficial:** https://pet-manager-api.geia.vip/q/swagger-ui/
- **API Base URL (default):** `https://pet-manager-api.geia.vip`

---

### Módulos (Lazy-loaded)
- **Pets**
  - Listagem com cards + paginação (10 por página) e busca por nome
  - Detalhe do pet (com dados do tutor quando existir)
  - Formulário de criação/edição
  - Upload de foto do pet
- **Tutores**
  - Listagem + paginação e busca por nome
  - Detalhe do tutor + lista de pets vinculados
  - Formulário de criação/edição
  - Upload de foto do tutor
  - Vincular/Desvincular pet ao tutor

### Autenticação
- Login via `/autenticacao/login`
- Renovação automática via `/autenticacao/refresh` quando a API retorna `401` (com “single flight” para evitar múltiplos refresh simultâneos)

---

## 🧱 Arquitetura e organização

Estrutura **feature-based** (por domínio) para facilitar manutenção, escalabilidade e separação de responsabilidades:

```
src/
  app/                 # shell, providers e router (lazy routes)
  features/
    auth/              # autenticação + storage + context
    pets/              # páginas, components e camada de API/facade
    tutores/           # páginas, components e camada de API/facade
  shared/
    api/               # axios client + interceptors
    components/        # UI components reutilizáveis
    config/            # env
    utils/             # helpers
  tests/               # testes unitários
  styles/              # estilos globais
```

### Camadas
- **UI (pages/components):** telas e componentes visuais
- **Facade (hooks):** `usePets`, `usePet`, `useCreatePet`, etc. — concentra regras de cache, invalidação, mutações e integrações
- **API client:** `shared/api/api-client.ts` centraliza Axios, baseURL, headers e interceptors
- **Auth:** `features/auth` gerencia tokens + expiração + refresh

---

## 🔐 Autenticação e expiração do token

1. Login salva `access_token`, `refresh_token` e timestamps de expiração
2. Requests usam interceptor para injetar `Authorization: Bearer <access_token>`
3. Em `401`, o interceptor tenta **refresh** (uma única chamada para evitar corrida)
4. Se refresh falhar ou expirar, força logout e redireciona para `/login`

---

## 🧪 Testes

Ferramentas:
- **Vitest**
- **@testing-library/react**
- **jsdom**

Exemplos no projeto:
- Renderização de componentes (ex.: `PetCard`)
- Testes utilitários (ex.: paginação)
- Testes de storage/auth

---

## 🚀 Como executar (Local)

### Pré-requisitos
- Node.js 20+ (recomendado)
- npm

### 1) Instalar dependências
```bash
npm install
```

### 2) Configurar variáveis de ambiente
Crie/edite `.env`:
```env
VITE_API_BASE_URL=https://pet-manager-api.geia.vip
```

### 3) Rodar em modo dev
```bash
npm run dev
```
Acesse:
- http://localhost:5173

---

## 🐳 Como executar (Docker / Produção local)

O projeto possui build multi-stage e serve o app via **Nginx**.

### Subir com docker-compose
```bash
docker compose up --build
```

Acesse:
- App: http://localhost:8080
- Health check: http://localhost:8080/healthz

### Health / Liveness / Readiness
- Endpoint: `GET /healthz` (retorna `200 ok`)
- Docker: `healthcheck` configurado no `docker-compose.yml` para validar o container via `/healthz`

---

## 🧰 Scripts úteis

```bash
# dev
npm run dev

# build
npm run build

# preview do build
npm run preview

# lint
npm run lint
npm run lint:fix

# formatter
npm run format
npm run format:check

# testes
npm test
```

---

## 📌 Decisões técnicas

- **React Query** para padronizar fetch/cache/retry/invalidação e reduzir complexidade de estado manual
- **Facade via hooks** para manter telas “finas” e concentrar regras de dados em um lugar
- **Interceptors Axios** para autenticação e refresh automáticos (melhor UX e menos repetição)
- **Tailwind** para produtividade e responsividade com baixo acoplamento de CSS
- **Lazy routes** para reduzir bundle inicial e cumprir o requisito do edital

---

## ⚠️ Limitações / trade-offs 

- **BehaviorSubject/RxJS** não foi implementado por ser um projeto React e a necessidade de reatividade e centralização de estado foi atendida com React Query e Context (mais idiomático e simples de evoluir):
  - Estado global mínimo com Context (auth)
  - Estado de servidor com React Query (reativo por natureza, via subscriptions e cache)

---

## ⚠️ Observação

 *O projeto foi desenvolvido utilizando duas máquinas distintas e não se foi atentado ao usuario configurado em uma delas, que estava como **joaoritter** e não **joaoritter8**. Por esse motivo os commits: **e792634e79e4329d088a36f28f1c9d28f22be9e4**, **5e28a8ae6ea23b2094016d7e14da069ea97ff542**, **b241a955cde2f25f57ac640386f19d70c541456b**, **a8a665cfeb5b9132b38ba9305778e51dbba71eb1**, **e91f0c62191b919ccd2aeefbb85546c9b42bc274** e **e91f0c62191b919ccd2aeefbb85546c9b42bc274** constam com um autor diferente ao "proprietário" do repositório*