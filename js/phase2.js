const Phase2 = {
  currentDay: null,
  DAYS: {
    1: { date: "9 jun",  label: "Dia 1", pin: "day1", game: "puzzle"      },
    2: { date: "10 jun", label: "Dia 2", pin: "day2", game: "memory"      },
    3: { date: "11 jun", label: "Dia 3", pin: "day3", game: "differences" },
    4: { date: "12 jun", label: "Dia 4", pin: "day4", game: "simon"       },
    5: { date: "13 jun", label: "Dia 5", pin: "day5", game: "trivia"      },
  },

  init() {
    const grid = document.getElementById("day-buttons");
    grid.innerHTML = "";
    Object.entries(this.DAYS).forEach(([day, info]) => {
      const completed = localStorage.getItem(`day${day}_done`) === "true";
      const btn = document.createElement("button");
      btn.className = `day-btn ${completed ? "done" : ""}`;
      btn.innerHTML = `
        <span class="day-num">${info.label}</span>
        <span class="day-date">${info.date}</span>
        ${completed ? "✅" : "🔒"}`;
      btn.onclick = () => this.openDay(parseInt(day));
      grid.appendChild(btn);
    });
  },

  openDay(day) {
    this.currentDay = day;
    document.getElementById("day-pin-title").textContent =
      `🔐 PIN del ${this.DAYS[day].label} (${this.DAYS[day].date})`;
    document.getElementById("day-pin-input").value = "";
    document.getElementById("day-pin-error").classList.add("hidden");
    document.getElementById("day-pin-modal").classList.remove("hidden");
    document.getElementById("day-pin-input").focus();
  },

  checkDayPin() {
    const pin    = document.getElementById("day-pin-input").value;
    const dayCfg = this.DAYS[this.currentDay];
    if (pin === CONFIG.PINS[dayCfg.pin]) {
      this.closeDayModal();
      this.launchGame(this.currentDay);
    } else {
      document.getElementById("day-pin-error").classList.remove("hidden");
      document.getElementById("day-pin-input").value = "";
    }
  },

  closeDayModal() {
    document.getElementById("day-pin-modal").classList.add("hidden");
  },

  launchGame(day) {
  const container = document.getElementById("minigame-container");
  container.innerHTML = "";
  container.classList.remove("hidden");
  document.getElementById("phase2-dashboard").classList.add("hidden");
  document.getElementById("roulette-screen").classList.add("hidden");

  // Mapa corregido: día → objeto global del minijuego
  const gameMap = {
    1: puzzle,       // objeto literal (minúscula)
    2: Memory,
    3: Differences,
    4: Simon,
    5: Trivia,
  };

  const game = gameMap[day];

  if (!game) {
    console.error("No se encontró el minijuego para el día:", day);
    return;
  }

  if (typeof game.init !== "function") {
    console.error("El minijuego no tiene método init():", game);
    return;
  }

  game.init(container, () => this.onGameWin(day));
  },

  onGameWin(day) {
    localStorage.setItem(`day${day}_done`, "true");
    document.getElementById("minigame-container").classList.add("hidden");
    document.getElementById("roulette-screen").classList.remove("hidden");
    document.getElementById("prize-result").classList.add("hidden");
    Roulette.init();
    // Scroll suave a la ruleta
    document.getElementById("roulette-screen").scrollIntoView({ behavior: "smooth" });
  },

  backToDashboard() {
    document.getElementById("roulette-screen").classList.add("hidden");
    document.getElementById("minigame-container").classList.add("hidden");
    document.getElementById("phase2-dashboard").classList.remove("hidden");
    this.init(); // refresca estado de botones
  },
};