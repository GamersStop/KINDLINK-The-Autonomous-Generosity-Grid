"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Sparkles,
    Radio,
    RefreshCw,
    MapPin,
    Clock,
    CheckCircle2,
    Layers,
    ShieldAlert,
    HeartHandshake,
    ArrowUpRight,
    Filter,
    Search,
    Coins,
    SlidersHorizontal
} from "lucide-react";

interface GridNodeItem {
    id: string;
    zone: string;
    category: "Food & Water" | "Medical" | "Rescue & Evac" | "Shelter";
    skuDetail: string;
    status: "MATCHED" | "DISPATCHING" | "URGENT";
    assignedVolunteer: string;
    timeElapsed: string;
    fundingSol: string;
    priorityScore: number;
}

export default function LiveGridHubPage() {
    const [selectedFilter, setSelectedFilter] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [isRefreshing, setIsRefreshing] = useState(false);

    const gridNodes: GridNodeItem[] = [
        {
            id: "NODE-742",
            zone: "Kerala · Ward 7 (South Aluva)",
            category: "Food & Water",
            skuDetail: "Drinking water, 400 L + 50 Water purification kits",
            status: "MATCHED",
            assignedVolunteer: "K. Mohan (4x4 Pickup)",
            timeElapsed: "4m ago",
            fundingSol: "0.25 SOL",
            priorityScore: 92
        },
        {
            id: "NODE-743",
            zone: "Assam · Camp B Outpost",
            category: "Shelter",
            skuDetail: "Blankets, 120 units & Waterproof tarpaulins (40 pcs)",
            status: "DISPATCHING",
            assignedVolunteer: "Brahmputra Youth Corps (Boat #4)",
            timeElapsed: "9m ago",
            fundingSol: "0.40 SOL",
            priorityScore: 78
        },
        {
            id: "NODE-744",
            zone: "Sindh · Relief Hub Corridor",
            category: "Medical",
            skuDetail: "Insulin cold chain container (20 vials) + ORS satchels",
            status: "URGENT",
            assignedVolunteer: "Awaiting local courier dispatch",
            timeElapsed: "1m ago",
            fundingSol: "0.15 SOL",
            priorityScore: 99
        },
        {
            id: "NODE-745",
            zone: "Bihar · Riverbank Sector 2",
            category: "Rescue & Evac",
            skuDetail: "2 Shallow-draft rafts & 6 trained flood rowers",
            status: "MATCHED",
            assignedVolunteer: "Disaster Cell Unit 09",
            timeElapsed: "14m ago",
            fundingSol: "0.80 SOL",
            priorityScore: 88
        },
        {
            id: "NODE-746",
            zone: "North Delta · School Terrace",
            category: "Rescue & Evac",
            skuDetail: "Geriatric hoist straps & Emergency dry rations (100 pkgs)",
            status: "DISPATCHING",
            assignedVolunteer: "Rapid Response Alliance",
            timeElapsed: "6m ago",
            fundingSol: "0.35 SOL",
            priorityScore: 95
        }
    ];

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 600);
    };

    const filteredNodes = gridNodes.filter((node) => {
        const matchesFilter = selectedFilter === "ALL" || node.status === selectedFilter;
        const matchesSearch =
            node.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
            node.skuDetail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            node.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (status: GridNodeItem["status"]) => {
        switch (status) {
            case "URGENT":
                return "bg-rose-50 text-rose-700 border-rose-200";
            case "DISPATCHING":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "MATCHED":
                return "bg-teal-50 text-teal-700 border-teal-200";
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 lg:py-14 space-y-10">

            {/* Top Breadcrumb & Live Sync Badge */}
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
                </Link>
                <div className="flex items-center gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-semibold">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        AUTONOMOUS GRID ONLINE
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="p-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition shadow-sm"
                        title="Refresh Grid Telemetry"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#0284C7]" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Screen Title & Topline Metrics */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E36] tracking-tight">
                        Live Generosity Grid
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                        Every active plea parsed by Gemini, matched to volunteers by proximity heuristics, and verified on-chain in real time.
                    </p>
                </div>

                {/* Action Quick Links */}
                <div className="flex items-center gap-3 shrink-0">
                    <Link
                        href="/ngo"
                        className="px-4 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95"
                    >
                        Decompose New Need
                    </Link>
                    <Link
                        href="/givers"
                        className="px-4 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-semibold border border-slate-200 shadow-sm transition active:scale-95"
                    >
                        Volunteer Capacity
                    </Link>
                </div>
            </div>

            {/* Grid Network Overview Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Active Operational Nodes", value: "38 Nodes", subtext: "Across 4 active zones", color: "text-[#0B1E36]" },
                    { label: "Resolution Velocity", value: "142 ops/hr", subtext: "AI matching latency < 300ms", color: "text-[#0284C7]" },
                    { label: "Median Dispatch Time", value: "4.2 min", subtext: "Plea intake to field movement", color: "text-amber-600" },
                    { label: "Devnet Escrow Vault", value: "84.50 SOL", subtext: "Automated fuel & food micro-grants", color: "text-purple-600" },
                ].map((item, idx) => (
                    <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{item.label}</p>
                        <p className={`text-2xl font-black mt-2 tracking-tight ${item.color}`}>{item.value}</p>
                        <p className="text-[11px] text-slate-500 mt-1">{item.subtext}</p>
                    </div>
                ))}
            </div>

            {/* Main Telemetry Table & Filters */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-6">

                {/* Controls Bar: Search & Status Filters */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">

                    {/* Search Box */}
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by zone, SKU, or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                        />
                    </div>

                    {/* Filter Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        {["ALL", "URGENT", "DISPATCHING", "MATCHED"].map((tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setSelectedFilter(tab)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${selectedFilter === tab
                                        ? "bg-[#0B1E36] text-white shadow-sm"
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                </div>

                {/* Live Grid Nodes List */}
                <div className="space-y-3">
                    {filteredNodes.length > 0 ? (
                        filteredNodes.map((node) => (
                            <div
                                key={node.id}
                                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 hover:bg-slate-50/90 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                {/* Left: Node Info */}
                                <div className="space-y-1.5 max-w-xl">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                                            {node.id}
                                        </span>
                                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-[#0284C7]" /> {node.zone}
                                        </span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-[11px] text-slate-500 font-medium">
                                            {node.category}
                                        </span>
                                    </div>

                                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                                        {node.skuDetail}
                                    </p>

                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <HeartHandshake className="w-3.5 h-3.5 text-teal-600" />
                                            Assigned: <strong className="text-slate-700">{node.assignedVolunteer}</strong>
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-slate-400" /> {node.timeElapsed}
                                        </span>
                                    </div>
                                </div>

                                {/* Right: Status & Funding Rails */}
                                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60">
                                    <div className="text-left md:text-right space-y-0.5">
                                        <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md border ${getStatusBadge(node.status)}`}>
                                            {node.status}
                                        </span>
                                        <p className="text-[11px] font-mono text-purple-700 flex items-center md:justify-end gap-1 font-semibold pt-1">
                                            <Coins className="w-3 h-3" /> {node.fundingSol} Escrowed
                                        </p>
                                    </div>

                                    <Link
                                        href={`/sos`}
                                        className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition shadow-sm"
                                        title="Inspect Node Sentinel Feed"
                                    >
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-xs">
                            No live grid operations match your current search and filters.
                        </div>
                    )}
                </div>

            </div>

            {/* Emergency Active Broadcast Bar */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div className="flex items-center gap-3 text-xs font-semibold">
                    <Radio className="w-5 h-5 animate-pulse shrink-0" />
                    <span>Priority Alert: High water logging detected in Ward 7. Autonomous boat matching dispatched.</span>
                </div>
                <Link
                    href="/sos"
                    className="px-4 py-1.5 rounded-full bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition whitespace-nowrap shadow-sm"
                >
                    View Sentinel Sensor
                </Link>
            </div>

        </div>
    );
}