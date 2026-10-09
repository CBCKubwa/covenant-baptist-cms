'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-3">
          <img 
            src="/cbc-logo.png" 
            alt="Covenant Baptist Church Byazhin Logo" 
            className="h-10 w-auto object-contain" 
          />
          <div className="flex flex-col">
            <span className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
              Covenant Baptist Church
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Byazhin-Kubwa, Abuja
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <Link href="/sermons" className="hover:text-blue-600 transition">Sermons</Link>
          <Link href="/events" className="hover:text-blue-600 transition">Events</Link>
          <Link href="/admin" className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Admin Portal
          </Link>
        </nav>
      </div>
    </header>
  );
}