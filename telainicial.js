// —————————————————————————————————————
// Relógio e partículas de giz sob o cursor
// —————————————————————————————————————

/* Relógio analógico */
(function startClock(){
    const hour = document.querySelector('.hand.hour');
    const minute = document.querySelector('.hand.minute');
    const second = document.querySelector('.hand.second');
    if (!hour || !minute || !second) return;
    const tick = () => {
      const now = new Date();
      const s = now.getSeconds();
      const m = now.getMinutes() + s/60;
      const h = (now.getHours()%12) + m/60;
      second.style.transform = `translate(-50%,-90%) rotate(${s*6}deg)`;
      minute.style.transform = `translate(-50%,-90%) rotate(${m*6}deg)`;
      hour.style.transform   = `translate(-50%,-90%) rotate(${h*30}deg)`;
    };
    tick(); setInterval(tick, 1000);
  })();
  
  /* Linha de giz acompanhando o mouse */
(function chalkLine(){
  const board = document.querySelector('.blackboard');
  const svg = document.querySelector('.chalk-path');
  if (!board || !svg) return;

  const path = document.createElementNS("http://www.w3.org/2000/svg","path");
  svg.appendChild(path);

  let d = ""; // caminho da linha
  let last = 0;
  const RATE = 1000/60; // ~60 fps

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

    if (d === "") {
      d = `M ${pt.x} ${pt.y}`;
    } else {
      d += ` L ${pt.x} ${pt.y}`;
    }
    path.setAttribute("d", d);
  };

  board.addEventListener('pointermove', e => move(e.clientX, e.clientY));
  board.addEventListener('touchmove', e => {
    if (e.touches && e.touches[0]) move(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive:true });
})();


  // Pôster: esconde a dica quando a imagem existir
(function posterAutoDetect(){
  const img = document.getElementById('posterImg');
  const hint = document.getElementById('posterHint');
  if (!img || !hint) return;

  img.addEventListener('load', () => { hint.style.display = 'none'; });
  img.addEventListener('error', () => { hint.style.display = 'flex'; });

  // Se já estiver em cache e carregada:
  if (img.complete && img.naturalWidth > 0) {
    hint.style.display = 'none';
  }
})();
