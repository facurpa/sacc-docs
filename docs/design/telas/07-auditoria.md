# Tela — Auditoria

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção

## Objetivo do documento

Especificar a tela de trilha de auditoria (admin-only), com apresentação legível do diff antes/depois armazenado em JSONB.

## Acesso

Rota `/auditoria` (admin-only). Dados: `GET /api/audit-log` (paginado, leitura).

## Layout

```
[h1 Auditoria]
[Filtros: entidade ▾ | ação ▾ (criou/atualizou/desativou/...) | usuário ▾ | período de/até]
[TabelaPaginada compacta com linha expansível]
```

| Coluna | Conteúdo |
| --- | --- |
| Quando | `DataHora` com segundos |
| Usuário | nome (ou "Sistema" para eventos do worker) |
| Ação | `badge-ghost` com verbo em português: Criou, Atualizou, Desativou, Reativou, Redefiniu senha, Executou |
| Entidade | tipo + identificação curta (ex.: "Destinatário · Fulano") |
| Detalhes | `btn-ghost btn-sm` `ChevronDown` expande a linha |

### Diff antes/depois (`DiffEvento`, linha expandida)

Nunca JSON cru. Lista **apenas dos campos alterados**, um por linha:

```
Campo           Antes                    Depois
E-mail          antigo@exemplo.com.br →  novo@exemplo.com.br
Situação        Ativo                 →  Inativo
```

- Grid de 3 colunas (`text-sm`); valor "Antes" em `text-base-content/60 line-through decoration-base-content/30`; seta `MoveRight` em `text-base-content/40`; "Depois" em texto normal `font-medium`.
- Valores booleanos/enums traduzidos (Ativo/Inativo, Admin/Usuário); campos sensíveis (hash de senha) exibidos como "•••" com nota "valor oculto".
- Criação: só coluna "Depois" ("Antes" = "—"); desativação idem invertido.

## Estados

| Estado | Especificação |
| --- | --- |
| Loading | `SkeletonTabela` |
| Empty | `EmptyState` ícone `ScrollText`, "Nenhum evento de auditoria registrado", com filtros: "Nenhum evento encontrado para os filtros selecionados." + "Limpar filtros" |
| Error | `alert-error` "Não foi possível carregar a auditoria." + Tentar novamente |
| Sucesso | Tabela com expansão |

## Links relacionados

- [Observabilidade](../../operacao/observabilidade.md) — o que é auditado.
- [ADR-003](../../arquitetura/decisoes/adr-003-auditoria.md) · [Mockup](../mockups/auditoria.html)

<!-- Checklist de revisão: Segurança: exemplos com exemplo.com.br; campos sensíveis mascarados na spec. Fonte da verdade: endpoints.md, ADR-003. Editorial: PT-BR. OK. -->
