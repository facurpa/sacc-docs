# ADR-009: Nomear eventos de log em snake_case com verbo no passado

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

O SACC (Sistema de Alertas Contábeis) usa [structlog](../../negocio/glossario.md#structlog) para logs estruturados. Para que a sustentação consiga investigar incidentes com busca simples (grep) ou, futuramente, agregação em ferramentas de log, os nomes de eventos precisam ser previsíveis e pesquisáveis.

## Decisão

Chaves de evento em `snake_case`, com verbo no passado ou substantivo descritivo: `worker_iniciado`, `email_enviado`, `worker_incidente`, `incidente_alerta_email_suprimido`, `worker_reagendado`.

## Alternativas consideradas

- **Mensagens de texto livre** — descartado: não são pesquisáveis nem agregáveis de forma confiável.

## Consequências

- ✅ Eventos "grepáveis" e agrupáveis; o verbo no passado deixa claro que o fato ocorreu.
- ✅ Compatível com futuras ferramentas de agregação de logs, sem retrabalho de nomenclatura.
- 📎 Pipeline de logging descrito em [Observabilidade](../../operacao/observabilidade.md).

<!--
Checklist: sem dados sensíveis; baseado em 07-decisoes-arquiteturais.md; data não documentada na fonte. OK.
-->
