# Regras de Negócio

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo; regra de detecção definitiva bloqueada por dependência externa

## Objetivo do documento

Descrever as regras de negócio do SACC (Sistema de Alertas Contábeis): o que é uma virada, como ela é detectada, com que cadência e o que acontece em caso de falha.

## Contexto de negócio

O SACC existe para encurtar o tempo entre a ocorrência de um [saldo invertido](./glossario.md#saldo-invertido-virada) no ERP (Enterprise Resource Planning) e o momento em que a área contábil fica sabendo. As regras abaixo definem o que o sistema considera anomalia, quais contas observa e como notifica — decisões validadas com a especialista contábil da organização (ver [Problema e Solução](./problema-e-solucao.md)).

## Conceito central: saldo invertido (virada)

Uma **conta virada** é uma conta contábil cujo saldo atual está com [natureza](./glossario.md#natureza-dc) **oposta** à natureza esperada dessa conta.

Exemplos:
- Conta "Caixa Geral" tem natureza esperada **Devedora**. Se o saldo atual está do lado **Credor** → virada.
- Conta "Fornecedores" tem natureza esperada **Credora**. Se o saldo atual está do lado **Devedor** → virada.

Viradas indicam problemas que exigem investigação: lançamento errado, [estorno](./glossario.md#estorno) pendente, saldo inicial invertido, entre outros.

## Regra formal de detecção

```
Para cada conta na view de saldos do ERP:
    se classe != 'analitica':
        pular  (só monitora contas analíticas)

    natureza_esperada = plano_contas[conta].natureza   # 'D' ou 'C'
    natureza_atual    = view.lado                      # 'D' ou 'C'

    se natureza_esperada != natureza_atual:
        registrar como virada
        incluir no alerta por e-mail
```

**Dependências:**
1. Plano de contas local com a natureza correta de cada conta — sincronizado do ERP ([ADR-005](../arquitetura/decisoes/adr-005-plano-contas-fonte-unica.md)).
2. View do ERP retornando o saldo e o lado atual de cada conta (ver [Integrações](../arquitetura/integracoes.md)).

## Por que só contas analíticas

| Classe | O que é | Uso no SACC |
|---|---|---|
| [**Sintética**](./glossario.md#conta-sintética) | Conta agregadora que soma suas filhas; não recebe lançamentos diretos | **Não monitorada** — saldo é derivado, virada não faz sentido |
| [**Analítica**](./glossario.md#conta-analítica) | Conta folha; recebe lançamentos diretos | **Monitorada** — pode virar |

O plano de contas do grupo tem ~857 analíticas e ~565 sintéticas. Apenas as analíticas entram no filtro.

## Fontes de dados para a regra

### Natureza esperada
Vem da tabela local `plano_contas`, populada por sincronização automática com uma view de plano de contas do ERP (feature em desenvolvimento — ver [estado](#estado-das-regras-e-impedimentos)).

### Saldo atual e lado
Virá de uma view de **saldos finais** do ERP, **ainda em criação** pela equipe de banco de dados. Estrutura esperada (conceitual):

| Coluna | Tipo | Exemplo ilustrativo |
|---|---|---|
| empresa | string | `"A"` |
| conta | string | `"1.1.01.001"` |
| descricao | string | `"Banco Conta Movimento"` |
| saldo | número | `R$ X.XXX,XX` (sempre positivo) |
| lado | char | `'D'` ou `'C'` |
| data_referencia | int (YYYYMMDD) | data fictícia `DD/MM/AAAA` em formato numérico |

**Importante:** o saldo é sempre em módulo (positivo). O lado (`D`/`C`) indica de que lado do balanço o saldo está.

## Cadência

- **Verificação:** padrão diário às 07:00 (horário de Brasília), configurável via a tabela de configurações do sistema ([ADR-006](../arquitetura/decisoes/adr-006-configuracoes-singleton.md)).
- **Envio de e-mail:** ocorre dentro da execução da verificação. Se houver viradas, o alerta é enviado; se não houver (`status = 'sem_alertas'`), nenhum e-mail é disparado. Um "resumo diário" mesmo sem viradas foi discutido, mas **não está implementado**.
- **Diária vs. semanal:** discussão em aberto. A verificação manual anterior era semanal; considera-se executar diariamente e enviar e-mail apenas quando há virada nova em relação à execução anterior. Decisão pendente de validação com a especialista contábil.

## Multi-empresa

O plano de contas do grupo cobre **11 empresas** (Empresa A a Empresa K), cada uma com um código numérico no ERP.

**Premissa atual (pendente de validação):** o plano é **consolidado** — o mesmo código contábil vale para todas as empresas. Os saldos, porém, são por empresa.

Consequência: uma virada é identificada pelo par `(empresa, conta)`. A mesma conta pode estar normal em uma empresa e virada em outra.

## Fluxo do worker (resumo)

O detalhamento passo a passo está em [Fluxo de Execução](../operacao/fluxo-de-execucao.md). Em resumo: o worker adquire um [advisory lock](./glossario.md#advisory-lock) para impedir execuções simultâneas, verifica se a execução automática está habilitada, registra o início em `logs_execucao`, consulta a view do ERP para o período configurado, compara naturezas conta a conta, envia o alerta se houver viradas e registra o resultado e a auditoria.

## Tratamento de falhas

### Falha na conexão com o ERP
- Log estruturado de erro com detalhes.
- Execução marcada com `status = 'erro'` e tipo de erro de conexão.
- Se o toggle de alertas de execução estiver ativo, envia e-mail de incidente aos administradores.
- **Não há retentativa automática** — a próxima execução agendada tenta novamente no dia seguinte (decisão em aberto, ver [ADRs — questões abertas](../arquitetura/decisoes/index.md#questões-em-aberto)).

### Falha no envio de e-mail
- Retentativa com backoff exponencial (número máximo configurável).
- Se as falhas persistirem, a execução mantém `status = 'sucesso'` mas com `alerta_enviado = false` — a análise foi feita; apenas a notificação falhou.

### Falha em uma conta específica no meio do lote
- **Não tratado hoje:** uma exceção durante o loop aborta a execução inteira.
- A feature planejada de sincronização do plano de contas tratará isso com registro de contas com erro, sem abortar as demais.

## Estado das regras e impedimentos

| Regra | Depende de | Status |
|---|---|---|
| Filtrar só analíticas | Campo `classe` em `plano_contas` | 🟡 Pendente da feature de sincronização |
| Natureza esperada | `plano_contas.natureza` (já existe) | ✅ Modelado |
| Saldo e lado atual | View de saldos finais no ERP | 🔴 Ainda não existe |
| Detecção definitiva | Todos os itens acima | 🔴 Bloqueada pela view |

Até a view de saldos finais existir, o worker usa a view atual de **movimento mensal** com uma lógica **provisória** de detecção, que será substituída quando a nova view estiver disponível.

> **Nota de divergência na fonte:** o Knowledge Source diverge quanto ao estado da view de plano de contas — um documento a descreve como "em criação" e outro como "recém-criada". A view efetivamente inexistente, que bloqueia a detecção definitiva, é a de **saldos finais**.

## Links relacionados

- [Glossário](./glossario.md) — natureza, analítica/sintética, virada, movimento vs. saldo.
- [Fluxo de Execução](../operacao/fluxo-de-execucao.md) — o passo a passo do worker.
- [Integrações](../arquitetura/integracoes.md) — as views do ERP, conceitualmente.
- [ADR-005](../arquitetura/decisoes/adr-005-plano-contas-fonte-unica.md) — plano de contas com fonte única no ERP.

<!--
Checklist de revisão:
Segurança: nomes reais das 11 empresas e códigos substituídos por Empresa A..K; código contábil real e descrições reais (banco/agência) substituídos por genéricos; valores monetários reais substituídos por R$ X.XXX,XX; nomes de views do ERP omitidos (descrição conceitual); chave numérica do advisory lock omitida; nome da especialista substituído por papel. OK.
Fonte da verdade: regras extraídas de 04-regras-negocio.md; divergência entre arquivos sinalizada em vez de resolvida; nada extrapolado. OK.
Editorial: siglas expandidas; termos contábeis linkados ao glossário na 1ª ocorrência; decisões linkam ADRs; presente para o que existe, futuro só para o confirmado. OK.
Negócio: abre com contexto de negócio; regra conectada ao problema da janela de detecção. OK.
-->
