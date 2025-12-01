import { sendTelegramMessage, sendTelegramPhoto } from "./telegram.js";
import { getProducts } from "./scraper.js";
import express from "express";

const app = express();
app.use(express.json());

const ADMIN_ID = 1427556598;
const BOT_TOKEN = process.env.BOT_TOKEN; // از Render environment variables

app.get("/", (req, res) => res.send("Telegram Bot is running ✅"));

app.post("/", async (req, res) => {
  const update = req.body;
  const message = update.message;
  if (!message) return res.send("ok");

  const chatId = message.chat.id;
  const text = message.text || "";

  // /start
  if (text === "/start") {
    await sendTelegramMessage(chatId, "به ربات صبحانه شیروان خوش آمدید 🍞🥛", {
      keyboard: [
        [{ text: "منوی محصولات 🍽" }],
        [{ text: "ساعات کاری ⏰" }, { text: "آدرس 📍" }]
      ],
      resize_keyboard: true
    });
    return res.send("ok");
  }

  // منوی محصولات
  if (text === "منوی محصولات 🍽") {
    await sendTelegramMessage(chatId, "⏳ در حال بارگیری محصولات...");
    const items = await getProducts();

    if (items.length === 0) {
      await sendTelegramMessage(chatId, `❌ هیچ محصولی پیدا نشد!
🔍 تعداد محصولات پیدا شده: 0`);
      return res.send("ok");
    }

    for (const p of items) {
      await sendTelegramPhoto(chatId, p.image, `🍽 <b>${p.title}</b>\n💰 قیمت: ${p.price}\n🔗 <a href="${p.url}">مشاهده محصول</a>`);
    }

    return res.send("ok");
  }

  // ساعات کاری
  if (text === "ساعات کاری ⏰") {
    await sendTelegramMessage(chatId, "⏰ هر روز از 7 صبح تا 2 ظهر");
    return res.send("ok");
  }

  // آدرس
  if (text === "آدرس 📍") {
    await sendTelegramMessage(chatId, "📍 شیروان – مرکز شهر – صبحانه شیروان");
    return res.send("ok");
  }

  return res.send("ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Bot is running on port ${PORT}`));
