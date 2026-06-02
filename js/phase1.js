const Phase1 = {
  countdownInterval: null,

  init() {
    this.buildTimeline();
    this.startCountdown();
    this.initParallax();
  },

  initEarlyMode() {
    // Antes del 4 de junio: muestra solo el hero con cuenta regresiva al 4
    this.buildTimeline();
    this.startCountdown();
  },

  buildTimeline() {
    const container = document.getElementById("timeline-entries");
    CONFIG.TIMELINE.forEach((item, i) => {
      const entry = document.createElement("div");
      entry.className = `timeline-entry ${i % 2 === 0 ? "left" : "right"} fade-in`;
      entry.innerHTML = `
        <div class="timeline-card">
          <img src="${item.img}" alt="${item.caption}" loading="lazy"/>
          <div class="timeline-info">
            <span class="timeline-date">${item.date}</span>
            <p>${item.caption}</p>
          </div>
        </div>`;
      container.appendChild(entry);
    });
    this.observeEntries();
  },

  observeEntries() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    }, { threshold: 0.2 });
    document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));
  },

  startCountdown() {
    const target = new Date("2026-06-09T00:00:00");
    this.countdownInterval = setInterval(() => {
      const diff = target - new Date();
      if (diff <= 0) {
        clearInterval(this.countdownInterval);
        document.getElementById("countdown-timer").innerHTML =
          "<p class='countdown-done'>🎉 ¡Ya es el día!</p>";
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      document.getElementById("cd-days").textContent  = String(d).padStart(2,"0");
      document.getElementById("cd-hours").textContent = String(h).padStart(2,"0");
      document.getElementById("cd-mins").textContent  = String(m).padStart(2,"0");
      document.getElementById("cd-secs").textContent  = String(s).padStart(2,"0");
    }, 1000);
  },

  initParallax() {
    window.addEventListener("scroll", () => {
      const offset = window.scrollY;
      const hero = document.querySelector(".hero");
      if (hero) hero.style.backgroundPositionY = `${offset * 0.4}px`;
    });
  },

  showTrapModal() {
    document.getElementById("trap-pin-modal").classList.remove("hidden");
    document.getElementById("trap-pin-input").focus();
  },
  closeTrapPinModal() {
    document.getElementById("trap-pin-modal").classList.add("hidden");
    document.getElementById("trap-pin-input").value = "";
    document.getElementById("trap-pin-error").classList.add("hidden");
  },

  async checkTrapPin() {
    const pin = document.getElementById("trap-pin-input").value;
    if (pin === CONFIG.PINS.trap) {
      this.closeTrapPinModal();
      document.getElementById("trap-modal").classList.remove("hidden");
      // 🔔 Notificación silenciosa a Telegram
      await Telegram.notify(
        `⚠️ <b>¡Clara intentó el acceso anticipado!</b>\n` +
        `📅 Fecha: ${new Date().toLocaleString("es-ES")}\n` +
        `🔐 Usó el PIN correcto de la trampa. ¡La pillamos!`
      );
    } else {
      document.getElementById("trap-pin-error").classList.remove("hidden");
      document.getElementById("trap-pin-input").value = "";
    }
  },

  closeTrapModal() {
    document.getElementById("trap-modal").classList.add("hidden");
  },
};

function scrollToTimeline() {
  document.getElementById("timeline").scrollIntoView({ behavior: "smooth" });
}