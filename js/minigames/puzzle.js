const puzzle = {
  GRID: 4, // 4x4 = 16 piezas
  ASPECT_W: 9,
  ASPECT_H: 16,
  solved: 0,
  total: 0,
  onWin: null,

  init(container, onWin) {
    this.onWin   = onWin;
    this.solved  = 0;
    this.total   = this.GRID * this.GRID;

    const IMG = "assets/photos/Rompecabezas.jpeg";

    // Calcula tamaño respetando el aspect ratio 9:16 y el ancho disponible
    const maxW    = Math.min(window.innerWidth - 40, 360);
    const maxH    = window.innerHeight * 0.65;
    const byWidth = maxW;
    const byHeight= (maxH * this.ASPECT_W) / this.ASPECT_H;
    const boardW  = Math.floor(Math.min(byWidth, byHeight));
    const boardH  = Math.floor(boardW * (this.ASPECT_H / this.ASPECT_W));
    const pw      = boardW / this.GRID; // ancho de pieza
    const ph      = boardH / this.GRID; // alto de pieza

    container.innerHTML = `
      <div class="game-header">
        <h2>🧩 Día 1 — Rompecabezas</h2>
        <p>Ordena las <strong>${this.total} piezas</strong> arrastrándolas a su sitio</p>
        <p id="puzzle-progress" style="color:var(--gold);font-weight:700">
          ✅ 0 / ${this.total} piezas colocadas
        </p>
      </div>

      <!-- Tablero destino -->
      <div id="puzzle-board" style="
        width:${boardW}px; height:${boardH}px;
        position:relative; margin:0 auto;
        border:3px solid var(--pink); border-radius:8px;
        background:#111;
      "></div>

      <p style="text-align:center;color:#aaa;font-size:.85rem;margin:.6rem 0">
        ↕ Arrastra las piezas de abajo al tablero de arriba
      </p>

      <!-- Bandeja de piezas mezcladas -->
      <div id="puzzle-tray" style="
        display:flex; flex-wrap:wrap; gap:4px;
        justify-content:center; margin-top:8px;
        max-width:${boardW + 20}px; margin-left:auto; margin-right:auto;
        padding:8px; background:var(--surface);
        border-radius:8px; border:2px dashed #555;
      "></div>
    `;

    const board = document.getElementById("puzzle-board");
    const tray  = document.getElementById("puzzle-tray");

    // ── Crear slots en el tablero ──
    for (let i = 0; i < this.total; i++) {
      const col  = i % this.GRID;
      const row  = Math.floor(i / this.GRID);
      const slot = document.createElement("div");
      slot.dataset.index = i;
      slot.style.cssText = `
        position:absolute;
        width:${pw}px; height:${ph}px;
        left:${col * pw}px; top:${row * ph}px;
        border:1px dashed rgba(255,255,255,.15);
        box-sizing:border-box;
      `;
      /*// Muestra la posición correcta tenuemente como guía
      slot.style.backgroundImage   = `url('${IMG}')`;
      slot.style.backgroundSize    = `${boardW}px ${boardH}px`;
      slot.style.backgroundPosition= `-${col * pw}px -${row * ph}px`;
      slot.style.opacity           = "0.12";*/

      slot.addEventListener("dragover",  e => e.preventDefault());
      slot.addEventListener("dragenter", e => { e.preventDefault(); slot.style.outline = "2px solid var(--pink)"; });
      slot.addEventListener("dragleave", ()  => { slot.style.outline = "none"; });
      slot.addEventListener("drop",      e  => this.drop(e, slot, pw, ph, boardW, boardH, IMG));

      // Touch support
      slot.addEventListener("touchover", e => e.preventDefault());

      board.appendChild(slot);
    }

    // ── Crear piezas mezcladas en la bandeja ──
    const indices = [...Array(this.total).keys()].sort(() => Math.random() - 0.5);
    indices.forEach(idx => {
      const col   = idx % this.GRID;
      const row   = Math.floor(idx / this.GRID);
      const piece = this.createPiece(idx, col, row, pw, ph, boardW, boardH, IMG);
      tray.appendChild(piece);
    });

    // ── Soporte táctil global ──
    this.initTouchSupport(board, pw, ph);
  },

  createPiece(idx, col, row, pw, ph, boardW, boardH, IMG) {
    const piece = document.createElement("div");
    piece.dataset.correct   = idx;
    piece.dataset.col       = col;
    piece.dataset.row       = row;
    piece.draggable         = true;
    piece.style.cssText     = `
      width:${pw}px; height:${ph}px;
      flex-shrink:0; cursor:grab;
      background-image:url('${IMG}');
      background-size:${boardW}px ${boardH}px;
      background-position:-${col * pw}px -${row * ph}px;
      border:2px solid #444; border-radius:3px;
      box-shadow:2px 2px 6px rgba(0,0,0,.4);
      transition:box-shadow .15s, transform .15s;
      touch-action:none;
    `;

    piece.addEventListener("mouseenter", () => {
      if (!piece.classList.contains("placed"))
        piece.style.transform = "scale(1.06)";
    });
    piece.addEventListener("mouseleave", () => {
      piece.style.transform = "scale(1)";
    });
    piece.addEventListener("dragstart", e => {
      e.dataTransfer.setData("correct", idx);
      e.dataTransfer.setData("fromSlot", piece.parentElement.dataset.index ?? "tray");
      piece.style.opacity = "0.5";
    });
    piece.addEventListener("dragend", () => {
      piece.style.opacity = "1";
    });

    return piece;
  },

  drop(e, slot, pw, ph, boardW, boardH, IMG) {
    e.preventDefault();
    slot.style.outline = "none";

    const correct  = parseInt(e.dataTransfer.getData("correct"));
    const fromSlot = e.dataTransfer.getData("fromSlot");
    const piece    = document.querySelector(`[data-correct="${correct}"]`);
    if (!piece) return;

    // Si el slot ya tiene una pieza, la mandamos a la bandeja o la intercambiamos
    const existing = slot.querySelector("[data-correct]");
    if (existing) {
      const prevParent = piece.parentElement;
      if (fromSlot !== "tray" && prevParent?.dataset?.index !== undefined) {
        // Intercambio entre slots
        prevParent.appendChild(existing);
        this.styleSlottedPiece(existing, parseInt(existing.dataset.correct), prevParent, pw, ph);
      } else {
        document.getElementById("puzzle-tray").appendChild(existing);
        existing.style.border = "2px solid #444";
        if (existing.classList.contains("placed")) {
          existing.classList.remove("placed");
          this.solved--;
          this.updateProgress();
        }
      }
    }

    // Coloca la pieza nueva en el slot
    slot.appendChild(piece);
    this.styleSlottedPiece(piece, correct, slot, pw, ph);
  },

  styleSlottedPiece(piece, correct, slot, pw, ph) {
    const slotIdx = parseInt(slot.dataset.index);
    piece.style.width   = `${pw}px`;
    piece.style.height  = `${ph}px`;
    piece.style.transform = "scale(1)";

    const wasPlaced = piece.classList.contains("placed");

    if (correct === slotIdx) {
      piece.style.border = "2px solid var(--green)";
      piece.style.boxShadow = "0 0 8px var(--green)";
      slot.style.opacity = "1";
      if (!wasPlaced) {
        piece.classList.add("placed");
        this.solved++;
        this.updateProgress();
        if (this.solved === this.total) {
          setTimeout(() => {
            alert("🎉 ¡Rompecabezas completado! ¡Giramos la ruleta!");
            this.onWin();
          }, 400);
        }
      }
    } else {
      piece.style.border = "2px solid #e53935";
      piece.style.boxShadow = "none";
      slot.style.opacity = "0.12";
      if (wasPlaced) {
        piece.classList.remove("placed");
        this.solved--;
        this.updateProgress();
      }
    }
  },

  updateProgress() {
    const el = document.getElementById("puzzle-progress");
    if (el) el.textContent = `✅ ${this.solved} / ${this.total} piezas colocadas`;
  },

  // ── Soporte táctil (drag & drop en móvil) ──
  initTouchSupport(board) {
    let draggedPiece = null;
    let ghost        = null;

    document.addEventListener("touchstart", e => {
      const piece = e.target.closest("[data-correct]");
      if (!piece) return;
      draggedPiece = piece;
      ghost        = piece.cloneNode(true);
      ghost.style.cssText += `
        position:fixed; opacity:.75; pointer-events:none;
        z-index:9999; transform:scale(1.08);
      `;
      document.body.appendChild(ghost);
    }, { passive: true });

    document.addEventListener("touchmove", e => {
      if (!ghost) return;
      e.preventDefault();
      const t = e.touches[0];
      ghost.style.left = `${t.clientX - ghost.offsetWidth / 2}px`;
      ghost.style.top  = `${t.clientY - ghost.offsetHeight / 2}px`;
    }, { passive: false });

    document.addEventListener("touchend", e => {
      if (!draggedPiece || !ghost) return;
      const t    = e.changedTouches[0];
      ghost.remove(); ghost = null;

      const el = document.elementFromPoint(t.clientX, t.clientY);
      const slot = el?.closest("[data-index]");
      if (slot && slot.closest("#puzzle-board")) {
        // Simula drop
        const correct  = parseInt(draggedPiece.dataset.correct);
        const boardEl  = document.getElementById("puzzle-board");
        const boardW   = boardEl.offsetWidth;
        const boardH   = boardEl.offsetHeight;
        const pw       = boardW / this.GRID;
        const ph       = boardH / this.GRID;
        const IMG      = "assets/photos/puzzle_photo.jpg";
        const existing = slot.querySelector("[data-correct]");
        if (existing && existing !== draggedPiece) {
          draggedPiece.parentElement.appendChild(existing);
          this.styleSlottedPiece(existing, parseInt(existing.dataset.correct),
            draggedPiece.parentElement, pw, ph);
        }
        slot.appendChild(draggedPiece);
        this.styleSlottedPiece(draggedPiece, correct, slot, pw, ph);
      }
      draggedPiece = null;
    }, { passive: true });
  },
};