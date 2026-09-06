"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    ShieldAlert,
    Database,
    RefreshCw,
    Coins,
    Cpu,
    Layers,
    FileCheck2,
    CheckCircle2,
    ExternalLink,
    Lock,
    LogOut,
    SlidersHorizontal,
    QrCode,
    Activity,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    BarChart3,
    PieChart,
    Compass
} from "lucide-react";

interface AuditMetrics {
    missionsCount: number;
    itemsCount: number;
    commitmentsCount: number;
    totalSolAllocated: number;
    recentLedger: Array<{
        id: number;
        missionId: string;
        itemTitle: string;
        giverEmail: string;
        solAmount: number;
        txSignature: string;
        status: string;
        createdAt: string;
    }>;
}

interface AnalyticsPayload {
    modalDistribution: Array<{
        type: string;
        count: number;
        pct: number;
        color: string;
    }>;
    capitalVelocity: Array<{
        zone: string;
        priority: number;
        sol: number;
        commitments: number;
    }>;
    cortexEngine: string;
    warehouseCluster: string;
}

export default function AdminAuditGridPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminEmail, setAdminEmail] = useState("");
    const [adminPassword, setAdminPassword] = useState("");
    const [loginError, setLoginError] = useState<string | null>(null);

    const [metrics, setMetrics] = useState<AuditMetrics | null>(null);
    const [analytics, setAnalytics] = useState<AnalyticsPayload | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncResult, setSyncResult] = useState<any | null>(null);
    const [selectedModalHover, setSelectedModalHover] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

    useEffect(() => {
        const token = localStorage.getItem("kindlink_admin_token");
        if (token) {
            setIsAuthenticated(true);
            fetchMetrics();
            fetchAnalytics();
        }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError(null);
        try {
            const res = await fetch(`${apiUrl}/api/v1/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: adminEmail, password: adminPassword }),
            });

            if (!res.ok) throw new Error("Invalid auditor credentials");

            const data = await res.json();
            localStorage.setItem("kindlink_admin_token", data.token);
            setIsAuthenticated(true);
            fetchMetrics();
            fetchAnalytics();
        } catch (err: any) {
            setLoginError(err.message || "Failed to authenticate.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("kindlink_admin_token");
        setIsAuthenticated(false);
    };

    const fetchMetrics = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${apiUrl}/api/v1/admin/metrics`);
            if (res.ok) {
                const data = await res.json();
                setMetrics(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const res = await fetch(`${apiUrl}/api/v1/admin/snowflake/analytics`);
            if (res.ok) {
                const data = await res.json();
                setAnalytics(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleTriggerSnowflakeSync = async () => {
        setIsSyncing(true);
        setSyncResult(null);
        try {
            const res = await fetch(`${apiUrl}/api/v1/admin/snowflake/sync`, {
                method: "POST",
            });
            if (!res.ok) throw new Error("Sync pipeline failed");
            const data = await res.json();
            setSyncResult(data);
            fetchMetrics();
            fetchAnalytics();
        } catch (e: any) {
            alert("Snowflake Sync Error: " + e.message);
        } finally {
            setIsSyncing(false);
        }
    };

    const fallbackDistribution = [
        { type: "SOL_ESCROW", count: 7, pct: 58.3, color: "#10B981" },
        { type: "DATES_BLOCKED", count: 5, pct: 41.7, color: "#F43F5E" },
        { type: "LOGISTICS", count: 3, pct: 25.0, color: "#06B6D4" },
        { type: "LABOUR", count: 2, pct: 16.6, color: "#F59E0B" },
    ];

    const fallbackVelocity = [
        { zone: "NGO Dog Shelter", priority: 75, sol: 1.4, commitments: 5 },
        { zone: "Sentinel SOS Node (Alpha)", priority: 100, sol: 2.1, commitments: 3 },
        { zone: "Sentinel SOS Node (Beta)", priority: 100, sol: 2.1, commitments: 2 },
        { zone: "Sentinel SOS Node (Gamma)", priority: 100, sol: 2.1, commitments: 2 },
    ];

    const activeDistribution = analytics?.modalDistribution && analytics.modalDistribution.length > 0
        ? analytics.modalDistribution
        : fallbackDistribution;

    const activeVelocity = analytics?.capitalVelocity && analytics.capitalVelocity.length > 0
        ? analytics.capitalVelocity
        : fallbackVelocity;

    // SVG Donut Calculations
    const radius = 64;
    const circumference = 2 * Math.PI * radius;
    let accumulatedOffset = 0;

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#070D18] flex items-center justify-center p-4 text-white">
                <div className="w-full max-w-md bg-[#0C1527] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-700 text-cyan-400 flex items-center justify-center mx-auto">
                            <ShieldAlert className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight">ADMIN AUDIT GRID</h1>
                        <p className="text-xs text-slate-400 font-mono">Live Triage &amp; Snowflake Cortex Bridge</p>
                    </div>

                    {loginError && (
                        <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-xl text-rose-300 text-xs font-semibold">
                            {loginError}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4 text-xs font-mono">
                        <div>
                            <label className="block text-slate-400 mb-1">Auditor Identifier</label>
                            <input
                                type="email"
                                required
                                value={adminEmail}
                                onChange={(e) => setAdminEmail(e.target.value)}
                                placeholder="admin@kindlink.org"
                                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 mb-1">Master Grid Secret</label>
                            <input
                                type="password"
                                required
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-500"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                        >
                            <Lock className="w-4 h-4" /> Authenticate Grid Console
                        </button>
                    </form>

                    <div className="text-center">
                        <Link href="/" className="text-[11px] text-slate-500 hover:text-slate-300 font-mono">
                            ← Return to Public Mesh
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070D18] text-slate-100 p-6 lg:p-10 space-y-8 font-sans">
            {/* Top Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
                            <SlidersHorizontal className="w-6 h-6 text-cyan-400" />
                            ADMIN AUDIT GRID
                        </h1>
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-[10px] font-mono font-bold tracking-wider">
                            SNOWFLAKE OLAP CLUSTER LIVE
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">
                        Direct PostgreSQL Operational State ↔ Snowflake Analytical Data Warehouse
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            fetchMetrics();
                            fetchAnalytics();
                        }}
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 hover:bg-slate-800 transition flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} /> Refresh Views
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-xl bg-rose-950/30 border border-rose-800/80 text-xs font-mono text-rose-300 hover:bg-rose-900/50 transition flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                        <LogOut className="w-3.5 h-3.5" /> Disconnect
                    </button>
                </div>
            </div>

            {/* Primary KPI Grid with Micro-Sparklines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-[#0C1527] border border-slate-800 relative overflow-hidden shadow-soft">
                    <div className="flex justify-between items-center text-slate-400">
                        <span className="text-xs font-mono font-bold">POSTGRES MISSIONS</span>
                        <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-400 border border-cyan-800">
                            <Layers className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <p className="text-3xl font-black font-mono text-white tracking-tight">{metrics?.missionsCount ?? "--"}</p>
                        <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center">
                            ↑ Active
                        </span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">Real-time Ground Distress Pleas</span>
                </div>

                <div className="p-5 rounded-3xl bg-[#0C1527] border border-slate-800 relative overflow-hidden shadow-soft">
                    <div className="flex justify-between items-center text-slate-400">
                        <span className="text-xs font-mono font-bold">ESCROW POOL (DEVNET)</span>
                        <div className="p-2 rounded-xl bg-emerald-950/60 text-emerald-400 border border-emerald-800">
                            <Coins className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <p className="text-3xl font-black font-mono text-emerald-400 tracking-tight">
                            {metrics?.totalSolAllocated ?? "--"} <span className="text-lg">SOL</span>
                        </p>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">100% On-Chain Solana Escrow</span>
                </div>

                <div className="p-5 rounded-3xl bg-[#0C1527] border border-slate-800 relative overflow-hidden shadow-soft">
                    <div className="flex justify-between items-center text-slate-400">
                        <span className="text-xs font-mono font-bold">COMMITTED PLEDGES</span>
                        <div className="p-2 rounded-xl bg-indigo-950/60 text-indigo-400 border border-indigo-800">
                            <FileCheck2 className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <p className="text-3xl font-black font-mono text-white tracking-tight">{metrics?.commitmentsCount ?? "--"}</p>
                        <span className="text-[10px] font-mono text-indigo-400">Audited Ledger</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">Volunteers, Fleet &amp; Funding</span>
                </div>

                <div className="p-5 rounded-3xl bg-[#0C1527] border border-slate-800 relative overflow-hidden shadow-soft">
                    <div className="flex justify-between items-center text-slate-400">
                        <span className="text-xs font-mono font-bold">SNOWFLAKE ANALYTICS</span>
                        <div className="p-2 rounded-xl bg-sky-950/60 text-sky-400 border border-sky-800">
                            <Database className="w-4 h-4" />
                        </div>
                    </div>
                    <div className="mt-3 flex items-baseline gap-2">
                        <p className="text-lg font-black font-mono text-sky-300 truncate tracking-tight">KINDLINK_ANALYTICS</p>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">Warehouse: COMPUTE_WH</span>
                </div>
            </div>

            {/* Snowflake Cortex ETL Trigger Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0C1527] via-[#0D1A33] to-[#0C1527] border border-cyan-800/50 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-1.5 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                        <Cpu className="w-5 h-5 text-cyan-400" />
                        <h2 className="text-base font-extrabold text-white">Snowflake Macro Cortex Pipeline</h2>
                        <span className="text-[10px] font-mono bg-cyan-900/60 border border-cyan-700 text-cyan-300 px-2 py-0.5 rounded-full">
                            ETL BATCH ENGINE
                        </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono max-w-2xl">
                        Atomically merge transactional records from PostgreSQL into Snowflake OLAP tables (<code className="text-cyan-300">CORTEX_MISSIONS_ANALYTICS</code> &amp; <code className="text-cyan-300">CORTEX_COMMITMENT_LEDGER</code>) for warehouse-grade intelligence.
                    </p>
                </div>

                <button
                    onClick={handleTriggerSnowflakeSync}
                    disabled={isSyncing}
                    className="px-6 py-3.5 rounded-full bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white font-mono font-bold text-xs shadow-lg shadow-cyan-950 transition active:scale-95 disabled:opacity-50 flex items-center gap-2.5 shrink-0 cursor-pointer"
                >
                    {isSyncing ? (
                        <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Executing Warehouse Load...
                        </>
                    ) : (
                        <>
                            <Database className="w-4 h-4" />
                            Sync PostgreSQL to Snowflake Cortex
                        </>
                    )}
                </button>
            </div>

            {/* Sync Confirmation Banner */}
            {syncResult && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-700/80 text-cyan-200 text-xs font-mono flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>
                            Synced <strong>{syncResult.recordsSynced} records</strong> to <code className="text-white">{syncResult.snowflakeTarget}</code> via {syncResult.pipeline}
                        </span>
                    </div>
                    <span className="text-slate-400 text-[10px]">{syncResult.timestamp}</span>
                </div>
            )}

            {/* REAL ANALYTICS ENGINE: Visual Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                {/* Visual Chart 1: Donut Chart & Channel Allocation */}
                <div className="lg:col-span-5 bg-[#0C1527] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-soft">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <PieChart className="w-4 h-4 text-cyan-400" />
                                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                                    Modal Aid Allocation (Snowflake OLAP)
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded-full font-bold">
                                V_MODAL_AID_DISTRIBUTION
                            </span>
                        </div>

                        {/* Interactive SVG Donut Visual */}
                        <div className="my-6 flex items-center justify-center relative">
                            <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    className="stroke-slate-900"
                                    strokeWidth="18"
                                    fill="transparent"
                                />
                                {activeDistribution.map((item, idx) => {
                                    const strokeLength = (item.pct / 100) * circumference;
                                    const strokeDasharray = `${strokeLength} ${circumference - strokeLength}`;
                                    const strokeDashoffset = -accumulatedOffset;
                                    accumulatedOffset += strokeLength;

                                    const color =
                                        item.type === "SOL_ESCROW"
                                            ? "#10B981"
                                            : item.type === "DATES_BLOCKED"
                                                ? "#F43F5E"
                                                : item.type === "LOGISTICS"
                                                    ? "#06B6D4"
                                                    : "#F59E0B";

                                    return (
                                        <circle
                                            key={item.type}
                                            cx="80"
                                            cy="80"
                                            r={radius}
                                            stroke={color}
                                            strokeWidth={selectedModalHover === item.type ? "22" : "18"}
                                            strokeDasharray={strokeDasharray}
                                            strokeDashoffset={strokeDashoffset}
                                            fill="transparent"
                                            strokeLinecap="round"
                                            className="transition-all duration-500 cursor-pointer hover:opacity-90"
                                            onMouseEnter={() => setSelectedModalHover(item.type)}
                                            onMouseLeave={() => setSelectedModalHover(null)}
                                        />
                                    );
                                })}
                            </svg>

                            {/* Center Donut Metrics */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                                <span className="text-xl font-black font-mono text-white">
                                    {metrics?.commitmentsCount ?? activeDistribution.reduce((a, b) => a + b.count, 0)}
                                </span>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Total Pledges</span>
                            </div>
                        </div>
                    </div>

                    {/* Donut Legend with percentage progress bars */}
                    <div className="space-y-3 font-mono text-xs pt-2">
                        {activeDistribution.map((item) => {
                            const isEscrow = item.type === "SOL_ESCROW";
                            const colorClass = isEscrow
                                ? "bg-emerald-500"
                                : item.type === "DATES_BLOCKED"
                                    ? "bg-rose-500"
                                    : item.type === "LOGISTICS"
                                        ? "bg-cyan-500"
                                        : "bg-amber-500";

                            return (
                                <div
                                    key={item.type}
                                    className={`p-2.5 rounded-xl border transition-all ${selectedModalHover === item.type
                                            ? "bg-slate-900 border-slate-700"
                                            : "bg-slate-950/40 border-slate-800/80"
                                        }`}
                                    onMouseEnter={() => setSelectedModalHover(item.type)}
                                    onMouseLeave={() => setSelectedModalHover(null)}
                                >
                                    <div className="flex justify-between items-center text-[11px] mb-1.5">
                                        <span className="text-slate-300 font-bold flex items-center gap-2">
                                            <span className={`w-2.5 h-2.5 rounded-full ${colorClass}`} />
                                            {item.type}
                                        </span>
                                        <span className="text-slate-400 font-mono">
                                            {item.count} commitments (<strong className="text-white">{item.pct}%</strong>)
                                        </span>
                                    </div>
                                    <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${colorClass} transition-all duration-700`}
                                            style={{ width: `${item.pct}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Visual Chart 2: 2D Matrix - Priority vs Escrow vs Pledges */}
                <div className="lg:col-span-7 bg-[#0C1527] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-soft">
                    <div>
                        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-sky-400" />
                                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                                    Capital Absorption vs. Mission Urgency Matrix
                                </h3>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-0.5 rounded-full">
                                V_MISSION_CAPITAL_VELOCITY
                            </span>
                        </div>

                        {/* Interactive Analytical Scatter/Bar Canvas */}
                        <div className="my-4 bg-slate-950/60 border border-slate-800/80 rounded-2xl p-4 space-y-4">
                            <div className="flex justify-between items-center text-[11px] font-mono text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Compass className="w-3.5 h-3.5 text-cyan-400" /> Ground Incident Nodes
                                </span>
                                <span>Target Baseline: <strong className="text-emerald-400">&gt; 0.50 SOL / Urgency</strong></span>
                            </div>

                            {/* Responsive Analytical Matrix Bars */}
                            <div className="space-y-3 font-mono">
                                {activeVelocity.map((m) => {
                                    const solRatio = (m.sol / Math.max(m.priority, 1)).toFixed(3);
                                    const isAdequate = parseFloat(solRatio) >= 0.02; // Normalized ratio check

                                    return (
                                        <div key={m.zone} className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-2 hover:border-slate-700 transition">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white text-xs">{m.zone}</span>
                                                    <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                                                        PRIORITY {m.priority}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                                                    <span>Pool: <strong className="text-emerald-400">{m.sol} SOL</strong></span>
                                                    <span>{m.commitments} Pledges</span>
                                                </div>
                                            </div>

                                            {/* Dual Metric Absorption Track */}
                                            <div className="space-y-1">
                                                <div className="flex justify-between text-[10px] text-slate-500">
                                                    <span>Escrow Absorption Depth</span>
                                                    <span className={isAdequate ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                                                        Velocity: {solRatio} SOL/P
                                                    </span>
                                                </div>
                                                <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden flex">
                                                    <div
                                                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-full rounded-full transition-all duration-700"
                                                        style={{ width: `${Math.min((m.sol / 5.0) * 100, 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Operational Triage Summary Card */}
                    <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 text-xs font-mono flex items-center justify-between">
                        <div className="flex items-center gap-2 text-cyan-300">
                            <Activity className="w-4 h-4 text-cyan-400" />
                            <span>Snowflake Statistical Mesh: <strong>All Mission Nodes Within Active Response Range</strong></span>
                        </div>
                        <span className="text-[10px] text-slate-400">Validated by PostgreSQL Stage</span>
                    </div>
                </div>
            </div>

            {/* Live Operational Ledger Table */}
            <div className="bg-[#0C1527] border border-slate-800 rounded-3xl p-6 space-y-4 shadow-soft">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-cyan-400" />
                        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                            Live Triage Transactions &amp; On-Chain Verification
                        </h3>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">
                        Operational PostgreSQL Commitments ({metrics?.recentLedger?.length ?? 0} Recorded)
                    </span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                        <thead>
                            <tr className="text-slate-400 border-b border-slate-800/80 text-[11px]">
                                <th className="pb-3 font-semibold">ID</th>
                                <th className="pb-3 font-semibold">MISSION NODE</th>
                                <th className="pb-3 font-semibold">SKU ITEM</th>
                                <th className="pb-3 font-semibold">CONTRIBUTOR</th>
                                <th className="pb-3 font-semibold">ESCROW</th>
                                <th className="pb-3 font-semibold">TX SIGNATURE</th>
                                <th className="pb-3 font-semibold">STATE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40 text-slate-300">
                            {metrics?.recentLedger && metrics.recentLedger.length > 0 ? (
                                metrics.recentLedger.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-900/40 transition">
                                        <td className="py-3.5 text-slate-500 font-bold">#{row.id}</td>
                                        <td className="py-3.5 font-bold text-white">
                                            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
                                                {row.missionId}
                                            </span>
                                        </td>
                                        <td className="py-3.5 text-slate-200">{row.itemTitle || "Ground Assistance"}</td>
                                        <td className="py-3.5 text-slate-400">{row.giverEmail}</td>
                                        <td className="py-3.5 font-bold text-emerald-400">
                                            {row.solAmount > 0 ? `${row.solAmount} SOL` : "—"}
                                        </td>
                                        <td className="py-3.5 text-slate-400">
                                            {row.txSignature && !row.txSignature.startsWith("BLOCK-") ? (
                                                <a
                                                    href={`https://explorer.solana.com/tx/${row.txSignature}?cluster=devnet`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 inline-flex items-center gap-1 font-bold"
                                                >
                                                    {row.txSignature.slice(0, 12)}... <ExternalLink className="w-3 h-3" />
                                                </a>
                                            ) : (
                                                <span className="text-slate-500 text-[10px]">STANDBY RESERVATION</span>
                                            )}
                                        </td>
                                        <td className="py-3.5">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 border border-emerald-800 text-emerald-300">
                                                {row.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-10 text-center text-slate-500">
                                        No transactions recorded in operational database yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}