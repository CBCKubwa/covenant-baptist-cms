'use client';

import { signOut } from 'next-auth/react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome to the Covenant Baptist Church CMS</p>
          </div>
          <button 
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 transition"
          >
            Sign Out
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* We will add your CMS cards (Sermons, Events, etc) here next! */}
          <div className="p-6 border border-slate-200 rounded-xl bg-slate-50">
            <h3 className="font-semibold text-lg text-slate-800 mb-2">Total Sermons</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
          <div className="p-6 border border-slate-200 rounded-xl bg-slate-50">
            <h3 className="font-semibold text-lg text-slate-800 mb-2">Upcoming Events</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}