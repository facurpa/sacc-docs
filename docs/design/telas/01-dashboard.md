# Tela — Dashboard

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção

## Objetivo do documento

Especificar o Dashboard, tela inicial após o login, cujo critério de aceite é: em menos de 3 segundos o usuário sabe se há contas viradas hoje.

## Acesso

Rota `/` (ou `/dashboard`). Papéis: `admin` e `usuario`. Dados: KPIs calculados no frontend a partir de `GET /api/logs` e `GET /api/plano-contas` (ver [Endpoints](../../referencias/endpoints.md)).

## Layout

```
[h1 Dashboard]                                  [caption: Última execução: 02/07/2026 07:00]

[KPI Contas Viradas*] [KPI Alertas Enviados] [KPI Próxima Execução] [KPI Integridade]

[card: Contas Viradas (tabela)]
[card: Execuções recentes (lista compacta)]
```

Grid de KPIs: `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4`.

### KPI cards (`KpiCard`)

| Card | Valor | Tom | Ícone | Observações |
| --- | --- | --- | --- | --- |
| **Contas Viradas** (herói) | qtd_contas_viradas da última execução | `urgente` se > 0; `sucesso` se 0 | `TriangleAlert` / `ShieldCheck` | Ver variantes abaixo |
| Alertas Enviados | total no período (hoje/últimos 7 dias) | `neutro` | `Mails` | descricao: "últimos 7 dias" |
| Próxima Execução | horário `HH:mm` + data se não for hoje | `neutro` | `Clock` | de configurações; se execução automática desligada: valor "Desativada" + tom `atencao` |
| Integridade | "OK" ou "Falha" (última execução com `erro`?) | `sucesso` / `urgente` | `Activity` | descricao: "última execução" |

**Card herói — Contas Viradas:**
- **> 0 (urgente):** `border-2 border-error bg-error/5`, valor `text-error text-4xl`, ícone `TriangleAlert` em `text-error`, descricao "detectadas na última execução". Único elemento vermelho de destaque da tela — nada compete com ele.
- **= 0 (tranquilo):** borda padrão, valor `text-success`, ícone `ShieldCheck` em `text-success`, descricao "Nenhuma conta virada detectada".

### Tabela "Contas Viradas"

`TabelaPaginada` densidade compacta, fonte: snapshot `contas_viradas` da última execução.

| Coluna | Conteúdo |
| --- | --- |
| Empresa | código/nome |
| Conta | código, `tabular-nums` |
| Descrição | truncada com tooltip |
| Natureza | `NaturezaVirada` (esperada → atual) |
| *(futuras)* Saldo, Severidade, Responsável | prever espaço; saldo `tabular-nums text-right`, severidade como badge |

Sem paginação se ≤ 20 itens (caso típico); acima disso, paginada.

### Execuções recentes

Lista das 5 últimas: `StatusBadge` + tipo (`badge-ghost`) + `DataHora` + duração + "X analisadas / Y viradas". Link "Ver todas" → `/execucoes`.

## Estados

| Estado | Especificação |
| --- | --- |
| Loading | 4 `SkeletonKpi` + `SkeletonTabela` (5 linhas) em cada card |
| Empty (nunca houve execução) | KPIs com valor "—" e tom neutro; tabela com `EmptyState` ícone `History`, título "Nenhuma execução registrada ainda", descrição "A primeira verificação aparecerá aqui." |
| Empty (0 viradas) | Card herói tranquilo; tabela com `EmptyState` ícone `ShieldCheck`, título "Nenhuma conta virada detectada", descrição "Todas as contas analisadas estão com a natureza esperada." |
| Error | `alert-error` no lugar dos cards afetados: "Não foi possível carregar os dados do dashboard." + Tentar novamente. KPIs que carregaram permanecem |
| Sucesso | Layout completo acima |

## Textos (PT-BR exatos)

- h1: "Dashboard" · KPIs: "Contas Viradas", "Alertas Enviados", "Próxima Execução", "Integridade".
- Card tabela: "Contas Viradas" · Card lista: "Execuções recentes" · Link: "Ver todas".

## Links relacionados

- [Design System](../design-system.md) · [Padrões Transversais](../padroes-transversais.md) · [Mockup](../mockups/dashboard.html)
- [Fluxo de Execução](../../operacao/fluxo-de-execucao.md) — origem dos dados exibidos.

<!-- Checklist de revisão: Segurança: dados fictícios. Fonte da verdade: KPIs do glossário, campos de modelo-de-dados.md. Editorial: PT-BR, data presente. Negócio: hierarquia do herói justificada. OK. -->
