import React, { useState } from 'react';
import { Sliders, Check, Plus, Trash2, Cpu, Globe, Link2 } from 'lucide-react';
import { MonitorSettings } from '../types';

interface FilterSettingsProps {
  settings: MonitorSettings;
  onSaveSettings: (newSettings: Partial<MonitorSettings>) => void;
}

export const FilterSettings: React.FC<FilterSettingsProps> = ({ settings, onSaveSettings }) => {
  const [minPrice, setMinPrice] = useState(settings.minPrice);
  const [maxPrice, setMaxPrice] = useState(settings.maxPrice);
  const [intervalSeconds, setIntervalSeconds] = useState(settings.intervalSeconds);
  const [targetGroupUrl, setTargetGroupUrl] = useState(settings.targetGroupUrl);
  const [aiFilterEnabled, setAiFilterEnabled] = useState(settings.aiFilterEnabled);

  const [keywords, setKeywords] = useState<string[]>(settings.keywords);
  const [newKeyword, setNewKeyword] = useState('');

  const [excludeWords, setExcludeWords] = useState<string[]>(settings.excludeWords);
  const [newExcludeWord, setNewExcludeWord] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  const handleAddExclude = () => {
    if (newExcludeWord.trim() && !excludeWords.includes(newExcludeWord.trim())) {
      setExcludeWords([...excludeWords, newExcludeWord.trim()]);
      setNewExcludeWord('');
    }
  };

  const handleRemoveExclude = (word: string) => {
    setExcludeWords(excludeWords.filter(w => w !== word));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings({
      minPrice,
      maxPrice,
      intervalSeconds,
      targetGroupUrl,
      aiFilterEnabled,
      keywords,
      excludeWords,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-sm font-semibold flex items-center">
          <Check className="w-5 h-5 mr-2" />
          Postavke i filtri su uspješno ažurirani!
        </div>
      )}

      {/* Target Facebook Group & Scan Interval Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Ciljana Grupa & Učestalost Provjere</h2>
            <p className="text-xs text-slate-400">Postavke skeniranja i vremenskog intervala (zadano 60s)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Link Facebook Grupe
            </label>
            <div className="relative">
              <Link2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={targetGroupUrl}
                onChange={(e) => setTargetGroupUrl(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Interval Skeniranja u Sekundama
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="10"
                max="600"
                value={intervalSeconds}
                onChange={(e) => setIntervalSeconds(parseInt(e.target.value) || 60)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-sm rounded-xl focus:outline-none focus:border-emerald-500 font-mono font-bold text-emerald-400"
              />
              <span className="text-xs text-slate-400 whitespace-nowrap">sekundi</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Preporučeno: 60 sekundi (1 minuta)</p>
          </div>
        </div>
      </div>

      {/* Price Filter Settings Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Rang Cijene Stanarine (EUR)</h2>
            <p className="text-xs text-slate-400">Postavljeno po tvom zahtjevu na 500 € do 700 €</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Minimalna Cijena (EUR)
            </label>
            <input
              type="number"
              step="50"
              value={minPrice}
              onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-emerald-400 text-lg font-bold rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Maksimalna Cijena (EUR)
            </label>
            <input
              type="number"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 text-emerald-400 text-lg font-bold rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* AI Filter & Keywords */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Gemini AI Analizator Oglasa</h2>
              <p className="text-xs text-slate-400">
                Automatski prepoznaje je li objava "potražnja" ili "ponuda stana" te izvlaci točnu cijenu i kvart.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={aiFilterEnabled}
              onChange={(e) => setAiFilterEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Preferred Keywords */}
        <div className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300">
            Poželjni Kvartovi i Ključne Riječi (Neobavezno)
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Dodaj npr. Vrbani, balkonom, garsonijera..."
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
              className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={handleAddKeyword}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 cursor-pointer flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Dodaj
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {keywords.map((kw) => (
              <span key={kw} className="inline-flex items-center bg-slate-800 text-slate-200 text-xs font-medium px-3 py-1 rounded-lg border border-slate-700">
                #{kw}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="ml-2 text-slate-400 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Exclude Keywords (e.g. potražnja) */}
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300">
            Riječi za Ignoriranje (Isključi iz obavijesti)
          </label>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Dodaj npr. cimer, tražim stan..."
              value={newExcludeWord}
              onChange={(e) => setNewExcludeWord(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExclude())}
              className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl focus:outline-none focus:border-amber-500"
            />
            <button
              type="button"
              onClick={handleAddExclude}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 cursor-pointer flex items-center"
            >
              <Plus className="w-4 h-4 mr-1" /> Dodaj
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {excludeWords.map((word) => (
              <span key={word} className="inline-flex items-center bg-amber-500/10 text-amber-300 text-xs font-medium px-3 py-1 rounded-lg border border-amber-500/30">
                🚫 {word}
                <button
                  type="button"
                  onClick={() => handleRemoveExclude(word)}
                  className="ml-2 text-amber-400 hover:text-red-400 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl transition shadow-lg cursor-pointer"
        >
          Spremi Sve Postavke Filtra
        </button>
      </div>
    </form>
  );
};
