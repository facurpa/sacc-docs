# Decisões Arquiteturais (ADRs)

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção
**Público:** desenvolvedores e arquitetos (aplica-se a todos os ADRs desta seção)

## Objetivo do documento

Indexar os ADRs (Architecture Decision Records) do SACC (Sistema de Alertas Contábeis) e registrar as questões ainda em aberto.

## Contexto de negócio

O SACC é um sistema interno, on-premise, com poucos usuários administrativos e uma execução crítica por dia. As decisões abaixo compartilham um mesmo fio condutor: **simplicidade operacional proporcional ao problema** — menos infraestrutura para operar, mais controle sobre o que importa para o negócio (detecção confiável e auditável de [saldos invertidos](../../negocio/glossario.md#saldo-invertido-virada)).

## ADRs

| ADR | Decisão |
|---|---|
| [ADR-001](./adr-001-auth-local.md) | Adotar autenticação local em vez de Azure AD |
| [ADR-002](./adr-002-remocao-redis.md) | Remover o Redis (refresh tokens em PostgreSQL) |
| [ADR-003](./adr-003-auditoria.md) | Unificar auditoria de domínio em `audit_log` e manter `auth_eventos` separada |
| [ADR-004](./adr-004-vertical-slice.md) | Organizar o código em vertical slice em vez de camadas |
| [ADR-005](./adr-005-plano-contas-fonte-unica.md) | Tratar o ERP como fonte única do plano de contas |
| [ADR-006](./adr-006-configuracoes-singleton.md) | Guardar configurações do sistema em tabela singleton com efeito em runtime |
| [ADR-007](./adr-007-nomenclatura-portugues.md) | Nomear o domínio em português |
| [ADR-008](./adr-008-dto-snake-camel.md) | Traduzir snake_case ↔ camelCase nos DTOs do frontend |
| [ADR-009](./adr-009-eventos-structlog.md) | Nomear eventos de log em snake_case com verbo no passado |
| [ADR-010](./adr-010-templates-biblioteca.md) | Tratar templates de e-mail como biblioteca com múltiplos ativos |
| [ADR-011](./adr-011-kpis-frontend.md) | Manter cálculo de KPIs no frontend (dívida técnica aceita) |
| [ADR-012](./adr-012-observabilidade-minima.md) | Observabilidade com `request_id` e logs estruturados, sem stack dedicada |
| [ADR-013](./adr-013-redacao-logs.md) | Redigir automaticamente campos sensíveis nos logs |
| [ADR-014](./adr-014-timezone-utc.md) | Armazenar timestamps em UTC e renderizar no fuso local |

## Questões em aberto

Registradas na fonte como **não decididas** — nenhuma promessa de comportamento deve ser derivada delas:

- **Severidade das viradas** (Crítica/Alta/Média/Baixa): atribuição manual ou automática? Por valor? Por tipo de conta?
- **Responsável por conta:** cada conta teria um responsável fixo? Onde modelar?
- **Multi-empresa em `periodos_verificacao`:** o campo de empresa é singular hoje; pode precisar mudar conforme a view de saldos finais.
- **Cadência de detecção:** diária (atual) vs. semanal vs. diária com envio condicional — pendente de validação com a especialista contábil.
- **Resumo diário** para administradores mesmo sem virada.
- **Retentativa automática do worker** em caso de falha (hoje só tenta na execução seguinte).

## Links relacionados

- [Visão Geral da Arquitetura](../visao-geral.md)
- [Regras de Negócio](../../negocio/regras-de-negocio.md)

<!--
Checklist de revisão:
Segurança: sem IPs, credenciais, nomes reais, schemas do ERP; nome da especialista substituído por papel. OK.
Fonte da verdade: lista de decisões e questões abertas extraída de 07-decisoes-arquiteturais.md; decisão descartada sobre "campo origem" incorporada ao ADR-005. OK.
Editorial: siglas expandidas; voz impessoal; data presente. OK.
Negócio: contexto conecta as decisões ao perfil do sistema. OK.
-->
