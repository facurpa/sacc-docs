# Componentes Reutilizáveis

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção

## Objetivo do documento

Catalogar os componentes de UI reutilizáveis do SACC (Sistema de Alertas Contábeis) com props sugeridas, alinhados ao padrão vertical slice do frontend ([Convenções de Código](../referencias/convencoes-de-codigo.md)).

## Contexto de negócio

O frontend é organizado por feature (`src/features/{feature}/presentation/`). Componentes usados por mais de uma feature vivem em `src/components/` (compartilhados); componentes de uma feature só vivem na `presentation/` dela. Este catálogo evita que cada feature reinvente tabela, badge ou empty state.

## Compartilhados (`src/components/`)

### `KpiCard`

```typescript
interface KpiCardProps {
  titulo: string;                       // h4 uppercase
  valor: string | number;               // text-3xl font-bold tabular-nums
  icone: LucideIcon;
  tom?: 'neutro' | 'sucesso' | 'urgente' | 'atencao';  // urgente = borda/fundo error (só viradas > 0)
  descricao?: string;                   // caption abaixo do valor
  carregando?: boolean;                 // renderiza skeleton
  href?: string;                        // card clicável (ex.: viradas → dashboard/execuções)
}
```

### `StatusBadge`

```typescript
interface StatusBadgeProps {
  status: 'executando' | 'sucesso' | 'sem_alertas' | 'erro';
}
// Renderiza o mapa status → badge do design system, com rótulo em português.
```

### `NaturezaVirada`

```typescript
interface NaturezaViradaProps {
  esperada: 'D' | 'C';
  atual: 'D' | 'C';
  // virada é derivada: esperada !== atual → variante error
}
```

Padrão visual em [Padrões Transversais](./padroes-transversais.md#natureza-dc-e-virada--componente-naturezavirada).

### `TabelaPaginada`

```typescript
interface TabelaPaginadaProps<T> {
  colunas: Array<{ chave: string; titulo: string; numerica?: boolean; render?: (item: T) => ReactNode }>;
  itens: T[];
  total: number;
  pagina: number;
  tamanhoPagina: number;
  onPaginaChange: (p: number) => void;
  densidade?: 'compacta' | 'confortavel';   // table-sm | table
  carregando?: boolean;                     // skeleton de 5 linhas
  erro?: string | null;                     // alert-error + onTentarNovamente
  onTentarNovamente?: () => void;
  vazio?: { icone: LucideIcon; titulo: string; descricao?: string };  // EmptyState
}
```

Encapsula os 4 estados — a página só fornece dados e textos. `numerica: true` aplica `tabular-nums text-right`.

### `EmptyState`

```typescript
interface EmptyStateProps {
  icone: LucideIcon;        // 48px, text-base-content/30
  titulo: string;           // ex.: "Nenhuma conta virada detectada"
  descricao?: string;
  acao?: { rotulo: string; onClick: () => void };  // ex.: "Novo destinatário"
}
```

### `ConfirmarAcaoModal`

```typescript
interface ConfirmarAcaoModalProps {
  aberto: boolean;
  titulo: string;             // "Desativar destinatário?"
  consequencia: string;       // uma frase sobre o efeito
  rotuloConfirmar: string;    // "Desativar"
  destrutiva?: boolean;       // true → btn-error + TriangleAlert
  carregando?: boolean;
  onConfirmar: () => void;
  onCancelar: () => void;
}
```

### `Toast` / `useToast`

```typescript
type ToastTipo = 'sucesso' | 'erro' | 'info';
useToast(): { mostrar: (tipo: ToastTipo, mensagem: string, link?: { rotulo: string; href: string }) => void }
```

Provider único no app shell; empilha até 3; auto-dismiss 5 s.

### `SkeletonTabela`, `SkeletonKpi`

Sem props além de `linhas?: number` — usados internamente por `TabelaPaginada`/`KpiCard`, exportados para casos manuais.

### `DataHora`

```typescript
interface DataHoraProps { iso: string; comSegundos?: boolean; relativa?: boolean }
// Sempre America/Sao_Paulo, dd/mm/aaaa HH:mm; relativa=true mostra "há X" com tooltip do absoluto.
```

## Por feature (`src/features/{feature}/presentation/`)

Seguem o vocabulário já convencionado — `{Feature}Page`, `{Feature}Table`, `{Feature}Filtros`, `Nova{Feature}Modal`, `Editar{Feature}Modal`, `errorMessages.ts` — compondo os compartilhados acima. Exemplos específicos:

| Feature | Componentes próprios além do padrão |
| --- | --- |
| `dashboard` | `CardContasViradas` (herói, compõe `KpiCard` tom urgente/sucesso), `TabelaViradas`, `ExecucoesRecentes` |
| `logs` | `ExecucaoDetalhe` (drawer/página), `BlocoErro` (mensagem + stack colapsável), `SnapshotViradas` |
| `plano-contas` | `IndicadorSincronizacao`, `LinhaContaHierarquica` (indentação opcional) |
| `templates-email` | `EditorTemplate` (TipTap + toolbar), `PreviewEmail`, `BadgeTemplateEmUso` |
| `usuarios` | `ResetSenhaModal`, `BadgeLockout` |
| `auditoria` | `DiffEvento` (antes/depois legível) |
| `configuracoes` | `CampoHorarioCron`, `BotaoExecutarAgora` |

## Links relacionados

- [Design System](./design-system.md) — tokens e variantes visuais dos componentes.
- [Padrões Transversais](./padroes-transversais.md) — comportamento de toasts, datas, natureza D/C.
- [Convenções de Código](../referencias/convencoes-de-codigo.md) — estrutura vertical slice.

<!--
Checklist de revisão:
Segurança: sem dados reais; interfaces genéricas. OK.
Fonte da verdade: vocabulário Page/Table/Filtros/Modais de convencoes-de-codigo.md; features de endpoints.md. OK.
Editorial: props em português conforme ADR-007 (domínio) mantendo termos técnicos em inglês. OK.
Negócio: abre explicando onde componentes compartilhados vivem e por quê. OK.
-->
