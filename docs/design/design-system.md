# Design System — SACC

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção
**Status da identidade visual:** ⚠️ **proposta a validar** — não houve acesso à identidade aprovada da tela de Login; a paleta e a tipografia abaixo são uma proposta e devem ser conferidas contra a identidade existente antes da adoção definitiva.
**Público:** desenvolvedores frontend e design

## Objetivo do documento

Definir a fundação visual do SACC (Sistema de Alertas Contábeis) — tokens de cor, tipografia, espaçamento e componentes-base — de forma que qualquer tela seja implementável apenas com Tailwind CSS + DaisyUI, sem decisões visuais em aberto.

## Contexto de negócio

O SACC é uma ferramenta interna de alerta financeiro usada por 2–5 administradores técnicos. A credibilidade visual importa: o estado mais crítico do produto — a **virada** (saldo invertido) — precisa ser inconfundível. Por isso a regra central deste design system é semântica: **vermelho é reservado a viradas e falhas de execução**; nenhuma cor de alerta é usada decorativamente.

## Princípios

1. **Sobriedade corporativa.** Azul-petróleo como cor de marca, neutros frios, sem gradientes ou elementos lúdicos.
2. **Semântica estrita de cor.** Vermelho = virada / falha. Amarelo = atenção real (execução em andamento há tempo demais, configuração pendente). Verde = sucesso confirmado. Azul-info = informativo/`sem_alertas`. Cinza (`ghost`) = neutro/inativo.
3. **Dados primeiro.** Produto table-heavy: números tabulares, densidade compacta por padrão, hierarquia tipográfica discreta.
4. **Estados sempre desenhados.** Toda tela especifica loading, empty, error e sucesso. Empty states com mensagem amigável em português — nunca "N/A" nem tela vazia silenciosa.

## Paleta de cores (tokens DaisyUI)

Dois temas: **`sacc`** (claro — área de conteúdo) e **`saccdark`** (escuro — sidebar e telas de autenticação). A sidebar usa o tema escuro via `data-theme="saccdark"` no `<aside>`.

### Objeto de tema pronto para `tailwind.config`

```js
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        sacc: {
          'primary': '#155E75',          // azul-petróleo — ações primárias, links, foco
          'primary-content': '#FFFFFF',
          'secondary': '#475569',        // slate — ações secundárias, texto de apoio
          'secondary-content': '#FFFFFF',
          'accent': '#0D9488',           // teal discreto — uso raro (destaques não semânticos)
          'accent-content': '#FFFFFF',
          'neutral': '#1E293B',          // slate escuro — texto forte, botões neutros
          'neutral-content': '#F1F5F9',
          'base-100': '#FFFFFF',         // superfícies: cards, tabelas, modais
          'base-200': '#F1F5F9',         // fundo da área de conteúdo
          'base-300': '#E2E8F0',         // bordas, divisores, linhas de tabela
          'base-content': '#0F172A',     // texto padrão
          'info': '#0369A1',             // sem_alertas, avisos informativos
          'info-content': '#FFFFFF',
          'success': '#15803D',          // execução com sucesso, ativo, "0 viradas"
          'success-content': '#FFFFFF',
          'warning': '#B45309',          // executando (longo), atenção real
          'warning-content': '#FFFFFF',
          'error': '#B91C1C',            // VIRADAS e falhas de execução — exclusivo
          'error-content': '#FFFFFF',
        },
      },
      {
        saccdark: {
          'primary': '#38BDF8',          // item ativo da sidebar, foco
          'primary-content': '#082F49',
          'secondary': '#94A3B8',
          'secondary-content': '#0F172A',
          'accent': '#2DD4BF',
          'accent-content': '#042F2E',
          'neutral': '#334155',
          'neutral-content': '#E2E8F0',
          'base-100': '#0F172A',         // fundo da sidebar / login
          'base-200': '#1E293B',         // hover de item de menu
          'base-300': '#334155',         // divisores
          'base-content': '#CBD5E1',     // texto da sidebar
          'info': '#38BDF8',
          'info-content': '#082F49',
          'success': '#4ADE80',
          'success-content': '#052E16',
          'warning': '#FBBF24',
          'warning-content': '#451A03',
          'error': '#F87171',
          'error-content': '#450A0A',
        },
      },
    ],
  },
};
```

### Justificativa semântica

| Token | Uso permitido | Uso proibido |
| --- | --- | --- |
| `error` | Card herói com viradas > 0, badge de virada, status `erro`, contas com natureza invertida, ações destrutivas | Decoração, ênfase genérica, ícones ilustrativos |
| `warning` | Status `executando` acima do tempo esperado, configuração pendente, lockout de conta | Destaques visuais, "novidades" |
| `success` | Status `sucesso`, toggle ativo, card herói com 0 viradas | Botões primários (usar `primary`) |
| `info` | Status `sem_alertas`, banners informativos (ex.: "sincronização indisponível") | Links (usar `primary`) |
| `ghost`/`neutral` | Inativo, tipo `agendada`/`manual`, valores neutros | — |
| `primary` | Botão primário, links, item ativo do menu, foco | Comunicar estado de execução |

