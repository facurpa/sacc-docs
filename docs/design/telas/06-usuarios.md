# Tela — Usuários

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção
**Público:** desenvolvedores frontend e design

## Objetivo do documento

Especificar o CRUD de usuários da UI (admin-only) — feature "template" do frontend, referência para as demais.

## Acesso

Rota `/usuarios` (admin-only — item de menu oculto para `usuario`). Dados: CRUD `/api/usuarios` + `POST /{id}/reset-password`, soft-delete.

## Layout

```
[h1 Usuários]                            [btn-primary Plus "Novo usuário"]
[Filtros: busca nome/e-mail | papel ▾ | situação ▾]
[TabelaPaginada confortável]
```

| Coluna | Conteúdo |
| --- | --- |
| Nome | texto |
| E-mail | texto |
| Papel | `badge-neutral` Admin / `badge-ghost` Usuário |
| Situação | Ativo/Inativo + **lockout visível**: `badge-warning` com ícone `Lock` "Bloqueado até HH:mm" quando a conta está em lockout (5 falhas / 15 min — ver [Segurança](../../operacao/seguranca.md)) |
| Último acesso | `DataHora` relativa com tooltip |
| Ações | menu `btn-ghost btn-sm` `EllipsisVertical`: Editar · Redefinir senha · Desativar/Reativar |

- **NovoUsuarioModal:** Nome, E-mail, Papel (select Admin/Usuário), senha inicial gerada ou definida com política (mínimo 12 caracteres — validação com mensagem "A senha deve ter pelo menos 12 caracteres.") e checkbox marcado por padrão "Exigir troca de senha no primeiro acesso".
- **EditarUsuarioModal:** Nome, Papel (e-mail imutável ou editável conforme backend; exibir como leitura se imutável).
- **ResetSenhaModal:** confirma a ação e informa "O usuário deverá definir uma nova senha no próximo acesso."
- **Desativar:** `ConfirmarAcaoModal` destrutivo — "Desativar usuário?", "Ele perderá o acesso ao SACC imediatamente."

## Estados

| Estado | Especificação |
| --- | --- |
| Loading | `SkeletonTabela` |
| Empty | `EmptyState` ícone `Users`, "Nenhum usuário encontrado", com filtros: "Nenhum usuário encontrado para os filtros selecionados." |
| Error | `alert-error` "Não foi possível carregar os usuários." + Tentar novamente |
| Sucesso | Tabela; toasts: "Usuário criado com sucesso." / "Usuário atualizado." / "Senha redefinida. O usuário deverá trocá-la no próximo acesso." / "Usuário desativado." |

## Links relacionados

- [Segurança](../../operacao/seguranca.md) — política de senha e lockout.
- [Convenções de Código](../../referencias/convencoes-de-codigo.md) — `usuarios` como feature template.
- [Mockup](../mockups/usuarios.html)

<!-- Checklist de revisão: Segurança: sem nomes/e-mails reais; política de senha citada sem detalhes sensíveis. Fonte da verdade: seguranca.md, endpoints.md. Editorial: PT-BR. OK. -->
