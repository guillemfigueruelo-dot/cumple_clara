const Simon = {
  PHOTOS: [
    "assets/photos/simon1.jpeg","assets/photos/simon2.jpeg",
    "assets/photos/simon3.jpeg","assets/photos/simon4.jpeg",
  ],
  COLORS: ["#ff6b9d","#ffd93d","#6bcb77","#4d96ff"],
  sequence: [], playerSeq: [], level: 0, onWin: null,

  init(container, onWin) {
    this.onWin = onWin; this.sequence = []; this.level = 0;
    container.innerHTML = `
      <div class="game-header">
        <h2>🎵 Día 4 — Simón Dice</h2>
        <p id="simon-msg">Repite la secuencia. Supera 5 rondas para ganar</p>
      </div>
      <div id="simon-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;max-width:340px;margin:1rem auto"></div>
      <button id="simon-start" onclick="Simon.nextRound()" style="margin-top:1rem">▶ Empezar</button>`;

    const grid = document.getElementById("simon-grid");
    this.PHOTOS.forEach((src, i) => {
      const btn = document.createElement("div");
      btn.id = `simon-${i}`;
      btn.style.cssText = `
        width:150px;height:150px;border-radius:12px;cursor:pointer;
        background-image:url('${src}');background-size:cover;
        border:4px solid ${this.COLORS[i]};transition:filter .15s;`;
      btn.addEventListener("click", () => this.playerClick(i));
      grid.appendChild(btn);
    });
  },

  nextRound() {
    document.getElementById("simon-start").style.display = "none";
    this.sequence.push(Math.floor(Math.random() * 4));
    this.level++;
    document.getElementById("simon-msg").textContent = `Ronda ${this.level} — Observa…`;
    this.playerSeq = [];
    this.playSequence();
  },

  async playSequence() {
    for (const idx of this.sequence) {
      await this.flashBtn(idx);
      await this.wait(300);
    }
    document.getElementById("simon-msg").textContent = "¡Tu turno! Repite la secuencia";
  },

  flashBtn(idx) {
    return new Promise(res => {
      const btn = document.getElementById(`simon-${idx}`);
      btn.style.filter = "brightness(2)";
      setTimeout(() => { btn.style.filter = "brightness(1)"; res(); }, 600);
    });
  },

  wait(ms) { return new Promise(r => setTimeout(r, ms)); },

  async playerClick(idx) {
    if (this.sequence.length === 0) return;
    await this.flashBtn(idx);
    const expected = this.sequence[this.playerSeq.length];
    this.playerSeq.push(idx);

    if (idx !== expected) {
      document.getElementById("simon-msg").textContent = "❌ ¡Error! Volvemos a empezar…";
      this.sequence = []; this.level = 0; this.playerSeq = [];
      setTimeout(() => {
        document.getElementById("simon-start").style.display = "block";
        document.getElementById("simon-start").textContent = "🔄 Reintentar";
        document.getElementById("simon-msg").textContent = "Repite la secuencia. Supera 5 rondas para ganar";
      }, 1500);
      return;
    }

    if (this.playerSeq.length === this.sequence.length) {
      if (this.level >= 5) {
        setTimeout(() => { alert("🎉 ¡Simón dice que mereces tu premio!"); this.onWin(); }, 400);
      } else {
        document.getElementById("simon-msg").textContent = `✅ ¡Ronda ${this.level} superada!`;
        setTimeout(() => this.nextRound(), 1000);
      }
    }
  },
};