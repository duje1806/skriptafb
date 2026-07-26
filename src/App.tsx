import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatusCards } from './components/StatusCards';
import { MatchedPostsList } from './components/MatchedPostsList';
import { AllPostsFeed } from './components/AllPostsFeed';
import { NotificationSettings } from './components/NotificationSettings';
import { FilterSettings } from './components/FilterSettings';
import { CodeExporter } from './components/CodeExporter';
import { PostTester } from './components/PostTester';
import { WhatsappSimulator } from './components/WhatsappSimulator';
import { LogsDrawer } from './components/LogsDrawer';
import { Post, MonitorStatus, MonitorSettings } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [status, setStatus] = useState<MonitorStatus | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Status and Posts from Backend Server
  const fetchStatusAndPosts = async () => {
    try {
      const [statusRes, postsRes] = await Promise.all([
        fetch('/api/status'),
        fetch('/api/posts')
      ]);

      if (statusRes.ok) {
        const statusData = await statusRes.ok ? await statusRes.json() : null;
        if (statusData) setStatus(statusData);
      }

      if (postsRes.ok) {
        const postsData = await postsRes.json();
        setPosts(postsData);
      }
    } catch (err) {
      console.error("Error fetching data from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  // Poll status every 1 second to update countdown animation smoothly
  useEffect(() => {
    fetchStatusAndPosts();
    const interval = setInterval(fetchStatusAndPosts, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggle = async () => {
    try {
      await fetch('/api/toggle', { method: 'POST' });
      fetchStatusAndPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckNow = async () => {
    try {
      await fetch('/api/check-now', { method: 'POST' });
      fetchStatusAndPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async (newSettings: Partial<MonitorSettings>) => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      fetchStatusAndPosts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendTestNotification = async (
    channel: 'whatsapp' | 'telegram', 
    customPost?: Post | { phone?: string; apiKey?: string; botToken?: string; chatId?: string },
    customParams?: { phone?: string; apiKey?: string; botToken?: string; chatId?: string }
  ) => {
    try {
      let payload: any = { channel };
      if (customPost && 'id' in customPost) {
        payload.customPost = customPost;
      } else if (customPost) {
        payload = { ...payload, ...customPost };
      }
      if (customParams) {
        payload = { ...payload, ...customParams };
      }

      await fetch('/api/test-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      fetchStatusAndPosts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !status) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-300">Inicijalizacija monitora za najamzagreb...</p>
        </div>
      </div>
    );
  }

  const matchedPosts = posts.filter(p => p.isInPriceRange);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header
        status={status}
        onToggle={handleToggle}
        onCheckNow={handleCheckNow}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Metric Cards Banner */}
        <StatusCards status={status} />

        {/* Tab View Contents */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Workspace (Left 2 Columns) */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'dashboard' && (
              <MatchedPostsList
                posts={matchedPosts}
                minPrice={status.settings.minPrice}
                maxPrice={status.settings.maxPrice}
                onSendTestNotification={(p) => handleSendTestNotification('whatsapp', p)}
              />
            )}

            {activeTab === 'all-posts' && (
              <AllPostsFeed
                posts={posts}
                minPrice={status.settings.minPrice}
                maxPrice={status.settings.maxPrice}
              />
            )}

            {activeTab === 'notifications' && (
              <NotificationSettings
                settings={status.settings}
                onSaveSettings={handleSaveSettings}
                onSendTestNotification={(channel) => handleSendTestNotification(channel)}
              />
            )}

            {activeTab === 'settings' && (
              <FilterSettings
                settings={status.settings}
                onSaveSettings={handleSaveSettings}
              />
            )}

            {activeTab === 'code-export' && (
              <CodeExporter
                minPrice={status.settings.minPrice}
                maxPrice={status.settings.maxPrice}
                phoneNumber={status.settings.whatsappConfig.phoneNumber}
                apiKey={status.settings.whatsappConfig.apiKey}
              />
            )}

            {activeTab === 'post-tester' && (
              <PostTester
                minPrice={status.settings.minPrice}
                maxPrice={status.settings.maxPrice}
              />
            )}
          </div>

          {/* Right Sidebar Widget Column */}
          <div className="space-y-6">
            <WhatsappSimulator
              posts={posts}
              phoneNumber={status.settings.whatsappConfig.phoneNumber}
            />

            <LogsDrawer logs={status.logs} />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Sustav za praćenje Facebook grupe najamzagreb (500€ - 700€)</span>
          <span>Aktivni interval: 60 sekundi • WhatsApp & Telegram Notifikacije</span>
        </div>
      </footer>
    </div>
  );
}
