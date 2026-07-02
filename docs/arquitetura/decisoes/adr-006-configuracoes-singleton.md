# ADR-006: Guardar configurações do sistema em tabela singleton com efeito em runtime

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

O horário do worker e os toggles de automação/alertas são configuração global do SACC (Sistema de Alertas Contábeis): existe exatamente **um** valor vigente de cada. Originalmente o horário do cron vivia em variável de ambiente, o que exigia acesso ao servidor e restart para alterar — inadequado para uma configuração que a administração deve poder mudar pela interface.

## Decisão

Criar a tabela `configuracoes_sistema` como [singleton](../../negocio/glossario.md#singleton-contexto-de-banco-de-dados): constraint `UNIQUE` sobre uma coluna booleana `singleton` permite apenas uma linha, semeada via migration.

Aplicação da configuração **em runtime**, sem restart:
- Mudança de horário → reagendamento do job no APScheduler.
- Toggle "Execução Automática" desligado → o job continua agendado, mas verifica a flag e retorna cedo.
- Toggle "Alertas de Execução" desligado → suprime apenas o e-mail de incidente; o log estruturado é mantido.
- O trigger manual do worker **ignora** o toggle de execução automática — o administrador sempre pode disparar manualmente.

## Alternativas consideradas

- **Configuração via variáveis de ambiente** — estado anterior; descartado como solução definitiva por exigir restart e acesso ao servidor (permanece como dívida transitória até a feature entrar).

## Consequências

- ✅ Administração muda cadência e toggles pela interface, com efeito imediato e auditado.
- ✅ Constraint impede duplicação acidental da linha de configuração.
- ⚠️ Feature ainda **em desenvolvimento** — até lá, o horário do cron segue lido do ambiente.
- 📎 Estrutura no [Modelo de Dados](../modelo-de-dados.md); comportamento do worker em [Fluxo de Execução](../../operacao/fluxo-de-execucao.md).

<!--
Checklist: sem dados sensíveis; baseado em 07-decisoes-arquiteturais.md e 06-estado-features.md; data não documentada na fonte. OK.
-->
