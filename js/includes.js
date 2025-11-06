(async function () {
  async function loadInclude(el) {
    const url = el.getAttribute('data-include');
    if (!url) return;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      el.innerHTML = await res.text();
      el.removeAttribute('data-include'); // evitar recarga infinita
    } catch (err) {
      console.error('Include error:', url, err);
    }
  }

  async function processIncludes() {
    const nodes = Array.from(document.querySelectorAll('[data-include]'));
    if (nodes.length === 0) return;
    for (const el of nodes) {
      await loadInclude(el);
    }
    // si se insertaron nuevos includes dentro de los partials, procesarlos también
    if (document.querySelector('[data-include]')) {
      await processIncludes();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', processIncludes);
  } else {
    processIncludes();
  }
})();