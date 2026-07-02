# Glossário

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção

## Objetivo do documento

Definir os termos contábeis, siglas e termos técnicos usados em toda a documentação do SACC (Sistema de Alertas Contábeis).

## Contexto de negócio

O SACC opera sobre o domínio da contabilidade empresarial brasileira. Para que qualquer leitor — inclusive quem nunca trabalhou com contabilidade — entenda o problema que o sistema resolve, este glossário explica os conceitos do domínio (conta analítica, natureza, saldo invertido) e os termos técnicos recorrentes na arquitetura.

## Siglas do projeto

| Sigla | Significado | Contexto |
|---|---|---|
| **SACC** | Sistema de Alertas Contábeis | Nome do produto |
| **ERP** | Enterprise Resource Planning | Sistema de gestão empresarial (no caso, TOTVS Protheus) |
| **PK / FK / UK** | Primary / Foreign / Unique Key | Chaves em SQL |
| **JWT** | JSON Web Token | Autenticação |
| **ODBC** | Open Database Connectivity | Protocolo de conexão com o banco do ERP |
| **DTO** | Data Transfer Object | Contratos de dados entre camadas |
| **ETL** | Extract, Transform, Load | Sincronização de dados externos |
| **MER** | Modelo Entidade-Relacionamento | Modelagem de dados |
| **ADR** | Architecture Decision Record | Documentação de decisões arquiteturais |
| **SMTP** | Simple Mail Transfer Protocol | Envio de e-mails |
| **KPI** | Key Performance Indicator | Indicadores do dashboard |
| **LGPD** | Lei Geral de Proteção de Dados | Base de compliance para este repositório público |

## Termos contábeis

### Conta contábil
Identificador único no plano de contas (ex. ilustrativo: `1.1.01.001`). Estruturada hierarquicamente por níveis — cada dígito adicional aprofunda a hierarquia.

### Plano de contas
Estrutura hierárquica completa de todas as contas de uma organização. O plano monitorado pelo SACC tem cerca de 1.400 contas (~857 analíticas e ~565 sintéticas), compartilhado por 11 empresas do grupo.

### Conta analítica
Conta **folha** da hierarquia, que recebe lançamentos contábeis diretos. Só contas analíticas têm saldo próprio — e por isso só elas são monitoradas pelo SACC.

### Conta sintética
Conta **agregadora**, que soma os saldos das analíticas abaixo dela. Não recebe lançamentos diretos; seu saldo é sempre derivado. Não é monitorada.

Exemplo ilustrativo:
- `1.1.01` "Caixa" (sintética) = soma de `1.1.01.001` "Caixa Geral" + `1.1.01.002` "Caixa Filial" + ...

### Natureza (D/C)
- **Devedora (D):** conta cujo saldo normal fica do lado devedor. Ex.: ativos (caixa, estoques), despesas.
- **Credora (C):** conta cujo saldo normal fica do lado credor. Ex.: passivos (fornecedores, empréstimos), receitas, patrimônio líquido.

### Saldo invertido (virada)
Estado anômalo em que uma conta apresenta saldo com natureza **oposta** à esperada. Exige investigação.

Exemplos:
- Conta "Caixa" (natureza esperada D) com saldo do lado C → dinheiro "negativo", fisicamente impossível; indica erro de lançamento.
- Conta "Fornecedores" (natureza esperada C) com saldo do lado D → pagamento acima do devido.

É o conceito central do SACC — ver [Regras de Negócio](./regras-de-negocio.md).

### Balancete
Relatório contábil que lista todas as contas com seus saldos em uma data específica.

### Movimento vs. saldo
- **Movimento:** débitos e créditos lançados em um período (ex.: um mês).
- **Saldo:** valor acumulado ao longo do tempo. `saldo_final = saldo_inicial + débitos − créditos` (para contas devedoras; inverso para credoras).

A distinção importa: a view atualmente disponível no ERP entrega **movimento**; a detecção definitiva de viradas depende de uma view de **saldos finais** (ver [Integrações](../arquitetura/integracoes.md)).

