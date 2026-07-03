# Endpoints da API REST

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** conforme o estado de features de 01/07/2026 do Knowledge Source
**Público:** desenvolvedores (frontend e backend)

## Objetivo do documento

Catalogar, em nível conceitual, os endpoints da API REST do SACC (Sistema de Alertas Contábeis), com seu estado de implementação e requisito de papel.

## Nesta página

Por feature: [`auth`](#auth-) · [`usuarios`](#usuarios--escrita-admin-only) · [`plano_contas`](#plano_contas--será-refeito-como-somente-leitura) · [`destinatarios`](#destinatarios-) · [`email_templates`](#email_templates-) · [`periodos`](#periodos-) · [`logs`](#logs--somente-leitura) · [`audit_log`](#audit_log--admin-only-somente-leitura) · [`balancete`](#balancete--dívida-técnica) · [`worker`](#worker-) · [`configuracoes`](#configuracoes--em-desenvolvimento) · [`sync_plano_contas`](#sync_plano_contas--bloqueado-por-dependência-externa)

## Contexto de negócio

A API existe para que administradores técnicos configurem a detecção de [saldos invertidos](../negocio/glossario.md#saldo-invertido-virada) — quem recebe alertas, com que template, sobre que período — e acompanhem execuções e auditoria. Os destinatários dos alertas não consomem a API; recebem apenas os e-mails.

Convenções gerais (detalhes em [Convenções de Código](./convencoes-de-codigo.md)): prefixo `/api/{feature}`, IDs UUID, listagens paginadas `{items, total, page, page_size}`, toggle de ativo via `PATCH /{id}/toggle-ativo`.

**Legenda de estado:** ✅ implementado · 🟡 em desenvolvimento · 🔴 bloqueado por dependência externa · ⏳ planejado.

## `auth` ✅

Autenticação local — comportamento em [Segurança](../operacao/seguranca.md).

| Endpoint | Descrição |
|---|---|
| `POST /api/auth/login` | Login com e-mail + senha |
| `POST /api/auth/refresh` | Rotação do refresh token |
| `POST /api/auth/logout` | Revogação do refresh token |
| `POST /api/auth/change-password` | Troca de senha |
| `GET /api/auth/me` | Dados do usuário autenticado |

## `usuarios` ✅ (escrita admin-only)

| Endpoint | Descrição |
|---|---|
| `POST /api/usuarios` | Criar usuário |
| `GET /api/usuarios` | Listar paginado com filtros |
| `GET /api/usuarios/{id}` | Detalhe |
| `PUT /api/usuarios/{id}` | Atualizar |
| `POST /api/usuarios/{id}/reset-password` | Reset com senha temporária |
| `DELETE /api/usuarios/{id}` | Soft-delete |

## `plano_contas` ✅ (será refeito como somente leitura)

O CRUD manual atual será substituído quando a sincronização com o ERP (Enterprise Resource Planning) entrar — ver [ADR-005](../arquitetura/decisoes/adr-005-plano-contas-fonte-unica.md).

| Endpoint | Descrição |
|---|---|
| `GET /api/plano-contas` | Listar paginado |
| `POST /api/plano-contas` | Criar *(será removido)* |
| `PUT /api/plano-contas/{id}` | Atualizar *(será removido)* |
| `DELETE /api/plano-contas/{id}` | Remover *(será removido)* |

## `destinatarios` ✅

CRUD completo (`GET`, `POST`, `PUT`, `DELETE`) + `PATCH /{id}/toggle-ativo`.

## `email_templates` ✅

`GET`, `GET /{id}`, `POST`, `PUT` + `PATCH /{id}/toggle-ativo`. Múltiplos templates ativos — ver [ADR-010](../arquitetura/decisoes/adr-010-templates-biblioteca.md).

## `periodos` ✅

Versionamento append-only da configuração de período (ver [Modelo de Dados](../arquitetura/modelo-de-dados.md)).

| Endpoint | Descrição |
|---|---|
| `GET /api/periodos` | Listar versões |
| `GET /api/periodos/ativo` | Versão mais recente |
| `POST /api/periodos` | Criar nova versão |

## `logs` ✅ (somente leitura)

| Endpoint | Descrição |
|---|---|
| `GET /api/logs` | Listar execuções paginado |
| `GET /api/logs/{id}` | Detalhe de uma execução |

## `audit_log` ✅ (admin-only, somente leitura)

| Endpoint | Descrição |
|---|---|
| `GET /api/audit-log` | Listar paginado com filtros |

## `balancete` ✅ (dívida técnica)

Leitura da view atual do ERP para teste visual. **Sem autenticação** — dívida técnica documentada, correção prevista.

| Endpoint | Descrição |
|---|---|
| `GET /api/balancete?empresa_codigo=&data_inicio=&data_fim=` | Consulta de movimento por período (datas em YYYYMMDD) |

## `worker` ✅

| Endpoint | Descrição |
|---|---|
| `POST /api/worker/trigger` | Dispara verificação manual (admin-only, responde `202 Accepted`) — ver [Fluxo de Execução](../operacao/fluxo-de-execucao.md) |

## Health checks ✅ (limitados)

`GET /health` e `GET /ready` respondem `{status: "ok"}` **sem testar dependências** — dívida técnica registrada ([ADR-011](../arquitetura/decisoes/adr-011-kpis-frontend.md)).

## `configuracoes` 🟡 (em desenvolvimento)

Tabela singleton — ver [ADR-006](../arquitetura/decisoes/adr-006-configuracoes-singleton.md).

| Endpoint planejado | Descrição |
|---|---|
| `GET /api/configuracoes` | Ler configuração vigente |
| `PUT /api/configuracoes` | Atualizar (com efeito em runtime) |

## `sync_plano_contas` 🔴 (bloqueado por dependência externa)

Sincronização do plano local com a view do ERP.

| Endpoint planejado | Descrição |
|---|---|
| `POST /api/sync/plano-contas` | Disparar sincronização |
| `GET /api/sync/plano-contas` | Histórico de sincronizações |
| `GET /api/sync/plano-contas/ultimo` | Última sincronização |

## Links relacionados

- [Convenções de Código](./convencoes-de-codigo.md) — padrões de router.
- [Segurança](../operacao/seguranca.md) — autenticação e papéis.
- [Fluxo de Execução](../operacao/fluxo-de-execucao.md) — o que o trigger do worker dispara.

<!--
Checklist de revisão:
Segurança: sem exemplos com dados reais; endpoint de balancete descrito sem detalhes exploráveis além do já conceitual; sem hosts/credenciais. OK.
Fonte da verdade: endpoints e estados exatamente conforme 06-estado-features.md; nada inventado (métodos não listados na fonte não foram adicionados). OK.
Editorial: legenda de estados; decisões linkam ADRs; termos linkados; data presente. OK.
Negócio: abre explicando para quem a API existe. OK.
-->
