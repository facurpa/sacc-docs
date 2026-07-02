# ADR-005: Tratar o ERP como fonte única do plano de contas

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

A [detecção de virada](../../negocio/regras-de-negocio.md) compara o lado do saldo de cada conta com a [natureza](../../negocio/glossario.md#natureza-dc) esperada, registrada no plano de contas. O plano do grupo tem ~857 [contas analíticas](../../negocio/glossario.md#conta-analítica) em 11 empresas. Cadastrar e manter isso manualmente na interface é inviável, e manter fonte dupla (manual + ERP) criaria conflitos e desatualização — exatamente o tipo de erro que o SACC (Sistema de Alertas Contábeis) existe para evitar.

## Decisão

Todo dado do plano de contas vem por sincronização com uma view de plano de contas do ERP (Enterprise Resource Planning). **Nenhum cadastro manual pela interface.** A tela de plano de contas passa a ser somente leitura.

## Alternativas consideradas

- **Cadastro manual pela interface** — descartado: inviável na escala do plano e sujeito a divergência com o ERP.
- **Campo `origem` distinguindo manual vs. ERP** (e o tratamento de conflitos correspondente) — descartado: sem cadastro manual, não há conflito a tratar.
- **Importação via upload de planilha** — descartado: desnecessário com sincronização automática.

## Consequências

- ✅ Uma única fonte de verdade; o gabarito da detecção reflete o ERP.
- ✅ Modelo mais simples (sem campo de origem, sem resolução de conflitos).
- ⚠️ A qualidade da detecção depende da view do ERP e da execução periódica do sync.
- ⚠️ A feature de CRUD manual existente será refeita como somente leitura (dívida transitória registrada).
- 📎 Depende da view de plano de contas do ERP ([Integrações](../integracoes.md)) e da feature de sincronização (bloqueada/em desenvolvimento — ver [Endpoints](../../referencias/endpoints.md)).

<!--
Checklist: sem nomes reais de views/tabelas do ERP; contagens conforme fonte; baseado em 07-decisoes-arquiteturais.md; data não documentada na fonte. OK.
-->
