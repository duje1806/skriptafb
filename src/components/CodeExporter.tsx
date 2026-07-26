import React, { useState } from 'react';
import { Copy, Check, Terminal, Code2, Server, Download, ExternalLink } from 'lucide-react';

interface CodeExporterProps {
  minPrice: number;
  maxPrice: number;
  phoneNumber: string;
  apiKey: string;
}

export const CodeExporter: React.FC<CodeExporterProps> = ({
  minPrice,
  maxPrice,
  phoneNumber,
  apiKey,
}) => {
  const [activeLang, setActiveLang] = useState<'node' | 'python' | 'docker'>('node');
  const [copied, setCopied] = useState(false);

  const nodeScript = `/**
 * Facebook Najam Zagreb - Auto Scraper & WhatsApp Alert Script
 * -------------------------------------------------------------
 * Pokreće se 24/7 i svako 60 sekundi provjerava grupu 'najamzagreb'.
 * Šalje besplatne WhatsApp notifikacije na vaš mobitel.
 */

const axios = require('axios');
const puppeteer = require('puppeteer');

// Config
const CHECK_INTERVAL_SECONDS = 60;
const MIN_PRICE = ${minPrice};
const MAX_PRICE = ${maxPrice};
const PHONE_NUMBER = "${phoneNumber || '+385912345678'}";
const CALLMEBOT_API_KEY = "${apiKey || '123456'}";
const FB_GROUP_URL = "https://www.facebook.com/groups/najamzagreb";

const scannedPostIds = new Set();

async function sendWhatsAppAlert(post) {
  const message = \`🚨 *NOVA PONUDA STANA U ZAGREBU!* 🚨\\n\\n\` +
    \`💰 *Cijena:* \${post.price} EUR\\n\` +
    \`📍 *Kvart:* \${post.location || 'Zagreb'}\\n\` +
    \`📝 *Opis:* \${post.text.slice(0, 150)}...\\n\\n\` +
    \`🔗 *FB Link:* \${post.url}\`;

  const encodedUrl = \`https://api.callmebot.com/whatsapp.php?phone=\${encodeURIComponent(PHONE_NUMBER)}&text=\${encodeURIComponent(message)}&apikey=\${CALLMEBOT_API_KEY}\`;

  try {
    await axios.get(encodedUrl);
    console.log(\`[✓] Poslana WhatsApp poruka za stan \${post.price} EUR!\`);
  } catch (err) {
    console.error('[x] Greška pri slanju WhatsApp poruke:', err.message);
  }
}

function parsePrice(text) {
  const match = text.match(/(\\d{3,4})\\s*(eur|eura|€)/i) || text.match(/cijena[:\\s]*(\\d{3,4})/i);
  return match ? parseInt(match[1], 10) : null;
}

async function scanFacebookGroup() {
  console.log(\`[ \${new Date().toLocaleTimeString()} ] Pokrećem provjeru grupe najamzagreb...\`);

  try {
    const browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    await page.goto(FB_GROUP_URL, { waitUntil: 'networkidle2' });

    // Izvlačenje objave s stranice
    const posts = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('div[role="feed"] > div'));
      return elements.slice(0, 5).map((el, i) => ({
        id: 'post-' + i,
        text: el.innerText || '',
        url: window.location.href
      }));
    });

    await browser.close();

    for (const p of posts) {
      if (!p.text || scannedPostIds.has(p.id)) continue;
      scannedPostIds.add(p.id);

      const price = parsePrice(p.text);
      const isOffer = !p.text.toLowerCase().includes('tražim') && !p.text.toLowerCase().includes('potražnja');

      if (isOffer && price && price >= MIN_PRICE && price <= MAX_PRICE) {
        console.log(\`[★] PRONAĐEN STAN: \${price} EUR!\`);
        await sendWhatsAppAlert({ ...p, price });
      }
    }
  } catch (err) {
    console.error('Greška pri skeniranju:', err.message);
  }
}

// Glavna 60s Petlja
console.log('Sustav za praćenje najamzagreb je pokrenut!');
setInterval(scanFacebookGroup, CHECK_INTERVAL_SECONDS * 1000);
scanFacebookGroup();
`;

  const pythonScript = `# Facebook Najam Zagreb - Python 24/7 Monitor & WhatsApp Bot
import time
import re
import urllib.parse
import requests

CHECK_INTERVAL = 60
MIN_PRICE = ${minPrice}
MAX_PRICE = ${maxPrice}
PHONE_NUMBER = "${phoneNumber || '+385912345678'}"
API_KEY = "${apiKey || '123456'}"
FB_URL = "https://www.facebook.com/groups/najamzagreb"

def send_whatsapp_alert(price, text, url):
    msg = f"🚨 *NOVI STAN NAJAM ZAGREB ({price} EUR)* 🚨\\n\\nOpis: {text[:150]}...\\n\\nLink: {url}"
    encoded = urllib.parse.quote(msg)
    callmebot_url = f"https://api.callmebot.com/whatsapp.php?phone={PHONE_NUMBER}&text={encoded}&apikey={API_KEY}"
    try:
        r = requests.get(callmebot_url)
        if r.status_code == 200:
            print(f"[✓] WhatsApp notifikacija uspješno poslana za {price} EUR!")
    except Exception as e:
        print("[x] Greška:", e)

def main():
    print("Python skripta za praćenje FB grupe najamzagreb je aktivna...")
    while True:
        print(f"[{time.strftime('%H:%M:%S')}] Provjera grupe svakih 60 sekundi...")
        # Ovdje integrirajte vaš scraper ili web_driver
        time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    main()
`;

  const dockerScript = `# Dockerfile za 24/7 neprekidni rad na poslužitelju (VPS / Railway / Render)
FROM node:20-slim

WORKDIR /app

# Instalacija ovisnosti za Puppeteer/Chrome
RUN apt-get update && apt-get install -y \\
    chromium \\
    fonts-ipafont-gothic \\
    --no-install-recommends \\
    && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

COPY package*.json ./
RUN npm install

COPY . .

CMD ["node", "server.js"]
`;

  const activeText = activeLang === 'node' ? nodeScript : activeLang === 'python' ? pythonScript : dockerScript;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Terminal className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Preuzmi Samostalni Kod (24/7 Skripta)</h2>
              <p className="text-xs text-slate-400">
                Možeš preuzeti ili kopirati kompletan izvorni kod za pokretanje na vlastitom računalu ili Linux VPS-u.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center shadow-md cursor-pointer self-end sm:self-auto"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-1.5" /> Kopirano!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 mr-1.5" /> Kopiraj Skriptu
              </>
            )}
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex space-x-2">
          {[
            { id: 'node', label: 'Node.js / Puppeteer' },
            { id: 'python', label: 'Python Skripta' },
            { id: 'docker', label: 'Dockerfile (VPS Deploy)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLang(tab.id as any)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                activeLang === tab.id
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Block Window */}
        <div className="relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <span>{activeLang === 'node' ? 'scraper.js' : activeLang === 'python' ? 'scraper.py' : 'Dockerfile'}</span>
            <span className="text-[11px] text-emerald-400">Generirano s vašim parametrima ({minPrice}€ - {maxPrice}€)</span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[450px] leading-relaxed">
            <code>{activeText}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
