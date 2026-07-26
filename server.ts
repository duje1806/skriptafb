import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { Post, MonitorSettings, MonitorStatus, LogEntry } from "./src/types.js";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  } catch (err) {
    console.error("Failed to initialize Gemini AI client:", err);
  }
}

// Default Monitor Settings
let monitorSettings: MonitorSettings = {
  enabled: true,
  intervalSeconds: 60,
  minPrice: 500,
  maxPrice: 700,
  targetGroupUrl: "https://www.facebook.com/groups/najamzagreb",
  keywords: ["Trešnjevka", "Jarun", "Centar", "Maksimir", "Lanište", "dvosobni", "garsonijera", "balkon"],
  excludeWords: ["tražim", "potražnja", "dijelim stan", "traži se"],
  aiFilterEnabled: true,
  dataMode: "simulated",
  whatsappConfig: {
    enabled: true,
    provider: "callmebot",
    phoneNumber: "+385912345678",
    apiKey: "123456"
  },
  telegramConfig: {
    enabled: false,
    botToken: "",
    chatId: ""
  },
  webhookConfig: {
    enabled: false,
    url: ""
  }
};

// Initial Realistic Seed Posts for Zagreb Rent Group
let postsStore: Post[] = [
  {
    id: "fb-101",
    title: "Novi dvosobni stan na Trešnjevci (Remiza)",
    content: "Iznajmljuje se moderan 2-sobni stan 52m2 na Trešnjevci u blizini Remize. Stan se sastoji od spavaće sobe, dnevnog boravka, kuhinje, kupaonice i balkona. Potpuno namješten, etažno plinsko grijanje. Cijena 650 EUR/mjesečno + režije. Polog 1 mjesečna najamnina. Dostupno odmah!",
    price: 650,
    currency: "EUR",
    location: "Trešnjevka",
    size: "52m²",
    author: "Marko Horvat",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    postUrl: "https://www.facebook.com/groups/najamzagreb/posts/101598273612/",
    postedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    scannedAt: new Date().toISOString(),
    isOffer: true,
    isInPriceRange: true,
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80"],
    matchedKeywords: ["Trešnjevka", "dvosobni", "balkon"],
    notificationSent: true,
    notificationLog: [
      {
        channel: "whatsapp",
        sentAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
        status: "success",
        recipient: "+385912345678"
      }
    ]
  },
  {
    id: "fb-102",
    title: "Garsonijera u blizini Kvatrića",
    content: "Daje se u najam uredna garsonijera 28m2 na Maksimirskoj blizu Kvatrića. Treći kat bez lifta. Perilica rublja, klima, centralno grijanje. Cijena je 550 eura fiksno sa uključenim dijelom režija. Traže se uredni zaposleni samci ili studenti.",
    price: 550,
    currency: "EUR",
    location: "Kvatrić / Maksimir",
    size: "28m²",
    author: "Ana Babić",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
    postUrl: "https://www.facebook.com/groups/najamzagreb/posts/101598273613/",
    postedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    scannedAt: new Date().toISOString(),
    isOffer: true,
    isInPriceRange: true,
    images: ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80"],
    matchedKeywords: ["garsonijera", "Maksimir"],
    notificationSent: true,
    notificationLog: [
      {
        channel: "whatsapp",
        sentAt: new Date(Date.now() - 1000 * 60 * 44).toISOString(),
        status: "success",
        recipient: "+385912345678"
      }
    ]
  },
  {
    id: "fb-103",
    title: "Tražim stan u centru ili širem centru do 600€",
    content: "Bok svima! Zaposleni sam par u kasnim dvadesetima. Tražimo jednosobni ili dvosobni stan u uži ili širi centar Zagreba do 600 EUR s režijama. Nepušači, nemamo kućne ljubimce. Ponude u inbox!",
    price: 600,
    currency: "EUR",
    location: "Centar",
    size: "Dvosobni",
    author: "Ivan & Petra",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
    postUrl: "https://www.facebook.com/groups/najamzagreb/posts/101598273614/",
    postedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    scannedAt: new Date().toISOString(),
    isOffer: false, // Potražnja - FILTERED OUT!
    isInPriceRange: false,
    images: [],
    matchedKeywords: [],
    notificationSent: false
  },
  {
    id: "fb-104",
    title: "Luksuzni trosobni stan Jarun s garažom",
    content: "Iznajmljuje se prekrasan stan 85m2 na Jarunu (uz jezero). 3 sobe, ogromna terasa, garažno mjesto, novogradnja, klima u svakoj sobi. Cijena 1100 EUR + režije.",
    price: 1100,
    currency: "EUR",
    location: "Jarun",
    size: "85m²",
    author: "Luka Kovačić",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80",
    postUrl: "https://www.facebook.com/groups/najamzagreb/posts/101598273615/",
    postedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    scannedAt: new Date().toISOString(),
    isOffer: true,
    isInPriceRange: false, // Too expensive! 1100 EUR (>700)
    images: ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80"],
    matchedKeywords: ["Jarun"],
    notificationSent: false
  }
];

