# Segurança

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** autenticação e autorização implementadas; pendências registradas como dívida técnica
**Público:** administradores técnicos e desenvolvedores

## Objetivo do documento

Descrever o modelo de autenticação, autorização e proteção de dados sensíveis do SACC (Sistema de Alertas Contábeis).

## Contexto de negócio

O SACC controla quem recebe alertas contábeis e quando a verificação roda. Um acesso indevido poderia silenciar alertas ou desviar informações contábeis — por isso toda a superfície administrativa exige autenticação, as ações são auditadas e o acesso ao ERP (Enterprise Resource Planning) é estritamente somente leitura.

## Autenticação

Modelo local (e-mail + senha), decidido no [ADR-001](../arquitetura/decisoes/adr-001-auth-local.md):

- **Hash de senha:** Argon2id.
- **Tokens:** JWT (JSON Web Token) assinados com HS256; chave em variável de ambiente (`JWT_SECRET_KEY=<REDACTED>`).
- **Refresh tokens:** válidos por 7 dias, com **rotação**, armazenados como hash no PostgreSQL ([ADR-002](../arquitetura/decisoes/adr-002-remocao-redis.md)).
- **Lockout:** 5 falhas de login bloqueiam a conta por 15 minutos.
- **Política de senha:** mínimo de 12 caracteres, com blocklist de senhas comuns; flag de troca obrigatória no próximo login.
- **Bootstrap:** o primeiro administrador é criado a partir de variáveis de ambiente (`INITIAL_ADMIN_*`).
- **Rate limiting:** aplicado via middleware (in-memory).

Endpoints de autenticação em [Endpoints](../referencias/endpoints.md#auth-).

## Autorização (papéis)

Dois papéis, descritos no [Glossário](../negocio/glossario.md#papéis-roles):

| Papel | Pode |
|---|---|
| `admin` | Tudo: administrar usuários e destinatários, templates, configurações, ver auditoria, disparar o worker manualmente |
| `usuario` | Ver dashboard, plano de contas (somente leitura) e logs de execução |

- No backend, dependências `require_admin` e `get_current_user` protegem os endpoints.
- No frontend, o `AuthGuard` bloqueia rotas admin-only e o menu esconde itens não permitidos (defesa em profundidade — a autorização real é do backend).
- Token guardado em `sessionStorage`, não em `localStorage`.

## Auditoria de segurança

Todos os eventos de sessão (login com sucesso, falha, lockout, troca de senha) são registrados em `auth_eventos`, com IP de origem e user agent — trilha separada da auditoria de domínio por decisão registrada no [ADR-003](../arquitetura/decisoes/adr-003-auditoria.md).

## Proteção de dados sensíveis

- **Redação automática nos logs** de chaves como `password`, `senha`, tokens e `secret` ([ADR-013](../arquitetura/decisoes/adr-013-redacao-logs.md)).
- **Segredos fora do código:** credenciais do ERP, SMTP e chave JWT vivem em `.env` nunca versionado; cofre de segredos planejado para produção (ver [Integrações](../arquitetura/integracoes.md#gestão-de-segredos)).
- **Acesso ao ERP somente leitura**, com credencial dedicada de escopo mínimo.
- **Refresh tokens nunca armazenados em claro** — apenas o hash.
- **Hospedagem exclusivamente on-premise** — dados contábeis não saem da infraestrutura da organização (nuvem fora de cogitação por política interna).

## Pendências conhecidas

> [!WARNING]
> Um endpoint de diagnóstico de balancete está **sem autenticação** — dívida técnica documentada, com correção prevista (ver [Endpoints](../referencias/endpoints.md)). Mitigação atual: o sistema só é acessível na rede interna.

- Exception handler global da API planejado, ainda não implementado.

## Links relacionados

- [Endpoints](../referencias/endpoints.md) — superfície da API e requisitos de papel.
- [Observabilidade](./observabilidade.md) — trilhas de auditoria.
- [ADR-001](../arquitetura/decisoes/adr-001-auth-local.md) — decisão de autenticação local.

<!--
Checklist de revisão:
Segurança: sem valores de segredo (placeholders <REDACTED>); dívida do endpoint sem auth reportada de forma mínima, sem instruções exploráveis, com mitigação de contexto (rede interna); sem IPs/hosts/nomes reais. OK.
Fonte da verdade: parâmetros (7d, 5/15min, 12+ chars) de 06-estado-features.md e 07; pendências conforme 06. OK.
Editorial: siglas expandidas; decisões linkam ADRs; termos linkados; data presente. OK.
Negócio: abre conectando segurança ao risco de silenciar alertas contábeis. OK.
-->
