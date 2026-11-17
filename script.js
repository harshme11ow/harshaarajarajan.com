'use strict';
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

// A deliberately subtle easter egg. Off by default for readability.
const crtButton = $('#crt-toggle');
crtButton.addEventListener('click', () => {
  const isOn = document.body.classList.toggle('crt-on');
  crtButton.setAttribute('aria-pressed', String(isOn));
  crtButton.textContent = isOn ? '▦ CRT: ON' : '▦ CRT: OFF';
});

const menuButton = $('#mobile-menu-button');
const menu = $('#mobile-nav');
menuButton.addEventListener('click', () => {
  const nextOpen = menu.hasAttribute('hidden');
  menu.toggleAttribute('hidden', !nextOpen);
  menuButton.setAttribute('aria-expanded', String(nextOpen));
});
$$('.mobile-nav a').forEach((link) => link.addEventListener('click', () => {
  menu.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
}));

// Filters are real, even before separate project pages have been written.
$$('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  $$('[data-filter]').forEach((candidate) => {
    const active = candidate === button;
    candidate.classList.toggle('is-active', active);
    candidate.setAttribute('aria-pressed', String(active));
  });
  $$('[data-project]').forEach((card) => {card.hidden = filter !== 'all' && card.dataset.type !== filter;});
}));

const projects = {
  satellite: {id:'001 / HARDWARE', title:'Small Satellite Research Lab', description:'Your work on UGA Small Satellite Research Laboratory projects including BoBa and MEME-Sat. The final case study should specify what you built, your own engineering decisions, and what you tested. Avoid sharing any restricted team documentation.'},
  formula: {id:'002 / HARDWARE', title:'Formula EV Electronics', description:'PCB work for brake and acceleration encoder systems and electronic throttle control with UGA Motorsports. Include design constraints, board screenshots, testing methods, and lessons learned once you have approved material.'},
  obd: {id:'003 / HARDWARE', title:'Accord Telemetry', description:'An experiment using ESP32 and OBD-II / CAN information to create vehicle-facing readouts. The current illustration is a conceptual display, not a claim of verified real-time vehicle measurements.'},
  transcribbl: {id:'004 / SOFTWARE', title:'Transcribbl', description:'A Windows utility concept for extracting handwritten information from repeated form layouts into spreadsheets. Demonstrate the workflow, architecture, and recognition limitations with sample or anonymized data.'}
};
const dialog = $('#project-dialog');
let lastFocusedElement;
$$('[data-project]').forEach((card) => card.addEventListener('click', () => {
  const project = projects[card.dataset.project];
  lastFocusedElement = card;
  $('#dialog-id').textContent = project.id;
  $('#dialog-title').textContent = project.title;
  $('#dialog-description').textContent = project.description;
  dialog.showModal();
}));
const closeDialog = () => { dialog.close(); lastFocusedElement?.focus(); };
$('#dialog-close').addEventListener('click', closeDialog);
$('#dialog-done').addEventListener('click', closeDialog);
dialog.addEventListener('click', (event) => { if (event.target === dialog) closeDialog(); });

const ideas = [
  'Could a tiny OLED become a dashboard for something ridiculous?',
  'What does a failed PCB prototype teach that a working board cannot?',
  'Could an old Raspberry Pi run a miniature mission-control room?',
  'How tiny can a useful CAN-bus diagnostic display get?',
  'What if a personal website behaved like an old engineering workstation?',
  'Can one weekend project become a useful tool for someone else?'
];
let ideaIndex = 0;
$('#idea-button').addEventListener('click', () => {
  ideaIndex = (ideaIndex + 1) % ideas.length;
  $('#terminal-output').textContent = "Today's rabbit hole: " + ideas[ideaIndex];
});
$('#year').textContent = String(new Date().getFullYear());


// Motion: visible-by-default until JS enables progressive enhancement.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const reveals = $$('.reveal');
if (!reduceMotion.matches && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('enhanced-motion');
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      observer.unobserve(entry.target);
    }
  }), {threshold: 0.04, rootMargin: '0px 0px 90px 0px'});
  reveals.forEach(el => observer.observe(el));
} else { reveals.forEach(el => el.classList.add('revealed')); }

const scanButton = $('#scan-toggle');
scanButton.addEventListener('click', () => {
  const paused = document.body.classList.toggle('scan-paused');
  scanButton.setAttribute('aria-pressed', String(!paused));
  scanButton.textContent = paused ? '◉ SCAN: OFF' : '◉ SCAN: ON';
});

const progressBar = $('#scroll-progress');
const heroArt = $('#hero-art');
let frameQueued = false;
const updateScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = max > 0 ? Math.min(1, window.scrollY/max) : 0;
  progressBar.style.transform = `scaleX(${fraction})`;
  if (!reduceMotion.matches && window.innerWidth >= 900) {
    const shift = Math.max(-22, Math.min(44, window.scrollY * .085));
    heroArt.style.setProperty('--hero-shift', `${shift}px`);
  }
  frameQueued = false;
};
window.addEventListener('scroll', () => {
  if (!frameQueued) { frameQueued = true; requestAnimationFrame(updateScroll); }
}, {passive:true});
window.addEventListener('resize', updateScroll);
updateScroll();
