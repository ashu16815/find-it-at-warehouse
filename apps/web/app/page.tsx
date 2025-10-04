'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      window.location.href = `/chat?q=${encodeURIComponent(trimmedQuery)}`;
    } else {
      window.location.href = '/chat';
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      {/* Hero Section - Centered like Google */}
      <div className="text-center max-w-2xl mx-auto">
        {/* Logo/Title */}
        <div className="mb-8">
          <img src="/twg-lockup.svg" alt="Find it @ Warehouse" className="mx-auto h-12 mb-4" />
          <h1 className="text-3xl font-light text-gray-900 mb-2">Find it @ Warehouse</h1>
          <p className="text-gray-600">AI-powered shopping that prioritises The Warehouse Group</p>
        </div>
        
        {/* Main Chat Input - Google-style */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <form onSubmit={(e) => {
              e.preventDefault();
              handleSearch(searchQuery);
            }} className="flex items-center border border-gray-300 rounded-full px-6 py-4 shadow-sm hover:shadow-md transition-shadow bg-white">
              <span className="text-gray-400 mr-3">💬</span>
              <input
                type="text"
                placeholder="Ask anything: laptop under $600, TV recommendations, office setup..."
                className="flex-1 outline-none text-lg bg-transparent placeholder:text-gray-400 text-gray-900"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(searchQuery);
                  }
                }}
              />
              <button
                type="submit"
                className="ml-3 px-6 py-2 bg-[#D32F2F] text-white rounded-full hover:bg-[#B71C1C] transition-colors font-medium"
              >
                Ask AI
              </button>
            </form>
          </div>
          
          {/* Quick Suggestions */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              "55\" TV under $1000",
              "School laptop under $600", 
              "Office desk and chair",
              "Airfryer 5L under $150"
            ].map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSearch(suggestion)}
                className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        {/* Secondary Actions */}
        <div className="flex gap-4 justify-center">
          <Link 
            href="/chat" 
            className="px-6 py-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors text-gray-700"
          >
            Open Chat Interface
          </Link>
          <Link 
            href="/admin/dashboard" 
            className="px-6 py-3 rounded-full border border-gray-300 hover:border-gray-400 transition-colors text-gray-700"
          >
            View Analytics
          </Link>
        </div>
      </div>
      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        
        {/* Page Links */}
        <div className="grid gap-3 sm:grid-cols-2 mb-6">
          <Link 
            href="/chat" 
            className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#D32F2F] hover:shadow-md transition-all bg-white"
          >
            <div className="w-10 h-10 rounded-full bg-[#D32F2F]/10 flex items-center justify-center group-hover:bg-[#D32F2F]/20 transition-colors">
              <span className="text-[#D32F2F] text-lg">💬</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">Chat Interface</div>
              <div className="text-sm text-gray-500">/chat</div>
            </div>
          </Link>
          
          <Link 
            href="/admin/dashboard" 
            className="group flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-[#D32F2F] hover:shadow-md transition-all bg-white"
          >
            <div className="w-10 h-10 rounded-full bg-[#D32F2F]/10 flex items-center justify-center group-hover:bg-[#D32F2F]/20 transition-colors">
              <span className="text-[#D32F2F] text-lg">📊</span>
            </div>
            <div>
              <div className="font-medium text-gray-900">Analytics Dashboard</div>
              <div className="text-sm text-gray-500">/admin/dashboard</div>
            </div>
          </Link>
        </div>
        
        {/* API Endpoints */}
        <div className="space-y-3">
          <h3 className="text-base font-medium text-gray-700 mb-3">API Endpoints</h3>
          
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border">
              <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700">POST</span>
              <code className="text-sm text-gray-700">/api/ai/chat</code>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border">
              <span className="text-xs font-medium px-2 py-1 rounded bg-blue-100 text-blue-700">GET</span>
              <code className="text-sm text-gray-700">/api/redirect</code>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border">
              <span className="text-xs font-medium px-2 py-1 rounded bg-green-100 text-green-700">POST</span>
              <code className="text-sm text-gray-700">/api/redirect/log</code>
            </div>
          </div>
          
          {/* Sitemap Link */}
          <div className="mt-4">
            <a 
              href="/.well-known/sitemap.json" 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 hover:border-[#D32F2F] hover:shadow-md transition-all bg-white text-sm"
            >
              <span className="text-[#D32F2F]">🗺️</span>
              <span className="font-medium">View Sitemap</span>
              <span className="text-gray-500">/.well-known/sitemap.json</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
