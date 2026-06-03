const Trivia = {
  idx: 0, onWin: null, answered: false,

  init(container, onWin) {
    this.onWin     = onWin;
    this.idx       = 0;
    this.answered  = false;
    container.innerHTML = `
      <div class="game-header">
        <h2>❓ Día 5 — Trivia de Pareja</h2>
        <p>Debes acertar las <strong>${CONFIG.TRIVIA.length} preguntas</strong> sin fallar ni una</p>
      </div>
      <div id="trivia-card" class="trivia-card"></div>`;
    this.showQuestion();
  },

  showQuestion() {
    this.answered   = false;
    const q         = CONFIG.TRIVIA[this.idx];
    const card      = document.getElementById("trivia-card");

    card.innerHTML  = `
      <p class="trivia-num">Pregunta ${this.idx + 1} de ${CONFIG.TRIVIA.length}</p>
      <h3 class="trivia-question">${q.q}</h3>
      <div id="trivia-options" class="trivia-options"></div>
      <p id="trivia-feedback" class="trivia-feedback hidden"></p>
    `;

    const optionsEl = document.getElementById("trivia-options");
    q.options.forEach((text, i) => {
      const btn = document.createElement("button");
      btn.className   = "trivia-option-btn";
      btn.textContent = text;
      btn.onclick     = () => this.checkAnswer(i, btn, q.a);
      optionsEl.appendChild(btn);
    });
  },

  checkAnswer(selectedIdx, btn, correctIdx) {
    if (this.answered) return; // evita doble clic
    this.answered = true;

    const allBtns  = document.querySelectorAll(".trivia-option-btn");
    const feedback = document.getElementById("trivia-feedback");

    // Bloquea todos los botones
    allBtns.forEach(b => b.disabled = true);

    if (selectedIdx === correctIdx) {
      // ── CORRECTO ──
      btn.classList.add("correct");
      feedback.textContent  = "✅ ¡Correcto!";
      feedback.className    = "trivia-feedback correct";

      this.idx++;
      if (this.idx >= CONFIG.TRIVIA.length) {
        setTimeout(() => {
          alert("🎉 ¡Todo correcto! ¡Eres la mejor!");
          this.onWin();
        }, 900);
      } else {
        setTimeout(() => this.showQuestion(), 1000);
      }

    } else {
      // ── INCORRECTO ──
      btn.classList.add("wrong");
      allBtns[correctIdx].classList.add("correct"); // revela la correcta
      feedback.textContent  = `❌ Era "${CONFIG.TRIVIA[this.idx].options[correctIdx]}"… ¡Empezamos de cero!`;
      feedback.className    = "trivia-feedback wrong";

      this.idx = 0;
      setTimeout(() => this.showQuestion(), 2200);
    }
  },
};