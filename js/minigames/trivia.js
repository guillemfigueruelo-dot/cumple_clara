const Trivia = {
  idx: 0, onWin: null,

  init(container, onWin) {
    this.onWin = onWin; this.idx = 0;
    container.innerHTML = `
      <div class="game-header">
        <h2>❓ Día 5 — Trivia de Pareja</h2>
        <p>Debes acertar las ${CONFIG.TRIVIA.length} preguntas sin fallar ni una</p>
      </div>
      <div id="trivia-card" class="trivia-card"></div>`;
    this.showQuestion();
  },

  showQuestion() {
    const q = CONFIG.TRIVIA[this.idx];
    document.getElementById("trivia-card").innerHTML = `
      <p class="trivia-num">Pregunta ${this.idx + 1} de ${CONFIG.TRIVIA.length}</p>
      <h3>${q.q}</h3>
      <input id="trivia-answer" type="text" placeholder="Tu respuesta…" style="width:80%;padding:10px;font-size:1rem;border-radius:8px;border:2px solid #ff6b9d;margin:1rem 0"/>
      <br/>
      <button onclick="Trivia.checkAnswer()">✅ Responder</button>
      <p id="trivia-feedback" class="hidden error"></p>`;
    document.getElementById("trivia-answer").addEventListener("keydown", e => {
      if (e.key === "Enter") Trivia.checkAnswer();
    });
  },

  checkAnswer() {
    const input    = document.getElementById("trivia-answer").value.trim().toLowerCase();
    const correct  = CONFIG.TRIVIA[this.idx].a.toLowerCase();
    const feedback = document.getElementById("trivia-feedback");

    if (input === correct) {
      this.idx++;
      if (this.idx >= CONFIG.TRIVIA.length) {
        setTimeout(() => { alert("🎉 ¡Todo correcto! ¡Eres la mejor!"); this.onWin(); }, 300);
      } else {
        feedback.textContent = "✅ ¡Correcto!";
        feedback.classList.remove("hidden");
        feedback.style.color = "#4caf50";
        setTimeout(() => this.showQuestion(), 800);
      }
    } else {
      feedback.textContent = `❌ Incorrecto. Empezamos desde el principio…`;
      feedback.classList.remove("hidden");
      feedback.style.color = "#e53935";
      this.idx = 0;
      setTimeout(() => this.showQuestion(), 1800);
    }
  },
};