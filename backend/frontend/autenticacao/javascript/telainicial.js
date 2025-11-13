/* Autoria: Alycia */

/* Relógio  */
(function startClock() {
  const hour = document.querySelector('.hand.hour');
  const minute = document.querySelector('.hand.minute');
  const second = document.querySelector('.hand.second');

  if (!hour || !minute || !second) return;

  const tick = () => {
    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;
    second.style.transform = `translate(-50%,-90%) rotate(${s * 6}deg)`;
    minute.style.transform = `translate(-50%,-90%) rotate(${m * 6}deg)`;
    hour.style.transform = `translate(-50%,-90%) rotate(${h * 30}deg)`;
  };

  tick();
  setInterval(tick, 1000);
})();

/* Pôster */
(function posterAutoDetect() {
  const img = document.getElementById('posterImg');
  const hint = document.getElementById('posterHint');
  if (!img || !hint) return;

  img.addEventListener('load', () => { hint.style.display = 'none'; });
  img.addEventListener('error', () => { hint.style.display = 'flex'; });

  if (img.complete && img.naturalWidth > 0) {
    hint.style.display = 'none';
  }
})();

/* Partículas de giz */
(function chalkParticles() {
  const board = document.querySelector('.blackboard');
  const layer = document.querySelector('.chalk-layer');
  if (!board || !layer) return;

  let last = 0;
  const RATE = 1000 / 60;
  const PARTICLES = 4;

  const spawn = (x, y) => {
    for (let i = 0; i < PARTICLES; i++) {
      const p = document.createElement('span');
      p.className = 'chalk';
      p.style.left = x + 'px';
      p.style.top = y + 'px';

      const dx = (Math.random() - .5) * 36;
      const dy = - (Math.random() * 28 + 8);

      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.setProperty('--life', (600 + Math.random() * 700) + 'ms');

      const s = 0.7 + Math.random() * 0.6;
      p.style.transform = `translate(-50%,-50%) scale(${s})`;
      layer.appendChild(p);
      p.addEventListener('animationend', () => p.remove(), { once: true });
    }
  };

  const pointOnBoard = (clientX, clientY) => {
    const rect = board.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
    return { x, y };
  };

  const move = (clientX, clientY) => {
    const now = performance.now();
    if (now - last < RATE) return;
    last = now;

    const pt = pointOnBoard(clientX, clientY);
    if (!pt) return;
    spawn(pt.x, pt.y);
  };

  board.addEventListener('pointermove', (e) => move(e.clientX, e.clientY));
  board.addEventListener('pointerdown', (e) => move(e.clientX, e.clientY));

  board.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) move(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  board.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) move(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
})();

/* Botão Login */
(function loginButtonRedirect() {
  const btnLogin = document.getElementById("btnLogin");

  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      // Caminho correto SEM baseURL
      window.location.href = "/auth/html/login.html";
    });
  }
})();

/* Botão Cadastro */
(function cadastroButtonRedirect() {
  const btnCadastro = document.getElementById("btnCadastro");

  if (btnCadastro) {
    btnCadastro.addEventListener("click", () => {
      window.location.href = "/auth/html/cadastro.html";
    });
  }
})();
