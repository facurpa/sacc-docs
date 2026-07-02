# Design — SACC

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção
**Status da identidade visual:** proposta a validar contra a identidade aprovada da tela de Login.

## Objetivo do documento

Sumário da documentação de design de UI do SACC (Sistema de Alertas Contábeis): design system, padrões transversais, especificação tela a tela, mockups e template de e-mail.

## Mapa da seção

### Fundação
- [Design System](./design-system.md) — paleta (tema DaisyUI pronto para `tailwind.config`), tipografia, espaçamento, componentes-base e estados globais.
- [Padrões Transversais](./padroes-transversais.md) — natureza D/C e virada, gating por papel, toasts, data/hora.
- [Componentes Reutilizáveis](./componentes.md) — catálogo com props sugeridas, alinhado ao vertical slice.

### Telas (em ordem de prioridade)
1. [Dashboard](./telas/01-dashboard.md) · [mockup](./mockups/dashboard.html)
2. [Execuções](./telas/02-execucoes.md) · [mockup](./mockups/execucoes.html)
3. [Plano de Contas](./telas/03-plano-de-contas.md) · [mockup](./mockups/plano-de-contas.html)
4. [Destinatários](./telas/04-destinatarios.md) · [mockup](./mockups/destinatarios.html)
5. [Templates de E-mail](./telas/05-templates-email.md) · [mockup](./mockups/templates-email.html)
6. [Usuários](./telas/06-usuarios.md) · [mockup](./mockups/usuarios.html)
7. [Auditoria](./telas/07-auditoria.md) · [mockup](./mockups/auditoria.html)
8. [Configurações](./telas/08-configuracoes.md) · [mockup](./mockups/configuracoes.html)
9. [Login / Troca de senha](./telas/09-login.md) · [mockup](./mockups/login.html)

Cada mockup é um HTML estático (Tailwind + DaisyUI via CDN, apenas para visualização) com um switcher no canto inferior esquerdo que alterna os estados **sucesso / loading / empty / error**. Base compartilhada: [_shared-head.html](./mockups/_shared-head.html).

### E-mail
- [Template de alerta — especificação](./email/template-alerta.md) · [HTML de referência](./email/template-alerta.html)

## Links relacionados

- [Convenções de Código](../referencias/convencoes-de-codigo.md) — onde os componentes vivem no código.
- [Endpoints da API](../referencias/endpoints.md) — dados consumidos por cada tela.

<!-- Checklist de revisão: Segurança: mockups só com dados fictícios. Fonte da verdade: docs desta seção. Editorial: PT-BR, data presente. OK. -->
