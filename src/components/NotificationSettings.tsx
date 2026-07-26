import React, { useState } from 'react';
import { MessageSquare, Send, Check, Copy, HelpCircle, Shield, AlertTriangle, Smartphone, Bot } from 'lucide-react';
import { MonitorSettings } from '../types';

interface NotificationSettingsProps {
  settings: MonitorSettings;
  onSaveSettings: (newSettings: Partial<MonitorSettings>) => void;
  onSendTestNotification: (channel: 'whatsapp' | 'telegram', customParams?: { phone?: string; apiKey?: string; botToken?: string; chatId?: string }) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  settings,
  onSaveSettings,
  onSendTestNotification,
}) => {
  const [waPhone, setWaPhone] = useState(settings.whatsappConfig.phoneNumber || '+385912345678');
  const [waApiKey, setWaApiKey] = useState(settings.whatsappConfig.apiKey || '');
  const [waEnabled, setWaEnabled] = useState(settings.whatsappConfig.enabled);

  const [tgToken, setTgToken] = useState(settings.telegramConfig.botToken || '');
  const [tgChatId, setTgChatId] = useState(settings.telegramConfig.chatId || '');
  const [tgEnabled, setTgEnabled] = useState(settings.telegramConfig.enabled);

  const [copiedCode, setCopiedCode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

      {/* WhatsApp Configuration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center">
                WhatsApp Notifikacije (CallMeBot Besplatni API)
              </h2>
              <p className="text-xs text-slate-400">
                Prima direktne poruke na tvoj mobitel čim izađe stan u rangu 500€ - 700€.
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
            Kako dobiti besplatni WhatsApp API ključ u 30 sekundi:
          </h3>
          <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2 leading-relaxed">
            <li>
              Spremi CallMeBot WhatsApp broj u imenik mobitela: <strong className="text-white font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">+34 644 59 71 67</strong> ili otvori link: <a href="https://api.whatsapp.com/send?phone=34644597167&text=I+allow+callmebot+to+send+me+messages" target="_blank" rel="noreferrer" className="text-emerald-400 hover:underline font-semibold">Otvori WhatsApp Chat</a>
            </li>
            <li>
              Pošalji poruku teksta: <code className="bg-slate-900 text-emerald-300 px-2 py-0.5 rounded font-mono border border-slate-800">I allow callmebot to send me messages</code>
            </li>
            <li>
              Primit ćeš automatski odgovor s tvojim osobnim <strong>API Key</strong> brojem (npr. <code className="text-amber-300 font-mono">123456</code>).
            </li>
            <li>Upiši svoj broj mobitela (s +385) i taj API Key u polja ispod:</li>
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
                Telegram Bot Notifikacije (Alternativa)
              </h2>
              <p className="text-xs text-slate-400">
                Možeš uključiti i Telegram Bot za trenutne besplatne obavijesti u novom kanalu ili chatu.
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
