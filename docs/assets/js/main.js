/* SACC Docs — navegação e renderização de markdown.
   Os arquivos .md continuam sendo a fonte única; pagina.html?doc=<caminho> renderiza no navegador. */

// Árvore da documentação (caminhos relativos à pasta docs/)
const ARVORE_DOCS = [
  { secao: 'Negócio', itens: [
    ['negocio/problema-e-solucao.md', 'Problema e Solução'],
    ['negocio/glossario.md', 'Glossário'],
    ['negocio/regras-de-negocio.md', 'Regras de Negócio'],
    ['negocio/faq.md', 'FAQ'],
  ]},
  { secao: 'Arquitetura', itens: [
    ['arquitetura/visao-geral.md', 'Visão Geral'],
    ['arquitetura/modelo-de-dados.md', 'Modelo de Dados'],
    ['arquitetura/integracoes.md', 'Integrações'],
    ['arquitetura/decisoes/index.md', 'Decisões (ADRs)'],
  ]},
  { secao: 'Operação', itens: [
    ['operacao/fluxo-de-execucao.md', 'Fluxo de Execução'],
    ['operacao/observabilidade.md', 'Observabilidade'],
    ['operacao/seguranca.md', 'Segurança'],
  ]},
  { secao: 'Referências', itens: [
    ['referencias/endpoints.md', 'Endpoints da API'],
    ['referencias/convencoes-de-codigo.md', 'Convenções de Código'],
    ['changelog.md', 'Changelog'],
  ]},
  { secao: 'Design', itens: [
    ['design/index.md', 'Visão Geral do Design'],
    ['design/design-system.md', 'Design System'],
    ['design/padroes-transversais.md', 'Padrões Transversais'],
    ['design/componentes.md', 'Componentes'],
    ['design/telas/01-dashboard.md', 'Tela: Dashboard'],
    ['design/telas/02-execucoes.md', 'Tela: Execuções'],
    ['design/telas/03-plano-de-contas.md', 'Tela: Plano de Contas'],
    ['design/telas/04-destinatarios.md', 'Tela: Destinatários'],
    ['design/telas/05-templates-email.md', 'Tela: Templates de E-mail'],
    ['design/telas/06-usuarios.md', 'Tela: Usuários'],
    ['design/telas/07-auditoria.md', 'Tela: Auditoria'],
    ['design/telas/08-configuracoes.md', 'Tela: Configurações'],
    ['design/telas/09-login.md', 'Tela: Login'],
    ['design/email/template-alerta.md', 'E-mail de Alerta'],
  ]},
];

// Menu superior: primeira página de cada seção
const NAV_TOPO = [
  ['index.html', 'Início'],
  ['pagina.html?doc=negocio/problema-e-solucao.md', 'Negócio'],
  ['pagina.html?doc=arquitetura/visao-geral.md', 'Arquitetura'],
  ['pagina.html?doc=operacao/fluxo-de-execucao.md', 'Operação'],
  ['pagina.html?doc=referencias/endpoints.md', 'Referências'],
  ['pagina.html?doc=design/index.md', 'Design'],
];

function docAtual() {
  return new URLSearchParams(location.search).get('doc') || '';
}

function montarHeader() {
  const nav = document.getElementById('site-nav');
  if (!nav) return;
  const doc = docAtual();
  nav.innerHTML = '<ul>' + NAV_TOPO.map(([href, rotulo]) => {
    const secaoDoDoc = doc && href.includes('doc=') && ARVORE_DOCS.some(g =>
      g.secao === rotuloParaSecao(rotulo) && g.itens.some(([p]) => p === doc));
    const ativo = (rotulo === 'Início' && !doc && !location.pathname.endsWith('pagina.html')) || secaoDoDoc;
    return `<li><a href="${href}" class="${ativo ? 'ativo' : ''}">${rotulo}</a></li>`;
  }).join('') + '</ul>';

  const btn = document.querySelector('.nav-toggle');
  if (btn) btn.addEventListener('click', () => {
    const aberto = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!aberto));
    nav.classList.toggle('open');
  });
}

function rotuloParaSecao(rotulo) {
  return rotulo === 'Referências' ? 'Referências' : rotulo;
}

