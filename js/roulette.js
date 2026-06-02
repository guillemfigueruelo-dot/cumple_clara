const Roulette = {
  canvas: null, ctx: null,
  angle: 0, velocity: 0, spinning: false,
  targetPrizeIndex: null,

  init() {
    this.canvas = document.getElementById("roulette-canvas");
    this.ctx    = this.canvas.getContext("2d");
    this.draw();
  },

  draw() {
    const ctx   = this.ctx;
    const prizes = CONFIG.PRIZES;
    const n     = prizes.length;
    const arc   = (2 * Math.PI) / n;
    const cx    = this.canvas.width / 2;
    const cy    = this.canvas.height / 2;
    const r     = cx - 10;

    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    prizes.forEach((prize, i) => {
      const startAngle = this.angle + i * arc;
      const endAngle   = startAngle + arc;

      // Sector
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      const hue = (i / n) * 360;
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Texto
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px sans-serif";
      ctx.shadowColor = "rgba(0,0,0,0.4)";
      ctx.shadowBlur = 4;
      // Limita el texto largo
      const label = prize.length > 18 ? prize.slice(0, 17) + "…" : prize;
      ctx.fillText(label, r - 10, 5);
      ctx.restore();
    });

    // Centro
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#ddd";
    ctx.lineWidth = 3;
    ctx.stroke();
  },

  spin() {
    if (this.spinning) return;
    document.getElementById("prize-result").classList.add("hidden");
    document.getElementById("spin-btn").disabled = true;
    this.spinning  = true;
    // Velocidad aleatoria entre 15 y 25 rad/s
    this.velocity  = 15 + Math.random() * 10;

    const animate = () => {
      if (this.velocity > 0.01) {
        this.velocity *= 0.985; // rozamiento
        this.angle    += this.velocity * 0.016; // ~60fps
        this.draw();
        requestAnimationFrame(animate);
      } else {
        this.velocity = 0;
        this.spinning = false;
        this.showResult();
        document.getElementById("spin-btn").disabled = false;
      }
    };
    requestAnimationFrame(animate);
  },

  showResult() {
  const n    = CONFIG.PRIZES.length;
  const arc  = (2 * Math.PI) / n;

  // El puntero está en la parte superior del canvas (−π/2).
  // Normalizamos el ángulo actual y calculamos qué sector queda ahí.
  const normalizedAngle = ((this.angle % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);
  const pointerAngle    = (2 * Math.PI - normalizedAngle + (3 * Math.PI / 2)) % (2 * Math.PI);
  const index           = Math.floor(pointerAngle / arc) % n;
  const prize           = CONFIG.PRIZES[index];

  const result = document.getElementById("prize-result");
  result.innerHTML = `🎉 ¡Tu premio es: <strong>${prize}</strong>! 🎉`;
  result.classList.remove("hidden");
  result.classList.add("bounce");
  },
};