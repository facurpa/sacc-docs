# Integrações Externas

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo; view de saldos finais ainda inexistente no ERP

## Objetivo do documento

Descrever, em nível conceitual, como o SACC (Sistema de Alertas Contábeis) se integra ao ERP (Enterprise Resource Planning) e ao serviço de e-mail.

## Contexto de negócio

Toda a inteligência do SACC depende de duas integrações: **ler** do ERP os saldos e o plano de contas (a matéria-prima da [detecção de virada](../negocio/regras-de-negocio.md)) e **enviar** e-mails de alerta para a área contábil (o produto final). O acesso ao ERP é estritamente somente leitura — o SACC nunca altera dados contábeis; a correção de lançamentos permanece manual, dentro do ERP.

> Este documento descreve as integrações **conceitualmente**. Detalhes de infraestrutura (endereços, credenciais, nomes de objetos de banco do ERP) não são publicados; nas configurações de exemplo, usam-se placeholders.

## ERP TOTVS Protheus

### Conexão

- **Protocolo:** ODBC (Open Database Connectivity) contra o banco SQL Server do ERP, em `servidor-interno`.
- **Credencial:** usuário de banco dedicado, **somente leitura**, configurado via variável de ambiente (`ERP_DATABASE_URL=<CONNECTION_STRING>`).
- **Pool de conexões:** singleton assíncrono, criado pela aplicação.
- **Warmup:** a conexão é testada no startup da aplicação; uma falha nesse teste não impede o app de subir, mas é registrada em log.

### Views consumidas

O SACC nunca consulta tabelas do ERP diretamente: consome **views** criadas e mantidas pelo time de banco de dados da organização, que encapsulam a estrutura interna do ERP.

#### View de saldos contábeis (atual)

