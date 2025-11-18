/* Autoria: Alycia */

/* Relógio | atualiza ponteiros a cada 1s  */
(function startClock() {
  const hour = document.querySelector('.hand.hour');
  const minute = document.querySelector('.hand.minute');
  const second = document.querySelector('.hand.second');

  // Se o relógio não existir no HTML, não faz nada
  if (!hour || !minute || !second) return;

  const tick = () => {
    const now = new Date();
    const s = now.getSeconds(); // segundos atuais
    const m = now.getMinutes() + s / 60; // minutos com frações dos segundos
    const h = (now.getHours() % 12) + m / 60; // horas com frações dos minutos

    // Rotaciona os ponteiros
    second.style.transform = `translate(-50%,-90%) rotate(${s * 6}deg)`;
    minute.style.transform = `translate(-50%,-90%) rotate(${m * 6}deg)`;
    hour.style.transform = `translate(-50%,-90%) rotate(${h * 30}deg)`;
  };

  tick(); // atualiza imediatamente
  setInterval(tick, 1000); // atualiza a cada 1 segundo
})();

/* Pôster */
(function posterAutoDetect() {
  const img = document.getElementById('posterImg');
  const hint = document.getElementById('posterHint');
  if (!img || !hint) return;

  img.addEventListener('load', () => { hint.style.display = 'none'; });
  img.addEventListener('error', () => { hint.style.display = 'flex'; });

  // caso a imagem já esteja carregada ao abrir a página
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
  const RATE = 1000 / 60; // ~60fps
  const PARTICLES = 4; // quantidade por ponto

  // Cria partículas de giz na posição do mouse
  const spawn = (x, y) => {
    for (let i = 0; i < PARTICLES; i++) {
      const p = document.createElement('span');
      p.className = 'chalk';
      p.style.left = x + 'px';
      p.style.top = y + 'px';

      // Movimento aleatório das partículas
      const dx = (Math.random() - .5) * 36;
      const dy = - (Math.random() * 28 + 8);

      // Variáveis CSS para animação
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.setProperty('--life', (600 + Math.random() * 700) + 'ms');

      // Escala aleatória
      const s = 0.7 + Math.random() * 0.6;
      p.style.transform = `translate(-50%,-50%) scale(${s})`;
      layer.appendChild(p);

      // Remove partícula ao fim da animação
      p.addEventListener('animationend', () => p.remove(), { once: true });
    }
  };

  // Verifica se o mouse está dentro da lousa
  const pointOnBoard = (clientX, clientY) => {
    const rect = board.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
    return { x, y };
  };

  // Gera partículas conforme movimento (limitado por RATE)
  const move = (clientX, clientY) => {
    const now = performance.now();
    if (now - last < RATE) return;
    last = now;

    const pt = pointOnBoard(clientX, clientY);
    if (!pt) return;
    spawn(pt.x, pt.y);
  };

  // Eventos desktop
  board.addEventListener('pointermove', (e) => move(e.clientX, e.clientY));
  board.addEventListener('pointerdown', (e) => move(e.clientX, e.clientY));

  // Eventos mobile
  board.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) move(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  board.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) move(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
})();

/* Botão Login | redireciona para a página de login*/
(function loginButtonRedirect() {
  const btnLogin = document.getElementById("btnLogin");

  if (btnLogin) {
    btnLogin.addEventListener("click", () => {
      window.location.href = "/auth/html/login.html";
    });
  }
})();

/* Botão Cadastro | redireciona para a página de cadastro */
(function cadastroButtonRedirect() {
  const btnCadastro = document.getElementById("btnCadastro");

  if (btnCadastro) {
    btnCadastro.addEventListener("click", () => {
      window.location.href = "/auth/html/cadastro.html";
    });
  }
})();
