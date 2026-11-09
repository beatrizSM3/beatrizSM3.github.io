// Tema claro/escuro
const toggle = document.getElementById('themeToggle');
if (toggle) {
  toggle.onclick = () => {
    const root = document.documentElement;
    const isDark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = isDark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
  };
}

// Ano no rodapé
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// Animação de entrada das seções
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('in'));
}

// Botão do currículo em PDF: só aparece se cv.pdf existir no site
const cvBtn = document.querySelectorAll('[data-cv]');
if (cvBtn.length) {
  fetch(cvBtn[0].getAttribute('href'), { method: 'HEAD' })
    .then((r) => { if (r.ok) cvBtn.forEach((b) => (b.hidden = false)); })
    .catch(() => {});
}

// Terminal digitando no topo da home
const term = document.getElementById('termBody');
if (term) {
  const lines = [
    ['cmd', 'whoami'],
    ['out', '<span class="k">beatriz</span> — AI engineer · CC @ UFCG'],
    ['cmd', 'cat agora.txt'],
    ['out', '→ agentes com LangGraph no <span class="w">Agents4Good</span>\n→ RAG + retrieval híbrido\n→ verificação de fatos com LLMs'],
    ['cmd', 'python evidencegraph.py --eval'],
    ['out', '<span class="d">baseline </span> macro-F1 = 0.52\n<span class="d">híbrido  </span> macro-F1 = <span class="p">0.73</span>  <span class="w">(+40%)</span>'],
    ['cmd', './contato --estagio'],
    ['out', 'aberta a oportunidades em engenharia de IA ✓'],
  ];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const prompt = '<span class="p">❯</span> ';
  let html = '';

  if (reduce) {
    lines.forEach(([t, s]) => { html += (t === 'cmd' ? prompt + s : s) + '\n'; });
    term.innerHTML = html + prompt + '<span class="caret"></span>';
  } else {
    let i = 0;
    const next = () => {
      if (i >= lines.length) { term.innerHTML = html + prompt + '<span class="caret"></span>'; return; }
      const [type, text] = lines[i++];
      if (type === 'out') {
        html += text + '\n';
        term.innerHTML = html + '<span class="caret"></span>';
        setTimeout(next, 450);
        return;
      }
      let c = 0;
      const typeChar = () => {
        term.innerHTML = html + prompt + text.slice(0, c) + '<span class="caret"></span>';
        if (c++ < text.length) setTimeout(typeChar, 35 + Math.random() * 40);
        else { html += prompt + text + '\n'; setTimeout(next, 250); }
      };
      typeChar();
    };
    setTimeout(next, 400);
  }
}
