"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Sparkles,
    ArrowLeft,
    Layers,
    Send,
    CheckCircle2,
    AlertTriangle,
    MapPin,
    Clock,
    RefreshCw,
    Box,
    Droplet,
    Users,
    ShieldCheck,
    ChevronRight,
    SlidersHorizontal
} from "lucide-react";

interface SKUItem {
    id: string;
    category: "food" | "water" | "medical" | "shelter" | "logistics";
    title: string;
    targetQty: number;
    raisedQty: number;
    unit: string;
    urgency: "CRITICAL" | "HIGH" | "NORMAL";
}

interface ParsedDecomposition {
    incidentZone: string;
    extractedCoordinates: string;
    reportedTimestamp: string;
    affectedCount: number;
    summary: string;
    priorityScore: number;
    items: SKUItem[];
}

export default function NGONeedDecomposerPage() {
    const [rawPlea, setRawPlea] = useState(
        "Sector 4 Primary School is marooned by floodwater reaching 4 feet. Around 120 civilians, including 25 children and 14 senior citizens, have evacuated to the terrace. Drinking water ran out 6 hours ago. Immediate need for 500 liters of potable water, 120 ready-to-eat dry meal kits, and 1 inflatable rescue raft for elderly medical evacuations. Grid power is down."
    );
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDispatched, setIsDispatched] = useState(false);

    // Live parsed decomposition state
    const [decomposition, setDecomposition] = useState<ParsedDecomposition | null>({
        incidentZone: "Sector 4 Primary School, North Delta",
        extractedCoordinates: "10.0245° N, 76.3088° E",
        reportedTimestamp: "6 mins ago",
        affectedCount: 120,
        summary: "Terrace evacuation due to 4ft water logging. Critical potable water deficit and geriatric evacuation required.",
        priorityScore: 94,
        items: [
            {
                id: "sku-1",
                category: "water",
                title: "Potable Drinking Water Cans",
                targetQty: 500,
                raisedQty: 180,
                unit: "Liters",
                urgency: "CRITICAL"
            },
            {
                id: "sku-2",
                category: "food",
                title: "Ready-to-Eat Emergency Meals",
                targetQty: 120,
                raisedQty: 75,
                unit: "Packs",
                urgency: "HIGH"
            },
            {
                id: "sku-3",
                category: "logistics",
                title: "Inflatable Shallow-Draft Rescue Raft",
                targetQty: 1,
                raisedQty: 0,
                unit: "Vessel",
                urgency: "CRITICAL"
            },
            {
                id: "sku-4",
                category: "medical",
                title: "Geriatric First Aid & ORS Salts",
                targetQty: 25,
                raisedQty: 12,
                unit: "Kits",
                urgency: "HIGH"
            }
        ]
    });

    const handleDecompose = () => {
        if (!rawPlea.trim()) return;
        setIsProcessing(true);
        setIsDispatched(false);

        // Simulates Gemini 2.5 Flash structured decomposition
        setTimeout(() => {
            setIsProcessing(false);
        }, 900);
    };

    const handleBroadcast = () => {
        setIsDispatched(true);
    };

    const getUrgencyBadge = (urgency: string) => {
        switch (urgency) {
            case "CRITICAL":
                return "bg-rose-50 text-rose-700 border-rose-200";
            case "HIGH":
                return "bg-amber-50 text-amber-700 border-amber-200";
            default:
                return "bg-slate-50 text-slate-700 border-slate-200";
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case "water":
                return <Droplet className="w-4 h-4 text-cyan-600" />;
            case "food":
                return <Box className="w-4 h-4 text-amber-600" />;
            case "medical":
                return <ShieldCheck className="w-4 h-4 text-rose-600" />;
            default:
                return <Layers className="w-4 h-4 text-indigo-600" />;
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 lg:py-14 space-y-8">

            {/* Top Breadcrumb & Actions */}
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Grid
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-[11px] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    GEMINI 2.5 FLASH MULTIMODAL INTAKE
                </div>
            </div>

            {/* Screen Title */}
            <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E36] tracking-tight">
                    NGO Need Decomposer
                </h1>
                <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
                    Convert unstructured field transcripts, phone dispatch audio, or ground SOS pleas into verified, itemized supply meters and autonomous volunteer missions.
                </p>
            </div>

            {/* Main 2-Column Workflow */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Raw Plea Intake Box */}
                <div className="lg:col-span-5 space-y-4">
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <SlidersHorizontal className="w-3.5 h-3.5 text-[#0284C7]" />
                                Field Distress Message
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">Plain Text or Audio</span>
                        </div>

                        <textarea
                            rows={8}
                            value={rawPlea}
                            onChange={(e) => setRawPlea(e.target.value)}
                            placeholder="Paste raw phone transcript, field SMS or audio dispatch plea..."
                            className="w-full text-sm leading-relaxed p-4 rounded-2xl bg-slate-50/70 border border-slate-200 focus:border-[#0284C7] focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 transition resize-none text-slate-800"
                        />

                        <div className="flex items-center justify-between gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setRawPlea("")}
                                className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition"
                            >
                                Clear
                            </button>

                            <button
                                type="button"
                                onClick={handleDecompose}
                                disabled={isProcessing || !rawPlea.trim()}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-semibold transition active:scale-95 disabled:opacity-50 shadow-sm"
                            >
                                {isProcessing ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Decomposing with Gemini...
                                    </>
                                ) : (
                                    <>
                                        Decompose Plea <ChevronRight className="w-3.5 h-3.5" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Prompt Suggestion Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                        <p className="font-bold text-slate-800">Example Field Pattern:</p>
                        <p className="italic text-slate-500">
                            &quot;Flood water entered hospital basement, 40 dialyzed patients need transfer, generator diesel out in 2 hours.&quot;
                        </p>
                    </div>
                </div>

                {/* Right Column: Parsed Structured SKUs */}
                <div className="lg:col-span-7 space-y-5">
                    {decomposition ? (
                        <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-6">

                            {/* Metadata Banner */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-[#0284C7]" />
                                        <span className="text-sm font-bold text-slate-900">{decomposition.incidentZone}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
                                        <span>{decomposition.extractedCoordinates}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3 text-slate-400" /> {decomposition.reportedTimestamp}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold font-mono">
                                        PRIORITY {decomposition.priorityScore}/100
                                    </div>
                                </div>
                            </div>

                            {/* Parsed Human Context Summary */}
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-start gap-3">
                                <Users className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                                <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                                    <span className="font-bold text-slate-900">{decomposition.affectedCount} individuals reported: </span>
                                    {decomposition.summary}
                                </div>
                            </div>

                            {/* SKU Allocation Progress Meters */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Structured Resource Units (SKUs)
                                    </h3>
                                    <span className="text-xs text-slate-500 font-mono">4 Target Requirements</span>
                                </div>

                                <div className="space-y-3">
                                    {decomposition.items.map((item) => {
                                        const percentage = Math.min(100, Math.round((item.raisedQty / item.targetQty) * 100));
                                        return (
                                            <div
                                                key={item.id}
                                                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-2 hover:border-slate-300 transition"
                                            >
                                                <div className="flex items-center justify-between gap-2">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                                                            {getCategoryIcon(item.category)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-slate-800">{item.title}</p>
                                                            <p className="text-xs text-slate-500">
                                                                {item.raisedQty} of {item.targetQty} {item.unit} secured
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <span className={`text-[10px] font-bold font-mono uppercase px-2 py-0.5 rounded border ${getUrgencyBadge(item.urgency)}`}>
                                                            {item.urgency}
                                                        </span>
                                                        <span className="text-xs font-mono font-bold text-slate-700 w-10 text-right">
                                                            {percentage}%
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Visual Progress Bar */}
                                                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-500 ${percentage >= 80
                                                                ? "bg-teal-500"
                                                                : percentage >= 40
                                                                    ? "bg-[#0284C7]"
                                                                    : "bg-amber-500"
                                                            }`}
                                                        style={{ width: `${percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Action Trigger */}
                            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
                                <p className="text-xs text-slate-500">
                                    Publishing unblocks this plea for proximity-based volunteer matching and Solana devnet micro-grants.
                                </p>

                                {isDispatched ? (
                                    <div className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold">
                                        <CheckCircle2 className="w-4 h-4 text-teal-600" /> Active on Grid
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleBroadcast}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold transition active:scale-95 shadow-sm"
                                    >
                                        <Send className="w-3.5 h-3.5" /> Publish to Grid Rails
                                    </button>
                                )}
                            </div>

                        </div>
                    ) : (
                        <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
                            <Layers className="w-8 h-8 text-slate-300 mx-auto" />
                            <p className="text-sm font-semibold text-slate-600">No plea currently decomposed</p>
                            <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                Paste a message on the left and click Decompose to extract actionable SKUs.
                            </p>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}