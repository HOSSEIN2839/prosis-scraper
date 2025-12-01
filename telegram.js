import fetch from "node-fetch";

export async function sendTelegramMessage(chatId, text, keyboard = null) {
  const BOT_TOKEN = "8351783060:AAE93rvP10AFnR_xea8JaomIQzDDJo_HRbE"; // توکن از محیط
  const payload = { chat_id: chatId, text, parse_mode: "HTML" };
  if (keyboard) payload.reply_markup = keyboard;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function sendTelegramPhoto(chatId, photo, caption) {
  const BOT_TOKEN = process.env.BOT_TOKEN;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, photo, caption, parse_mode: "HTML" })
  });
}