Contraste: todos os pares `cor`/`cor-content` acima atendem WCAG AA (≥ 4.5:1) para texto normal.

### Mapa status → badge (convenção obrigatória)

| Valor | Badge | Rótulo exibido |
| --- | --- | --- |
| `executando` | `badge-warning` | Executando |
| `sucesso` | `badge-success` | Sucesso |
| `sem_alertas` | `badge-info` | Sem alertas |
| `erro` | `badge-error` | Erro |
| `agendada` / `manual` (tipo) | `badge-ghost` | Agendada / Manual |
| ativo = true | `badge-success badge-outline` | Ativo |
| ativo = false | `badge-ghost` | Inativo |
| role `admin` / `usuario` | `badge-neutral` / `badge-ghost` | Admin / Usuário |

## Tipografia

- **Família:** [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts), pesos 400, 500, 600, 700. Fallback `system-ui`. Inter tem números tabulares de qualidade — essencial para colunas contábeis.
- **Números tabulares:** toda célula numérica/monetária/código de conta usa a utility `tabular-nums` do Tailwind (classe em `<td>` ou na coluna). Códigos de conta podem adicionalmente usar `font-mono` se a leitura caractere a caractere for necessária — decisão: **usar Inter + `tabular-nums`**, sem mono, para manter sobriedade.

| Papel | Classes Tailwind | Uso |
| --- | --- | --- |
| h1 | `text-2xl font-semibold` | Título da página (um por tela) |
| h2 | `text-lg font-semibold` | Título de seção/card |
| h3 | `text-base font-medium` | Subtítulo, título de modal |
| h4 | `text-sm font-medium uppercase tracking-wide text-base-content/60` | Rótulo de KPI, cabeçalho de grupo |
| body | `text-sm` | Texto padrão, células de tabela |
| caption | `text-xs text-base-content/60` | Metadados, timestamps, ajuda |
| KPI valor | `text-3xl font-bold tabular-nums` | Número grande dos cards |

## Espaçamento, grid e densidade

- **Escala:** só a escala padrão do Tailwind; passos preferidos `1, 2, 3, 4, 6, 8` (4–32 px).
- **App shell:** sidebar fixa `w-64` (tema `saccdark`); topbar `h-16` com `border-b border-base-300`; conteúdo com `p-6` e `max-w-screen-xl mx-auto`.
- **Cards:** `card bg-base-100 border border-base-300 shadow-sm` (sombra discreta, nunca `shadow-lg` decorativo). Espaço entre seções `space-y-6`.
- **Tabelas — densidade:**
  - **Compacta (padrão):** `table table-sm` — telas de dados (Execuções, Plano de Contas, Auditoria).
  - **Confortável:** `table` — CRUDs curtos (Destinatários, Usuários, Templates).
  - Linhas com `hover:bg-base-200`; cabeçalho `text-xs uppercase text-base-content/60`.
- **Responsividade básica:** grid de KPIs `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`; tabelas envolvidas em `overflow-x-auto`; sidebar colapsa em drawer (`lg:drawer-open`) abaixo de `lg`.

## Componentes-base

Especificação de uso; props e contratos em [Componentes](./componentes.md).

### Botões

| Variante | Classes | Uso |
| --- | --- | --- |
| Primário | `btn btn-primary` | Ação principal da tela/modal (1 por contexto) |
| Secundário | `btn btn-outline` | Ação alternativa (Cancelar, Exportar) |
| Destrutivo | `btn btn-error` | Confirmar desativação/exclusão — **apenas dentro do modal de confirmação** |
| Ghost | `btn btn-ghost btn-sm` | Ações de linha de tabela (Editar, Detalhes) |

Loading: `<span class="loading loading-spinner loading-sm">` dentro do botão + `disabled`.

### Inputs e selects

- `input input-bordered w-full` / `select select-bordered w-full`, sempre dentro de `form-control` com `label` (`label-text`).
- Erro de validação: `input-error` + `label-text-alt text-error` com a mensagem.
- Filtros de tabela: linha horizontal `flex flex-wrap gap-3` acima da tabela, com `input-sm`/`select-sm`; busca com ícone `Search` (lucide).

### Modais (padrão Nova/Editar)

- `dialog` + `modal` DaisyUI; `modal-box max-w-lg`.
- Estrutura: h3 título → formulário → `modal-action` com Cancelar (`btn btn-outline`) e Salvar (`btn btn-primary`).
- Fechamento por Esc e clique no backdrop **apenas quando o formulário está limpo**; caso contrário, manter aberto.

### Confirmação de ação destrutiva

