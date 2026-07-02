# ADR-007: Nomear o domínio em português

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

O domínio do SACC (Sistema de Alertas Contábeis) é a contabilidade empresarial brasileira. Os conceitos — conta, natureza, plano de contas, destinatários — têm vocabulário consagrado em português, usado pelos stakeholders contábeis que validam as regras.

## Decisão

Usar **português** em nomes de entidades, colunas de banco, endpoints e interface (`plano_contas`, `natureza`, `atualizado_por`). Manter **inglês** para convenções técnicas (`repository`, `service`, `router`), padrões de frameworks (`useQuery`, `Depends`) e operadores.

## Alternativas consideradas

- **Tudo em inglês** — descartado: traduzir "natureza devedora" para o código e de volta para a especialista contábil cria atrito e ambiguidade exatamente onde a precisão importa.

## Consequências

- ✅ Código fala a língua do domínio; conversas com a área contábil não exigem tradução mental.
- ⚠️ Dificulta a contratação de desenvolvedores não-lusófonos — aceitável no contexto interno da organização.
- 📎 Regras completas de nomenclatura em [Convenções de Código](../../referencias/convencoes-de-codigo.md).

<!--
Checklist: nomes reais de stakeholders substituídos por papéis; baseado em 07-decisoes-arquiteturais.md; data não documentada na fonte. OK.
-->