// Operational Logs
let logsStore: LogEntry[] = [
  {
    id: "log-1",
    timestamp: new Date().toLocaleTimeString('hr-HR'),
    type: "info",
    message: "Sustav za praćenje pokrenut. Grupa: facebook.com/groups/najamzagreb (Interval: 60s, Rang: 500€ - 700€)"
  },
  {
    id: "log-2",
    timestamp: new Date(Date.now() - 1000 * 60 * 14).toLocaleTimeString('hr-HR'),
    type: "success",
    message: "Pronađen stan na Trešnjevci (650 EUR). Poslana WhatsApp notifikacija na +385912345678."
  }
];

// Interval Runner Variables
let nextCheckSeconds = monitorSettings.intervalSeconds;
let totalScanned = 18;
let totalMatched = 2;
let totalNotificationsSent = 2;

// Generator of realistic Zagreb apartment posts for simulated live stream
const ZAGREB_LOCATIONS = [
  "Trešnjevka sjever", "Trešnjevka jug", "Jarun", "Maksimir", "Centar", 
  "Lanište", "Dubrava", "Novi Zagreb - Središće", "Siget", "Vrbani", 
  "Knežija", "Španovsko", "Gajnice", "Črnomerec"
];

const LANDLORD_NAMES = [
  "Ivan Radić", "Martina Jurić", "Tomislav Car", "Katarina Perić",
  "Goran Filipović", "Sanja Tomić", "Davor Knežević", "Elena Marić"
];

const APARTMENT_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&auto=format&fit=crop&q=80"
];

// AI Gemini cooldown state
let geminiCooldownUntil = 0;

// Helper: Parse text using Gemini or Regex fallback
async function parsePostContent(content: string): Promise<{
  price: number | null;
  location: string;
  size: string;
  isOffer: boolean;
  matchedKeywords: string[];
}> {
  const contentLower = content.toLowerCase();

  // Check if request (potražnja) vs offer (ponuda)
  const isRequest = monitorSettings.excludeWords.some(w => contentLower.includes(w.toLowerCase()));
  const isOffer = !isRequest;

  // Try Gemini AI parsing if key available, enabled, and not in cooldown
  if (aiClient && monitorSettings.aiFilterEnabled && Date.now() > geminiCooldownUntil) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `Analiziraj ovaj tekst oglasa iz Facebook grupe za najam stanova u Zagrebu i vrati JSON sa sljedećim poljima:
- price: broj u EUR (ili null ako nema cijene)
- location: kvart u Zagrebu (npr. Trešnjevka, Jarun, Centar...)
- size: opis veličine (npr. 45m2 ili dvosobni)
- isOffer: boolean (true ako se stan iznajmljuje/daje u najam, false ako netko traži stan za sebe)

Tekst oglasa:
"${content}"

Vrati SAMO čisti JSON bez markdown oznaka.`
      });

      const text = response.text || "";
      const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);

      // Check keywords
      const matched = monitorSettings.keywords.filter(k => 
        contentLower.includes(k.toLowerCase()) || (parsed.location && parsed.location.toLowerCase().includes(k.toLowerCase()))
      );

      return {
        price: typeof parsed.price === 'number' ? parsed.price : extractPriceRegex(content),
        location: parsed.location || extractLocationRegex(content),
        size: parsed.size || "Dvosobni",
        isOffer: Boolean(parsed.isOffer),
        matchedKeywords: matched
      };
    } catch (e: any) {
      const errStr = String(e?.message || e || "");
      if (errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("Quota exceeded")) {
        geminiCooldownUntil = Date.now() + 60 * 1000; // 60s cooldown
        console.log("[AI Parser] Gemini free tier rate limit reached (429). Using Regex parser fallback for 60s.");
      } else {
        console.log("[AI Parser] Gemini parse error, using Regex parser fallback:", e?.message || e);
      }
    }
  }

  // Regex fallback parser
  const price = extractPriceRegex(content);
  const location = extractLocationRegex(content);
  const matched = monitorSettings.keywords.filter(k => contentLower.includes(k.toLowerCase()));

  return {
    price,
    location,
    size: contentLower.includes("garsonijera") ? "Garsonijera" : contentLower.includes("trosobni") ? "Trosobni" : "Dvosobni",
    isOffer,
    matchedKeywords: matched
  };
}

