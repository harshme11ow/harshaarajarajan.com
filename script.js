/*
  Harshaa's - Original's | Retro startup placeholder
  Plain browser JavaScript. No React, Node.js server, CDN, or dependencies.
  Keyboard: R = replay, Escape = skip.
*/
(() => {
  'use strict';

  const machine = document.querySelector('.machine');
  const lines = [...document.querySelectorAll('.log-line')];
  const statusLabel = document.getElementById('statusLabel');
  const progressText = document.getElementById('progressText');
  const progressFill = document.getElementById('progressFill');
  const footerMessage = document.getElementById('footerMessage');
  const skipButton = document.getElementById('skipButton');
  const rebootButton = document.getElementById('rebootButton');
  const clock = document.getElementById('clock');

  let activeTimers = [];
  let cycleId = 0;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function schedule(callback, delay, cycle) {
    const timerId = window.setTimeout(() => {
      if (cycle === cycleId) callback();
    }, delay);
    activeTimers.push(timerId);
  }

  function cancelTimers() {
    activeTimers.forEach(clearTimeout);
    activeTimers = [];
  }

  function updateProgress(amount) {
    progressText.textContent = amount + '%';
    progressFill.style.width = amount + '%';
  }

  function ready() {
    cancelTimers();
    cycleId++;
    lines.forEach(line => line.classList.add('shown'));
    machine.dataset.state = 'ready';
    statusLabel.textContent = 'DEVELOPMENT MODE';
    footerMessage.innerHTML = '&gt; SYSTEM ONLINE <span class="blink">█</span> &nbsp; // &nbsp; LAUNCH DATE: TBD';
    updateProgress(100);
    skipButton.hidden = true;
    skipButton.setAttribute('aria-hidden', 'true');
  }

  function boot() {
    cancelTimers();
    cycleId++;
    const cycle = cycleId;
    machine.dataset.state = 'off';
    statusLabel.textContent = 'INITIALIZING';
    footerMessage.innerHTML = '&gt; INITIALIZING STARTUP SEQUENCE<span class="blink">█</span>';
    updateProgress(0);
    lines.forEach(line => line.classList.remove('shown'));
    skipButton.hidden = false;
    skipButton.removeAttribute('aria-hidden');

    if (reducedMotion.matches) {
      ready();
      return;
    }
    // Two animation frames ensure the CSS power-on animation restarts on replay.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (cycle !== cycleId) return;
      machine.dataset.state = 'booting';
      const checkpoints = [
        [500, 0, 12],
        [740, 1, 29],
        [980, 2, 54],
        [1220, 3, 77],
        [1500, 4, 94]
      ];
      checkpoints.forEach(([delay, index, percent]) => {
        schedule(() => {
          lines[index].classList.add('shown');
          updateProgress(percent);
        }, delay, cycle);
      });
      schedule(() => ready(), 1950, cycle);
    }));
  }

  function refreshClock() {
    const date = new Date();
    clock.textContent = date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false});
  }

  rebootButton.addEventListener('click', boot);
  skipButton.addEventListener('click', ready);
  document.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.repeat) return;
    if (event.key.toLowerCase() === 'r' && !['INPUT','TEXTAREA'].includes(document.activeElement?.tagName)) boot();
    if (event.key === 'Escape' && machine.dataset.state !== 'ready') ready();
  });
  reducedMotion.addEventListener?.('change', () => {
    if (reducedMotion.matches && machine.dataset.state !== 'ready') ready();
  });
  refreshClock();
  window.setInterval(refreshClock, 1000);
  boot();
})();
