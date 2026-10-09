"use client";

import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [churchName, setChurchName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.churchName) setChurchName(data.churchName);
        if (data.logoUrl) setLogoUrl(data.logoUrl);
      });
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be smaller than 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ churchName, logoUrl }),
      });

      if (res.ok) {
        setMessage("Settings saved successfully! Refreshing dynamic logo...");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage("Error saving settings.");
      }
    } catch {
      setMessage("An unexpected error occurred.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Church Settings</h1>

      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded-md text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Church Name</label>
          <input
            type="text"
            value={churchName}
            onChange={(e) => setChurchName(e.target.value)}
            className="w-full p-2 border rounded-md text-black"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Church Logo</label>
          <div className="flex items-center gap-4 mb-3">
            <img
              src={logoUrl || "/cbc-logo.png"}
              alt="Logo Preview"
              className="w-16 h-16 object-contain border p-1 rounded-md bg-slate-50"
            />
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Upload PNG or JPG (Max 2MB)</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}