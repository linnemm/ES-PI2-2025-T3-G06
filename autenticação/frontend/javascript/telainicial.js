/* Autoria: Alycia */

/* Relógio  */
(function startClock(){
  // Seleciona os ponteiros do relógio no HTML
  const hour = document.querySelector('.hand.hour');
  const minute = document.querySelector('.hand.minute');
  const second = document.querySelector('.hand.second');
  // Se algum ponteiro não existir, interrompe a função
  if (!hour || !minute || !second) return;
  //Função que atualiza a rotação dos ponteiros a cada segundo
  const tick = () => {
    const now = new Date();
    const s = now.getSeconds();
    const m = now.getMinutes() + s/60;
    const h = (now.getHours()%12) + m/60;
    second.style.transform = `translate(-50%,-90%) rotate(${s*6}deg)`;
    minute.style.transform = `translate(-50%,-90%) rotate(${m*6}deg)`;
    hour.style.transform   = `translate(-50%,-90%) rotate(${h*30}deg)`;
  };
  // Atualiza o relógio imediatamente
  tick(); setInterval(tick, 1000);
})();

/* Pôster: mostra mensagem se a imagem não existir, esconde se existir */
(function posterAutoDetect(){
  const img = document.getElementById('posterImg');
  const hint = document.getElementById('posterHint');
  if (!img || !hint) return;

  img.addEventListener('load', () => { hint.style.display = 'none'; });
  img.addEventListener('error', () => { hint.style.display = 'flex'; });

  //Caso a imagem já esteja carregada desde o início
  if (img.complete && img.naturalWidth > 0) {
    hint.style.display = 'none';
  }
})();

/* Partículas de giz */
(function chalkParticles(){
  const board = document.querySelector('.blackboard');
  const layer = document.querySelector('.chalk-layer'); // Camada onde as partículas aparecem
  if (!board || !layer) return;

  let last = 0;
  const RATE = 1000/60;
  const PARTICLES = 4;
// Função que cria as partículas de giz na posição (x, y)
  const spawn = (x, y) => {
    for (let i = 0; i < PARTICLES; i++) {
      const p = document.createElement('span');
      p.className = 'chalk';
      p.style.left = x + 'px';
      p.style.top  = y + 'px';

      // Movimentos aleatórios (direção e velocidade)
      const dx = (Math.random() - .5) * 36;
      const dy = - (Math.random() * 28 + 8);
      // Define variáveis CSS customizadas
      p.style.setProperty('--dx', dx + 'px');
      p.style.setProperty('--dy', dy + 'px');
      p.style.setProperty('--life', (600 + Math.random()*700) + 'ms');
      // Define tamanho aleatório
      const s = 0.7 + Math.random()*0.6;
      p.style.transform = `translate(-50%,-50%) scale(${s})`;
      layer.appendChild(p);
      p.addEventListener('animationend', () => p.remove(), { once:true });
    }
  };

//Converte coordenadas da tela (mouse) para dentro do quadro
  const pointOnBoard = (clientX, clientY) => {
    const rect = board.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
    return { x, y };
  };

  // Função principal de movimento (cria partículas conforme o mouse/touch se move)
  const move = (clientX, clientY) => {
    const now = performance.now();
    if (now - last < RATE) return;
    last = now;
    const pt = pointOnBoard(clientX, clientY);
    if (!pt) return;
    spawn(pt.x, pt.y); // Cria as partículas na posição atual
  };

  // Eventos de interação com o quadro (mouse e toque)
  board.addEventListener('pointermove', (e) => move(e.clientX, e.clientY));
  board.addEventListener('pointerdown', (e) => move(e.clientX, e.clientY));
  // Suporte a telas sensíveis ao toque
  board.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) move(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive:true });
  board.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches[0]) move(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive:true });
})();
