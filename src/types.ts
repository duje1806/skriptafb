export interface Post {
  id: string;
  title: string;
  content: string;
  price: number | null;
  currency: string;
  location: string;
  size?: string;
  author: string;
  authorAvatar?: string;
  postUrl: string;
  postedAt: string;
  scannedAt: string;
  isOffer: boolean; // true = iznajmljuje se (ponuda), false = traži se (potražnja)
  isInPriceRange: boolean; // npr. 500€ - 700€
  images: string[];
  matchedKeywords: string[];
  notificationSent: boolean;
  notificationLog?: {
    channel: 'whatsapp' | 'telegram' | 'webhook' | 'simulator';
    sentAt: string;
    status: 'success' | 'failed' | 'simulated';
    recipient?: string;
    error?: string;
  }[];
}

export interface WhatsappConfig {
  enabled: boolean;
  provider: 'callmebot' | 'twilio' | 'greenapi' | 'webhook';
  phoneNumber: string; // e.g. +385912345678
  apiKey: string; // CallMeBot API Key
  accountSid?: string; // Twilio SID
  authToken?: string; // Twilio Auth Token
  fromNumber?: string; // Twilio Sender Number
}

export interface TelegramConfig {
  enabled: boolean;
  botToken: string;
  chatId: string;
}

export interface WebhookConfig {
  enabled: boolean;
  url: string;
}

export interface MonitorSettings {
  enabled: boolean;
  intervalSeconds: number; // e.g. 60
  minPrice: number; // e.g. 500
  maxPrice: number; // e.g. 700
  targetGroupUrl: string;
  keywords: string[];
  excludeWords: string[];
  aiFilterEnabled: boolean;
  dataMode: 'simulated' | 'apify' | 'rss_bridge' | 'custom_webhook';
  apifyToken?: string;
  apifyActorId?: string;
  whatsappConfig: WhatsappConfig;
  telegramConfig: TelegramConfig;
  webhookConfig: WebhookConfig;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface MonitorStatus {
  isRunning: boolean;
  intervalSeconds: number;
  lastCheckTime: string | null;
  nextCheckSeconds: number;
  totalScanned: number;
  totalMatched: number;
  totalNotificationsSent: number;
  settings: MonitorSettings;
  logs: LogEntry[];
}

export interface WhatsAppIncomingMessage {
  id: string;
  senderName: string;
  time: string;
  text: string;
  postUrl?: string;
  price?: number;
  location?: string;
  imageUrl?: string;
}
