// 1) Indicador de seção atual no menu.
// 2) Botão "Copiar número" (só aparece com JavaScript ativo).

(() => {
  const revealTargets = document.querySelectorAll('.hero, .hero__content, .hero__photo, .section, .course, .entry, .statement, .duo > div, .facts, .site-footer p');

  if (revealTargets.length && 'IntersectionObserver' in window) {
    revealTargets.forEach((element, index) => {
      element.classList.add('reveal');
      element.style.setProperty('--reveal-delay', `${index * 35}ms`);
    });

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -3% 0px'
    });

    revealTargets.forEach((element) => observer.observe(element));
  } else {
    revealTargets.forEach((element) => element.classList.add('reveal', 'is-visible'));
  }
})();

(() => {
  const links = [...document.querySelectorAll('.site-nav a')];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  if (!sections.length) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const line = window.innerHeight * 0.4;
    const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    let current = sections[0];
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= line) current = section;
    }
    if (atEnd) current = sections[sections.length - 1];

    links.forEach((link) => {
      const active = link.getAttribute('href') === `#${current.id}`;
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();

(() => {
  const button = document.getElementById('copiar');
  const number = document.getElementById('telefone');
  const status = document.getElementById('copiar-status');
  if (!button || !number) return;

  const label = button.textContent;
  button.hidden = false;

  const announce = (message) => {
    button.textContent = message;
    if (status) status.textContent = message;
    setTimeout(() => {
      button.textContent = label;
      if (status) status.textContent = '';
    }, 2000);
  };

  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(number.textContent.trim());
      announce('Copiado');
    } catch {
      // Sem permissão: seleciona o número para copiar manualmente.
      const range = document.createRange();
      range.selectNodeContents(number);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      announce('Número selecionado');
    }
  });
})();