### Lançamento contábil
Registro de um evento financeiro no razão. Sempre tem contrapartida — débito em uma conta corresponde a crédito em outra.

### Estorno
Lançamento que anula outro feito por engano (débitos viram créditos e vice-versa).

### Conciliação
Verificação do saldo contábil contra o extrato real (banco, cliente etc.). É o trabalho que a área contábil realiza após receber um alerta de virada.

## Termos técnicos do projeto

### Vertical slice
Padrão de organização de código em que cada feature contém tudo o que precisa (modelos, schemas, repository, service, router) em um único diretório, em vez de camadas transversais. Ver [ADR-004](../arquitetura/decisoes/adr-004-vertical-slice.md).

### Repository
Camada de acesso a dados. No SACC, funções assíncronas independentes (não classes) que consultam o PostgreSQL.

### Service
Camada de lógica de negócio, presente apenas quando a lógica é complexa. CRUDs simples usam só o repository.

### Feature "template"
Feature de referência para replicação de estrutura. No SACC, é a feature `usuarios`.

### Soft-delete
Marcar um registro como inativo (`ativo = false`) em vez de excluí-lo fisicamente, preservando histórico e integridade referencial.

### Advisory lock
Mecanismo do PostgreSQL que garante exclusão mútua entre processos ou sessões. Usado pelo worker para impedir execuções simultâneas.

### Contextvars
Mecanismo do Python que propaga estado através de chamadas assíncronas. Usado para propagar o `request_id` em todos os logs de um mesmo ciclo.

### Structlog
Biblioteca de logging estruturado: produz JSON com campos consistentes em vez de texto livre.

### Singleton (contexto de banco de dados)
Tabela desenhada para ter **exatamente uma linha**, garantida por constraint de unicidade. Ex.: `configuracoes_sistema`. Ver [ADR-006](../arquitetura/decisoes/adr-006-configuracoes-singleton.md).

### APScheduler
Biblioteca Python de agendamento de tarefas (estilo cron). Executa o worker de detecção diário.

### `request_id`
UUID único gerado por request HTTP, propagado via contextvars e incluído em todos os logs do ciclo. Devolvido no header `X-Request-Id`. Permite rastrear uma request específica através dos logs. *(Propagação end-to-end ainda planejada.)*

### `execution_id`
Equivalente do `request_id` para execuções do worker disparadas pelo agendador (que não têm request HTTP associada).

### Worker
Componente do backend que executa a verificação de saldos de forma agendada. Ver [Fluxo de Execução](../operacao/fluxo-de-execucao.md).

## Termos de UI/UX do projeto

### KPI cards
Os quatro cards no topo do dashboard: Contas Viradas, Alertas Enviados, Próxima Execução, Integridade.

### Empty state
Estado da interface quando não há dados. Deve exibir mensagem amigável (ex.: "Nenhuma conta virada detectada"), nunca vazio silencioso ou "N/A".

### AuthGuard
Componente do frontend que bloqueia rotas para usuários não autenticados ou sem papel suficiente.

## Papéis (roles)

### `admin`
Acesso total: administra usuários e destinatários, cria templates, vê auditoria, dispara o worker manualmente, vê e edita configurações.

### `usuario`
Acesso limitado: vê dashboard, plano de contas (somente leitura) e logs de execução. Não administra usuários nem acessa auditoria e configurações.

## Links relacionados

- [Regras de Negócio](./regras-de-negocio.md) — aplicação dos conceitos contábeis na detecção.
- [Problema e Solução](./problema-e-solucao.md) — contexto de negócio do projeto.

<!--
Checklist de revisão:
Segurança: código contábil real e descrições reais substituídos por exemplos genéricos (1.1.01.001, "Caixa Geral"); tabelas internas do ERP e nomes de views omitidos; sigla interna de diretoria omitida por ser jargão corporativo; sem IPs, credenciais, nomes reais. OK.
Fonte da verdade: definições vindas do 09-glossario.md; contagens de contas conforme fonte. OK.
Editorial: siglas expandidas; voz impessoal; data presente; links relativos. OK.
Negócio: contexto de negócio presente; termos explicados para leigos. OK.
-->
