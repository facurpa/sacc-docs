# Observabilidade

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** logs estruturados implementados; propagação de request_id planejada, não implementada

## Objetivo do documento

Descrever como o SACC (Sistema de Alertas Contábeis) registra o que acontece e como a sustentação investiga incidentes.

## Contexto de negócio

Se o worker falhar silenciosamente, a área contábil volta ao cenário anterior ao SACC — viradas sem detecção — sem saber disso. A observabilidade existe para garantir que falhas sejam visíveis e investigáveis rapidamente: cada execução historiada, cada erro registrado com contexto e cada ação administrativa auditada.

## Estratégia

A decisão registrada em [ADR-012](../arquitetura/decisoes/adr-012-observabilidade-minima.md) é de observabilidade **mínima e suficiente** para o estágio do projeto: logs estruturados em stdout + identificadores de correlação + trilhas de auditoria no banco. Sem stack dedicada (Loki/Grafana/Sentry) por enquanto.

## Logs estruturados

- Biblioteca: [structlog](../negocio/glossario.md#structlog), com `merge_contextvars` no pipeline — contexto propaga automaticamente por chamadas assíncronas.
- Formato: JSON em produção, console legível em desenvolvimento.
- Eventos nomeados em snake_case com verbo no passado ([ADR-009](../arquitetura/decisoes/adr-009-eventos-structlog.md)): `worker_iniciado`, `email_enviado`, `worker_incidente`, `worker_reagendado`.
- Campos técnicos padronizados: `duration_ms`, `error`, `error_type`, `path`, `method`, `status`.
- Middleware HTTP loga cada request com duração.
- **Redação automática de campos sensíveis** (`password`, `senha`, `access_token`, `refresh_token`, `authorization`, `secret`) — ver [ADR-013](../arquitetura/decisoes/adr-013-redacao-logs.md).

## Identificadores de correlação

| Identificador | Escopo | Estado |
|---|---|---|
| [`request_id`](../negocio/glossario.md#request_id) | Uma request HTTP; devolvido no header `X-Request-Id` | ⏳ Propagação end-to-end **planejada**, não implementada |
| [`execution_id`](../negocio/glossario.md#execution_id) | Uma execução do worker (sem request HTTP) | Contrapartida do request_id para o agendador |

Quando implementado, o `request_id` permitirá filtrar todos os logs de uma única request através de todo o ciclo.

## Trilhas de auditoria no banco

Três tabelas complementares (detalhes no [Modelo de Dados](../arquitetura/modelo-de-dados.md) e no [ADR-003](../arquitetura/decisoes/adr-003-auditoria.md)):

| Tabela | Responde a |
|---|---|
| `logs_execucao` | "O que o worker fez, quando, com que resultado?" — status, contadores, snapshot das viradas, erro/stack, duração |
| `audit_log` | "Quem mudou o quê?" — ação, entidade, diff JSONB dos campos alterados, autor (ou "Sistema") |
| `auth_eventos` | "Quem entrou, quem falhou, quem foi bloqueado?" — eventos de segurança com IP e user agent |

## Roteiro de investigação de incidente

1. **Alerta não chegou?** Verificar `logs_execucao`: houve execução? Com que status? `alerta_enviado`?
2. **Execução com erro?** Ler `erro_tipo`, `erro_mensagem` e stack trace no próprio registro; cruzar com eventos `worker_*` nos logs do processo.
3. **Comportamento mudou?** Consultar `audit_log` por alterações recentes em templates, destinatários, períodos ou configurações.
4. **Suspeita de acesso indevido?** Consultar `auth_eventos` por falhas de login e lockouts.

## Limites conhecidos

- Health checks (`/health`, `/ready`) respondem "ok" **sem testar dependências** — dívida técnica registrada ([ADR-011](../arquitetura/decisoes/adr-011-kpis-frontend.md)).
- Sem alertas automáticos de erro de infraestrutura; o e-mail de incidente do worker cobre apenas falhas da própria execução.
- Retenção e busca de logs dependem das ferramentas do servidor (sem agregador dedicado).

## Links relacionados

- [Fluxo de Execução](./fluxo-de-execucao.md) — o que gera os registros descritos aqui.
- [Segurança](./seguranca.md) — eventos de autenticação e redação de sensíveis.
- [ADR-012](../arquitetura/decisoes/adr-012-observabilidade-minima.md) — a decisão de escopo.

<!--
Checklist de revisão:
Segurança: sem IPs/hosts/credenciais; sem detalhes do servidor; sem dados reais de log. OK.
Fonte da verdade: baseado em 05-convencoes (logging), 07 (ADRs de observabilidade/redação) e 03 (tabelas); request_id marcado como planejado conforme 06. OK.
Editorial: siglas expandidas; termos linkados; decisões linkam ADRs; data presente. OK.
Negócio: abre conectando observabilidade ao risco de falha silenciosa da detecção. OK.
-->
