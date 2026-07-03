# Perguntas Frequentes (FAQ)

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção
**Público:** negócio, administradores técnicos e desenvolvedores

## Objetivo do documento

Responder, de forma direta, às dúvidas mais comuns sobre o SACC (Sistema de Alertas Contábeis), com link para a fonte canônica de cada resposta.

## Nesta página

- [Sobre o produto](#sobre-o-produto)
- [Detecção e regras](#detecção-e-regras)
- [Uso e acesso](#uso-e-acesso)
- [Operação e falhas](#operação-e-falhas)
- [Estado do projeto](#estado-do-projeto)

## Sobre o produto

### O que o SACC faz, em uma frase?
Detecta automaticamente contas com [saldo invertido](./glossario.md#saldo-invertido-virada) no ERP e avisa a área contábil por e-mail. Ver [Problema e Solução](./problema-e-solucao.md).

### O SACC corrige os lançamentos errados?
**Não.** O SACC **apenas detecta e alerta**. A investigação e a correção continuam manuais, feitas no ERP pela equipe contábil — o SACC só encurta o tempo até o início dessa investigação. Ver [O que substitui](./problema-e-solucao.md#que-trabalho-manual-o-sacc-substitui).

### Por que não corrigir automaticamente?
Corrigir lançamentos exige julgamento contábil; automatizar teria risco alto e valor incerto. Encurtar a detecção resolve a maior dor (a janela de até 7 dias) com risco baixo. Ver [Por que essa forma](./problema-e-solucao.md#por-que-essa-forma-de-resolver).

## Detecção e regras

### O que é uma "virada"?
Uma conta cujo saldo atual está com [natureza](./glossario.md#natureza-dc) **oposta** à esperada (ex.: uma conta Devedora que aparece Credora). Ver [Regras de Negócio](./regras-de-negocio.md#conceito-central-saldo-invertido-virada).

### Por que o SACC monitora só contas analíticas?
Contas [sintéticas](./glossario.md#conta-sintética) apenas agregam o saldo das filhas e não recebem lançamentos diretos — uma virada nelas não faria sentido. Só as [analíticas](./glossario.md#conta-analítica) (contas-folha) são monitoradas. Ver [Por que só analíticas](./regras-de-negocio.md#por-que-só-contas-analíticas).

### Com que frequência a verificação roda?
Cadência diária por padrão (07:00, horário de Brasília), configurável. Há também disparo manual por administradores. Ver [Fluxo de Execução](../operacao/fluxo-de-execucao.md#agendamento).

## Uso e acesso

### Quem usa a interface web?
Apenas **administradores técnicos**, para configurar destinatários, templates e períodos e acompanhar execuções. Os **destinatários dos alertas (área contábil) não usam a interface** — só recebem os e-mails. Ver [Para quem](./problema-e-solucao.md#para-quem).

### Quais são os papéis de acesso?
`admin` (tudo) e `usuario` (leitura de dashboard, plano de contas e execuções). Ver [Segurança — Autorização](../operacao/seguranca.md#autorização-papéis).

### O SACC roda na nuvem?
Não. Por política de dados da organização, é **exclusivamente on-premise**. Ver [Escopo — Fora do escopo](./problema-e-solucao.md#fora-do-escopo).

## Operação e falhas

### O que acontece se a conexão com o ERP falhar?
A execução é marcada com `status='erro'`, registrada nos logs e (se habilitado) gera e-mail de incidente; não há retentativa automática. Ver [Comportamento em falha](../operacao/fluxo-de-execucao.md#comportamento-em-falha).

### Como investigar por que um alerta não chegou?
Comece pela tabela `logs_execucao` (houve execução? qual status? `alerta_enviado`?) e siga o roteiro em [Observabilidade](../operacao/observabilidade.md#roteiro-de-investigação-de-incidente).

## Estado do projeto

### Por que a "regra definitiva de detecção" está bloqueada?
Ela depende da criação, no ERP, de uma **view de saldos finais**. Enquanto isso, o worker usa uma lógica provisória sobre a view de movimento mensal. Ver [Estado das regras](./regras-de-negocio.md#estado-das-regras-e-impedimentos).

## Links relacionados

- [Problema e Solução](./problema-e-solucao.md) — ponto de partida recomendado.
- [Glossário](./glossario.md) — todos os termos usados aqui.
- [Regras de Negócio](./regras-de-negocio.md) — como a detecção funciona.

<!--
Checklist de revisão:
Segurança: sem IPs/hosts/credenciais/nomes reais; sem códigos contábeis reais; respostas derivadas de docs já sanitizados. OK.
Fonte da verdade: cada resposta linka a doc canônica (problema-e-solucao, regras-de-negocio, seguranca, fluxo-de-execucao, observabilidade). OK.
Editorial: siglas expandidas na 1ª ocorrência; termos linkados ao glossário; voz impessoal; data presente. OK.
Negócio: perguntas partem da dor do leitor leigo (o que faz, corrige?, quem usa). OK.
-->
