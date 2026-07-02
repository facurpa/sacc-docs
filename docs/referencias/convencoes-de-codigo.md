# Convenções de Código

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção

## Objetivo do documento

Documentar os padrões de código do SACC (Sistema de Alertas Contábeis) para que um contribuidor novo produza código consistente com o existente.

## Contexto de negócio

O SACC é mantido por um time pequeno e evolui por features bem delimitadas. As convenções abaixo existem para que qualquer feature nova nasça previsível — replicando uma estrutura conhecida — e para que o vocabulário do código espelhe o vocabulário da área contábil que o sistema atende ([ADR-007](../arquitetura/decisoes/adr-007-nomenclatura-portugues.md)).

## Backend

### Estrutura por feature ([vertical slice](../negocio/glossario.md#vertical-slice))

Decisão registrada no [ADR-004](../arquitetura/decisoes/adr-004-vertical-slice.md). Cada feature vive em `app/features/{nome}/`:

```
app/features/{feature}/
├── __init__.py
├── models.py       # SQLAlchemy models
├── schemas.py      # Pydantic v2 (Create, Update, Response, ListResponse)
├── repository.py   # Funções de acesso a dados (async)
├── service.py      # Lógica de negócio (só quando complexa)
└── router.py       # Endpoints FastAPI
```

**Feature "template":** `usuarios` — a mais completa; novas features replicam sua estrutura.

### Padrões de router

- Prefixo sempre `/api/{feature}` (kebab-case) — catálogo em [Endpoints](./endpoints.md).
- Endpoints admin-only usam `Depends(require_admin)`; autenticados, `Depends(get_current_user)`.
- Listagem paginada retorna `{items, total, page, page_size}`.
- Toggle de ativo: `PATCH /{id}/toggle-ativo` retornando o registro atualizado.
- IDs sempre UUID; status codes explícitos (`201` em POST, `204` em DELETE).

### Padrões de repository

- Funções assíncronas independentes (não classes): `get_by_id`, `listar_paginado`, `create`, `update`, `toggle_ativo`.
- **Não commitar dentro de funções internas** — o caller (router) faz o commit final, garantindo atomicidade.
- Auditoria via chamada explícita ao serviço de auditoria, na mesma transação da mutação ([ADR-003](../arquitetura/decisoes/adr-003-auditoria.md)).

### Logging

