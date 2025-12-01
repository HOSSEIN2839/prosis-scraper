import fetch from "node-fetch";

export async function getProducts() {
  const TARGET_URL = "https://prosis.ir/bazar/store/4869";
  try {
    const res = await fetch(TARGET_URL, { headers: { "User-Agent": "Mozilla/5.0" } });
    const html = await res.text();

    // استخراج بلوک‌ها
    const productRegex = /<div class="col-md-3 col-6 mb-3">([\s\S]*?)<\/div>/g;
    const products = [];
    let match;

    while ((match = productRegex.exec(html)) !== null) {
      const block = match[1];
      const title = block.match(/<h5 class="font-weight-bold">([^<]+)<\/h5>/)?.[1]?.trim();
      const price = block.match(/<p class="text-success font-weight-bold">([^<]+)<\/p>/)?.[1]?.trim();
      const image = block.match(/<img[^>]+src="([^"]+)"/)?.[1];
      const url = block.match(/<a[^>]+href="([^"]+)"/)?.[1];

      if (title && price && image && url) {
        products.push({
          title,
          price,
          image: "https://prosis.ir" + image,
          url: "https://prosis.ir" + url
        });
      }
    }

    return products;

  } catch (e) {
    console.error("Scraper Error:", e.message);
    return [];
  }
}
