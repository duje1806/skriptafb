import React from 'react';
import { Smartphone, CheckCheck, Send, Bell } from 'lucide-react';
import { Post } from '../types';

interface WhatsappSimulatorProps {
  posts: Post[];
  phoneNumber: string;
}

export const WhatsappSimulator: React.FC<WhatsappSimulatorProps> = ({ posts, phoneNumber }) => {
  const matchedPosts = posts.filter(p => p.isInPriceRange).slice(0, 5);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-emerald-400" />
          <h3 className="text-sm font-bold text-white">Live WhatsApp Pregled na Mobitelu</h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">{phoneNumber || '+385 91 234 5678'}</span>
      </div>

      {/* Simulated Phone UI Container */}
      <div className="w-full max-w-sm mx-auto bg-slate-950 border-4 border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[420px]">
        
        {/* Phone Header (WhatsApp Bar) */}
        <div className="bg-emerald-700 px-4 py-3 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-500 flex items-center justify-center font-bold text-xs text-emerald-200">
              NZM
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">Najam Zagreb Bot</div>
              <div className="text-[10px] text-emerald-200">Online • Provjera 60s</div>
            </div>
          </div>
          <Bell className="w-4 h-4 text-emerald-200 animate-bounce" />
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#0b141a] text-xs">
          <div className="text-center my-2">
            <span className="bg-[#182229] text-slate-400 text-[10px] px-2.5 py-1 rounded-md">
              Kriptirane Notifikacije uživo
            </span>
          </div>

          {matchedPosts.length === 0 ? (
            <div className="text-center text-slate-500 my-12 text-xs">
              Čeka se prva objava u rangu 500€ - 700€...
            </div>
          ) : (
            matchedPosts.map((post) => (
              <div key={post.id} className="bg-[#005c4b] text-white p-3 rounded-xl rounded-tl-none max-w-[90%] shadow-md space-y-1.5 self-start">
                <div className="font-extrabold text-emerald-200 text-[11px] border-b border-emerald-600/50 pb-1">
                  🚨 NOVA PONUDA STANA U ZAGREBU!
                </div>
                <div>📍 <strong>Lokacija:</strong> {post.location}</div>
                <div>💰 <strong>Cijena:</strong> <span className="text-emerald-200 font-bold">{post.price} EUR/mj</span></div>
                <div>📐 <strong>Tip:</strong> {post.size || 'Stan'}</div>
                <div>👤 <strong>Iznajmljuje:</strong> {post.author}</div>
                <div className="text-[11px] text-slate-200 line-clamp-2 pt-1 italic opacity-90">
                  "{post.content}"
                </div>
                <div className="text-[10px] text-emerald-300 underline font-mono pt-1">
                  🔗 {post.postUrl}
                </div>
                <div className="flex justify-end items-center text-[9px] text-emerald-300 pt-1 space-x-1">
                  <span>{new Date(post.postedAt).toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <CheckCheck className="w-3 h-3 text-cyan-300" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Bar Placeholder */}
        <div className="bg-[#1f2c34] px-3 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px]">Poruke stižu automatski svako 60s</span>
          <Send className="w-3.5 h-3.5 text-emerald-500" />
        </div>
      </div>
    </div>
  );
};
