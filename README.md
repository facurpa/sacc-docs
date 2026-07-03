# SACC — Sistema de Alertas Contábeis

Sistema interno da Cast Informática que **monitora contas contábeis no ERP TOTVS Protheus**, detecta [saldos invertidos](docs/negocio/glossario.md#saldo-invertido-virada) (as "viradas") e **dispara alertas por e-mail** para a área contábil. Substitui uma verificação manual e semanal, encurtando de até 7 dias para 1 dia a janela entre o erro no ERP e a detecção.

> [!NOTE]
> Este repositório contém **apenas a documentação pública** do projeto (sanitizada). Não há código-fonte aqui.

## 📖 Documentação

**A documentação completa está em [`docs/`](docs/index.md).** Comece pelo hub:

➡️ **[Abrir a documentação](docs/index.md)**

Trilhas rápidas por perfil:

| Se você é… | Comece por |
|---|---|
| **Negócio / novo no projeto** | [Problema e Solução](docs/negocio/problema-e-solucao.md) → [Glossário](docs/negocio/glossario.md) |
| **Desenvolvedor** | [Visão Geral da Arquitetura](docs/arquitetura/visao-geral.md) → [Convenções de Código](docs/referencias/convencoes-de-codigo.md) |
| **Administrador técnico** | [Segurança](docs/operacao/seguranca.md) → [Fluxo de Execução](docs/operacao/fluxo-de-execucao.md) |

Com dúvidas? Veja a [FAQ](docs/negocio/faq.md).

## Estado do projeto

Em **desenvolvimento ativo, pré-produção**. Legenda: ✅ concluído · 🟡 em curso · 🔴 bloqueado por dependência externa · ⏳ planejado.

- ✅ Autenticação local, CRUDs administrativos, worker de detecção (lógica provisória), auditoria, dashboard.
- 🟡 Configurações do sistema, sincronização do plano de contas com o ERP, propagação de `request_id`.
- 🔴 Regra definitiva de detecção — aguarda uma view de saldos finais no ERP.

Detalhes em [Estado do projeto](docs/index.md#estado-do-projeto).

## Como esta documentação é servida

Markdown estático publicado via **GitHub Pages** (a raiz redireciona para `docs/`). Não há gerador de site — os arquivos são lidos diretamente no GitHub ou no Pages.
