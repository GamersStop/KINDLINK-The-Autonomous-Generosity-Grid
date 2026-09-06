"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Lock, ArrowRight, AlertTriangle, RefreshCw, HeartHandshake, Eye, EyeOff } from "lucide-react";

interface GiverGateProps {
    children: React.ReactNode;
}

export default function GiverGate({ children }: GiverGateProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [isLoginTab, setIsLoginTab] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("kindlink_giver_token");
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        fetch(`${apiUrl}/api/v1/giver-auth/verify-session?token=${token}`)
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Invalid session");
            })
            .then((data) => {
                setIsAuthenticated(true);
                setUserEmail(data.giver?.email || "Volunteer");
            })
            .catch(() => {
                localStorage.removeItem("kindlink_giver_token");
                setIsAuthenticated(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const endpoint = isLoginTab ? "/api/v1/giver-auth/login" : "/api/v1/giver-auth/signup";

        try {
            const res = await fetch(`${apiUrl}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || "Authentication request failed");
            }

            const data = await res.json();
            localStorage.setItem("kindlink_giver_token", data.token);
            setUserEmail(data.email);
            setIsAuthenticated(true);
        } catch (err: any) {
            setErrorMessage(err.message || "Failed to authenticate");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("kindlink_giver_token");
        setIsAuthenticated(false);
    };

    if (isAuthenticated === null) {
        return (
            <div className="py-28 text-center space-y-3">
                <RefreshCw className="w-6 h-6 text-[#0284C7] animate-spin mx-auto" />
                <p className="text-xs font-mono text-slate-400">Verifying Giver Session...</p>
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <div className="space-y-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
                    <div className="flex items-center justify-between px-5 py-2.5 rounded-2xl bg-[#0B1E36] text-white text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="font-semibold text-slate-300">Signed in as:</span>
                            <span className="font-bold text-white">{userEmail}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-[11px] text-slate-400 hover:text-white underline font-semibold transition"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>
                {children}
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto py-12 sm:py-20 px-4">
            <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-6">
                <div className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Grid
                    </Link>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-cyan-50 border border-cyan-200 text-[#0284C7]">
                        GIVERS PORTAL
                    </span>
                </div>

                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
                        <HeartHandshake className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-extrabold text-[#0B1E36]">
                        {isLoginTab ? "Sign In to Offer Support" : "Create Giver Account"}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                        {isLoginTab
                            ? "Access live mission requirements, sponsor with Solana devnet escrow, or commit field time."
                            : "Register to commit resources, pledge standby availability, and track volunteer routes."}
                    </p>
                </div>

                {/* Tab Toggle */}
                <div className="flex rounded-2xl bg-slate-100 p-1">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLoginTab(true);
                            setErrorMessage(null);
                        }}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${isLoginTab ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Log In
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setIsLoginTab(false);
                            setErrorMessage(null);
                        }}
                        className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${!isLoginTab ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {errorMessage && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    <div className="space-y-1">
                        <label className="font-bold text-slate-700">Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@domain.org"
                            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="font-bold text-slate-700">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder={isLoginTab ? "••••••••" : "At least 6 characters"}
                                className="w-full p-3 pr-10 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold transition active:scale-95 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                {isLoginTab ? "Authenticating..." : "Creating Account..."}
                            </>
                        ) : (
                            <>
                                {isLoginTab ? "Unlock Support Options" : "Complete Registration"}
                                <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-[11px] text-slate-400 text-center">
                    {isLoginTab ? "Don't have an account yet?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        onClick={() => {
                            setIsLoginTab(!isLoginTab);
                            setErrorMessage(null);
                        }}
                        className="text-[#0284C7] font-bold hover:underline"
                    >
                        {isLoginTab ? "Sign up with email" : "Log in"}
                    </button>
                </p>
            </div>
        </div>
    );
}