Retorna o **movimento contábil mensal** ([movimento, não saldo](../negocio/glossario.md#movimento-vs-saldo)) por conta e empresa. Colunas conceituais:

| Coluna | Tipo | Conteúdo |
|---|---|---|
| empresa | string | Código da empresa no grupo |
| data | int (YYYYMMDD) | Fim do mês de referência |
| conta | string | Código contábil |
| descricao | string | Nome da conta |
| debito | decimal | Total de débitos do período |
| credito | decimal | Total de créditos do período |

**Limitação crítica:** entrega o movimento do mês, não o saldo acumulado. Detectar virada a partir dela exigiria somar todos os movimentos anteriores mais o saldo inicial — cálculo complexo e sujeito a erros. Por isso, a lógica de detecção atual sobre essa view é **provisória**.

**Uso atual:** endpoint de balancete para teste visual (smoke test) e worker com lógica provisória.

#### View de saldos finais (planejada — bloqueia a detecção definitiva)

Retornará o **saldo final** por conta e empresa em uma data de referência. Estrutura esperada (conceitual):

| Coluna | Tipo | Conteúdo |
|---|---|---|
| empresa | string | Código/nome da empresa |
| tipo | string | "Analítica" ou "Sintética" |
| conta | string | Código contábil |
| descricao | string | Nome da conta |
| saldo | decimal | Sempre positivo (módulo) |
| dc | char | `'D'` ou `'C'` — lado atual do saldo |
| data_referencia | int (YYYYMMDD) | Data do saldo |

Com essa view, a regra de virada fica trivial: `natureza_esperada (plano_contas) != dc (view)`. Enquanto ela não existe, a [regra definitiva de detecção permanece bloqueada](../negocio/regras-de-negocio.md#estado-das-regras-e-impedimentos).

#### View de plano de contas

Retorna o plano de contas oficial do grupo, com transformações já aplicadas pelo time de banco de dados (classificações legíveis em vez de códigos internos do ERP). Conceitualmente, a consulta equivale a:

```sql
-- Representação conceitual — não é a estrutura real do ERP
SELECT conta, descricao, grupo, classe, natureza, conta_pai, situacao
FROM vw_plano_contas
WHERE registro_ativo = TRUE;
```

**Mapeamento conceitual para o SACC:**

| Origem (view) | Destino local (`plano_contas`) | Transformação |
|---|---|---|
| conta | `conta` | trim |
| descricao | `descricao` | trim |
| natureza | `natureza` | "DEVEDORA" → `'D'`, "CREDORA" → `'C'` |
| classe | `classe` | "ANALITICA"/"SINTETICA" → minúsculas |
| situacao (bloqueio) | `ativo` | ativo → `true`, inativo → `false` |
| grupo | `codigo_grupo` | trim |
| conta_pai | `codigo_conta_pai` | trim |

**Observação:** a view não segrega por filial/empresa. Premissa (pendente de validação): o plano é consolidado entre as empresas do grupo — ver [Regras de Negócio](../negocio/regras-de-negocio.md#multi-empresa).

**Uso planejado:** sincronização automática diária para popular a tabela local `plano_contas` ([ADR-005](./decisoes/adr-005-plano-contas-fonte-unica.md)).

> **Nota de divergência na fonte:** o Knowledge Source descreve essa view ora como "em criação", ora como "recém-criada" com estrutura definida. A divergência é registrada aqui em vez de resolvida.

### Erros comuns de conexão com o ERP

- **Timeout no login** — tipicamente conectividade de rede indisponível (a aplicação precisa estar na rede corporativa).
- **Falha de resolução de nome (DNS)** — ambiente fora da rede corporativa.

## Serviço de e-mail (SMTP)

### Conexão

- **Servidor:** serviço de e-mail corporativo (`SMTP_HOST=<servidor-interno>`), acessível apenas na rede interna.
- **Porta/segurança:** 587 com STARTTLS.
- **Autenticação:** usuário e senha via variáveis de ambiente (`SMTP_USER`, `SMTP_PASSWORD=<REDACTED>`).
- **Biblioteca:** `smtplib` nativa do Python.

### Retentativas

- Retry com backoff exponencial; número máximo configurável (`SMTP_RETRY_MAX`, padrão 3).
- Log estruturado a cada tentativa; evento de falha definitiva quando as tentativas se esgotam.
- O comportamento em caso de falha persistente está descrito em [Regras de Negócio](../negocio/regras-de-negocio.md#tratamento-de-falhas).

### Usos

- Envio de **alertas de virada** para a lista de destinatários ativos.
- Envio de **e-mails de incidente** para administradores, quando o toggle de alertas de execução está ativo ([ADR-006](./decisoes/adr-006-configuracoes-singleton.md)).

## Gestão de segredos

- Todas as credenciais (ERP, SMTP, chave JWT — JSON Web Token —, bootstrap do administrador inicial) vivem em arquivo `.env` **nunca versionado**; cada ambiente tem o seu.

```env
# Exemplo ilustrativo — valores sempre via ambiente
ERP_DATABASE_URL=<CONNECTION_STRING>
SMTP_HOST=<servidor-interno>
SMTP_USER=usuario@exemplo.com
SMTP_PASSWORD=<REDACTED>
JWT_SECRET_KEY=<REDACTED>
INITIAL_ADMIN_EMAIL=usuario@exemplo.com
INITIAL_ADMIN_PASSWORD=<REDACTED>
```

- Uso de um cofre de segredos (vault) está **planejado** para produção; ainda não implementado.

## Links relacionados

- [Regras de Negócio](../negocio/regras-de-negocio.md) — como os dados das views alimentam a detecção.
- [Visão Geral da Arquitetura](./visao-geral.md) — onde as integrações se encaixam.
- [ADR-005](./decisoes/adr-005-plano-contas-fonte-unica.md) — plano de contas com fonte única no ERP.
- [Fluxo de Execução](../operacao/fluxo-de-execucao.md) — quando as integrações são acionadas.

<!--
Checklist de revisão:
Segurança: host/porta/banco/usuário reais do ERP substituídos por placeholders da convenção; SQL real da view (tabela, colunas e schema do ERP) substituído por representação conceitual explicitamente sinalizada; nomes reais das views omitidos; códigos contábeis e descrições reais omitidos; IP/SO/portas do servidor de produção, proxy, hostnames internos e projeto co-hospedado omitidos; exemplos .env só com placeholders da convenção. OK.
Fonte da verdade: baseado em 08-integracoes-externas.md; divergência sobre o estado da view sinalizada; vault marcado como planejado. OK.
Editorial: siglas ERP/ODBC/SMTP/JWT/DNS expandidas ou linkadas; termos linkados ao glossário; decisões linkam ADRs; data presente. OK.
Negócio: abre conectando as integrações ao propósito (matéria-prima da detecção, produto final do alerta). OK.
-->
