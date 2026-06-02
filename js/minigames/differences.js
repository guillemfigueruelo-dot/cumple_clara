const Differences = {
  // Define las 5 zonas (coordenadas en %) donde están las diferencias en la imagen DERECHA
  ZONES: [
    // Rejilla
    { x: 22, y: 5, r: 8 },
    // Pantalón
    { x: 10, y: 97, r: 7 },
    // Gafas de sol
    { x: 45, y: 85, r: 7 }
  ],
  found: [],

  init(container, onWin) {
    this.onWin = onWin; this.found = [];
    container.innerHTML = `
      <div class="game-header">
        <h2>🔍 Día 3 — Encuentra las diferencias</h2>
        <p>Haz clic en las 5 diferencias de la imagen derecha</p>
        <span id="diff-count">Encontradas: 0 / 5</span>
      </div>
      <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
        <div style="position:relative">
          <img src="assets/photos/Diferencias1.png" style="max-width:45vw;border-radius:8px"/>
        </div>
        <div style="position:relative" id="diff-right-wrap">
          <img src="assets/photos/Diferencias2.jpeg" id="diff-right-img" style="max-width:45vw;border-radius:8px"/>
        </div>
      </div>`;

    const wrap = document.getElementById("diff-right-wrap");
    wrap.addEventListener("click", (e) => this.checkClick(e, wrap));
  },

  checkClick(e, wrap) {
    const rect = wrap.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width)  * 100;
    const yPct = ((e.clientY - rect.top)  / rect.height) * 100;

    for (const [i, zone] of this.ZONES.entries()) {
      if (this.found.includes(i)) continue;
      const dist = Math.hypot(xPct - zone.x, yPct - zone.y);
      if (dist <= zone.r) {
        this.found.push(i);
        // Marca visual
        const dot = document.createElement("div");
        dot.style.cssText = `
          position:absolute;border:3px solid #4caf50;border-radius:50%;
          width:${zone.r * 2}%;padding-top:${zone.r * 2}%;
          left:${zone.x - zone.r}%;top:${zone.y - zone.r}%;
          pointer-events:none;box-sizing:border-box;`;
        wrap.appendChild(dot);
        document.getElementById("diff-count").textContent =
          `Encontradas: ${this.found.length} / 5`;
        if (this.found.length === 5) {
          setTimeout(() => { alert("🎉 ¡Todas encontradas! ¡A la ruleta!"); this.onWin(); }, 500);
        }
        return;
      }
    }
    // Click fallido
    const miss = document.createElement("div");
    miss.textContent = "✗";
    miss.style.cssText = `position:absolute;color:red;font-size:1.4rem;
      left:${xPct}%;top:${yPct}%;transform:translate(-50%,-50%);
      pointer-events:none;animation:fadeOut 1s forwards;`;
    wrap.appendChild(miss);
    setTimeout(() => miss.remove(), 1000);
  },
};