# ADR-010: Tratar templates de e-mail como biblioteca com múltiplos ativos

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

O alerta por e-mail é o produto final do SACC (Sistema de Alertas Contábeis), e a administração precisa poder evoluir o conteúdo sem deploy. Surgiu a questão: um template único vigente, tipos de template (crítico vs. normal) ou uma biblioteca?

## Decisão

Tratar `email_templates` como **biblioteca**: múltiplos templates podem estar `ativo = true` simultaneamente. O worker usa o template ativo **mais recentemente atualizado**.

## Alternativas consideradas

- **Tipos de template ("crítico" vs. "normal")** — descartado: complicava sem valor claro.
- **Template único vigente** — implícito na fonte como o modelo mais restritivo, preterido pela flexibilidade de manter rascunhos e versões.

## Consequências

- ✅ Administração mantém versões e rascunhos; abre caminho para testes A/B no futuro.
- ⚠️ A regra "mais recentemente atualizado vence" precisa ser conhecida pela administração — editar um template antigo o torna o vigente.
- 📎 Estrutura da tabela no [Modelo de Dados](../modelo-de-dados.md); seleção do template em [Fluxo de Execução](../../operacao/fluxo-de-execucao.md).

<!--
Checklist: sem dados sensíveis; baseado em 07-decisoes-arquiteturais.md e 03-modelo-dados.md; data não documentada na fonte. OK.
-->
