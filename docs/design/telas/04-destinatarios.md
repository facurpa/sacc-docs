# Tela — Destinatários

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção
**Público:** desenvolvedores frontend e design

## Objetivo do documento

Especificar o CRUD de destinatários dos e-mails de alerta.

## Acesso

Rota `/destinatarios`. Escrita: `admin`. Dados: `GET/POST/PUT /api/destinatarios`, `PATCH /{id}/toggle-ativo`.

## Layout

```
[h1 Destinatários]                       [btn-primary Plus "Novo destinatário"]
[Filtros: busca nome/e-mail | situação ▾]
[TabelaPaginada confortável]
```

| Coluna | Conteúdo |
| --- | --- |
| Nome | texto |
| E-mail | texto |
| Situação | toggle DaisyUI (`toggle toggle-success`) — alterna ativo direto na linha, com toast |
| Ações | `btn-ghost btn-sm` "Editar" |

- **NovoDestinatarioModal / EditarDestinatarioModal:** campos Nome (obrigatório) e E-mail (obrigatório, validação de formato — erro: "Informe um e-mail válido."). Botões Cancelar / Salvar.
- **Desativação** é o soft-delete: sem botão de excluir. Desativar via toggle pede `ConfirmarAcaoModal` **apenas se** o destinatário estiver ativo ("Desativar destinatário?", "Ele deixará de receber os alertas de contas viradas.", botão "Desativar" em `btn-error`). Reativar não pede confirmação.

## Estados

| Estado | Especificação |
| --- | --- |
| Loading | `SkeletonTabela` |
| Empty | `EmptyState` ícone `Mails`, "Nenhum destinatário cadastrado", "Cadastre quem deve receber os alertas de contas viradas.", ação "Novo destinatário" |
| Error | `alert-error` "Não foi possível carregar os destinatários." + Tentar novamente |
| Sucesso | Tabela; toasts: "Destinatário criado com sucesso." / "Destinatário atualizado." / "Destinatário desativado." / "Destinatário reativado." |

## Links relacionados

- [Design System](../design-system.md) · [Componentes](../componentes.md) · [Mockup](../mockups/destinatarios.html)

<!-- Checklist de revisão: Segurança: sem e-mails reais (mockups usam exemplo.com.br). Fonte da verdade: endpoints.md. Editorial: PT-BR. OK. -->
