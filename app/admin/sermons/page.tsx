'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: string;
  youtubeUrl?: string;
}

export default function SermonsAdminPage() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sermons')
      .then((res) => res.json())
      .then((data) => {
        setSermons(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Sermons Management</h1>
            <p className="text-slate-500 text-sm">Upload and manage Sunday messages</p>
          </div>
          <div className="flex gap-3">
            <Link 
              href="/admin" 
              className="px-4 py-2 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
            >
              ← Back to Dashboard
            </Link>
            <Link 
              href="/admin/sermons/new" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + Add New Sermon
            </Link>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-slate-500">Loading sermons...</div>
          ) : sermons.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No sermons found. Click "+ Add New Sermon" to add your first message.</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Speaker</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {sermons.map((sermon) => (
                  <tr key={sermon.id} className="hover:bg-slate-50">
                    <td className="p-4 font-medium text-slate-900">{sermon.title}</td>
                    <td className="p-4 text-slate-600">{sermon.speaker}</td>
                    <td className="p-4 text-slate-600">{new Date(sermon.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      {sermon.youtubeUrl ? (
                        <a href={sermon.youtubeUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                          Watch Link
                        </a>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}