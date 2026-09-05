"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Sparkles,
    Mail,
    Phone,
    Radio,
    MessageSquare,
    ShieldCheck,
    Send,
    CheckCircle2,
    Clock,
    MapPin,
    FileQuestion,
    Headphones,
    LifeBuoy
} from "lucide-react";

export default function ContactHubPage() {
    const [inquiryType, setInquiryType] = useState<"field-escalation" | "partner" | "technical">("field-escalation");
    const [isSending, setIsSending] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const [form, setForm] = useState({
        name: "",
        org: "",
        contactInfo: "",
        urgency: "HIGH",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.contactInfo || !form.message) return;
        setIsSending(true);

        setTimeout(() => {
            setIsSending(false);
            setSubmitted(true);
        }, 800);
    };

    return (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 lg:py-14 space-y-10">

            {/* Top Header & Breadcrumb */}
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Grid
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-[11px] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    24/7 COORDINATION & PROTOCOL LIAISON
                </div>
            </div>

            {/* Title & Introduction */}
            <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E36] tracking-tight">
                    Field Support & Protocol Team
                </h1>
                <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Need immediate ground triage coordination, API mesh integration, or emergency fuel escrow authorization? Our distributed response team operates around the clock.
                </p>
            </div>

            {/* 2-Column Responsive Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Direct Escalation Form */}
                <div className="lg:col-span-7">
                    <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-6">

                        {/* Inquiry Selector Tabs */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Direct Routing Channel
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { id: "field-escalation", label: "Field Escalation", icon: Radio },
                                    { id: "partner", label: "NGO / Agency", icon: ShieldCheck },
                                    { id: "technical", label: "Grid Tech / API", icon: FileQuestion },
                                ].map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = inquiryType === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setInquiryType(tab.id as typeof inquiryType)}
                                            className={`p-3 rounded-2xl border text-left transition flex flex-col gap-1.5 ${isActive
                                                    ? "bg-cyan-50/70 border-[#0284C7] shadow-sm text-cyan-900"
                                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                                }`}
                                        >
                                            <Icon className={`w-4 h-4 ${isActive ? "text-[#0284C7]" : "text-slate-400"}`} />
                                            <span className="text-xs font-bold leading-tight">{tab.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {!submitted ? (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">Full Name / Callsign</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. Maya Chen"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">Organization or Division</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Red Cross Kerala Unit"
                                            value={form.org}
                                            onChange={(e) => setForm({ ...form, org: e.target.value })}
                                            className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">Phone / Signal / Email</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. +91 94000 12345 or email"
                                            value={form.contactInfo}
                                            onChange={(e) => setForm({ ...form, contactInfo: e.target.value })}
                                            className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800 font-mono"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">Priority Level</label>
                                        <select
                                            value={form.urgency}
                                            onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                                            className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800 font-semibold"
                                        >
                                            <option value="CRITICAL">Critical (Active Hazard)</option>
                                            <option value="HIGH">High (Within 6 Hours)</option>
                                            <option value="STANDARD">Standard Coordination</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Field Dispatch Brief</label>
                                    <textarea
                                        rows={4}
                                        required
                                        placeholder="Provide incident coordinates, stranded group size, supply bottlenecks, or team partnership requests..."
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800 resize-none leading-relaxed"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold transition active:scale-95 shadow-sm disabled:opacity-50"
                                >
                                    {isSending ? (
                                        "Transmitting Brief..."
                                    ) : (
                                        <>
                                            <Send className="w-3.5 h-3.5" /> Dispatch Inquiry
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <div className="p-8 rounded-2xl bg-teal-50 border border-teal-200 text-center space-y-3">
                                <CheckCircle2 className="w-10 h-10 text-teal-600 mx-auto" />
                                <h3 className="text-base font-bold text-teal-900">Message Dispatched to Ground Desk</h3>
                                <p className="text-xs text-teal-700 max-w-sm mx-auto leading-relaxed">
                                    Duty coordinators have received your telemetry ticket. A response will route back through your provided contact handle shortly.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSubmitted(false);
                                        setForm({ name: "", org: "", contactInfo: "", urgency: "HIGH", message: "" });
                                    }}
                                    className="mt-2 text-xs font-bold text-teal-800 underline hover:text-teal-950"
                                >
                                    Send another message
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Direct Hotlines & Emergency Channels */}
                <div className="lg:col-span-5 space-y-4">

                    {/* Live Desk Status Card */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                            <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <Headphones className="w-4 h-4 text-[#0284C7]" /> Duty Desk
                            </span>
                            <div className="flex items-center gap-1.5 font-mono text-emerald-600 font-semibold text-[11px]">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                                ACTIVE
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                <Phone className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                    <p className="text-xs text-slate-400 font-mono uppercase">24/7 Field Dispatch Hotline</p>
                                    <p className="text-sm font-bold text-slate-900 font-mono">+1 (800) 412-KIND</p>
                                    <p className="text-[11px] text-slate-500">Voice-interactive ElevenLabs auto-triage enabled</p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                <Mail className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                    <p className="text-xs text-slate-400 font-mono uppercase">Encrypted Coordination Desk</p>
                                    <p className="text-sm font-bold text-slate-900 font-mono">ops@kindlink.org</p>
                                    <p className="text-[11px] text-slate-500">PGP signed alerts and multi-sig escalation</p>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                <MessageSquare className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                    <p className="text-xs text-slate-400 font-mono uppercase">Mesh & WhatsApp Gateway</p>
                                    <p className="text-sm font-bold text-slate-900 font-mono">+91 94470 KIND1</p>
                                    <p className="text-[11px] text-slate-500">Auto-routes plain SMS when cell data fails</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-800">
                            <LifeBuoy className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <p>
                                For trapped victims or active life safety threats, please use the <Link href="/sos" className="font-bold underline text-amber-900">Live SOS Sentinel</Link> for immediate satellite and audio telemetry.
                            </p>
                        </div>
                    </div>

                    {/* Incident Operations Nodes */}
                    <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 space-y-3">
                        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Primary Regional Nodes
                        </h4>
                        <div className="space-y-2 text-xs text-slate-600">
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <MapPin className="w-3.5 h-3.5 text-[#0284C7]" /> South Asia Relief Node (Kochi / Guwahati)
                                </span>
                                <span className="font-mono text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                    ONLINE
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Median Response Latency
                                </span>
                                <span className="font-mono font-bold text-slate-800">
                                    ~1.8 min
                                </span>
                            </div>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}