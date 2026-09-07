// La perception masculiniste — interactions

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- hero: single one-shot glitch on load ---------- */
  const hero = document.getElementById('hero');
  if (hero) {
    requestAnimationFrame(() => hero.classList.add('play-glitch'));
  }

  /* ---------- mindmap page ---------- */
  const wrap = document.getElementById('mapWrap');
  if (wrap) initMindmap(wrap);

});

function initMindmap(wrap) {
  const svg = document.getElementById('mapSvg');
  const center = wrap.querySelector('.node.center');
  const orbit = Array.from(wrap.querySelectorAll('.node:not(.center)'));
  const backdrop = document.getElementById('backdrop');

  function layout() {
    const isMobile = window.matchMedia('(max-width:720px)').matches;
    if (isMobile) {
      svg.innerHTML = '';
      return;
    }

    const rect = wrap.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const radius = Math.min(rect.width, rect.height) / 2 - 90;

    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    svg.innerHTML = '';

    const n = orbit.length;
    orbit.forEach((node, i) => {
      // start at top (-90deg) and go clockwise
      const angle = (-90 + (360 / n) * i) * (Math.PI / 180);
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      node.style.left = x + 'px';
      node.style.top = y + 'px';

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
      line.dataset.node = node.dataset.node;
      svg.appendChild(line);
    });
  }

  layout();
  window.addEventListener('resize', debounce(layout, 150));

  /* ---------- panel open/close ---------- */
  function openPanel(id, nodeKey) {
    document.querySelectorAll('.panel.open').forEach(p => p.classList.remove('open'));
    const panel = document.getElementById(id);
    if (!panel) return;
    panel.classList.add('open');
    backdrop.classList.add('open');

    document.querySelectorAll('.node').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('svg line').forEach(l => l.classList.remove('lit'));
    const activeNode = wrap.querySelector(`.node[data-node="${nodeKey}"]`);
    if (activeNode) activeNode.classList.add('active');
    const activeLine = svg.querySelector(`line[data-node="${nodeKey}"]`);
    if (activeLine) activeLine.classList.add('lit');
  }

  function closePanels() {
    document.querySelectorAll('.panel.open').forEach(p => p.classList.remove('open'));
    backdrop.classList.remove('open');
    document.querySelectorAll('.node').forEach(n => n.classList.remove('active'));
    document.querySelectorAll('svg line').forEach(l => l.classList.remove('lit'));
  }

  orbit.forEach(node => {
    node.addEventListener('click', () => {
      const target = node.dataset.target;
      if (target) openPanel(target, node.dataset.node);
    });
  });

  backdrop.addEventListener('click', closePanels);
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', closePanels);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closePanels();
  });
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}
