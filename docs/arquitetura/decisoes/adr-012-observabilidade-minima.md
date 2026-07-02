# ADR-012: Observabilidade com request_id e logs estruturados, sem stack dedicada

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

O SACC (Sistema de Alertas Contábeis) roda on-premise, com uma execução crítica por dia e poucos usuários. Uma stack completa de observabilidade (Loki, Grafana, Sentry) adicionaria serviços para operar sem retorno proporcional neste estágio.

## Decisão

Observabilidade mínima e suficiente: propagação de [`request_id`](../../negocio/glossario.md#request_id) via contextvars do structlog + logs estruturados em stdout, capturados pelo gerenciador de serviços do sistema operacional no servidor. Busca por grep resolve o volume atual. Nenhuma stack dedicada por enquanto.

**Planejado para depois:** tabela de eventos operacionais para erros não categorizados e uma tela administrativa de operação.

## Alternativas consideradas

- **Loki + Grafana on-premise** — descartado para o MVP: over-engineering no estágio atual (permanece como possibilidade futura registrada).
- **Sentry** — descartado pelo mesmo motivo.

## Consequências

- ✅ Zero serviços extras para operar; investigação viável com ferramentas básicas.
- ⚠️ Sem dashboards, alertas automáticos de erro ou retenção estruturada de logs — limite conhecido, a reavaliar com o crescimento do uso.
- 📎 Propagação do `request_id` ainda **planejada** (não implementada) — ver [Observabilidade](../../operacao/observabilidade.md).

<!--
Checklist: journalctl/systemd generalizado para "gerenciador de serviços do sistema operacional" (evita detalhar o servidor); sem dados sensíveis; baseado em 07-decisoes-arquiteturais.md; data não documentada na fonte. OK.
-->
