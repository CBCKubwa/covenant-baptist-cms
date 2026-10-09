'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Radio, Calendar, Home } from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Sermons', href: '/admin/sermons', icon: Radio },
    { label: 'Events', href: '/admin/events', icon: Calendar },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white p-6 shrink-0 flex flex-col justify-between min-h-screen">
      <div>
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-800">
          <img 
            src="/cbc-logo.png" 
            alt="Covenant Baptist Church Logo" 
            className="w-10 h-10 object-contain shrink-0" 
          />
          <div>
            <h2 className="font-bold text-sm leading-tight text-white">Covenant Baptist</h2>
            <p className="text-xs text-slate-400">Admin Portal</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition"
        >
          <Home size={18} />
          View Live Website
        </Link>
      </div>
    </aside>
  );
}