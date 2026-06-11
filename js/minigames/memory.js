const Memory = {
  flipped: [], matched: 0, locked: false,

  init(container, onWin) {
    this.onWin = onWin;
    this.flipped = []; this.matched = 0; this.locked = false;

    // 6 parejas de fotos (12 cartas)
    const PHOTOS = [
      "assets/photos/Memory1.jpeg","assets/photos/Memory2.jpeg",
      "assets/photos/Memory3.jpeg","assets/photos/Memory4.jpeg",
      "assets/photos/Memory5.jpeg","assets/photos/Memory6.jpeg",
    ];
    const cards = [...PHOTOS, ...PHOTOS].sort(() => Math.random() - 0.5);

    container.innerHTML = `
      <div class="game-header">
        <h2>💝 Día 2 — Memorama</h2>
        <p>Encuentra las 6 parejas de recuerdos</p>
      </div>
      <div id="memory-grid" style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:400px;margin:auto"></div>`;

    const grid = document.getElementById("memory-grid");
    cards.forEach((src, i) => {
      const card = document.createElement("div");
      card.className = "mem-card";
      card.dataset.src = src;
      card.dataset.index = i;
      card.innerHTML = `
        <div class="mem-inner">
          <div class="mem-front">💕</div>
          <div class="mem-back"><img src="${src}" style="width:100%;height:100%;object-fit:cover"/></div>
        </div>`;
      card.addEventListener("click", () => this.flip(card));
      grid.appendChild(card);
    });
  },

  flip(card) {
    if (this.locked || card.classList.contains("flipped") || card.classList.contains("matched")) return;
    card.classList.add("flipped");
    this.flipped.push(card);
    if (this.flipped.length === 2) {
      this.locked = true;
      const [a, b] = this.flipped;
      if (a.dataset.src === b.dataset.src) {
        a.classList.add("matched"); b.classList.add("matched");
        this.matched++;
        this.flipped = []; this.locked = false;
        if (this.matched === 6) {
          setTimeout(() => { alert("🎉 ¡Todas las parejas! ¡A girar la ruleta!"); this.onWin(); }, 400);
        }
      } else {
        setTimeout(() => {
          a.classList.remove("flipped"); b.classList.remove("flipped");
          this.flipped = []; this.locked = false;
        }, 1000);
      }
    }
  },
};