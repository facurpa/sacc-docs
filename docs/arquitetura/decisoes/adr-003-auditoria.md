# ADR-003: Unificar auditoria de domínio em `audit_log` e manter `auth_eventos` separada

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

O SACC (Sistema de Alertas Contábeis) altera configurações que afetam alertas contábeis — quem recebe, quando roda, o que é monitorado. Para sustentação e compliance, toda ação administrativa e toda execução do worker precisam ser rastreáveis. Ao mesmo tempo, eventos de sessão (login, falha, lockout) têm cadência e detalhamento (IP, user agent) muito diferentes das ações de domínio.

## Decisão

Manter **duas** trilhas de auditoria:
- `audit_log` — única para ações de domínio (CRUDs e execuções), com diff em JSONB contendo **apenas os campos alterados**.
- `auth_eventos` — separada, para eventos de segurança.

A interceptação é **manual**: cada repository chama explicitamente o serviço de auditoria dentro da mesma transação da mutação.

## Alternativas consideradas

- **Tabela única para tudo** — descartado: eventos de sessão poluiriam a tela de auditoria de domínio.
- **Listeners automáticos do ORM (SQLAlchemy)** — descartado: mais "mágicos", menos auditáveis; a chamada explícita torna o registro visível no código.
- **Diff com estado completo** — descartado em favor do diff só de campos alterados.

## Consequências

- ✅ Tela de auditoria de domínio limpa e legível; trilha de segurança dedicada.
- ✅ Registro de auditoria atômico com a operação (mesma transação).
- ⚠️ Disciplina manual: cada novo repository precisa lembrar de registrar o evento — não há rede de segurança automática.
- 📎 Estrutura das tabelas no [Modelo de Dados](../modelo-de-dados.md); uso na investigação de incidentes em [Observabilidade](../../operacao/observabilidade.md).

<!--
Checklist: sem dados sensíveis; baseado em 07-decisoes-arquiteturais.md; data da decisão não documentada na fonte. OK.
-->
