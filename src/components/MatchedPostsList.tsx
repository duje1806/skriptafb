import React, { useState } from 'react';
import { ExternalLink, Send, CheckCircle, MapPin, Tag, Clock, User, Share2, AlertCircle } from 'lucide-react';
import { Post } from '../types';

interface MatchedPostsListProps {
  posts: Post[];
  minPrice: number;
  maxPrice: number;
  onSendTestNotification: (post: Post) => void;
}

export const MatchedPostsList: React.FC<MatchedPostsListProps> = ({
  posts,
  minPrice,
  maxPrice,
  onSendTestNotification,
}) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (posts.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center my-6">
        <div className="w-16 h-16 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Tag className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-200">Trenutno nema novih stanova u rangu {minPrice}€ - {maxPrice}€</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mt-2">
          Skripta se pokreće svakih 60 sekundi i automatski će izdvojiti svaku novu objavu iz grupe čim se pojavi.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white flex items-center font-mono uppercase tracking-wider">
            <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-2 shadow-[0_0_8px_#10b981]"></span>
            Pronađeni Stanovi ({minPrice}€ — {maxPrice}€)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Prikazuju se isključivo ponude stanova koje zadovoljavaju kriterije cijene i lokacije.
          </p>
        </div>
        <span className="bg-emerald-500/10 text-emerald-400 text-xs font-mono font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
          UKUPNO: {posts.length} OGLASA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, idx) => (
          <div
            key={`${post.id || 'post'}-${idx}`}
            className="bg-slate-900/60 border border-emerald-500/30 hover:border-emerald-500/60 transition-all rounded-xl overflow-hidden shadow-xl flex flex-col justify-between group backdrop-blur-sm"
          >
            <div>
              {/* Image Preview & Price Tag Badge */}
              <div className="relative h-48 bg-slate-950 overflow-hidden">
                {post.images && post.images.length > 0 ? (
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-950 font-mono text-xs">
                    [ NEMA PRILOŽENE SLIKE ]
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-emerald-600 text-white font-mono font-extrabold px-3 py-1.5 rounded-lg shadow-lg text-sm flex items-center tracking-wide border border-emerald-400/40">
                  <Tag className="w-4 h-4 mr-1.5" />
                  {post.price ? `${post.price} EUR/mj` : 'Cijena na upit'}
                </div>

                <div className="absolute top-3 right-3 bg-slate-950/90 backdrop-blur-md text-emerald-300 border border-emerald-500/40 text-[10px] font-mono uppercase tracking-wider font-semibold px-2.5 py-1 rounded-lg flex items-center shadow-md">
                  <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                  WhatsApp Poslano
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <div className="flex items-center text-xs text-slate-400 space-x-3 mb-2 font-mono">
                  <span className="flex items-center text-emerald-400 font-medium">
                    <MapPin className="w-3.5 h-3.5 mr-1" />
                    {post.location}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center text-slate-400">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    {new Date(post.postedAt).toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' })} h
                  </span>
                </div>

                <h3 className="font-bold text-white text-base leading-snug mb-2 group-hover:text-emerald-400 transition-colors">
                  {post.title}
                </h3>

                <p className="text-slate-300 text-xs leading-relaxed line-clamp-3 mb-4 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 font-sans">
                  {post.content}
                </p>

                {/* Author & Matched Tags */}
                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    {post.authorAvatar ? (
                      <img src={post.authorAvatar} alt={post.author} className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700" />
                    ) : (
                      <User className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-slate-300 font-medium text-xs">{post.author}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 font-mono">
                    {post.matchedKeywords.map((kw, kwIdx) => (
                      <span key={`${kw}-${kwIdx}`} className="bg-slate-950 text-emerald-400/90 text-[10px] px-2 py-0.5 rounded border border-emerald-500/20">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-3.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <a
                href={post.postUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-lg transition shadow-md"
              >
                Otvori Oglas
                <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
              </a>

              <button
                onClick={() => onSendTestNotification(post)}
                className="inline-flex items-center px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-semibold rounded-lg border border-slate-800 transition cursor-pointer"
                title="Ponovno pošalji WhatsApp test notifikaciju za ovaj stan"
              >
                <Send className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                WhatsApp
              </button>

              <button
                onClick={() => handleCopyLink(post.postUrl, post.id)}
                className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title="Kopiraj link oglasa"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
