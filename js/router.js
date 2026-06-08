const Router = {
  PHASE1_DATE: new Date("2026-06-04T00:00:00"),
  PHASE2_DATE: new Date("2026-06-09T22:00:00"),

  init() {
    const unlocked = sessionStorage.getItem("unlocked");
    if (!unlocked) {
      this.show("screen-unlock");
      return;
    }
    this.route();
  },

  route() {
    // Modo debug: saltar directamente a una fase
    if (CONFIG.DEBUG_PHASE === 1) { this.show("screen-phase1"); Phase1.init(); return; }
    if (CONFIG.DEBUG_PHASE === 2) { this.show("screen-phase2"); Phase2.init(); return; }
    const now = new Date();
    if (now >= this.PHASE2_DATE) {
      this.show("screen-phase2");
      Phase2.init();
    } else if (now >= this.PHASE1_DATE) {
      this.show("screen-phase1");
      Phase1.init();
    } else {
      // Antes del 4 de junio → solo pantalla de espera
      this.show("screen-phase1");
      Phase1.initEarlyMode();
    }
  },

  tryUnlock() {
    const pin = document.getElementById("unlock-pin").value;
    // PIN de acceso general = cualquier PIN diario válido o un PIN master
    const allPins = Object.values(CONFIG.PINS);
    if (allPins.includes(pin)) {
      sessionStorage.setItem("unlocked", "true");
      document.getElementById("unlock-error").classList.add("hidden");
      this.route();
    } else {
      document.getElementById("unlock-error").classList.remove("hidden");
      document.getElementById("unlock-pin").value = "";
    }
  },

  show(screenId) {
    document.querySelectorAll(".screen").forEach(s => {
      s.classList.add("hidden");
      s.classList.remove("active");
    });
    const target = document.getElementById(screenId);
    target.classList.remove("hidden");
    target.classList.add("active");
  },
};