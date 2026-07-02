# ADR-002: Remover o Redis

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

Com a autenticação local ([ADR-001](./adr-001-auth-local.md)), o SACC (Sistema de Alertas Contábeis) precisava armazenar refresh tokens e aplicar rate limiting. A arquitetura original previa Redis para ambos — mais um container para orquestrar em um ambiente on-premise simples, para um volume de dados baixo (poucos usuários).

## Decisão

Remover o Redis. Refresh tokens ficam no PostgreSQL, na tabela `refresh_tokens` (armazenando apenas o hash do token, com rotação). Rate limiting fica in-memory, via slowapi.

## Alternativas consideradas

- **Manter Redis** — descartado: custo operacional de mais um serviço não se paga com o volume atual; o PostgreSQL atende bem.

## Consequências

- ✅ Infraestrutura mais simples: um serviço a menos para operar, monitorar e fazer backup.
- ✅ Refresh tokens ganham a durabilidade e a auditabilidade do banco relacional.
- ⚠️ Rate limit não persiste entre restarts do processo — trade-off aceito para o volume atual.
- 📎 Tabela `refresh_tokens` descrita no [Modelo de Dados](../modelo-de-dados.md).

<!--
Checklist: sem dados sensíveis; baseado em 07-decisoes-arquiteturais.md e 02-stack; data da decisão não documentada na fonte. OK.
-->
