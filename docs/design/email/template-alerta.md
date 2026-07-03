# Template de E-mail — Alerta de Contas Viradas

**Última atualização:** 02/07/2026
**Versão do documento:** v1
**Estado do projeto refletido:** desenvolvimento ativo, pré-produção
**Público:** desenvolvedores frontend e design

## Objetivo do documento

Especificar o design HTML do e-mail de alerta de viradas — o único ponto de contato da especialista contábil com o SACC (Sistema de Alertas Contábeis), já que ela não usa a UI.

## Contexto de negócio

O e-mail precisa comunicar em segundos: houve virada, em quais contas, e o que se espera de cada uma. É lido em clientes corporativos (Outlook inclusive), portanto: **HTML de tabelas, CSS 100% inline, sem JavaScript, largura fixa 600 px, sem webfonts** (fallback `Arial, Helvetica, sans-serif`).

## Estrutura (arquivo de referência: [template-alerta.html](./template-alerta.html))

1. **Header:** faixa `#0F172A` (mesmo azul-escuro da sidebar), texto "SACC" em `#38BDF8` + "Sistema de Alertas Contábeis · Cast Informática" em branco. Sem imagens/logo por enquanto (evita bloqueio de imagens); substituível por logo hospedado quando houver.
2. **Título e resumo:** "⚠ {{qtd_viradas}} conta(s) com saldo invertido" em `#B91C1C`; parágrafo com empresa e data da execução ({{empresa}}, {{data_execucao}} em horário de Brasília).
3. **Tabela de viradas** (`{{tabela_viradas}}`): colunas Conta, Descrição, Natureza esperada, Lado atual. Cabeçalho fundo `#F1F5F9`; célula "Lado atual" com texto `#B91C1C` em negrito — versão estática do padrão `NaturezaVirada` (esperada → atual). Zebra sutil `#F8FAFC`.
4. **CTA opcional:** botão-tabela "Abrir o SACC" (fundo `#155E75`, texto branco, cantos 6 px) apontando para a URL interna do sistema — incluir apenas se a URL for acessível aos destinatários.
5. **Rodapé:** texto `#64748B` 12 px — "E-mail automático do SACC. A correção dos lançamentos é feita diretamente no ERP." + data/hora de envio.

## Variáveis do template (TipTap)

| Variável | Conteúdo |
| --- | --- |
| `{{empresa}}` | Empresa/filial da execução |
| `{{data_execucao}}` | `dd/mm/aaaa HH:mm` (America/Sao_Paulo) |
| `{{qtd_viradas}}` | Total de contas viradas |
| `{{tabela_viradas}}` | Tabela HTML pronta, gerada pelo worker |

## Compatibilidade

- Layout inteiro em `<table role="presentation">` aninhadas; nada de flex/grid.
- Cores em hex; estilos inline em cada elemento (sem `<style>` dependente, exceto reset básico).
- Testar em Outlook desktop, Outlook web e Gmail antes de ativar.

## Acessibilidade

- **Não depender de cor:** a coluna "Lado atual" combina cor `#B91C1C` **e** negrito **e** o rótulo textual do lado — a virada é legível mesmo sem enxergar a cor.
- **Contraste:** conferir que os textos (inclusive rodapé `#64748B` 12 px e título `#B91C1C`) atingem contraste AA sobre o fundo.
- **Assunto e pré-cabeçalho** devem resumir o alerta (ex.: "SACC — {{qtd_viradas}} conta(s) com saldo invertido"), para leitura na lista de e-mails.
- Definir `lang="pt-BR"` no HTML e `alt` descritivo em qualquer imagem/logo que venha a ser adicionada.

## Links relacionados

- [Tela Templates de E-mail](../telas/05-templates-email.md) — onde o template é editado.
- [Padrões Transversais](../padroes-transversais.md#natureza-dc-e-virada--componente-naturezavirada) — o padrão esperada → atual.

<!-- Checklist de revisão: Segurança: variáveis genéricas, sem URLs internas reais. Fonte da verdade: ADR-010, fluxo-de-execucao.md. Editorial: PT-BR. OK. -->
