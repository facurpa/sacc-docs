# ADR-013: Redigir automaticamente campos sensíveis nos logs

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

Logs estruturados registram payloads e contexto de requests. Sem proteção sistemática, uma senha ou um token pode acabar em log por descuido — e logs costumam ter controle de acesso mais frouxo que o banco de dados.

## Decisão

Incluir no pipeline do structlog um processor que **redige automaticamente** o valor de qualquer chave cujo nome contenha `password`, `senha`, `access_token`, `refresh_token`, `authorization` ou `secret`.

## Alternativas consideradas

- **Confiar na sanitização manual em cada ponto de log** — descartado: depende de todos os desenvolvedores lembrarem sempre; uma falha basta para vazar.

## Consequências

- ✅ Defesa em profundidade: o vazamento acidental é bloqueado na infraestrutura de logging, não na disciplina individual.
- ⚠️ Baseado no nome da chave — um dado sensível sob chave com nome atípico não seria redigido.
- 📎 Pipeline de logging em [Observabilidade](../../operacao/observabilidade.md); política geral em [Segurança](../../operacao/seguranca.md).

<!--
Checklist: sem dados sensíveis; baseado em 07-decisoes-arquiteturais.md e 05-convencoes-codigo.md; data não documentada na fonte. OK.
-->