function extractPriceRegex(text: string): number | null {
  const priceMatches = text.match(/(\d{3,4})\s*(eur|eura|€|\/mj)/i) || text.match(/cijena[:\s]*(\d{3,4})/i);
  if (priceMatches && priceMatches[1]) {
    return parseInt(priceMatches[1], 10);
  }
  return null;
}

function extractLocationRegex(text: string): string {
  for (const loc of ZAGREB_LOCATIONS) {
    if (text.toLowerCase().includes(loc.toLowerCase())) {
      return loc;
    }
  }
  return "Zagreb (širi centar)";
}

// Notification Trigger Functions
async function sendWhatsappNotification(post: Post, forceSend = false): Promise<{ success: boolean; detail?: string }> {
  const cfg = monitorSettings.whatsappConfig;
  if (!cfg.enabled && !forceSend) return { success: false, detail: 'WhatsApp notifikacije nisu uključene u postavkama.' };

  const msgText = `🚨 *NOVA PONUDA STANA U ZAGREBU!* 🚨\n\n` +
    `📍 *Lokacija:* ${post.location}\n` +
    `💰 *Cijena:* ${post.price} EUR/mj\n` +
    `📐 *Veličina:* ${post.size || 'Stan'}\n` +
    `👤 *Iznajmljuje:* ${post.author}\n\n` +
    `📝 *Opis:* ${post.content.slice(0, 160)}...\n\n` +
    `🔗 *FB Oglas:* ${post.postUrl}`;

  if (cfg.provider === 'callmebot') {
    if (!cfg.phoneNumber || cfg.phoneNumber === '+385912345678' || !cfg.apiKey) {
      return { success: false, detail: 'Upišite vaš broj mobitela (+385) i CallMeBot API Key.' };
    }
    try {
      const cleanPhone = cfg.phoneNumber.replace(/[^0-9+]/g, '');
      const encodedMsg = encodeURIComponent(msgText);
      const url = `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(cleanPhone)}&text=${encodedMsg}&apikey=${encodeURIComponent(cfg.apiKey)}`;
      console.log(`[WhatsApp CallMeBot] Triggering alert for phone ${cleanPhone}...`);
      
      const res = await fetch(url, { method: 'GET' });
      const responseText = await res.text();
      
      if (res.ok && (responseText.toLowerCase().includes('queued') || responseText.toLowerCase().includes('ok') || responseText.includes('200'))) {
        return { success: true, detail: 'Poruka predana CallMeBot servisu.' };
      } else {
        console.warn("[CallMeBot response warning]:", responseText);
        return { success: false, detail: `CallMeBot: ${responseText.slice(0, 120)}` };
      }
    } catch (err: any) {
      console.error("CallMeBot fetch error:", err);
      return { success: false, detail: `Mrežna greška: ${err.message}` };
    }
  }

  return { success: true, detail: 'Simulirano slanje' };
}

