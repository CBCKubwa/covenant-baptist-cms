"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { AlertCircle, ArrowLeft, Eye, EyeOff, Loader2, Lock, ShieldCheck, User } from "lucide-react";
import SiteLogo from "@/components/SiteLogo";

/**
 * Split-screen sign-in: brand panel (desktop) + form.
 * The visual language (navy / gold / serif) matches the public website.
 */
export default function LoginForm({ logoUrl, churchName, churchLocation }: { logoUrl: string; churchName: string; churchLocation: string }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", { redirect: false, username: username.trim(), password });

      if (res?.error === "RATE_LIMITED") {
        setError("Too many failed attempts. For security, sign-in is paused for 15 minutes. Please try again later.");
        setLoading(false);
        return;
      }

      if (!res || res.error) {
        setError("Incorrect username or password. Please try again.");
        setLoading(false);
        return;
      }

      // Return to the page the visitor originally wanted. Only same-site /admin
      // paths are allowed, so the login link cannot be abused to redirect elsewhere.
      const wanted = new URLSearchParams(window.location.search).get("callbackUrl");
      router.push(wanted && wanted.startsWith("/admin") && !wanted.startsWith("//") ? wanted : "/admin");
      router.refresh();
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setLoading(false);
    }
  }

  const inputCls =
    "w-full rounded-lg border border-navy/15 bg-white pl-11 pr-4 py-3 text-[15px] text-ink placeholder:text-ink-soft/50 outline-none transition focus:border-gold focus:ring-4 focus:ring-gold/15";

  return (
    <div className="min-h-screen grid lg:grid-cols-[1.05fr_1fr] bg-parchment">
      {/* ------------------------------ Brand panel ------------------------------ */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-midnight p-14 text-parchment">
        <Image
          src="/church-building.jpg"
          alt=""
          fill
          priority
          sizes="55vw"
          className="object-cover object-[78%_35%] opacity-25"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(160deg, rgba(9,17,29,0.92) 0%, rgba(14,26,43,0.8) 55%, rgba(9,17,29,0.95) 100%)" }}
        />

        <div className="relative z-10 flex items-center gap-4">
          <SiteLogo src={logoUrl} size={64} priority alt={`${churchName} logo`} />
          <div className="leading-tight">
            <div className="font-serif text-xl text-parchment">{churchName}</div>
            <div className="mt-1 text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-light">{churchLocation}</div>
          </div>
        </div>

        <blockquote className="relative z-10 max-w-[30rem]">
          <span className="block h-px w-14 bg-gold mb-7" />
          <p className="font-serif text-[1.65rem] leading-snug text-parchment/95">
            &ldquo;That I may know Him, and the power of His resurrection, and the fellowship of His sufferings.&rdquo;
          </p>
          <cite className="block mt-5 not-italic text-[12px] tracking-[0.18em] uppercase text-gold-light">Philippians 3:10</cite>
        </blockquote>

        <p className="relative z-10 text-xs text-parchment/45">Church Management System &middot; Authorized personnel only</p>
      </aside>

      {/* -------------------------------- Form side ------------------------------- */}
      <main className="flex flex-col justify-center px-6 py-10 sm:px-12">
        <div className="w-full max-w-[420px] mx-auto">
          {/* Logo is shown here only on small screens (the brand panel is hidden) */}
          <div className="lg:hidden flex flex-col items-center text-center mb-9">
            <SiteLogo src={logoUrl} size={80} priority alt={`${churchName} logo`} />
            <div className="mt-4 font-serif text-xl text-navy">{churchName}</div>
          </div>

          <div className="mb-8 text-center lg:text-left">
            <span className="inline-flex items-center gap-2 text-[11.5px] font-bold tracking-[0.2em] uppercase text-gold">
              <ShieldCheck size={14} /> Admin Portal
            </span>
            <h1 className="mt-3 font-serif text-[2rem] leading-tight text-navy">Welcome back</h1>
            <p className="mt-2 text-sm text-ink-soft">Sign in to manage sermons, media, events and church information.</p>
          </div>

          {error && (
            <div role="alert" className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="username" className="block text-[12.5px] font-semibold text-ink mb-1.5">Username</label>
              <div className="relative">
                <User size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/60" />
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[12.5px] font-semibold text-ink mb-1.5">Password</label>
              <div className="relative">
                <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft/60" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded text-ink-soft/70 hover:text-navy"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-navy py-3.5 text-[13px] font-bold tracking-wide uppercase text-parchment transition hover:bg-midnight active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (<><Loader2 size={16} className="animate-spin" /> Signing in&hellip;</>) : "Sign in"}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-[12.5px] text-ink-soft">
            <Link href="/" className="inline-flex items-center gap-1.5 hover:text-navy transition">
              <ArrowLeft size={14} /> Back to website
            </Link>
            <span className="inline-flex items-center gap-1.5"><Lock size={12} /> Secure sign-in</span>
          </div>
        </div>
      </main>
    </div>
  );
}
