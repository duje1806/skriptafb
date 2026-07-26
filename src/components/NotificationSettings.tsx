import React, { useState } from 'react';
import { MessageSquare, Send, Check, Copy, HelpCircle, Shield, AlertTriangle, Smartphone, Bot, BellRing } from 'lucide-react';
import { MonitorSettings } from '../types';

interface NotificationSettingsProps {
  settings: MonitorSettings;
  onSaveSettings: (newSettings: Partial<MonitorSettings>) => void;
  onSendTestNotification: (channel: 'whatsapp' | 'telegram' | 'ntfy', customParams?: { phone?: string; apiKey?: string; botToken?: string; chatId?: string; topic?: string }) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onSaveSettings,
  onSendTestNotification,
}) => {
  const [waPhone, setWaPhone] = useState(settings.whatsappConfig.phoneNumber || '+385912345678');
  const [waApiKey, setWaApiKey] = useState(settings.whatsappConfig.apiKey || '');
  const [waEnabled, setWaEnabled] = useState(settings.whatsappConfig.enabled);

  const [ntfyTopic, setNtfyTopic] = useState(settings.ntfyConfig?.topic || 'stanovi-zagreb-moj-kanal');
  const [ntfyEnabled, setNtfyEnabled] = useState(settings.ntfyConfig?.enabled ?? true);

  const [tgToken, setTgToken] = useState(settings.telegramConfig.botToken || '');
  const [tgChatId, setTgChatId] = useState(settings.telegramConfig.chatId || '');
  const [tgEnabled, setTgEnabled] = useState(settings.telegramConfig.enabled);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveNtfy = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      ntfyConfig: {
        enabled: ntfyEnabled,
        topic: ntfyTopic,
      }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      whatsappConfig: {
        ...settings.whatsappConfig,
        enabled: waEnabled,
        phoneNumber: waPhone,
        apiKey: waApiKey,
      }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSaveTelegram = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      telegramConfig: {
        ...settings.telegramConfig,
        enabled: tgEnabled,
        botToken: tgToken,
        chatId: tgChatId,
      }
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {saveSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm font-semibold flex items-center">
          <Check className="w-5 h-5 mr-2" />
          Postavke notifikacija su uspješno spremljene!
        </div>
      )}

      {/* ntfy.sh Instant Push Notifications (Preporučeno & 100% Besplatno) */}
      <div className="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-sm space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-purple-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
          Preporučena besplatna alternativa
        </div>

        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <BellRing className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center">
                ntfy.sh Besplatne Push Notifikacije na Mobitel
              </h2>
              <p className="text-xs text-slate-400">
                Instantan zvučni signal i obavijest na mobitelu bez registracije, broja ili API ključeva.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={ntfyEnabled}
              onChange={(e) => setNtfyEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
          </label>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/20 space-y-3">
          <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center">
            <HelpCircle className="w-4 h-4 mr-1.5" />
            Kako postaviti ntfy push obavijesti u 20 sekundi:
          </h3>
          <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2 leading-relaxed">
            <li>
              Instaliraj besplatnu aplikaciju <strong>ntfy</strong> na mobitel (<a href="https://play.google.com/store/apps/details?id=io.heckel.ntfy" target="_blank" rel="noreferrer" className="text-purple-400 underline">Android Play Store</a> ili <a href="https://apps.apple.com/us/app/ntfy/id1625396347" target="_blank" rel="noreferrer" className="text-purple-400 underline">iOS App Store</a>).
            </li>
            <li>
              Klikni <code className="bg-slate-900 text-purple-300 px-1.5 py-0.5 rounded font-mono border border-slate-800">+ Subscribe to topic</code> i upiši svoje tajno ime kanala (npr. <code className="text-amber-300 font-mono">{ntfyTopic}</code>).
            </li>
            <li>Upiši to isto ime u polje ispod i klikni spremi!</li>
          </ol>
        </div>

        <form onSubmit={handleSaveNtfy} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Naziv Tvoje ntfy.sh Teme / Kanala
            </label>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-slate-500">https://ntfy.sh/</span>
              <input
                type="text"
                placeholder="stanovi-zagreb-moj-kanal"
                value={ntfyTopic}
                onChange={(e) => setNtfyTopic(e.target.value)}
                className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => onSendTestNotification('ntfy', { topic: ntfyTopic })}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 mr-2 text-purple-400" />
              Pošalji Test Push Obavijest
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Spremi ntfy Postavke
            </button>
          </div>
        </form>
      </div>

      {/* WhatsApp Configuration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center">
                WhatsApp Notifikacije (CallMeBot API)
              </h2>
              <p className="text-xs text-slate-400">
                CallMeBot javni besplatni poslužitelj (napomena: zna biti nedostupan zbog preopterećenja).
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={waEnabled}
              onChange={(e) => setWaEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Step-by-Step Guide in Croatian */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center">
            <HelpCircle className="w-4 h-4 mr-1.5" />
            Upute za CallMeBot WhatsApp API:
          </h3>
          <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2 leading-relaxed">
            <li>
              Pošalji poruku na WhatsApp broj <strong className="text-white font-mono">+34 644 59 71 67</strong> s tekstom: <code className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded font-mono border border-slate-800">I allow callmebot to send me messages</code>
            </li>
            <li>Ako CallMeBot vrati API Key (npr. 123456), upiši ga ispod sa svojim brojem mobitela.</li>
          </ol>
        </div>

        <form onSubmit={handleSaveWhatsApp} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tvoj Broj Mobitela (s pozivnim brojem)
              </label>
              <input
                type="text"
                placeholder="+385912345678"
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                CallMeBot API Ključ
              </label>
              <input
                type="text"
                placeholder="npr. 123456"
                value={waApiKey}
                onChange={(e) => setWaApiKey(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => onSendTestNotification('whatsapp', { phone: waPhone, apiKey: waApiKey })}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 mr-2 text-emerald-400" />
              Pošalji Test Poruku na WhatsApp
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Spremi WhatsApp Postavke
            </button>
          </div>
        </form>
      </div>

      {/* Telegram Configuration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center">
                Telegram Bot Notifikacije (100% Pouzdano i Besplatno)
              </h2>
              <p className="text-xs text-slate-400">
                Kreiraj vlastitog bota na Telegramu koji šalje besplatne instant obavijesti 24/7.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={tgEnabled}
              onChange={(e) => setTgEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>

        <form onSubmit={handleSaveTelegram} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Telegram Bot Token
              </label>
              <input
                type="text"
                placeholder="123456789:ABCdefGhIJKlmNoPQ..."
                value={tgToken}
                onChange={(e) => setTgToken(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Chat ID
              </label>
              <input
                type="text"
                placeholder="npr. 987654321"
                value={tgChatId}
                onChange={(e) => setTgChatId(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => onSendTestNotification('telegram', { botToken: tgToken, chatId: tgChatId })}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition flex items-center cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 mr-2 text-blue-400" />
              Pošalji Test na Telegram
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Spremi Telegram Postavke
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