async function sendTelegramNotification(post: Post, forceSend = false): Promise<{ success: boolean; detail?: string }> {
  const cfg = monitorSettings.telegramConfig;
  if ((!cfg.enabled && !forceSend) || !cfg.botToken || !cfg.chatId) {
    return { success: false, detail: 'Telegram Bot token ili Chat ID nisu uneseni.' };
  }

  const msgText = `🏢 *NOVI STAN NAJAM ZAGREB (${post.price} EUR)*\n\n` +
    `*Kvart:* ${post.location}\n` +
    `*Iznajmljuje:* ${post.author}\n` +
    `*Link:* [Pogledaj obja na Facebooku](${post.postUrl})\n\n` +
    `${post.content.slice(0, 200)}...`;

  try {
    const url = `https://api.telegram.org/bot${cfg.botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: cfg.chatId,
        text: msgText,
        parse_mode: 'Markdown',
        disable_web_page_preview: false
      })
    });
    if (res.ok) {
      return { success: true, detail: 'Telegram poruka poslana.' };
    } else {
      const data = await res.json() as any;
      return { success: false, detail: `Telegram error: ${data.description || 'Greška'}` };
    }
  } catch (err: any) {
    return { success: false, detail: `Telegram mrežna greška: ${err.message}` };
  }
}

async function sendWebhookNotification(post: Post): Promise<boolean> {
  const cfg = monitorSettings.webhookConfig;
  if (!cfg.enabled || !cfg.url) return false;

  try {
    const res = await fetch(cfg.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'new_apartment_found',
        price: post.price,
        location: post.location,
        url: post.postUrl,
        post
      })
    });
    return res.ok;
  } catch (err) {
    console.error("Webhook notification error:", err);
    return false;
  }
}

// Simulated Generator for new Facebook Posts
async function generateAndCheckNewPost() {
  totalScanned++;
  
  // Decide price range to simulate realistic variance
  // 50% chance inside 500-700€, 50% outside
  const isMatchPrice = Math.random() < 0.6;
  const price = isMatchPrice 
    ? Math.floor(Math.random() * (700 - 500 + 1)) + 500 // 500 - 700
    : Math.random() < 0.5 ? Math.floor(Math.random() * 150) + 350 : Math.floor(Math.random() * 400) + 750; // 350-500 or 750-1150
  
  const loc = ZAGREB_LOCATIONS[Math.floor(Math.random() * ZAGREB_LOCATIONS.length)];
  const author = LANDLORD_NAMES[Math.floor(Math.random() * LANDLORD_NAMES.length)];
  const img = APARTMENT_IMAGES[Math.floor(Math.random() * APARTMENT_IMAGES.length)];
  const postId = `fb-${Date.now().toString().slice(-6)}`;

  const content = `Iznajmljuje se prekrasan namješten stan u kvartu ${loc}. Stan ima 2 sobe, potpuno opremljenu kuhinju, kupaonicu i perilicu rublja. Blizina javnog prijevoza i trgovina. Cijena je ${price} EUR mjesečno. Polog u visini jedne stanarine. Zvati na broj ili poruka u inbox.`;

  const parsed = await parsePostContent(content);
  
  const isInPriceRange = Boolean(
    parsed.isOffer && 
    parsed.price !== null && 
    parsed.price >= monitorSettings.minPrice && 
    parsed.price <= monitorSettings.maxPrice
  );

  const newPost: Post = {
    id: postId,
    title: `Stan ${loc} (${price} EUR)`,
    content,
    price: parsed.price,
    currency: "EUR",
    location: loc,
    size: parsed.size,
    author,
    authorAvatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random()*100000)}?w=100&auto=format&fit=crop&q=80`,
    postUrl: `https://www.facebook.com/groups/najamzagreb/posts/${postId}/`,
    postedAt: new Date().toISOString(),
    scannedAt: new Date().toISOString(),
    isOffer: parsed.isOffer,
    isInPriceRange,
    images: [img],
    matchedKeywords: parsed.matchedKeywords,
    notificationSent: false,
    notificationLog: []
  };

  postsStore.unshift(newPost);
  // Keep store capped at 50 posts
  if (postsStore.length > 50) postsStore.pop();

  if (isInPriceRange) {
    totalMatched++;
    totalNotificationsSent++;
    newPost.notificationSent = true;

    // Dispatch notifications
    const waResult = await sendWhatsappNotification(newPost);
    const tgResult = await sendTelegramNotification(newPost);
    const whResult = await sendWebhookNotification(newPost);

    newPost.notificationLog = [
      {
        channel: "whatsapp",
        sentAt: new Date().toISOString(),
        status: waResult ? "success" : "simulated",
        recipient: monitorSettings.whatsappConfig.phoneNumber
      }
    ];

    addLog('success', `🎉 PRONAĐEN STAN! ${loc} - ${price} EUR! Poslana notifikacija na WhatsApp.`);
  } else {
    addLog('info', `Pregledana objava: ${loc} (${price ? price + ' EUR' : 'Bez cijene'}). Izvan zadanog ranga [500-700€].`);
  }
}

function addLog(type: 'info' | 'success' | 'warning' | 'error', message: string) {
  const entry: LogEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    timestamp: new Date().toLocaleTimeString('hr-HR'),
    type,
    message
  };
  logsStore.unshift(entry);
  if (logsStore.length > 40) logsStore.pop();
}

// Global 1-second background ticker
setInterval(async () => {
  if (!monitorSettings.enabled) return;

  nextCheckSeconds--;
  if (nextCheckSeconds <= 0) {
    nextCheckSeconds = monitorSettings.intervalSeconds;
    addLog('info', `Sekunda 0: Pokreće se provjera grupe facebook.com/groups/najamzagreb...`);
    try {
      await generateAndCheckNewPost();
    } catch (e) {
      console.error("Scan error:", e);
      addLog('error', `Greška pri skeniranju: ${String(e)}`);
    }
  }
}, 1000);

// API Endpoints
app.get("/api/status", (req, res) => {
  res.json({
    isRunning: monitorSettings.enabled,
    intervalSeconds: monitorSettings.intervalSeconds,
    lastCheckTime: new Date().toLocaleTimeString('hr-HR'),
    nextCheckSeconds,
    totalScanned,
    totalMatched,
    totalNotificationsSent,
    settings: monitorSettings,
    logs: logsStore
  });
});