function montarSidebar() {
  const el = document.getElementById('sidebar');
  if (!el) return;
  const doc = docAtual();
  el.innerHTML = ARVORE_DOCS.map(grupo =>
    `<h4>${grupo.secao}</h4><ul>` +
    grupo.itens.map(([caminho, titulo]) =>
      `<li><a href="pagina.html?doc=${caminho}" class="${caminho === doc ? 'ativo' : ''}">${titulo}</a></li>`
    ).join('') + '</ul>'
  ).join('');
}

// Resolve um link relativo ao documento atual (ex.: ../operacao/seguranca.md a partir de design/index.md)
function resolverCaminho(base, rel) {
  const pilha = base.split('/').slice(0, -1);
  for (const parte of rel.split('/')) {
    if (parte === '..') pilha.pop();
    else if (parte !== '.' && parte !== '') pilha.push(parte);
  }
  return pilha.join('/');
}

async function carregarDoc() {
  const artigo = document.getElementById('conteudo');
  if (!artigo) return;
  const doc = docAtual();
  // Whitelist estrita: só caminho relativo simples dentro de docs/ (bloqueia URLs externas,
  // protocol-relative "//", "..", "\" e querystrings — evita XSS por markdown de origem externa).
  if (!doc || !/^[a-zA-Z0-9][a-zA-Z0-9/_.-]*\.md$/.test(doc) || doc.includes('..') || doc.includes('//')) {
    artigo.innerHTML = '<p class="erro-doc">Documento não informado ou inválido. Volte ao <a href="index.html">início</a>.</p>';
    return;
  }
  artigo.innerHTML = '<p class="carregando">Carregando documento…</p>';
  try {
    const resp = await fetch(doc, { cache: 'no-cache' });
    if (!resp.ok) throw new Error(resp.status);
    let md = await resp.text();
    // Remove o comentário de checklist de revisão do rodapé
    md = md.replace(/<!--[\s\S]*?-->\s*$/m, '');
    // Sanitização (defesa em profundidade): remove scripts/handlers de eventual HTML embutido no markdown
    const html = marked.parse(md);
    artigo.innerHTML = window.DOMPurify ? DOMPurify.sanitize(html) : html;

    // Título da aba
    const h1 = artigo.querySelector('h1');
    if (h1) document.title = h1.textContent + ' — SACC Docs';

    // Reescreve links relativos: .md → visualizador; demais → caminho resolvido
    artigo.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      if (/^(https?:|mailto:|#)/.test(href)) return;
      const [caminho, ancora] = href.split('#');
      const resolvido = resolverCaminho(doc, caminho);
      if (resolvido.endsWith('.md')) {
        a.setAttribute('href', 'pagina.html?doc=' + resolvido + (ancora ? '#' + ancora : ''));
      } else {
        a.setAttribute('href', resolvido + (ancora ? '#' + ancora : ''));
      }
    });

    // Tabelas com rolagem horizontal
    artigo.querySelectorAll('table').forEach(t => {
      const wrap = document.createElement('div');
      wrap.className = 'tabela-scroll';
      t.parentNode.insertBefore(wrap, t);
      wrap.appendChild(t);
    });

    // Blocos mermaid
    const blocosMermaid = artigo.querySelectorAll('pre code.language-mermaid');
    if (blocosMermaid.length && window.mermaid) {
      blocosMermaid.forEach(code => {
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = code.textContent;
        code.closest('pre').replaceWith(div);
      });
      mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme: 'neutral' });
      mermaid.run({ nodes: artigo.querySelectorAll('.mermaid') });
    }

    // Âncora da URL após renderizar
    if (location.hash) {
      try {
        const alvo = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (alvo) alvo.scrollIntoView();
      } catch (_) { /* âncora malformada: ignora */ }
    }
  } catch (e) {
    artigo.innerHTML = '<p class="erro-doc">Não foi possível carregar o documento (' + doc + ').<br>' +
      'Se estiver abrindo localmente, sirva a pasta com um servidor: <code>python -m http.server</code> dentro de <code>docs/</code>.</p>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  montarHeader();
  montarSidebar();
  carregarDoc();
});
