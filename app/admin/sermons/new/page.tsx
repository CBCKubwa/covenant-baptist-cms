'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewSermonPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    speakerName: '',
    scripture: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    youtubeUrl: '',
    audioUrl: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/sermons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save sermon');
      }

      router.push('/admin/sermons');
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Error saving sermon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
        <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
          <h1 className="text-xl font-bold text-slate-900">Add New Sermon</h1>
          <Link href="/admin/sermons" className="text-sm text-slate-500 hover:text-slate-800">
            Cancel
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 border border-red-200 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Sermon Title *</label>
            <input
              type="text"
              required
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Walking in Grace"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Speaker / Preacher Name *</label>
            <input
              type="text"
              required
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              value={form.speakerName}
              onChange={(e) => setForm({ ...form, speakerName: e.target.value })}
              placeholder="e.g. Pastor John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Scripture Reference *</label>
            <input
              type="text"
              required
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              value={form.scripture}
              onChange={(e) => setForm({ ...form, scripture: e.target.value })}
              placeholder="e.g. Romans 8:1-11"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Date Preached</label>
              <input
                type="date"
                className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Category (Optional)</label>
              <input
                type="text"
                className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="e.g. Faith, Grace, Salvation"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">YouTube Video Link (Optional)</label>
            <input
              type="url"
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              value={form.youtubeUrl}
              onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Description / Notes (Optional)</label>
            <textarea
              rows={4}
              className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Summary of message key points..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Saving Sermon...' : 'Publish Sermon'}
          </button>
        </form>
      </div>
    </div>
  );
}