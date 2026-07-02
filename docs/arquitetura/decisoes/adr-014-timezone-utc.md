# ADR-014: Armazenar timestamps em UTC e renderizar no fuso local

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

O SACC (Sistema de Alertas Contábeis) registra execuções, auditoria e eventos de autenticação — tudo com carimbo de tempo. O público (área contábil brasileira) raciocina no horário de Brasília, mas armazenar horário local convida a ambiguidades.

## Decisão

Todo timestamp no banco é `TIMESTAMPTZ` em UTC. A renderização acontece em `America/Sao_Paulo` no frontend e nos e-mails. O cron do APScheduler é configurado com timezone explícito.

## Alternativas consideradas

- **Armazenar em horário local** — descartado: ambíguo e frágil (a fonte registra a decisão pelo UTC; alternativas detalhadas não documentadas).

## Consequências

- ✅ Comparações e ordenações de tempo sem ambiguidade em todo o sistema.
- ✅ Horário do worker previsível para o negócio ("07:00 de Brasília"), independente do relógio do servidor.
- 📎 Convenção aplicada a todas as tabelas — ver [Modelo de Dados](../modelo-de-dados.md).

<!--
Checklist: sem dados sensíveis; baseado em 07-decisoes-arquiteturais.md; data não documentada na fonte. OK.
-->
