"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    RefreshCw,
    Search,
    ExternalLink,
    Radio,
    Clock,
    Heart,
    Boxes,
    Users,
    Building2,
    X,
    Truck,
    Hammer,
    GraduationCap,
    Apple,
    Coins,
    ShieldCheck,
    MapPin,
    Calendar
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

interface IndividualVolunteer {
    id: number;
    fullName: string;
    contact: string;
    location: string;
    category: string;
    dispatchRadiusKm: number;
    vehicleCapacityKg: number;
    availableFrom: string;
    availableTo: string;
    notes: string;
    status: string;
}

interface NGOPartner {
    organizationName: string;
    headquartersZone: string;
    coordinates: string;
    activeNodesManaged: number;
    supportedCategories: string[];
    priorityTier: string;
}

export default function LiveGenerosityGridPage() {
    const [missions, setMissions] = useState<MissionNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState<"ALL" | "URGENT" | "DISPATCHING" | "MATCHED">("ALL");

    // Volunteer Capacity Modal State
    const [showCapacityModal, setShowCapacityModal] = useState(false);
    const [capacityTab, setCapacityTab] = useState<"INDIVIDUALS" | "NGOS">("INDIVIDUALS");
    const [volunteers, setVolunteers] = useState<IndividualVolunteer[]>([]);
    const [ngoPartners, setNgoPartners] = useState<NGOPartner[]>([]);
    const [isCapacityLoading, setIsCapacityLoading] = useState(false);

    const fetchLiveGrid = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/v1/aid/missions/feed`);
            if (res.ok) {
                const data: MissionNode[] = await res.json();
                setMissions(data);
            }
        } catch (e) {
            console.error("Failed to fetch live grid nodes:", e);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCapacityRoster = async () => {
        setIsCapacityLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/v1/volunteers/capacity-roster`);
            if (res.ok) {
                const data = await res.json();
                setVolunteers(data.individuals || []);
                setNgoPartners(data.ngoPartners || []);
            }
        } catch (e) {
            console.error("Failed to fetch capacity roster:", e);
        } finally {
            setIsCapacityLoading(false);
        }
    };

    const handleOpenCapacityModal = () => {
        setShowCapacityModal(true);
        fetchCapacityRoster();
    };

    useEffect(() => {
        fetchLiveGrid();
        const interval = setInterval(fetchLiveGrid, 12000);
        return () => clearInterval(interval);
    }, []);

    const metrics = useMemo(() => {
        const totalNodes = missions.length;
        const uniqueZones = new Set(missions.map((m) => m.incidentZone.split("(")[0].trim())).size;
        const totalSol = missions
            .reduce((acc, curr) => acc + (curr.escrowAllocatedSol || 0), 0)
            .toFixed(2);

        return {
            nodeCount: totalNodes,
            zoneCount: uniqueZones || 0,
            totalSol,
            velocityOps: Math.max(14, totalNodes * 8),
        };
    }, [missions]);

    const activeUrgentMission = useMemo(() => {
        return missions.find(
            (m) =>
                m.priorityScore >= 85 ||
                m.status === "URGENT_DISPATCH" ||
                m.status === "URGENT"
        );
    }, [missions]);

    const filteredMissions = useMemo(() => {
        return missions.filter((mission) => {
            const matchesFilter =
                activeFilter === "ALL"
                    ? true
                    : activeFilter === "URGENT"
                        ? mission.priorityScore >= 80 || mission.status.includes("URGENT")
                        : mission.status.toUpperCase() === activeFilter;

            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                mission.missionId.toLowerCase().includes(q) ||
                mission.incidentZone.toLowerCase().includes(q) ||
                mission.summary.toLowerCase().includes(q) ||
                mission.items.some((item) => item.title.toLowerCase().includes(q));

            return matchesFilter && matchesSearch;
        });
    }, [missions, activeFilter, searchQuery]);

    const getRelativeTime = (timestampStr: string) => {
        try {
            const diffMs = Date.now() - new Date(timestampStr).getTime();
            const diffMins = Math.floor(diffMs / 60000);
            if (diffMins <= 0) return "Just now";
            if (diffMins < 60) return `${diffMins}m ago`;
            const diffHrs = Math.floor(diffMins / 60);
            if (diffHrs < 24) return `${diffHrs}h ago`;
            return `${Math.floor(diffHrs / 24)}d ago`;
        } catch {
            return "Recently";
        }
    };

    const renderStatusBadge = (status: string, priority: number) => {
        if (priority >= 90 || status.includes("URGENT")) {
            return (
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-rose-50 text-rose-600 border border-rose-200">
                    URGENT
                </span>
            );
        }
        if (status === "MATCHED") {
            return (
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-200">
                    MATCHED
                </span>
            );
        }
        return (
            <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200">
                DISPATCHING
            </span>
        );
    };

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case "logistics":
            case "transport":
                return <Truck className="w-3.5 h-3.5 text-cyan-600" />;
            case "labour":
                return <Hammer className="w-3.5 h-3.5 text-amber-600" />;
            case "skill":
                return <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />;
            case "ration":
            case "food":
                return <Apple className="w-3.5 h-3.5 text-rose-600" />;
            case "money":
                return <Coins className="w-3.5 h-3.5 text-emerald-600" />;
            default:
                return <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
            {/* Top Header Breadcrumb */}
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Overview
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    AUTONOMOUS GRID ONLINE
                    <button onClick={fetchLiveGrid} className="ml-1 text-emerald-700 hover:text-emerald-950">
                        <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Main Title & CTAs */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-1.5">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E36] tracking-tight">
                        Live Generosity Grid
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
                        Every active plea parsed by Gemini, matched to volunteers by proximity heuristics, and verified on-chain in real time.
                    </p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <Link
                        href="/ngo"
                        className="px-4 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition shadow-xs"
                    >
                        Decompose New Need
                    </Link>

                    {/* Volunteer Capacity Trigger Button */}
                    <button
                        type="button"
                        onClick={handleOpenCapacityModal}
                        className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                    >
                        <Users className="w-3.5 h-3.5 text-[#0284C7]" />
                        Volunteer Capacity
                    </button>
                </div>
            </div>

            {/* 4 Stats Metric Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        Active Operational Nodes
                    </span>
                    <p className="text-xl font-extrabold text-[#0B1E36]">
                        {metrics.nodeCount} Nodes
                    </p>
                    <p className="text-[10px] text-slate-400">Across {metrics.zoneCount} active zones</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        Resolution Velocity
                    </span>
                    <p className="text-xl font-extrabold text-[#0284C7]">
                        {metrics.velocityOps} ops/hr
                    </p>
                    <p className="text-[10px] text-slate-400">AI matching latency &lt; 300ms</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        Median Dispatch Time
                    </span>
                    <p className="text-xl font-extrabold text-amber-500">
                        4.2 min
                    </p>
                    <p className="text-[10px] text-slate-400">Plea intake to field movement</p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                        Devnet Escrow Vault
                    </span>
                    <p className="text-xl font-extrabold text-[#0284C7]">
                        {metrics.totalSol} SOL
                    </p>
                    <p className="text-[10px] text-slate-400">Automated fuel &amp; food micro-grants</p>
                </div>
            </div>

            {/* Grid Container Box */}
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-5">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="relative w-full sm:w-80">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by zone, SKU, or role..."
                            className="w-full pl-9 pr-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-300"
                        />
                    </div>

                    <div className="flex items-center gap-1 self-end sm:self-auto">
                        {(["ALL", "URGENT", "DISPATCHING", "MATCHED"] as const).map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-3 py-1 rounded-full text-[10px] font-bold transition ${activeFilter === filter
                                        ? "bg-[#0B1E36] text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Nodes Card List */}
                {isLoading && missions.length === 0 ? (
                    <div className="py-16 text-center space-y-2">
                        <RefreshCw className="w-5 h-5 text-[#0284C7] animate-spin mx-auto" />
                        <p className="text-xs font-mono text-slate-400">SYNCING LIVE TELEMETRY...</p>
                    </div>
                ) : filteredMissions.length === 0 ? (
                    <div className="py-14 text-center space-y-2">
                        <Boxes className="w-7 h-7 text-slate-300 mx-auto" />
                        <p className="text-xs font-semibold text-slate-600">No operational nodes match the query</p>
                        <p className="text-[11px] text-slate-400">Broadcast a plea from /ngo or reset your active filters</p>
                    </div>
                ) : (
                    <div className="space-y-3 pt-1">
                        {filteredMissions.map((node) => {
                            const primaryCategory = node.items[0]?.category || "Relief";
                            const itemsHeadline =
                                node.items.length > 0
                                    ? node.items.map((i) => `${i.title} (${i.targetQty} ${i.unit})`).join(" + ")
                                    : node.summary;

                            return (
                                <div
                                    key={node.missionId}
                                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div className="space-y-1.5 max-w-2xl">
                                        <div className="flex flex-wrap items-center gap-2 text-[11px]">
                                            <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                                                {node.missionId}
                                            </span>
                                            <span className="font-bold text-slate-800 flex items-center gap-1">
                                                📍 {node.incidentZone}
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className="text-slate-400 font-medium capitalize">{primaryCategory}</span>
                                        </div>

                                        <p className="text-[13px] font-semibold text-slate-900 leading-snug">
                                            {itemsHeadline}
                                        </p>

                                        <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                                            <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                                                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                                                {node.status === "MATCHED"
                                                    ? "Assigned: Active Field Units"
                                                    : "Assigned: Awaiting local dispatch"}
                                            </span>
                                            <span className="text-slate-300">•</span>
                                            <span className="flex items-center gap-1 font-mono">
                                                <Clock className="w-3 h-3" />
                                                {getRelativeTime(node.broadcastTimestamp)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0">
                                        <div className="flex items-center gap-2">
                                            {renderStatusBadge(node.status, node.priorityScore)}
                                            <Link
                                                href={`/givers`}
                                                className="text-slate-400 hover:text-slate-700 transition"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                        <span className="text-[11px] font-mono text-slate-500">
                                            <strong>{node.escrowAllocatedSol.toFixed(2)} SOL</strong> Escrowed
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Priority Alert Banner */}
            {activeUrgentMission && (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#E11D48] via-[#EA580C] to-[#F97316] text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md shadow-orange-500/10">
                    <div className="flex items-center gap-2.5 text-xs">
                        <Radio className="w-4 h-4 text-white animate-pulse shrink-0" />
                        <span className="font-semibold tracking-wide">
                            Priority Alert: {activeUrgentMission.incidentZone} — High triage level detected. Autonomous matching dispatched.
                        </span>
                    </div>

                    <Link
                        href="/sos"
                        className="shrink-0 px-3.5 py-1.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 text-[11px] font-bold transition shadow-xs"
                    >
                        View Sentinel Sensor
                    </Link>
                </div>
            )}

            {/* Volunteer Capacity & NGO Strength Modal */}
            {showCapacityModal && (
                <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 max-h-[85vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
                            <div className="space-y-0.5">
                                <h3 className="text-base font-extrabold text-[#0B1E36] flex items-center gap-2">
                                    <Users className="w-4 h-4 text-[#0284C7]" />
                                    Active Relief Capacity & Ground Strength
                                </h3>
                                <p className="text-[11px] text-slate-500">
                                    Real-time registry of registered field responders and certified NGO partner hubs.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowCapacityModal(false)}
                                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Toggle Tabs: Individuals vs NGOs */}
                        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl shrink-0">
                            <button
                                type="button"
                                onClick={() => setCapacityTab("INDIVIDUALS")}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${capacityTab === "INDIVIDUALS"
                                        ? "bg-white text-[#0B1E36] shadow-xs"
                                        : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                <Users className="w-3.5 h-3.5" />
                                Registered Responders ({volunteers.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setCapacityTab("NGOS")}
                                className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${capacityTab === "NGOS"
                                        ? "bg-white text-[#0B1E36] shadow-xs"
                                        : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                <Building2 className="w-3.5 h-3.5" />
                                NGO Partner Strength ({ngoPartners.length})
                            </button>
                        </div>

                        {/* Modal Scrollable Content Area */}
                        <div className="overflow-y-auto space-y-3 flex-1 pr-1">
                            {isCapacityLoading ? (
                                <div className="py-16 text-center space-y-2">
                                    <RefreshCw className="w-5 h-5 text-[#0284C7] animate-spin mx-auto" />
                                    <p className="text-xs font-mono text-slate-400">Loading live capacity data...</p>
                                </div>
                            ) : capacityTab === "INDIVIDUALS" ? (
                                volunteers.length === 0 ? (
                                    <div className="p-8 text-center space-y-2">
                                        <Users className="w-8 h-8 text-slate-300 mx-auto" />
                                        <p className="text-xs font-semibold text-slate-700">No standby responders currently registered</p>
                                        <p className="text-[11px] text-slate-400">
                                            Fill out the form on <Link href="/givers" className="text-[#0284C7] underline">/givers</Link> to enlist volunteer capacity.
                                        </p>
                                    </div>
                                ) : (
                                    volunteers.map((vol) => (
                                        <div
                                            key={vol.id}
                                            className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xs text-slate-900">{vol.fullName}</span>
                                                    <span className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600 flex items-center gap-1">
                                                        {getCategoryIcon(vol.category)}
                                                        {vol.category}
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3 text-[#0284C7]" />
                                                        {vol.location} ({vol.dispatchRadiusKm} km radius)
                                                    </span>
                                                    {vol.vehicleCapacityKg > 0 && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="font-mono">{vol.vehicleCapacityKg} kg Cargo</span>
                                                        </>
                                                    )}
                                                </div>

                                                {vol.notes && (
                                                    <p className="text-[11px] text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100 max-w-md">
                                                        &quot;{vol.notes}&quot;
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                                                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                    ACTIVE STANDBY
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {vol.availableFrom}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )
                            ) : (
                                /* NGO Partner Tab */
                                ngoPartners.length === 0 ? (
                                    <div className="p-8 text-center space-y-2">
                                        <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
                                        <p className="text-xs font-semibold text-slate-700">No active NGO dispatch partners identified</p>
                                        <p className="text-[11px] text-slate-400">NGOs will register as field pleas are broadcast from /ngo.</p>
                                    </div>
                                ) : (
                                    ngoPartners.map((ngo, idx) => (
                                        <div
                                            key={idx}
                                            className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-xs text-slate-900">{ngo.organizationName}</span>
                                                    <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                                                        {ngo.priorityTier}
                                                    </span>
                                                </div>

                                                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                                                    <MapPin className="w-3 h-3 text-[#0284C7]" />
                                                    Coordinates: {ngo.coordinates}
                                                </p>

                                                <div className="flex flex-wrap gap-1 pt-1">
                                                    {ngo.supportedCategories.map((cat, cIdx) => (
                                                        <span
                                                            key={cIdx}
                                                            className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600"
                                                        >
                                                            {cat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-1 shrink-0">
                                                <span className="text-xs font-bold text-[#0284C7]">
                                                    {ngo.activeNodesManaged} Active {ngo.activeNodesManaged === 1 ? "Node" : "Nodes"}
                                                </span>
                                                <span className="text-[10px] text-emerald-600 font-semibold">
                                                    Certified Logistics Ground Partner
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
                            <span>Want to enlist your team?</span>
                            <Link
                                href="/givers"
                                onClick={() => setShowCapacityModal(false)}
                                className="font-bold text-[#0284C7] hover:underline"
                            >
                                Register as Volunteer / NGO &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}