const axios = require('axios');
const puppeteer = require('puppeteer');

const MIN_PRICE = process.env.MIN_PRICE || 500;
const MAX_PRICE = process.env.MAX_PRICE || 700;
const PHONE_NUMBER = process.env.PHONE_NUMBER;
const CALLMEBOT_API_KEY = process.env.CALLMEBOT_API_KEY;
const FB_GROUP_URL = "https://www.facebook.com/groups/najamzagreb";

async function sendWhatsAppAlert(price, text, url) {
  const message = `🚨 *NOVI STAN NAJAM ZAGREB (${price} EUR)* 🚨\n\nOpis: ${text.slice(0, 150)}...\n\nLink: ${url}`;
  const encodedUrl = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(PHONE_NUMBER)}&text=${encodeURIComponent(message)}&apikey=${CALLMEBOT_API_KEY}`;
  
  try {
    await axios.get(encodedUrl);
    console.log(`[✓] Poslana WhatsApp poruka za stan od ${price} EUR!`);
  } catch (err) {
    console.error('[x] Greška pri slanju:', err.message);
  }
}

async function runScraper() {
  console.log('Skeniram Facebook grupu...');
  const browser = await puppeteer.launch({ 
    headless: true, 
    args: ['--no-sandbox', '--disable-setuid-sandbox'] 
  });
  const page = await browser.newPage();
  await page.goto(FB_GROUP_URL, { waitUntil: 'networkidle2' });

  // Izvlačenje najnovijih objava
  const posts = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('div[role="feed"] > div'));
    return elements.slice(0, 5).map((el) => ({ text: el.innerText || '', url: window.location.href }));
  });

  await browser.close();

  for (const p of posts) {
    const match = p.text.match(/(\d{3,4})\s*(eur|eura|€)/i);
    const price = match ? parseInt(match[1], 10) : null;
    const isOffer = !p.text.toLowerCase().includes('tražim') && !p.text.toLowerCase().includes('potražnja');

    if (isOffer && price && price >= MIN_PRICE && price <= MAX_PRICE) {
      console.log(`[★] PRONAĐEN STAN: ${price} EUR!`);
      await sendWhatsAppAlert(price, p.text, p.url);
    }
  }
}

runScraper();
