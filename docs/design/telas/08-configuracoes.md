# Tela — Configurações

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção (feature de configurações em desenvolvimento)
**Público:** desenvolvedores frontend e design

## Objetivo do documento

Especificar a tela de configurações do sistema (singleton, admin-only).

## Acesso

Rota `/configuracoes` (admin-only). Dados: `GET`/`PUT /api/configuracoes` (🟡 em desenvolvimento); trigger manual `POST /api/worker/trigger` (retorna 202).

## Layout

Formulário único em card (`max-w-2xl`), sem tabela:

```
[h1 Configurações]

[card Execução automática]
  toggle "Execução automática"           (toggle-success)
  input time "Horário da verificação"    (HH:mm, America/Sao_Paulo)
  caption "A verificação roda diariamente no horário definido (horário de Brasília)."

[card Alertas]
  toggle "Alertas de execução"
  caption "Envia e-mail aos destinatários também quando a execução falha."

[card Verificação manual]
  btn-primary Play "Executar verificação agora"
  caption "Dispara uma verificação imediata, independente do agendamento."

[rodapé: btn-outline Cancelar | btn-primary Salvar]
```

Comportamentos:
- **Toggle "Execução automática" desligado:** o campo de horário fica `disabled`; o KPI "Próxima Execução" do dashboard mostra "Desativada".
- **Salvar:** só habilitado com alterações pendentes (dirty); toast "Configurações salvas."
- **Executar agora:** botão entra em loading; resposta 202 → toast `alert-info` "Verificação iniciada. Acompanhe em Execuções." com link. Se já houver execução em andamento (409/422 do backend): toast erro "Já existe uma verificação em andamento."
- Sair com alterações não salvas: confirmação "Descartar alterações?".

## Estados

| Estado | Especificação |
| --- | --- |
| Loading | Skeleton dos cards (campos) |
| Empty | Não se aplica (singleton criado por seed); se o registro faltar, tratar como erro |
| Error | `alert-error` "Não foi possível carregar as configurações." + Tentar novamente |
| Sucesso | Formulário; toasts acima |

## Links relacionados

- [Fluxo de Execução](../../operacao/fluxo-de-execucao.md) — agendamento e trigger manual.
- [Padrões Transversais](../padroes-transversais.md) — feedback 202. · [Mockup](../mockups/configuracoes.html)

<!-- Checklist de revisão: Segurança: sem valores reais de cron/hosts. Fonte da verdade: endpoints.md (🟡), fluxo-de-execucao.md. Editorial: PT-BR. OK. -->
