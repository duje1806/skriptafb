import React, { useState } from 'react';
import { Send, CheckCircle2, XCircle, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

interface PostTesterProps {
  minPrice: number;
  maxPrice: number;
}

export const PostTester: React.FC<PostTesterProps> = ({ minPrice, maxPrice }) => {
  const [inputText, setInputText] = useState(
    "Iznajmljuje se moderan 2-sobni stan 55m2 na Trešnjevci u ulici Izidora Kršnjavoga. Stan ima balkon, klimu i novu kupaonicu. Cijena je 620 EUR mjesečno plus režije. Traži se uredan par ili zaposlena osoba. Bez kućnih ljubimaca."
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleTest = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/parse-custom-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText })
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Testiraj Bilo Koji Oglas iz Grupe</h2>
            <p className="text-xs text-slate-400">
              Kopiraj i zalijepi bilo koji tekst s Facebooka da provjeriš hoće li ga AI prepoznati kao stan u rangu {minPrice}€ - {maxPrice}€.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Tekst Objave s Facebooka:
            </label>
            <textarea
              rows={5}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-4 bg-slate-950 border border-slate-800 text-slate-100 text-xs rounded-xl focus:outline-none focus:border-emerald-500 font-mono leading-relaxed"
              placeholder="Zalijepi tekst oglasa ovdje..."
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              onClick={handleTest}
              disabled={loading}
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition flex items-center shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Analiziram s Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" /> Analiziraj i Pokreni Filtar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Card */}
        {result && (
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center">
              <span>Rezultat Analize:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Prepoznata Cijena</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  {result.parsed.price ? `${result.parsed.price} EUR` : 'Nije detektirana'}
                </div>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Vrsta Objave</div>
                <div className="text-sm font-bold text-white mt-1">
                  {result.parsed.isOffer ? '✅ Ponuda Stana (Iznajmljuje se)' : '🚫 Potražnja (Tražim stan)'}
                </div>
              </div>

              <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Lokacija / Kvart</div>
                <div className="text-sm font-bold text-slate-200 mt-1">
                  {result.parsed.location || 'Zagreb'}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border flex items-center space-x-3 bg-slate-900">
              {result.isInPriceRange ? (
                <>
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-emerald-400">PROLAZI! Šalje se WhatsApp obavijest!</div>
                    <div className="text-[11px] text-slate-400">
                      Objava je ponuda stana i cijena od {result.parsed.price} EUR je unutar zadanog raspona ({result.minPrice} EUR - {result.maxPrice} EUR).
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-amber-400">ODBIJENO - Ne šalje se obavijest</div>
                    <div className="text-[11px] text-slate-400">
                      {!result.parsed.isOffer 
                        ? 'Objava je označena kao potražnja (netko traži stan za sebe).' 
                        : `Cijena (${result.parsed.price} EUR) nije u zadanom rangu od ${result.minPrice} EUR do ${result.maxPrice} EUR.`}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
