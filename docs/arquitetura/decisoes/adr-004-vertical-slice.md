# ADR-004: Organizar o código em vertical slice em vez de camadas

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

O SACC (Sistema de Alertas Contábeis) é desenvolvido por um time pequeno, com features bem delimitadas pelo domínio (usuários, destinatários, templates, períodos, plano de contas). A organização clássica por camadas transversais (models/, controllers/, services/) espalha cada feature por vários diretórios.

## Decisão

Organizar o backend por feature ([vertical slice](../../negocio/glossario.md#vertical-slice)): cada feature vive em `app/features/{nome}/` com seus próprios `models`, `schemas`, `repository`, `service` e `router`. O frontend segue o mesmo princípio com `domain/`, `application/` e `presentation/` por feature. A feature `usuarios` é o template canônico para replicação.

## Alternativas consideradas

- **Layered architecture (camadas transversais)** — descartado: navegação por tipo de arquivo em vez de por contexto de negócio; PRs maiores e mais difíceis de revisar.

## Consequências

- ✅ Navegação por contexto: tudo de uma feature em um só lugar.
- ✅ PRs pequenos e revisáveis; features novas nascem copiando um padrão conhecido.
- ⚠️ Código utilitário genuinamente transversal exige disciplina para não ser duplicado entre slices.
- 📎 Estruturas detalhadas em [Convenções de Código](../../referencias/convencoes-de-codigo.md).

<!--
Checklist: sem dados sensíveis; baseado em 07-decisoes-arquiteturais.md e 05-convencoes-codigo.md; data não documentada na fonte. OK.
-->
