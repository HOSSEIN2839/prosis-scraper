const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const TARGET_URL = "https://prosis.ir/bazar/store/4869";

// Endpoint برای دریافت محصولات
app.get("/products", async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();
    await page.goto(TARGET_URL, { waitUntil: "networkidle2" });

    const products = await page.evaluate(() => {
      const items = [];
      document.querySelectorAll(".col-md-3.col-6.mb-3").forEach(block => {
        const title = block.querySelector("h5.font-weight-bold")?.innerText.trim();
        const price = block.querySelector("p.text-success.font-weight-bold")?.innerText.trim();
        const image = block.querySelector("img")?.src;
        const url = block.querySelector("a")?.href;

        if (title && price && image && url) items.push({ title, price, image, url });
      });
      return items;
    });

    await browser.close();
    res.json(products);

  } catch (err) {
    console.error("خطا در استخراج محصولات:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
