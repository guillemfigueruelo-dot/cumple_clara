const Telegram = {
  async notify(message) {
    const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CONFIG.TELEGRAM_CHAT_ID,
          text: `🚨 ALERTA CUMPLEAÑOS 🚨\n\n${message}`,
          parse_mode: "HTML",
        }),
      });
    } catch (e) {
      console.warn("Telegram notify failed:", e);
    }
  },
};