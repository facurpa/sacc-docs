# Padrões Transversais de UI

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção
**Público:** desenvolvedores frontend e design

## Objetivo do documento

Definir os padrões visuais e de comportamento que se repetem em várias telas do SACC (Sistema de Alertas Contábeis): visualização de natureza D/C e virada, gating por papel, feedback de ações e formatação de data/hora.

## Contexto de negócio

A informação central do SACC — "esta conta deveria ser devedora e está credora" — aparece no dashboard, no detalhe de execuções e no e-mail de alerta. Um padrão visual único para essa comparação evita reinterpretação a cada tela e treina o olho do usuário para reconhecer a virada instantaneamente.

## Natureza D/C e virada — componente `NaturezaVirada`

Par de badges com seta, lido como "esperada → atual":

```
Esperada: [ D ]  →  Atual: [ C ]
```

- **Estrutura:** `<span class="inline-flex items-center gap-2">` com dois badges e o ícone `MoveRight` (16 px) entre eles.
- **Badge de natureza:** quadrado pequeno com a letra — `badge badge-sm font-semibold`; `D` = Devedora, `C` = Credora (tooltip com a palavra completa).
- **Variante virada (naturezas divergem):** badge "esperada" em `badge-ghost`, seta em `text-error`, badge "atual" em `badge-error`. É a única situação em que a seta e o segundo badge ficam vermelhos.
- **Variante normal (naturezas iguais):** ambos `badge-ghost`, seta em `text-base-content/40`. Usada no detalhe de execução quando o snapshot lista contas verificadas sem virada (se aplicável).
- **Versão para e-mail:** mesma leitura, em HTML de tabela com CSS inline (sem componente) — ver [Template de e-mail](./email/template-alerta.md).
- **Reuso:** Dashboard (tabela de viradas), Execuções (snapshot no detalhe), e-mail de alerta.

## Gating por papel (role)

Papéis: `admin` e `usuario` (ver [Segurança](../operacao/seguranca.md)).

- **Menu:** itens admin-only (Usuários, Auditoria, Configurações) **não são renderizados** para `usuario` — sem cadeado, sem item desabilitado. Recursos indisponíveis não são sinalizados; a navegação de cada papel parece completa em si.
- **Ações em telas mistas:** botões admin-only (ex.: "Executar verificação agora") não renderizam para `usuario`.
- **Rotas:** `AuthGuard` com `requireAdmin` continua protegendo a rota (defesa em profundidade); o gating visual é conveniência, não segurança.

## Feedback de ações

- **Sucesso:** toast `alert-success`, verbo no particípio + substantivo — "Destinatário criado com sucesso.", "Configurações salvas."
- **Erro:** toast `alert-error` com mensagem amigável. A tradução técnico → amigável mora em `errorMessages.ts` de cada feature; fallback genérico: "Algo deu errado. Tente novamente em instantes."
- **Ação assíncrona (trigger manual, HTTP 202):** toast `alert-info` — "Verificação iniciada. Acompanhe em Execuções." com link para a tela de Execuções.
- Toasts em `toast-end toast-bottom`, auto-dismiss 5 s, empilháveis (máx. 3).

## Data e hora

- Exibição **sempre em America/Sao_Paulo**, independentemente do fuso do navegador ([ADR-014](../arquitetura/decisoes/adr-014-timezone-utc.md)).
- Formato padrão: `dd/mm/aaaa HH:mm` (ex.: `02/07/2026 07:00`). Com segundos apenas no detalhe de execução: `dd/mm/aaaa HH:mm:ss`.
- Duração: `Xs` abaixo de 60 s, `Xmin Ys` acima (ex.: `1min 42s`), a partir de `duracao_ms`.
- Util compartilhado sugerido: `formatarDataHora(iso: string, comSegundos?: boolean)` e `formatarDuracao(ms: number)` em `src/lib/datas.ts` — nenhuma tela formata data manualmente.
- Timestamps relativos ("há 2 horas") são permitidos apenas como complemento, com tooltip mostrando o absoluto.

## Terminologia

UI 100% em português brasileiro ([ADR-007](../arquitetura/decisoes/adr-007-nomenclatura-portugues.md)): "Plano de Contas" (não "Chart of Accounts"), "Destinatários", "Execuções", "conta analítica/sintética", "natureza Devedora/Credora", "virada".

## Links relacionados

- [Design System](./design-system.md) — tokens e mapa status → badge.
- [Componentes reutilizáveis](./componentes.md) — props de `NaturezaVirada`, `Toast`, etc.
- [Segurança](../operacao/seguranca.md) — papéis e AuthGuard.

<!--
Checklist de revisão:
Segurança: sem dados reais; exemplos fictícios. OK.
Fonte da verdade: roles e timezone de seguranca.md e ADR-014; padrão de badges de convencoes-de-codigo.md. OK.
Editorial: PT-BR; termos linkados; data presente. OK.
Negócio: abre justificando o padrão único de virada. OK.
-->
