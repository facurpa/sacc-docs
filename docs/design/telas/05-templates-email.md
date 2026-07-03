# Tela — Templates de E-mail

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção
**Público:** desenvolvedores frontend e design

## Objetivo do documento

Especificar a biblioteca de templates de e-mail de alerta e o editor rich-text (TipTap).

## Acesso

Rota `/templates`. Escrita: `admin`. Dados: `GET/POST/PUT /api/email-templates`, `PATCH /{id}/toggle-ativo`. Regra ([ADR-010](../../arquitetura/decisoes/adr-010-templates-biblioteca.md)): múltiplos templates podem estar ativos; **o worker usa o ativo atualizado mais recentemente**.

## Layout — biblioteca

```
[h1 Templates de E-mail]                 [btn-primary Plus "Novo template"]
[TabelaPaginada confortável]
```

| Coluna | Conteúdo |
| --- | --- |
| Nome | texto; o template que o worker usará recebe `badge-primary badge-sm` **"Em uso"** ao lado do nome |
| Assunto | truncado com tooltip |
| Situação | toggle ativo (`toggle toggle-success`) |
| Versão | `tabular-nums` |
| Atualizado em | `DataHora` |
| Ações | "Editar" |

Banner `alert alert-info` acima da tabela: "O alerta usa o template ativo atualizado mais recentemente." — explicita a regra que define o badge "Em uso".

## Layout — editor (Novo/Editar)

Página `/templates/{id}` (não modal — o editor precisa de espaço), duas colunas em `xl` (`grid xl:grid-cols-2 gap-6`), empilhadas abaixo:

1. **Coluna edição:** campos Nome e Assunto (`input-bordered`); editor TipTap:
   - **Toolbar:** `join` de `btn btn-ghost btn-sm btn-square` com ícones lucide — `Bold`, `Italic`, `Underline`, `List`, `ListOrdered`, `Link2`, `Heading2`, `Table` (inserir tabela de viradas), `Braces` (inserir variável). Estado ativo do botão: `btn-active`. Fundo `bg-base-200 border border-base-300 rounded-t-lg p-1`.
   - **Área de edição:** `border border-base-300 rounded-b-lg min-h-96 p-4 prose prose-sm max-w-none bg-base-100`.
   - **Variáveis** (menu do botão `Braces`): `{{data_execucao}}`, `{{qtd_viradas}}`, `{{tabela_viradas}}`, `{{empresa}}` — inseridas como chips destacados (`badge badge-outline badge-primary`) no texto.
2. **Coluna preview:** card "Pré-visualização" com o e-mail renderizado (HTML sanitizado via DOMPurify) usando dados fictícios de exemplo; toggle "Dados de exemplo: com viradas / sem viradas".

Rodapé fixo da página: Cancelar / Salvar (`btn-primary`).

## Estados

| Estado | Especificação |
| --- | --- |
| Loading | `SkeletonTabela`; no editor, skeleton dos campos + área |
| Empty | `EmptyState` ícone `FileText`, "Nenhum template cadastrado", "Crie o primeiro template para os alertas de contas viradas.", ação "Novo template" |
| Error | `alert-error` "Não foi possível carregar os templates." + Tentar novamente |
| Sucesso | Biblioteca/editor; toasts "Template criado com sucesso." / "Template salvo." / "Template desativado." Desativar o template **em uso** exige `ConfirmarAcaoModal`: "Desativar o template em uso?", "O alerta passará a usar o próximo template ativo mais recente. Se nenhum estiver ativo, o envio de alertas ficará sem template." |

## Links relacionados

- [Template de e-mail de alerta](../email/template-alerta.md) — o design HTML de referência.
- [ADR-010](../../arquitetura/decisoes/adr-010-templates-biblioteca.md) · [Mockup](../mockups/templates-email.html)

<!-- Checklist de revisão: Segurança: variáveis e dados de preview fictícios. Fonte da verdade: ADR-010, modelo-de-dados.md. Editorial: PT-BR. OK. -->
