# Tela — Login e Troca de Senha

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção
**Nota:** a tela de Login já tem identidade aprovada. Esta spec **não redesenha do zero** — propõe o refinamento de consistência com o design system; validar contra a identidade existente antes de aplicar.

## Objetivo do documento

Especificar o refinamento das telas de Login e Troca de Senha para consistência com o restante do sistema.

## Acesso

Rotas públicas `/login` e `/trocar-senha` (esta, forçada quando a flag de troca obrigatória está ativa). Endpoints: `POST /api/auth/login`, `POST /api/auth/change-password`.

## Layout — Login

Tema `saccdark` em página inteira (mesma família da sidebar):

```
[centro vertical/horizontal, card max-w-sm bg-base-200]
  [logotipo SACC + caption "Sistema de Alertas Contábeis · Cast Informática"]
  [input E-mail]
  [input Senha (toggle Eye/EyeOff)]
  [btn-primary block "Entrar"]
```

- Erros no `alert-error` acima do botão (não em toast — a página não tem shell):
  - Credenciais inválidas: "E-mail ou senha incorretos." (mensagem única, sem revelar qual campo errou).
  - **Lockout** (5 falhas / 15 min): "Conta bloqueada temporariamente por excesso de tentativas. Tente novamente em alguns minutos." + ícone `Lock`.
- Botão em loading durante a autenticação; Enter submete.

## Layout — Troca de senha

Mesmo card, título "Definir nova senha":

- Contexto no topo (`alert-info`): "Por segurança, defina uma nova senha para continuar." (troca obrigatória) — omitido na troca voluntária via menu do usuário.
- Campos: Senha atual (só na voluntária), Nova senha, Confirmar nova senha.
- Validação inline: "A senha deve ter pelo menos 12 caracteres."; "Esta senha é muito comum. Escolha outra." (blocklist); "As senhas não coincidem."
- Sucesso: redireciona ao dashboard com toast "Senha alterada com sucesso."

## Estados

| Estado | Especificação |
| --- | --- |
| Loading | Botão com spinner; campos desabilitados |
| Empty | Formulário inicial (estado padrão) |
| Error | `alert-error` inline conforme acima |
| Sucesso | Redirecionamento (login → dashboard) |

## Links relacionados

- [Segurança](../../operacao/seguranca.md) — política de senha, lockout, troca obrigatória.
- [Design System](../design-system.md) — tema `saccdark`. · [Mockup](../mockups/login.html)

<!-- Checklist de revisão: Segurança: mensagens não revelam existência de conta; sem credenciais. Fonte da verdade: seguranca.md, endpoints.md. Editorial: PT-BR. OK. -->
