"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Sparkles,
    Search,
    ArrowRight,
    Activity,
    ShieldCheck,
    RefreshCw,
    Boxes
} from "lucide-react";

interface PartnerEntity {
    id: string;
    name: string;
    type: "FIELD_NGO" | "TECH_INFRA" | "GOV_DISASTER_CELL";
    region: string;
    focus: string;
    nodeStatus: "ONLINE" | "STANDBY";
    verifiedDate: string;
    activeMissions: number;
}

interface NetworkMetrics {
    activePartners: string;
    regionalCoverage: string;
    automatedRelays: string;
    nodeUptime: string;
}

export default function PartnersDirectoryPage() {
    const [partners, setPartners] = useState<PartnerEntity[]>([]);
    const [metrics, setMetrics] = useState<NetworkMetrics>({
        activePartners: "0 Orgs",
        regionalCoverage: "0 States",
        automatedRelays: "0",
        nodeUptime: "99.98%",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [selectedType, setSelectedType] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchPartners = async () => {
        setIsLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/v1/ngo-auth/directory`);
            if (res.ok) {
                const data = await res.json();
                setPartners(data.partners || []);
                if (data.metrics) {
                    setMetrics(data.metrics);
                }
            }
        } catch (err) {
            console.error("Failed to load partners from database:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const filteredPartners = useMemo(() => {
        return partners.filter((p) => {
            const matchesFilter = selectedType === "ALL" || p.type === selectedType;
            const q = searchQuery.toLowerCase().trim();
            const matchesSearch =
                !q ||
                p.name.toLowerCase().includes(q) ||
                p.region.toLowerCase().includes(q) ||
                p.focus.toLowerCase().includes(q);
            return matchesFilter && matchesSearch;
        });
    }, [partners, selectedType, searchQuery]);

    const getTypeLabel = (type: PartnerEntity["type"]) => {
        switch (type) {
            case "FIELD_NGO":
                return { text: "Field Operations NGO", color: "bg-teal-50 text-teal-700 border-teal-200" };
            case "GOV_DISASTER_CELL":
                return { text: "Emergency Disaster Cell", color: "bg-amber-50 text-amber-700 border-amber-200" };
            case "TECH_INFRA":
                return { text: "Protocol & Core Tech", color: "bg-purple-50 text-purple-700 border-purple-200" };
            default:
                return { text: "Verified Entity", color: "bg-slate-50 text-slate-700 border-slate-200" };
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 lg:py-14 space-y-12">
            {/* Breadcrumb & Protocol Pill */}
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Grid
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    FEDERATED DISASTER ALLIANCE
                    <button onClick={fetchPartners} className="ml-1 text-cyan-700 hover:text-cyan-950">
                        <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
                    </button>
                </div>
            </div>

            {/* Screen Title & Mission Statement */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E36] tracking-tight">
                        Coordinating Network &amp; Partners
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                        The Autonomous Generosity Grid bridges ground responders, civil defense teams, and decentralized compute nodes into a shared protocol for zero-delay triage.
                    </p>
                </div>

                <Link
                    href="/onboard-ngo"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-semibold shadow-xs transition active:scale-95 shrink-0"
                >
                    Federate Your Organization <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Federation Network Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Active Field Partners", value: metrics.activePartners, subtext: "Verified ground operations", color: "text-[#0B1E36]" },
                    { label: "Regional Coverage", value: metrics.regionalCoverage, subtext: "Live low-bandwidth mesh nodes", color: "text-[#0284C7]" },
                    { label: "Automated Relays", value: metrics.automatedRelays, subtext: "Direct dispatches processed", color: "text-teal-600" },
                    { label: "Node Uptime", value: metrics.nodeUptime, subtext: "Redundant emergency routing", color: "text-purple-600" },
                ].map((stat, idx) => (
                    <div key={idx} className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-soft">
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
                        <p className={`text-2xl font-black mt-2 tracking-tight ${stat.color}`}>{stat.value}</p>
                        <p className="text-[11px] text-slate-500 mt-1">{stat.subtext}</p>
                    </div>
                ))}
            </div>

            {/* Search and Category Filter Strip */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search partners by name, region, focus..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-white border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800 shadow-xs"
                    />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                    {[
                        { id: "ALL", label: "All Network Nodes" },
                        { id: "FIELD_NGO", label: "Field NGOs" },
                        { id: "GOV_DISASTER_CELL", label: "Civil Defense Cells" },
                        { id: "TECH_INFRA", label: "Protocol & AI Labs" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setSelectedType(tab.id)}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${selectedType === tab.id
                                    ? "bg-[#0B1E36] text-white shadow-xs"
                                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid of Partners */}
            {isLoading && partners.length === 0 ? (
                <div className="py-20 text-center space-y-3">
                    <RefreshCw className="w-7 h-7 text-[#0284C7] animate-spin mx-auto" />
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Syncing Partner Directory...</p>
                </div>
            ) : filteredPartners.length === 0 ? (
                <div className="py-16 text-center space-y-2 bg-white rounded-3xl border border-slate-200 p-8">
                    <Boxes className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-sm font-semibold text-slate-700">No partner entities match this filter</p>
                    <p className="text-xs text-slate-400">Try changing your search keywords or resetting the filter pill.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPartners.map((partner) => {
                        const typeMeta = getTypeLabel(partner.type);
                        return (
                            <div
                                key={partner.id}
                                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft hover:shadow-card-hover transition-all flex flex-col justify-between space-y-6"
                            >
                                <div className="space-y-4">
                                    {/* Header Row */}
                                    <div className="flex items-start justify-between gap-2">
                                        <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${typeMeta.color}`}>
                                            {typeMeta.text}
                                        </span>
                                        <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-600 font-bold">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            {partner.nodeStatus}
                                        </div>
                                    </div>

                                    {/* Partner Name & Region */}
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold text-slate-900">{partner.name}</h3>
                                        <p className="text-xs text-slate-400 font-medium">{partner.region}</p>
                                    </div>

                                    {/* Focus Area */}
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {partner.focus}
                                    </p>
                                </div>

                                {/* Bottom Operational Telemetry */}
                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1">
                                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                                        {partner.verifiedDate}
                                    </span>
                                    <span className="font-bold text-slate-800 flex items-center gap-1">
                                        <Activity className="w-3.5 h-3.5 text-[#0284C7]" />
                                        {partner.activeMissions} Active Dispatches
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Institutional Integration Banner */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-1.5 max-w-xl">
                    <h3 className="text-xl font-bold tracking-tight">Are you a regional emergency responder?</h3>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                        Directly bridge your GIS system, CAD radio logs, or regional volunteer registry into the KindLink open protocol.
                    </p>
                </div>
                <Link
                    href="/contact"
                    className="px-5 py-3 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold transition shadow-xs active:scale-95 shrink-0"
                >
                    Contact Systems Liaison
                </Link>
            </div>
        </div>
    );
}