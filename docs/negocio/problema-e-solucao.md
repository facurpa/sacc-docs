# Problema e Solução

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção

## Objetivo do documento

Explicar que problema o SACC (Sistema de Alertas Contábeis) resolve, para quem, por que foi resolvido dessa forma e como o sucesso é medido.

## Contexto de negócio

Empresas que usam um ERP (Enterprise Resource Planning) contábil precisam garantir que os saldos das contas estejam coerentes com a natureza esperada de cada conta. Quando uma conta apresenta [saldo invertido](./glossario.md#saldo-invertido-virada) — uma "virada" —, isso indica erro de lançamento, estorno pendente ou saldo inicial incorreto, e exige investigação. O SACC automatiza a detecção dessas anomalias.

## O problema

Antes do SACC, a Coordenação Contábil da organização fazia verificação **manual e semanal** de contas viradas diretamente no ERP TOTVS Protheus. Isso significava:

- **Trabalho repetitivo** consumindo horas por semana de uma profissional especializada.
- **Janela de detecção de até 7 dias** — uma virada ocorrida logo após a verificação só era percebida na semana seguinte.
- **Risco de erro humano** em um plano com ~857 [contas analíticas](./glossario.md#conta-analítica) distribuídas por 11 empresas do grupo (Empresa A, Empresa B, ..., Empresa K).

## A solução

O SACC automatiza essa verificação com cadência configurável (padrão diário) e envia alertas por e-mail para a área contábil quando detecta contas cujo saldo foge da [natureza](./glossario.md#natureza-dc) esperada. A regra de detecção está descrita em [Regras de Negócio](./regras-de-negocio.md).

Um ponto de desenho importante: **os destinatários dos alertas não usam a interface do sistema**. A especialista contábil e seu time apenas recebem os e-mails; a interface web é usada por administradores técnicos para configurar destinatários, templates, períodos e acompanhar execuções.

### Que trabalho manual o SACC substitui

A varredura periódica do plano de contas em busca de saldos invertidos. A **investigação e a correção** dos lançamentos continuam manuais, feitas no ERP pela equipe contábil — o SACC encurta o tempo entre a ocorrência do problema e o início dessa investigação.

## Para quem

| Perfil | Relação com o SACC |
|---|---|
| Coordenação Contábil e equipe | Recebem os alertas por e-mail; não usam a interface |
| Diretoria de planejamento e controle | Sponsor do projeto |
| Administradores técnicos | Operam a interface web (configuração, auditoria, execuções) |
| Especialista contábil | Valida regras de negócio e especifica as fontes de dados no ERP |

## Escopo

### No escopo

- Detecção automática de saldos invertidos em contas analíticas.
- Envio de alertas por e-mail com templates configuráveis.
- Sincronização periódica do plano de contas com o ERP.
- Auditoria de todas as ações e execuções.
- Autenticação local (e-mail + senha) com papéis `admin`/`usuario` (ver [Segurança](../operacao/seguranca.md)).
- Dashboard com KPIs (Key Performance Indicators) e histórico de execuções.

### Fora do escopo

- **Correção automática de saldos** — o SACC só detecta e alerta; a correção é manual no ERP.
- **Análise de balancetes completos** — o SACC verifica conta a conta, não faz reconciliação.
- **Integração com outros ERPs** além do TOTVS Protheus.
- **Aplicativo mobile** — a interface é exclusivamente web.
- **Hospedagem em nuvem/SaaS** — por política de dados da organização, o sistema roda em infraestrutura própria (on-premise).

## Por que essa forma de resolver

- **Detecção, não correção:** corrigir lançamentos exige julgamento contábil; automatizar a correção teria risco alto e valor incerto. Encurtar a detecção resolve a maior dor (a janela de 7 dias) com risco baixo.
- **E-mail como canal de alerta:** os destinatários já trabalham no e-mail e não precisam adotar uma nova ferramenta.
- **Plano de contas espelhado do ERP:** a fonte única de verdade das contas e suas naturezas é o ERP; o SACC sincroniza uma cópia local em vez de manter cadastro manual (ver [ADR-005](../arquitetura/decisoes/adr-005-plano-contas-fonte-unica.md)).

## Como se mede sucesso

**Métrica principal (north star):** redução do tempo semanal gasto pela Coordenação Contábil em verificação manual, medido em horas/semana.

**Métricas secundárias:**
- Precisão da detecção (viradas corretamente identificadas).
- Tempo médio entre a virada real no ERP e o alerta recebido.
- Taxa de sucesso das execuções diárias do worker.

## Links relacionados

- [Regras de Negócio](./regras-de-negocio.md) — como a detecção funciona.
- [Glossário](./glossario.md) — termos contábeis usados aqui.
- [Visão Geral da Arquitetura](../arquitetura/visao-geral.md) — como a solução é construída.

<!--
Checklist de revisão:
Segurança: nomes reais (coordenadora, desenvolvedora, especialista) substituídos por papéis; empresas do grupo anonimizadas como Empresa A..K; sigla interna da diretoria substituída por descrição genérica; IP do servidor e projeto co-hospedado omitidos; sem credenciais/códigos reais. OK.
Fonte da verdade: baseado em 01-visao-geral-projeto.md e 04-regras-negocio.md; métricas de sucesso são as documentadas, nenhuma inventada. OK.
Editorial: siglas SACC/ERP/KPI expandidas; termos contábeis linkados ao glossário na 1ª ocorrência; decisão citada linka ADR; voz impessoal; data presente. OK.
Negócio: documento inteiro é contexto de negócio; problema, público e medição de sucesso explícitos. OK.
-->
