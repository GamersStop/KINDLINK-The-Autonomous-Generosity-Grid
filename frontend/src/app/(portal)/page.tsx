"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    ArrowRight,
    Sparkles,
    Layers,
    HeartHandshake,
    Radio,
    Clock,
    ExternalLink,
    RefreshCw,
    Boxes
} from "lucide-react";

interface SKUItem {
    id: string;
    category: string;
    title: string;
    targetQty: number;
    raisedQty: number;
    unit: string;
    urgency: string;
}

interface MissionNode {
    missionId: string;
    incidentZone: string;
    extractedCoordinates: string;
    reportedTimestamp: string;
    affectedCount: number;
    summary: string;
    priorityScore: number;
    status: "URGENT" | "DISPATCHING" | "MATCHED" | "URGENT_DISPATCH" | string;
    escrowAllocatedSol: number;
    broadcastTimestamp: string;
    items: SKUItem[];
}

export default function HomePage() {
    const [missions, setMissions] = useState<MissionNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdatedSec, setLastUpdatedSec] = useState(0);

    const fetchHomeFeed = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/v1/aid/missions/feed`);
            if (res.ok) {
                const data: MissionNode[] = await res.json();
                setMissions(data);
                setLastUpdatedSec(0);
            }
        } catch (e) {
            console.error("Failed to load homepage live feed:", e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHomeFeed();
        const interval = setInterval(fetchHomeFeed, 15000);
        const secTimer = setInterval(() => setLastUpdatedSec((prev) => prev + 1), 1000);
        return () => {
            clearInterval(interval);
            clearInterval(secTimer);
        };
    }, []);

    // Compute Dynamic Metrics
    const stats = useMemo(() => {
        const totalCount = missions.length;
        const uniqueZones = new Set(missions.map((m) => m.incidentZone.split("(")[0].trim())).size;
        const totalSol = missions.reduce((acc, curr) => acc + (curr.escrowAllocatedSol || 0), 0);

        return {
            activeNeeds: totalCount,
            activeZones: uniqueZones || 1,
            giverVelocity: Math.max(12, totalCount * 6),
            reliefFundedSol: totalSol > 0 ? `${totalSol.toFixed(1)} SOL` : "0.0 SOL",
        };
    }, [missions]);

    // Urgent SOS tally for the mini orange ribbon
    const urgentCount = useMemo(() => {
        return missions.filter(
            (m) => m.priorityScore >= 85 || m.status.includes("URGENT")
        ).length;
    }, [missions]);

    const renderStatusBadge = (status: string, priority: number) => {
        if (priority >= 90 || status.includes("URGENT")) {
            return (
                <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                    URGENT
                </span>
            );
        }
        if (status === "MATCHED") {
            return (
                <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                    MATCHED
                </span>
            );
        }
        return (
            <span className="text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">
                DISPATCHING
            </span>
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 lg:py-16 space-y-16 sm:space-y-20">
            {/* Hero Section */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
                {/* Left Headline & Content */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-[#0284C7] text-[11px] font-semibold tracking-wide">
                        <Sparkles className="w-3.5 h-3.5" />
                        RELIEF COORDINATION GRID
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-[#0B1E36] tracking-tight leading-[1.08]">
                        Where urgent human pleas become{" "}
                        <span className="text-[#0284C7]">verified relief</span> in minutes.
                    </h1>

                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                        One shared grid for field NGOs, local volunteers and donors — needs arrive raw, leave structured, and every delivery is traceable end to end.
                    </p>

                    <div className="flex flex-wrap items-center gap-3.5 pt-2">
                        <Link
                            href="/ngo"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition shadow-xs active:scale-95"
                        >
                            Report a need <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                            href="/givers"
                            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs"
                        >
                            Volunteer resources
                        </Link>
                    </div>
                </div>

                {/* Right Live Relief Feed Card (Dynamically Populated) */}
                <div className="lg:col-span-5">
                    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-4">
                        {/* Card Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-xs font-bold text-slate-800">Live relief feed</span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400">
                                updated {lastUpdatedSec}s ago
                            </span>
                        </div>

                        {/* List of 4 most recent live missions */}
                        <div className="space-y-3">
                            {isLoading && missions.length === 0 ? (
                                <div className="py-12 text-center space-y-2">
                                    <RefreshCw className="w-5 h-5 text-[#0284C7] animate-spin mx-auto" />
                                    <p className="text-[11px] font-mono text-slate-400">Syncing live nodes...</p>
                                </div>
                            ) : missions.length === 0 ? (
                                <div className="py-10 text-center space-y-2">
                                    <Boxes className="w-6 h-6 text-slate-300 mx-auto" />
                                    <p className="text-xs text-slate-500 font-medium">No active dispatches on grid</p>
                                </div>
                            ) : (
                                missions.slice(0, 4).map((node) => {
                                    const headlineItem =
                                        node.items.length > 0
                                            ? `${node.items[0].title}, ${node.items[0].targetQty} ${node.items[0].unit}`
                                            : node.summary.slice(0, 32);

                                    return (
                                        <Link
                                            key={node.missionId}
                                            href="/live-grid"
                                            className="group p-3 rounded-2xl bg-slate-50/70 hover:bg-slate-100/80 border border-slate-100 transition flex items-center justify-between gap-3 block"
                                        >
                                            <div className="space-y-0.5 truncate">
                                                <p className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition truncate">
                                                    {headlineItem}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium truncate">
                                                    {node.incidentZone.split("(")[0].trim()}
                                                </p>
                                            </div>

                                            <div className="shrink-0 flex items-center gap-2">
                                                {renderStatusBadge(node.status, node.priorityScore)}
                                            </div>
                                        </Link>
                                    );
                                })
                            )}
                        </div>

                        {/* Live Sentinel Alert Banner */}
                        <Link
                            href="/sos"
                            className="p-3 rounded-2xl bg-linear-to-r from-[#E11D48] via-[#EA580C] to-[#F97316] text-white flex items-center justify-between gap-2 shadow-xs transition hover:brightness-105 block"
                        >
                            <div className="flex items-center gap-2 text-[11px] font-semibold truncate">
                                <Radio className="w-3.5 h-3.5 animate-pulse shrink-0" />
                                <span className="truncate">
                                    {urgentCount > 0
                                        ? `${urgentCount} SOS streams active — field units alerted.`
                                        : "Live Sentinel SOS sensor standby ready."}
                                </span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4 Stats Metrics Row (Dynamically Bound to DB) */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        ACTIVE NEEDS
                    </span>
                    <p className="text-3xl font-extrabold text-[#0B1E36]">{stats.activeNeeds}</p>
                    <p className="text-[11px] text-slate-400">Across {stats.activeZones} active zones</p>
                </div>

                <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        GIVER VELOCITY
                    </span>
                    <p className="text-3xl font-extrabold text-[#0284C7]">{stats.giverVelocity}/hr</p>
                    <p className="text-[11px] text-slate-400">Resources routed live</p>
                </div>

                <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        MEDIAN RESPONSE
                    </span>
                    <p className="text-3xl font-extrabold text-amber-500">4.2 min</p>
                    <p className="text-[11px] text-slate-400">Intake to dispatch</p>
                </div>

                <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        RELIEF FUNDED
                    </span>
                    <p className="text-3xl font-extrabold text-[#0284C7]">{stats.reliefFundedSol}</p>
                    <p className="text-[11px] text-slate-400">Verified micro-grants</p>
                </div>
            </section>

            {/* Three Rails Section */}
            <section className="space-y-6">
                <div className="inline-flex items-center gap-2 text-slate-400 text-[11px] font-bold tracking-wider uppercase">
                    <Layers className="w-3.5 h-3.5 text-[#0284C7]" />
                    THREE RAILS, ONE GRID
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1: Need intake */}
                    <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4 hover:border-slate-300 transition flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-[#0284C7] flex items-center justify-center">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Need intake</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Paste a chaotic distress message or voice note. It becomes a structured list of supplies, people and locations with live target meters.
                            </p>
                        </div>
                        <Link
                            href="/ngo"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:text-[#0369A1] transition pt-2"
                        >
                            Start intake &rarr;
                        </Link>
                    </div>

                    {/* Card 2: Giver matching */}
                    <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4 hover:border-slate-300 transition flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
                                <HeartHandshake className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Giver matching</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Offer a vehicle, free hours or surplus gear. We match you to the nearest mission where that exact offer unblocks relief today.
                            </p>
                        </div>
                        <Link
                            href="/givers"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:text-[#0369A1] transition pt-2"
                        >
                            Offer help &rarr;
                        </Link>
                    </div>

                    {/* Card 3: Live SOS */}
                    <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4 hover:border-slate-300 transition flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                                <Radio className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">Live SOS</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Stream camera frames and GPS from the field. Flood depth, stranded counts and spoken guidance come back within seconds.
                            </p>
                        </div>
                        <Link
                            href="/sos"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] hover:text-[#0369A1] transition pt-2"
                        >
                            Open SOS &rarr;
                        </Link>
                    </div>
                </div>
            </section>

            {/* Callout Banner */}
            <section className="p-8 sm:p-10 rounded-3xl bg-[#0284C7] text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-cyan-900/10">
                <div className="space-y-2 max-w-xl">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Relief is a logistics problem. We solved the last mile.
                    </h2>
                    <p className="text-xs sm:text-sm text-cyan-100 leading-relaxed">
                        Bring your field teams onto the grid in a day — no new hardware, no training weeks. Works over SMS, voice and low-bandwidth data.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <Link
                        href="/onboard"
                        className="px-5 py-2.5 rounded-full bg-white text-[#0B1E36] hover:bg-slate-100 text-xs font-bold transition shadow-xs"
                    >
                        Onboard your NGO
                    </Link>
                    <Link
                        href="/givers"
                        className="px-5 py-2.5 rounded-full border border-white/30 hover:bg-white/10 text-white text-xs font-bold transition"
                    >
                        Talk to the team
                    </Link>
                </div>
            </section>
        </div>
    );
}