Modal próprio (`ConfirmarAcaoModal`): ícone `TriangleAlert` em `text-error`, título ("Desativar destinatário?"), consequência em uma frase, botões Cancelar (`btn-outline`) e confirmar (`btn-error`). Nunca desativar/excluir com um clique só.

### Tabela paginada com filtros

Composição padrão: filtros → `overflow-x-auto` + `table table-sm` → rodapé com "Exibindo X–Y de Z" (esquerda) e `join` de paginação (direita). Ordenação, quando houver, por clique no cabeçalho com ícone `ArrowUpDown`.

### Toasts

`toast toast-end toast-bottom` com `alert alert-success` ou `alert alert-error`; auto-dismiss em 5 s; sempre em português (ex.: "Destinatário criado com sucesso.", "Não foi possível salvar. Tente novamente."). Erros técnicos nunca são exibidos crus — tradução via `errorMessages.ts` da feature.

### Tooltips

`tooltip` DaisyUI (`data-tip`), apenas para esclarecer ícones sem rótulo e timestamps relativos (tooltip mostra o absoluto `dd/mm/aaaa HH:mm`).

### Skeleton loaders

- KPI: `skeleton h-24 w-full`.
- Tabela: 5 linhas de `skeleton h-4 w-full` dentro da estrutura da tabela (cabeçalho real visível).
- Nunca spinner de página inteira; spinner só em botões.

## Estados globais (padrão para todas as telas)

| Estado | Padrão |
| --- | --- |
| **Loading** | Skeletons no lugar do conteúdo, layout estável (sem saltos) |
| **Empty** | Ícone lucide em `text-base-content/30` (48 px), mensagem amigável em h3, frase de apoio em caption. Ex.: "Nenhuma conta virada detectada" |
| **Error** | `alert alert-error` com ícone `CircleAlert`, mensagem amigável traduzida e botão "Tentar novamente" (`btn btn-sm btn-outline`) |
| **Sucesso** | Conteúdo + toasts para mutações |

## Acessibilidade

Metas de referência: **WCAG 2.1 nível AA**. Regras que valem para todas as telas:

- **Nunca depender só de cor.** O estado crítico (virada/erro) sempre combina **cor + ícone + texto** — nunca vermelho isolado. Ex.: card herói do dashboard usa `TriangleAlert` + rótulo, não apenas a borda vermelha.
- **Contraste:** texto e ícones informativos devem atingir contraste AA (≥ 4,5:1 para texto normal; ≥ 3:1 para texto grande e ícones essenciais) contra o fundo, nos temas claro e escuro. Conferir ao ajustar a paleta proposta.
- **Foco visível:** todo elemento interativo mantém indicador de foco (não remover `outline` sem substituto). Ordem de tabulação segue a ordem visual.
- **Teclado:** toda ação possível com mouse deve ser possível com teclado (abrir/fechar modais, alternar toggles, acionar "Tentar novamente").
- **Alvos de toque/clique:** mínimo ~44×44 px para botões e ícones acionáveis.
- **Semântica e leitores de tela:** usar elementos nativos (`button`, `table`, `label`); ícones decorativos com `aria-hidden`; ícones que carregam significado com `aria-label`. Toasts em região `aria-live` para anunciar o resultado de mutações.
- **Imagens/ícones informativos:** fornecer texto alternativo equivalente.

> [!NOTE]
> Estas metas ainda não foram auditadas formalmente. Tratar como critério de aceite de UI e validar com ferramenta de contraste ao fechar a identidade visual.

## Ícones (lucide-react)

Tamanho padrão 16 px em linha/botão, 20 px na sidebar, 48 px em empty states. Mapa canônico:

| Conceito | Ícone |
| --- | --- |
| Dashboard | `LayoutDashboard` |
| Execuções | `History` |
| Plano de Contas | `BookOpenText` |
| Destinatários | `Mails` |
| Templates | `FileText` |
| Usuários | `Users` |
| Auditoria | `ScrollText` |
| Configurações | `Settings` |
| Virada / erro | `TriangleAlert` |
| Tudo certo | `ShieldCheck` |
| Execução manual | `Play` |
| Sincronização | `RefreshCw` |

## Links relacionados

- [Componentes reutilizáveis](./componentes.md) — props e localização no código.
- [Padrões transversais](./padroes-transversais.md) — natureza D/C, roles, datas, toasts.
- [Especificações de telas](./telas/01-dashboard.md) — aplicação do sistema tela a tela.
- [Convenções de Código](../referencias/convencoes-de-codigo.md) — estrutura vertical slice em que os componentes vivem.

<!--
Checklist de revisão:
Segurança: sem dados reais, sem screenshots, exemplos genéricos. OK.
Fonte da verdade: stack e convenções de visao-geral.md e convencoes-de-codigo.md; paleta é proposta nova, sinalizada como a validar. OK.
Editorial: siglas expandidas na 1ª ocorrência; PT-BR; data presente. OK.
Negócio: abre conectando a semântica de cor ao estado crítico do produto (virada). OK.
-->
