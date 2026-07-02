# ADR-008: Traduzir snake_case ↔ camelCase nos DTOs do frontend

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

O backend do SACC (Sistema de Alertas Contábeis) segue a convenção Python/SQL (`snake_case`); o frontend segue a convenção TypeScript (`camelCase`). Sem uma fronteira explícita, as duas convenções vazam uma na outra e os contratos entre as camadas ficam frágeis.

## Decisão

Toda tradução mora nos DTOs (Data Transfer Objects) do frontend: cada feature tem um `dto.ts` com schemas Zod que validam a resposta do backend em `snake_case` e funções `mapXxx()` que convertem para o domínio em `camelCase`. **O domínio do frontend nunca vê `snake_case`.** A validação em runtime usa `parseOrThrow`.

## Alternativas consideradas

- **Usar snake_case no frontend ou camelCase no backend** — descartado: violaria a convenção nativa de uma das linguagens.
- **Conversão automática genérica (middleware)** — *Informação não documentada na Knowledge Source* como alternativa avaliada; a fonte registra apenas a decisão pelos mapeadores explícitos por feature.

## Consequências

- ✅ Contratos validados em runtime (Zod) — mudanças no backend quebram cedo e com mensagem clara.
- ✅ Cada convenção nativa preservada em seu ecossistema.
- ⚠️ Boilerplate: cada feature precisa manter schema + mapeador.
- 📎 Padrão detalhado em [Convenções de Código](../../referencias/convencoes-de-codigo.md).

<!--
Checklist: sem dados sensíveis; baseado em 07-decisoes-arquiteturais.md e 05-convencoes-codigo.md; alternativa não documentada sinalizada; data não documentada na fonte. OK.
-->
