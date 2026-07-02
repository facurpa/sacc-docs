# Tela — Plano de Contas

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção

## Objetivo do documento

Especificar a tela de consulta do plano de contas — **somente leitura**: a fonte da verdade é o TOTVS Protheus via sincronização (endpoint de sync ainda bloqueado; ver [Endpoints](../../referencias/endpoints.md)).

## Acesso

Rota `/plano-de-contas`. Papéis: `admin` e `usuario`. Dados: `GET /api/plano-contas` (paginado). **Nenhuma ação de criação/edição/exclusão na UI**, mesmo que a API ainda exponha CRUD (será removido).

## Layout

```
[h1 Plano de Contas]        [IndicadorSincronizacao: RefreshCw "Última sincronização: 02/07/2026 06:30"]
[Filtros: busca conta/descrição | natureza ▾ D/C | classe ▾ Analítica/Sintética | ativo ▾]
[TabelaPaginada compacta]
```

| Coluna | Conteúdo |
| --- | --- |
| Conta | código, `tabular-nums`; hierarquia opcional: contas sintéticas em `font-medium`, analíticas indentadas (`pl-6`) sob o grupo |
| Descrição | texto |
| Natureza | badge `badge-sm badge-ghost` "D" ou "C", tooltip "Devedora"/"Credora" (aqui não há comparação — `NaturezaVirada` não se aplica) |
| Classe | `badge-ghost` Analítica / Sintética |
| Ativo | `badge-success badge-outline` Ativo / `badge-ghost` Inativo |

**Indicador de sincronização:** caption com ícone `RefreshCw`. Enquanto o sync com o ERP não existir: `badge-info` + texto "Sincronização com o ERP em desenvolvimento — dados carregados manualmente." (estado transitório, remover quando o sync entrar).

**Hierarquia (opcional, fase 2):** toggle "Agrupar por conta sintética" acima da tabela; agrupamento por prefixo do código, grupos colapsáveis (`ChevronRight`/`ChevronDown`).

## Estados

| Estado | Especificação |
| --- | --- |
| Loading | `SkeletonTabela` |
| Empty | `EmptyState` ícone `BookOpenText`, "Nenhuma conta cadastrada", "As contas aparecerão aqui após a sincronização com o ERP." Com filtros: "Nenhuma conta encontrada para os filtros selecionados." + "Limpar filtros" |
| Error | `alert-error` "Não foi possível carregar o plano de contas." + Tentar novamente |
| Sucesso | Tabela acima |

## Textos

h1: "Plano de Contas" · Filtros: "Buscar por conta ou descrição", "Natureza", "Classe", "Situação".

## Links relacionados

- [Integrações](../../arquitetura/integracoes.md) — sincronização com o ERP.
- [Design System](../design-system.md) · [Mockup](../mockups/plano-de-contas.html)

<!-- Checklist de revisão: Segurança: sem códigos contábeis reais. Fonte da verdade: endpoints.md (CRUD a remover, sync bloqueado). Editorial: PT-BR ("Plano de Contas"). Negócio: somente leitura reforçado. OK. -->
