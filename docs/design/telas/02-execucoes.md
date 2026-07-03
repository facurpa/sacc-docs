# Tela — Execuções (Logs)

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção
**Público:** desenvolvedores frontend e design

## Objetivo do documento

Especificar a tela de histórico de execuções do worker e o detalhe de cada execução.

## Acesso

Rota `/execucoes`. Papéis: `admin` e `usuario` (leitura). Dados: `GET /api/logs` (paginado), `GET /api/logs/{id}`. Botão "Executar verificação agora" (`POST /api/worker/trigger`, admin-only) vive em Configurações; aqui pode aparecer como atalho **apenas para admin**.

## Layout — lista

```
[h1 Execuções]                       [admin: btn-outline Play "Executar agora"]
[Filtros: status ▾ | tipo ▾ | período (de/até)]
[TabelaPaginada compacta]
[Exibindo 1–20 de N            «  1 2 3  »]
```

| Coluna | Conteúdo |
| --- | --- |
| Início | `DataHora` (`dd/mm/aaaa HH:mm`) |
| Status | `StatusBadge` (`executando`/`sucesso`/`sem_alertas`/`erro`) |
| Tipo | `badge-ghost` Agendada / Manual |
| Duração | `formatarDuracao(duracao_ms)`, `tabular-nums text-right`; "—" se executando |
| Analisadas | número, `tabular-nums text-right` |
| Viradas | número; **> 0 em `text-error font-semibold`**, 0 em texto normal |
| Alerta | ícone `Mails` com tooltip "Alerta enviado" se `alerta_enviado`; senão vazio |
| Ações | `btn-ghost btn-sm` "Detalhes" |

Linha com status `erro`: sem fundo vermelho na linha inteira (só o badge) — vermelho em excesso dessensibiliza.

## Layout — detalhe

Página `/execucoes/{id}` (preferível a drawer, para permitir link direto a partir do toast 202 e do e-mail).

1. **Cabeçalho:** h1 "Execução de 02/07/2026 07:00" + `StatusBadge` + badge tipo; caption com id e `iniciado_em`/`finalizado_em` com segundos.
2. **Resumo:** 4 mini-stats (Duração, Analisadas, Viradas, Alerta enviado Sim/Não).
3. **Snapshot de viradas:** tabela com Empresa, Conta, Descrição, `NaturezaVirada` — o mesmo padrão do dashboard.
4. **Bloco de erro (só status `erro`):** `alert alert-error` com `erro_tipo` e `erro_mensagem` amigável; abaixo, `collapse` "Detalhes técnicos (stack trace)" com `<pre class="text-xs overflow-x-auto">` — colapsado por padrão.

## Estados

| Estado | Especificação |
| --- | --- |
| Loading | `SkeletonTabela`; no detalhe, skeletons por seção |
| Empty | `EmptyState` ícone `History`, "Nenhuma execução registrada ainda", "As execuções agendadas e manuais aparecerão aqui." Com filtros ativos: "Nenhuma execução encontrada para os filtros selecionados." + botão "Limpar filtros" |
| Error | `alert-error` "Não foi possível carregar as execuções." + Tentar novamente |
| Sucesso | Lista/detalhe acima; status `executando` na lista com refetch automático (TanStack Query) a cada 10 s |

## Textos

- h1: "Execuções" · Filtros: "Status", "Tipo", "De", "Até" · Botão: "Executar agora".
- Toast do trigger (202): "Verificação iniciada. Acompanhe em Execuções." (link para a lista).

## Links relacionados

- [Fluxo de Execução](../../operacao/fluxo-de-execucao.md) · [Design System](../design-system.md) · [Mockup](../mockups/execucoes.html)

<!-- Checklist de revisão: Segurança: dados fictícios; stack trace apenas como conceito. Fonte da verdade: campos de modelo-de-dados.md, endpoints.md. Editorial: PT-BR, data presente. OK. -->
