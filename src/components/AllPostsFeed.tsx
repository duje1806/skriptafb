import React, { useState } from 'react';
import { Post } from '../types';
import { Filter, CheckCircle2, XCircle, ExternalLink, Search } from 'lucide-react';

interface AllPostsFeedProps {
  posts: Post[];
  minPrice: number;
  maxPrice: number;
}

export const AllPostsFeed: React.FC<AllPostsFeedProps> = ({ posts, minPrice, maxPrice }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'matched' | 'offers' | 'requests'>('all');

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.location.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'matched') return post.isInPriceRange;
    if (filterType === 'offers') return post.isOffer;
    if (filterType === 'requests') return !post.isOffer;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Search & Filter Header */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-5 shadow-xl space-y-4 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">Cjelokupni Izvorni Feed Grupe</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pregled svih očitanih objava (ponude, potražnje, izvan ranga i filtrirani oglasi).
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Pretraži po kvartu ili riječi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono rounded-lg focus:outline-none focus:border-emerald-500 transition"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800/80">
          {[
            { id: 'all', label: 'SVE OBJAVE' },
            { id: 'matched', label: `U RANGU (${minPrice}€—${maxPrice}€)` },
            { id: 'offers', label: 'SAMO PONUDE' },
            { id: 'requests', label: 'POTRAŽNJA (IGNORIRANO)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilterType(item.id as any)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold tracking-wider transition cursor-pointer ${
                filterType === item.id
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Posts Table / List */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="divide-y divide-slate-800/80">
          {filteredPosts.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs font-mono">
              [ NEMA OBJAVA KOJE ODGOVARAJU ZADANIM FILTERIMA PRETRAGE ]
            </div>
          ) : (
            filteredPosts.map((post) => (
              <div key={post.id} className="p-4 sm:p-5 hover:bg-slate-800/30 transition flex flex-col sm:flex-row items-start justify-between gap-4">
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-mono">
                    {/* Status Badge */}
                    {post.isInPriceRange ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 tracking-wider">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        PROLAZI ({minPrice}€ — {maxPrice}€)
                      </span>
                    ) : !post.isOffer ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 tracking-wider">
                        <XCircle className="w-3 h-3 mr-1" />
                        ODBIJENO: POTRAŽNJA
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-950 text-slate-400 border border-slate-800 tracking-wider">
                        <XCircle className="w-3 h-3 mr-1" />
                        ODBIJENO: CIJENA {post.price ? `${post.price}€` : 'N/A'}
                      </span>
                    )}

                    <span className="text-slate-600">•</span>
                    <span className="text-emerald-400 font-medium">{post.location}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500">{new Date(post.postedAt).toLocaleTimeString('hr-HR')}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 font-sans">
                    {post.content}
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center space-x-3 font-mono">
                    <span>AUTOR: <strong className="text-slate-200">{post.author}</strong></span>
                    {post.price && (
                      <span>CIJENA: <strong className="text-emerald-400">{post.price} EUR</strong></span>
                    )}
                  </div>
                </div>

                <div className="sm:self-center">
                  <a
                    href={post.postUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-200 text-xs font-mono font-semibold uppercase tracking-wider rounded-lg border border-slate-800 transition"
                  >
                    FB Oglas
                    <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />
                  </a>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
