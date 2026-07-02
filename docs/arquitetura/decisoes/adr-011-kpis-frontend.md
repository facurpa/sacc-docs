# ADR-011: Manter cálculo de KPIs no frontend (dívida técnica aceita)

**Status:** Aceito
**Data:** DD/MM/AAAA

## Contexto

O dashboard do SACC (Sistema de Alertas Contábeis) exibe [KPI cards](../../negocio/glossario.md#kpi-cards) (Contas Viradas, Alertas Enviados, Próxima Execução, Integridade) calculados no frontend a partir de múltiplas consultas. Debateu-se criar um endpoint agregador no backend.

## Decisão

Manter o cálculo de KPIs (Key Performance Indicators) no frontend. Não criar endpoint agregador agora: o MVP funciona e o refactor seria prematuro — o custo não se paga no estágio atual.

**Dívida técnica registrada (aceita conscientemente):**
1. Lógica de KPI espalhada em cinco hooks.
2. JOIN client-side entre logs e plano de contas (lento com histórico grande).
3. Horário do cron duplicado em variável de ambiente do frontend (viola fonte única — o valor mora no backend).
4. Health check sempre responde "ok" sem testar dependências.
5. O hook de logs das últimas 24h filtra sobre os últimos 50 registros no frontend (falha se houver mais de 50 execuções em 24h).

**Gatilhos de reavaliação:** o próximo KPI a entrar no dashboard, ou o primeiro incidente em produção.

## Alternativas consideradas

- **Endpoint agregador no backend** — descartado por ora: refactor prematuro para o estágio do produto.

## Consequências

- ✅ Time segue entregando features de maior valor; dashboard funcional já hoje.
- ⚠️ Cinco itens de dívida conhecidos e documentados, com condições explícitas de reavaliação.
- 📎 Dívidas correlatas listadas também em [Endpoints](../../referencias/endpoints.md) (health checks).

<!--
Checklist: sem dados sensíveis (nome exato da env var do front omitido); baseado em 07-decisoes-arquiteturais.md; data não documentada na fonte. OK.
-->
