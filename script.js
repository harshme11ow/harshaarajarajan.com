(() => {
  const root = document.documentElement;
  const replay = document.getElementById('replayButton');
  const skip = document.getElementById('skipButton');
  const logStatus = document.getElementById('logStatus');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let finishTimer = null;

  // Keep the experience readable when JavaScript is disabled or reduced motion is requested.
  function finish() {
    clearTimeout(finishTimer);
    root.classList.remove('intro-running');
    // Trigger a fresh entrance animation for subsequent replays.
    root.classList.remove('intro-complete');
    void document.body.offsetWidth;
    root.classList.add('intro-complete');
    logStatus.textContent = 'READY';
    skip.setAttribute('aria-hidden', 'true');
    skip.tabIndex = -1;
  }

  function start() {
    clearTimeout(finishTimer);
    root.classList.remove('intro-complete', 'intro-running');
    if (reduceMotion.matches) {
      finish();
      return;
    }
    // Force a new animation timeline when replaying.
    void document.body.offsetWidth;
    root.classList.add('intro-running');
    logStatus.textContent = 'BOOTING';
    skip.removeAttribute('aria-hidden');
    skip.tabIndex = 0;
    finishTimer = setTimeout(finish, 1120);
  }

  replay.addEventListener('click', start);
  skip.addEventListener('click', finish);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && root.classList.contains('intro-running')) finish();
    if ((event.key === 'r' || event.key === 'R') && !event.altKey && !event.ctrlKey && !event.metaKey &&
      !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) start();
  });
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', () => reduceMotion.matches && finish());
  start();
})();
