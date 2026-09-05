"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Sparkles,
    Building2,
    ShieldCheck,
    Radio,
    ExternalLink,
    Search,
    Cpu,
    Layers,
    HeartHandshake,
    ArrowRight,
    Activity,
    CheckCircle2
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

export default function PartnersDirectoryPage() {
    const [selectedType, setSelectedType] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    const partners: PartnerEntity[] = [
        {
            id: "PARTNER-01",
            name: "Flood Watch Kerala",
            type: "GOV_DISASTER_CELL",
            region: "South Asia · Coastline",
            focus: "Hydrological sensors, dam overflow alerts, and regional siren integration.",
            nodeStatus: "ONLINE",
            verifiedDate: "Verified Jan 2026",
            activeMissions: 18
        },
        {
            id: "PARTNER-02",
            name: "Relief Logistics Co-op",
            type: "FIELD_NGO",
            region: "North & Northeast Riverine",
            focus: "High-clearance cargo transport, cold-chain pharma distribution.",
            nodeStatus: "ONLINE",
            verifiedDate: "Verified Feb 2026",
            activeMissions: 9
        },
        {
            id: "PARTNER-03",
            name: "City Volunteer Corps",
            type: "FIELD_NGO",
            region: "Metropolitan Delta Hubs",
            focus: "First responders, shallow-draft boat rowers, community shelter leads.",
            nodeStatus: "ONLINE",
            verifiedDate: "Verified Nov 2025",
            activeMissions: 14
        },
        {
            id: "PARTNER-04",
            name: "District Disaster Cell",
            type: "GOV_DISASTER_CELL",
            region: "State Emergency Desk",
            focus: "Civil defense clearance, priority transit lanes, aerial supply drops.",
            nodeStatus: "ONLINE",
            verifiedDate: "Verified Aug 2025",
            activeMissions: 22
        },
        {
            id: "PARTNER-05",
            name: "Solana Humanitarian Foundation",
            type: "TECH_INFRA",
            region: "Global Decentralized Rail",
            focus: "Devnet escrow liquidity, automated gas sponsorship, and Blink actions.",
            nodeStatus: "ONLINE",
            verifiedDate: "Verified Core Protocol",
            activeMissions: 38
        },
        {
            id: "PARTNER-06",
            name: "ElevenLabs Crisis Voice Lab",
            type: "TECH_INFRA",
            region: "Distributed Audio AI",
            focus: "Real-time multilingual emergency voice translation and phone lifelines.",
            nodeStatus: "ONLINE",
            verifiedDate: "Verified Core Protocol",
            activeMissions: 31
        }
    ];

    const filteredPartners = partners.filter((p) => {
        const matchesFilter = selectedType === "ALL" || p.type === selectedType;
        const matchesSearch =
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.focus.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getTypeLabel = (type: PartnerEntity["type"]) => {
        switch (type) {
            case "FIELD_NGO":
                return { text: "Field Operations NGO", color: "bg-teal-50 text-teal-700 border-teal-200" };
            case "GOV_DISASTER_CELL":
                return { text: "Emergency Disaster Cell", color: "bg-amber-50 text-amber-700 border-amber-200" };
            case "TECH_INFRA":
                return { text: "Protocol & Core Tech", color: "bg-purple-50 text-purple-700 border-purple-200" };
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
                </div>
            </div>

            {/* Screen Title & High-Trust Mission Statement */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E36] tracking-tight">
                        Coordinating Network & Partners
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                        The Autonomous Generosity Grid bridges ground responders, civil defense teams, and decentralized compute nodes into a shared protocol for zero-delay triage.
                    </p>
                </div>

                <Link
                    href="/onboard"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-semibold shadow-sm transition active:scale-95 shrink-0"
                >
                    Federate Your Organization <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Federation Network Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Active Field Partners", value: "42 Orgs", subtext: "Verified ground operations", color: "text-[#0B1E36]" },
                    { label: "Regional Coverage", value: "11 States", subtext: "Live low-bandwidth mesh nodes", color: "text-[#0284C7]" },
                    { label: "Automated Relays", value: "3,840+", subtext: "Direct dispatches processed", color: "text-teal-600" },
                    { label: "Node Uptime", value: "99.98%", subtext: "Redundant emergency routing", color: "text-purple-600" },
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
                        className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-full bg-white border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800 shadow-sm"
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
                                    ? "bg-[#0B1E36] text-white shadow-sm"
                                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid of Partners */}
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
                    className="px-5 py-3 rounded-full bg-white text-slate-900 hover:bg-slate-100 text-xs sm:text-sm font-bold transition shadow-sm active:scale-95 shrink-0"
                >
                    Contact Systems Liaison
                </Link>
            </div>

        </div>
    );
}