- [structlog](../negocio/glossario.md#structlog) com `merge_contextvars`; eventos em snake_case ([ADR-009](../arquitetura/decisoes/adr-009-eventos-structlog.md)).
- Campos técnicos: `duration_ms`, `error`, `error_type`, `path`, `method`, `status`.
- Redação automática de campos sensíveis ([ADR-013](../arquitetura/decisoes/adr-013-redacao-logs.md)).
- JSON em produção; console em desenvolvimento.

### Migrations

- Alembic; nome `{numero}_{descricao_snake_case}.py`; `upgrade()` e `downgrade()` obrigatórios.
- Colunas novas entram como NULL primeiro; backfill em migration separada quando necessário.
- Seed inline via `op.execute()` apenas em casos específicos (ex.: linha singleton de configurações).

### Testes

- pytest + pytest-asyncio; `tests/{feature}/` espelha `app/features/{feature}/`.
- Fixtures compartilhadas em `tests/conftest.py`.
- Routers testados com `httpx.AsyncClient` e override de dependencies; repositories com SQLite in-memory.

## Frontend

### Estrutura por feature

```
src/features/{feature}/
├── domain/
│   └── {Entidade}.ts              # tipos puros, sem React nem HTTP
├── application/
│   ├── dto.ts                     # Zod schemas + mapXxx (snake_case ↔ camelCase)
│   ├── use{Feature}List.ts        # hook TanStack Query
│   └── useCriar{Feature}.ts       # mutations
└── presentation/
    ├── {Feature}Page.tsx
    ├── {Feature}Table.tsx
    ├── {Feature}Filtros.tsx
    ├── Nova{Feature}Modal.tsx
    ├── Editar{Feature}Modal.tsx
    └── errorMessages.ts            # tradução de erros para mensagens amigáveis
```

Feature "template": `usuarios`.

### DTOs com Zod ([ADR-008](../arquitetura/decisoes/adr-008-dto-snake-camel.md))

```typescript
export const exemploDtoSchema = z.object({
  id: z.string(),
  campo_snake_case: z.string(),
});

export function mapExemplo(dto): Exemplo {
  return {
    id: dto.id,
    campoCamelCase: dto.campo_snake_case,
  };
}
```

**Regra:** o domínio usa `camelCase`, o backend usa `snake_case`; a tradução mora nos `map*` do `dto.ts`. Nunca vazar `snake_case` para o domínio. Nos hooks: `parseOrThrow(schema, data, 'feature')` seguido de `.map(mapXxx)`.

### Hooks

```typescript
export function useExemploList(params) {
  const http = useHttpClient();
  return useQuery({
    queryKey: ['exemplo', ...params],
    queryFn: async () => {
      const data = await http.get('/api/exemplo');
      const parsed = parseOrThrow(schema, data, 'exemplo');
      return { items: parsed.items.map(mapExemplo), total: parsed.total };
    },
    placeholderData: (prev) => prev,  // mantém dados anteriores durante refetch
  });
}
```

### Autenticação no frontend

- Token em `sessionStorage`.
- `AuthGuard` com `requireAdmin?: boolean`; rotas admin-only: `/usuarios`, `/auditoria`, `/configuracoes`, `/administracao`.
- Itens de menu escondidos para não-admin (defesa em profundidade — ver [Segurança](../operacao/seguranca.md)).

### Estilo e testes

- Tailwind + DaisyUI; badges semânticos (`badge-success`, `badge-error`, ...); ícones lucide-react.
- [Empty states](../negocio/glossario.md#empty-state) sempre com mensagem amigável — nunca "N/A" ou vazio silencioso.
- Vitest + Testing Library; MSW para mock de API; testes de página cobrem loading, error, empty e sucesso.

## Convenções gerais

### Commits

`feat|fix|refactor|test|chore|style({escopo}): descrição` — escopo é o nome da feature em kebab-case.

### Pull requests

- Screenshot antes/depois quando muda UI (**sempre com dados fictícios**).
- Confirmação de smoke test quando muda regra de negócio.
- Menção à issue/história relacionada; commits separados por responsabilidade.

### Nomenclatura ([ADR-007](../arquitetura/decisoes/adr-007-nomenclatura-portugues.md))

- **Português:** entidades, colunas, endpoints, UI — `plano_contas`, `natureza`, `atualizado_por`.
- **Inglês:** convenções técnicas (`repository`, `service`, `router`), padrões de frameworks (`useQuery`, `Depends`), operadores.

## Links relacionados

- [Endpoints](./endpoints.md) — a superfície resultante dos padrões de router.
- [Visão Geral da Arquitetura](../arquitetura/visao-geral.md) — a stack em que os padrões se aplicam.
- [ADR-004](../arquitetura/decisoes/adr-004-vertical-slice.md), [ADR-007](../arquitetura/decisoes/adr-007-nomenclatura-portugues.md), [ADR-008](../arquitetura/decisoes/adr-008-dto-snake-camel.md) — decisões por trás das convenções.

<!--
Checklist de revisão:
Segurança: chave do sessionStorage omitida; exemplos de código genéricos ("exemplo"), sem dados reais; nota sobre screenshots com dados fictícios adicionada por ser doc pública. OK.
Fonte da verdade: padrões de 05-convencoes-codigo.md; nada inventado. OK.
Editorial: siglas expandidas; decisões linkam ADRs; termos linkados; data presente. OK.
Negócio: abre conectando convenções à previsibilidade do time e ao vocabulário contábil. OK.
-->