app.get("/api/posts", (req, res) => {
  const filter = req.query.filter as string; // 'all' | 'matched' | 'offers'
  let results = [...postsStore];
  if (filter === 'matched') {
    results = results.filter(p => p.isInPriceRange);
  } else if (filter === 'offers') {
    results = results.filter(p => p.isOffer);
  }
  res.json(results);
});

app.post("/api/settings", (req, res) => {
  const newSettings = req.body as Partial<MonitorSettings>;
  monitorSettings = { ...monitorSettings, ...newSettings };
  if (newSettings.intervalSeconds) {
    nextCheckSeconds = newSettings.intervalSeconds;
  }
  addLog('info', `Postavke praćenja ažurirane (Rang: ${monitorSettings.minPrice}€ - ${monitorSettings.maxPrice}€, Interval: ${monitorSettings.intervalSeconds}s).`);
  res.json({ status: "ok", settings: monitorSettings });
});

app.post("/api/toggle", (req, res) => {
  monitorSettings.enabled = !monitorSettings.enabled;
  if (monitorSettings.enabled) {
    nextCheckSeconds = monitorSettings.intervalSeconds;
    addLog('info', 'Sustav praćenja je POKRENUT.');
  } else {
    addLog('warning', 'Sustav praćenja je PAUZIRAN.');
  }
  res.json({ status: "ok", isRunning: monitorSettings.enabled });
});

app.post("/api/check-now", async (req, res) => {
  addLog('info', 'Ručno pokrenuta trenutna provjera grupe najamzagreb...');
  await generateAndCheckNewPost();
  nextCheckSeconds = monitorSettings.intervalSeconds;
  res.json({ status: "ok", message: "Provjera završena." });
});

app.post("/api/test-notification", async (req, res) => {
  const { channel, phone, apiKey, botToken, chatId } = req.body;
  
  const samplePost: Post = {
    id: "test-999",
    title: "Testna Objava - Stan Trešnjevka (620 EUR)",
    content: "Ovo je testna poruka sa sustava Najam Zagreb Monitor. Ako vidite ovu poruku, vaše notifikacije rade savršeno!",
    price: 620,
    currency: "EUR",
    location: "Trešnjevka",
    size: "50m²",
    author: "Zagreb Monitor Bot",
    postUrl: "https://www.facebook.com/groups/najamzagreb",
    postedAt: new Date().toISOString(),
    scannedAt: new Date().toISOString(),
    isOffer: true,
    isInPriceRange: true,
    images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&auto=format&fit=crop&q=80"],
    matchedKeywords: ["Trešnjevka"],
    notificationSent: true
  };

  let result: { success: boolean; detail?: string } = { success: false, detail: 'Nepoznat kanal' };
  if (channel === 'whatsapp') {
    const origPhone = monitorSettings.whatsappConfig.phoneNumber;
    const origKey = monitorSettings.whatsappConfig.apiKey;
    if (phone) monitorSettings.whatsappConfig.phoneNumber = phone;
    if (apiKey) monitorSettings.whatsappConfig.apiKey = apiKey;

    result = await sendWhatsappNotification(samplePost, true);

    monitorSettings.whatsappConfig.phoneNumber = origPhone;
    monitorSettings.whatsappConfig.apiKey = origKey;
  } else if (channel === 'telegram') {
    const origToken = monitorSettings.telegramConfig.botToken;
    const origChat = monitorSettings.telegramConfig.chatId;
    if (botToken) monitorSettings.telegramConfig.botToken = botToken;
    if (chatId) monitorSettings.telegramConfig.chatId = chatId;

    result = await sendTelegramNotification(samplePost, true);

    monitorSettings.telegramConfig.botToken = origToken;
    monitorSettings.telegramConfig.chatId = origChat;
  }

  addLog(result.success ? 'success' : 'warning', `Testna ${channel} notifikacija: ${result.detail}`);
  res.json({ status: result.success ? "success" : "warning", detail: result.detail });
});

app.post("/api/parse-custom-post", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400).json({ error: "Sadržaj oglasa je obavezan." });
    return;
  }

  const parsed = await parsePostContent(text);
  const isInPriceRange = Boolean(
    parsed.isOffer &&
    parsed.price !== null &&
    parsed.price >= monitorSettings.minPrice &&
    parsed.price <= monitorSettings.maxPrice
  );

  res.json({
    parsed,
    isInPriceRange,
    minPrice: monitorSettings.minPrice,
    maxPrice: monitorSettings.maxPrice
  });
});

// Start Express Server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
