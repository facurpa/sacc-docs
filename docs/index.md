# SACC — Sistema de Alertas Contábeis

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção
**Público:** todos os leitores da documentação (negócio, desenvolvedores, administradores técnicos)

## Objetivo do documento

Apresentar o SACC e servir de sumário navegável para toda a documentação pública do projeto.

## Comece por aqui

Escolha a trilha pelo seu perfil — cada passo leva ao próximo documento recomendado:

| Perfil | Trilha sugerida |
|---|---|
| 🧑‍💼 **Negócio / novo no projeto** | [Problema e Solução](./negocio/problema-e-solucao.md) → [Glossário](./negocio/glossario.md) → [Regras de Negócio](./negocio/regras-de-negocio.md) |
| 👩‍💻 **Desenvolvedor** | [Visão Geral da Arquitetura](./arquitetura/visao-geral.md) → [Convenções de Código](./referencias/convencoes-de-codigo.md) → [Endpoints](./referencias/endpoints.md) |
| 🛠️ **Administrador técnico** | [Segurança](./operacao/seguranca.md) → [Telas](./design/index.md) → [Fluxo de Execução](./operacao/fluxo-de-execucao.md) |

Com pressa ou com uma dúvida pontual? Vá direto à [FAQ](./negocio/faq.md).

## Contexto de negócio

O SACC (Sistema de Alertas Contábeis) é um sistema interno da Cast Informática que monitora automaticamente contas contábeis no ERP (Enterprise Resource Planning) TOTVS Protheus, detecta [saldos invertidos](./negocio/glossario.md#saldo-invertido-virada) — saldos com natureza oposta à esperada — e dispara alertas por e-mail para a área contábil. Ele substitui uma verificação manual e semanal que consumia horas de trabalho da coordenação contábil e deixava uma janela de detecção de até 7 dias.

## O que o SACC faz

- Detecta automaticamente saldos invertidos em [contas analíticas](./negocio/glossario.md#conta-analítica), com cadência configurável (padrão diário).
- Envia alertas por e-mail com templates configuráveis.
- Sincroniza periodicamente o plano de contas com o ERP (em desenvolvimento — ver [estado por área](#estado-do-projeto)).
- Audita todas as ações administrativas e execuções.
- Oferece interface web com autenticação local e papéis `admin`/`usuario`.

O SACC **apenas detecta e alerta** — a correção dos lançamentos é feita manualmente no ERP. Detalhes em [Problema e Solução](./negocio/problema-e-solucao.md).

## Mapa da documentação

### Negócio
- [Problema e Solução](./negocio/problema-e-solucao.md) — o que o SACC resolve, para quem e por quê.
- [Glossário](./negocio/glossario.md) — termos contábeis, siglas e termos técnicos do projeto.
- [Regras de Negócio](./negocio/regras-de-negocio.md) — detecção de virada, cadência, filtros e tratamento de falhas.
- [Perguntas Frequentes (FAQ)](./negocio/faq.md) — dúvidas comuns, com link para a fonte de cada resposta.

### Arquitetura
- [Visão Geral](./arquitetura/visao-geral.md) — diagrama de alto nível e stack tecnológica.
- [Modelo de Dados](./arquitetura/modelo-de-dados.md) — entidades e MER (Modelo Entidade-Relacionamento).
- [Integrações](./arquitetura/integracoes.md) — ERP e serviço de e-mail, descritos conceitualmente.
- [Decisões Arquiteturais (ADRs)](./arquitetura/decisoes/index.md) — registro das decisões e seus trade-offs.

### Operação
- [Fluxo de Execução](./operacao/fluxo-de-execucao.md) — como o worker de detecção roda.
- [Observabilidade](./operacao/observabilidade.md) — logs estruturados, rastreabilidade e auditoria.
- [Segurança](./operacao/seguranca.md) — autenticação, papéis e proteção de dados sensíveis.

### Design
- [Design de UI](./design/index.md) — design system (tokens DaisyUI, tipografia, componentes), especificação e mockups das telas, template do e-mail de alerta.

### Referências
- [Endpoints da API](./referencias/endpoints.md) — API REST conceitual, por feature.
- [Convenções de Código](./referencias/convencoes-de-codigo.md) — padrões para contribuidores.
- [Changelog da documentação](./changelog.md) — o que mudou nesta documentação.

## Estado do projeto

O projeto está em desenvolvimento ativo, ainda pré-produção:

- **Concluído:** autenticação local, CRUDs administrativos (usuários, destinatários, templates, períodos), worker de detecção com lógica provisória, auditoria, dashboard básico.
- **Em curso:** feature de configurações do sistema, sincronização do plano de contas com o ERP, propagação de identificador de rastreio (`request_id`).

> [!WARNING]
> **Bloqueado:** a regra definitiva de detecção aguarda a criação, no ERP, de uma view de saldos finais. Até lá, o worker roda com lógica provisória. Ver [Regras de Negócio](./negocio/regras-de-negocio.md#estado-das-regras-e-impedimentos).

## Links relacionados

- [Problema e Solução](./negocio/problema-e-solucao.md) — ponto de partida recomendado.
- [Visão Geral da Arquitetura](./arquitetura/visao-geral.md) — ponto de partida para desenvolvedores.

<!--
Checklist de revisão:
Segurança: sem IPs/hostnames/URLs internas; sem credenciais; sem nomes de pessoas reais; sem e-mails reais; sem códigos contábeis/valores reais; sem schemas/tabelas do ERP; sem topologia de rede; sem screenshots. OK.
Fonte da verdade: afirmações baseadas em 00, 01 e 06 do Knowledge Source; estados de feature refletem 06. OK.
Editorial: siglas SACC/ERP/ADR/MER expandidas na 1ª ocorrência; termos contábeis linkados ao glossário; voz impessoal; data presente. OK.
Negócio: documento abre com contexto de negócio; problema claro para leitor leigo. OK.
-->
