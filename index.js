const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const TARGET_URL = "https://prosis.ir/bazar/store/4869";

app.get("/", (req, res) => {
  res.send("Prosis Scraper API is running ⚡️");
});

// -------------------------
//     محصولات
// -------------------------
app.get("/products", async (req, res) => {
  try {
    const { data: html } = await axios.get(TARGET_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0"
      }
    });

    const $ = cheerio.load(html);
    const items = [];

    $(".col-md-3.col-6.mb-3").each((_, el) => {
      const block = $(el);

      const title = block.find("h5.font-weight-bold").text().trim();
      const price = block.find("p.text-success.font-weight-bold").text().trim();
      const image = block.find("img").attr("src");
      const url = block.find("a").attr("href");

      if (title && price && image && url) {
        items.push({
          title,
          price,
          image: "https://prosis.ir" + image,
          url: "https://prosis.ir" + url
        });
      }
    });

    res.json(items);

  } catch (err) {
    console.error("❌ Scraper Error:", err);
    res.status(500).json({
      error: err.message,
      details: "مشکلی در گرفتن اطلاعات رخ داده است."
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on Render port ${PORT}`);
});
