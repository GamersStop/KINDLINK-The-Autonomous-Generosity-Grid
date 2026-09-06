"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowRight, Building2, AlertTriangle, RefreshCw } from "lucide-react";

interface NGOGateProps {
    children: React.ReactNode;
}

export default function NGOGate({ children }: NGOGateProps) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [regNumber, setRegNumber] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [orgName, setOrgName] = useState<string | null>(null);

    // Check saved session on mount
    useEffect(() => {
        const token = localStorage.getItem("kindlink_ngo_token");
        if (!token) {
            setIsAuthenticated(false);
            return;
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        fetch(`${apiUrl}/api/v1/ngo-auth/verify-session?token=${token}`)
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Invalid session");
            })
            .then((data) => {
                setIsAuthenticated(true);
                setOrgName(data.ngo?.orgName || "Verified NGO");
            })
            .catch(() => {
                localStorage.removeItem("kindlink_ngo_token");
                setIsAuthenticated(false);
            });
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/v1/ngo-auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ regNumber, password }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || "Authentication failed");
            }

            const data = await res.json();
            localStorage.setItem("kindlink_ngo_token", data.token);
            setOrgName(data.organization?.name);
            setIsAuthenticated(true);
        } catch (err: any) {
            setErrorMessage(err.message || "Failed to authenticate");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("kindlink_ngo_token");
        setIsAuthenticated(false);
    };

    if (isAuthenticated === null) {
        return (
            <div className="py-28 text-center space-y-3">
                <RefreshCw className="w-6 h-6 text-[#0284C7] animate-spin mx-auto" />
                <p className="text-xs font-mono text-slate-400">Verifying Partner Clearance...</p>
            </div>
        );
    }

    // If authenticated, render children with a top partner indicator banner
    if (isAuthenticated) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between px-5 py-2.5 rounded-2xl bg-slate-900 text-white text-xs">
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold">{orgName}</span>
                        <span className="text-slate-400 font-mono text-[11px]">(Verified Dispatch Authority)</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-[11px] text-slate-400 hover:text-white underline font-semibold transition"
                    >
                        Sign Out
                    </button>
                </div>
                {children}
            </div>
        );
    }

    // Auth Gate Screen
    return (
        <div className="max-w-md mx-auto py-12 sm:py-20 px-4">
            <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-6">
                <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-200 text-[#0284C7] flex items-center justify-center mx-auto">
                        <Lock className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-extrabold text-[#0B1E36]">Authorized NGO Portal</h2>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                        Access to natural language decomposition and distress plea broadcasting is restricted to verified disaster relief partners.
                    </p>
                </div>

                {errorMessage && (
                    <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4 text-xs">
                    <div className="space-y-1">
                        <label className="font-bold text-slate-700">Registration / Charter ID</label>
                        <input
                            type="text"
                            required
                            value={regNumber}
                            onChange={(e) => setRegNumber(e.target.value)}
                            placeholder="e.g. NGO-DL-2024-8841"
                            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 font-mono text-slate-800"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="font-bold text-slate-700">Access Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold transition active:scale-95 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying Credentials...
                            </>
                        ) : (
                            <>
                                Unlock Distress Dispatch Console <ArrowRight className="w-3.5 h-3.5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="pt-3 border-t border-slate-100 text-center space-y-2">
                    <p className="text-[11px] text-slate-400">Not yet registered with KindLink?</p>
                    <Link
                        href="/onboard-ngo"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:underline"
                    >
                        <Building2 className="w-3.5 h-3.5" /> Submit NGO Charter Verification &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}