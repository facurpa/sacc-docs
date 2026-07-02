# ADR-001: Adotar autenticação local em vez de Azure AD

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

O SACC (Sistema de Alertas Contábeis) é uma aplicação on-premise com poucos usuários (administradores técnicos). O projeto começou com autenticação via diretório corporativo com cookie, migrou para Azure AD com OIDC (OpenID Connect) e JWKS (JSON Web Key Set), e por fim reavaliou: a complexidade do OIDC não se justificava para o porte e o contexto do sistema.

## Decisão

Adotar login local com e-mail + senha: hash de senha com Argon2id e tokens JWT (JSON Web Token) assinados com HS256.

Compensações de segurança embutidas na decisão:
- Política de senha com mínimo de 12 caracteres e blocklist.
- Lockout após 5 falhas de login por 15 minutos.
- Bootstrap do primeiro administrador via variáveis de ambiente (`INITIAL_ADMIN_*`).

## Alternativas consideradas

- **Azure AD / OIDC / PKCE / JWKS** — descartado: complexidade operacional desproporcional para app interno com poucos usuários.
- **Diretório corporativo (LDAP) + cookie** — abordagem inicial, abandonada ao longo da evolução do projeto.

## Consequências

- ✅ Controle total sobre lockout, políticas de senha e reset — sem dependência de time externo.
- ✅ Menos partes móveis; login funciona mesmo sem conectividade com serviços de identidade.
- ⚠️ Gestão de credenciais passa a ser responsabilidade da aplicação (hash, expiração, reset, auditoria de eventos de segurança).
- 📎 Depende das tabelas `usuarios`, `refresh_tokens` ([ADR-002](./adr-002-remocao-redis.md)) e `auth_eventos` ([ADR-003](./adr-003-auditoria.md)); comportamento descrito em [Segurança](../../operacao/seguranca.md).

<!--
Checklist: sem dados sensíveis (nomes de env vars são convenção pública da doc, valores nunca mostrados); baseado em 07-decisoes-arquiteturais.md; data real da decisão não documentada na fonte — placeholder DD/MM/AAAA. OK.
-->
