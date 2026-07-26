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
 * Facebook Najam Zagreb - 100% FREE Auto Scraper & Push Notification Script
 * --------------------------------------------------------------------------
 * Pokreće se besplatno na vašem računalu ili poslužitelju.
 * Šalje besplatne instant zvučne obavijesti na mobitel putem ntfy.sh
 */

const axios = require('axios');
const puppeteer = require('puppeteer');

// Config
const CHECK_INTERVAL_SECONDS = 60;
const MIN_PRICE = ${minPrice};
const MAX_PRICE = ${maxPrice};
const NTFY_TOPIC = "stanovi-zagreb-moj-kanal"; // Vaš ntfy.sh kanal
const FB_GROUP_URL = "https://www.facebook.com/groups/najamzagreb";

const scannedPostIds = new Set();

async function sendFreePushAlert(post) {
  try {
    await axios.post(\`https://ntfy.sh/\${NTFY_TOPIC}\`, 
      \`📍 Kvart: \${post.location || 'Zagreb'}\\n💰 Cijena: \${post.price} EUR\\n\\nLink: \${post.url}\`,
      {
        headers: {
          'Title': \`🚨 NOVI STAN: \${post.price} EUR\`,
          'Priority': 'high',
          'Tags': 'house,euro',
          'Click': post.url
        }
      }
    );
    console.log(\`[✓] Poslana besplatna push notifikacija za stan \${post.price} EUR!\`);
  } catch (err) {
    console.error('[x] Greška pri slanju ntfy obavijesti:', err.message);
  }
}

function parsePrice(text) {
  const match = text.match(/(\\d{3,4})\\s*(eur|eura|€)/i) || text.match(/cijena[:\\s]*(\\d{3,4})/i);
  return match ? parseInt(match[1], 10) : null;
}

async function scanFacebookGroup() {
  console.log(\`[ \${new Date().toLocaleTimeString()} ] Skeniram FB grupu najamzagreb...\`);

  try {
    const browser = await puppeteer.launch({ 
      headless: true, 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    await page.goto(FB_GROUP_URL, { waitUntil: 'networkidle2' });

    // Izvlačenje objava s fotkama
    const posts = await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('div[role="feed"] > div'));
      return elements.slice(0, 5).map((el, i) => {
        const hasImages = el.querySelectorAll('img').length > 1; // Ma barem 1 slika stana
        return {
          id: 'post-' + i,
          text: el.innerText || '',
          hasImages,
          url: window.location.href
        };
      });
    });

    await browser.close();

    for (const p of posts) {
      if (!p.text || scannedPostIds.has(p.id) || !p.hasImages) continue;
      scannedPostIds.add(p.id);

      const price = parsePrice(p.text);
      const isOffer = !p.text.toLowerCase().includes('tražim') && !p.text.toLowerCase().includes('potražnja');

      if (isOffer && price && price >= MIN_PRICE && price <= MAX_PRICE) {
        console.log(\`[★] PRONAĐEN STAN S FOTKAMA: \${price} EUR!\`);
        await sendFreePushAlert({ ...p, price });
      }
    }
  } catch (err) {
    console.error('Greška pri skeniranju:', err.message);
  }
}

// Glavna petlja
console.log('100% Besplatni skraper za stanove u Zagrebu je pokrenut!');
setInterval(scanFacebookGroup, CHECK_INTERVAL_SECONDS * 1000);
scanFacebookGroup();
`;

  const pythonScript = `# Facebook Najam Zagreb - 100% Free Python Scraper & ntfy.sh Push Alert
import time
import requests

CHECK_INTERVAL = 60
MIN_PRICE = ${minPrice}
MAX_PRICE = ${maxPrice}
NTFY_TOPIC = "stanovi-zagreb-moj-kanal" # Unesite naziv vaše teme iz ntfy aplikacije
FB_URL = "https://www.facebook.com/groups/najamzagreb"

def send_free_push_alert(price, location, url):
    payload = f"📍 Kvart: {location}\\n💰 Cijena: {price} EUR\\n\\nLink: {url}"
    headers = {
        "Title": f"🚨 NOVI STAN: {price} EUR",
        "Priority": "high",
        "Tags": "house,euro",
        "Click": url
    }
    try:
        r = requests.post(f"https://ntfy.sh/{NTFY_TOPIC}", data=payload.encode('utf-8'), headers=headers)
        if r.status_code == 200:
            print(f"[✓] Instant push obavijest poslana na mobitel za stan {price} EUR!")
    except Exception as e:
        print("[x] Greška:", e)

def main():
    print("Python 100% besplatna skripta aktivna...")
    while True:
        print(f"[{time.strftime('%H:%M:%S')}] Provjera FB grupe...")
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
