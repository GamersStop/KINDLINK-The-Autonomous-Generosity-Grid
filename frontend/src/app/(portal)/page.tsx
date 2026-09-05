"use client";

import Link from "next/link";
import {
    ArrowRight,
    Layers,
    HeartHandshake,
    ShieldAlert,
    Sparkles,
    Radio,
    Clock
} from "lucide-react";

export default function HumanitarianLandingPage() {
    const reliefFeedItems = [
        {
            title: "Drinking water, 400 L",
            location: "Kerala · Ward 7",
            status: "MATCHED",
            badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
        },
        {
            title: "Blankets, 120 units",
            location: "Assam · Camp B",
            status: "DISPATCHING",
            badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
        },
        {
            title: "Insulin cold chain",
            location: "Sindh · Relief hub",
            status: "URGENT",
            badgeColor: "bg-rose-50 text-rose-700 border-rose-200 font-bold",
        },
        {
            title: "2 boats, 6 rowers",
            location: "Bihar · Riverbank",
            status: "MATCHED",
            badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
        },
    ];

    return (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 lg:py-16 space-y-20">

            {/* Hero Section: 2 Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

                {/* Left Column: Mission Statement & Key Metrics */}
                <div className="lg:col-span-7 space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-[11px] font-semibold tracking-wide uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                        RELIEF COORDINATION GRID
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-[#0B1E36] tracking-tight leading-[1.08]">
                        Where urgent <br />
                        human pleas <br />
                        become <span className="text-[#0284C7]">verified</span> <br />
                        <span className="text-[#0284C7]">relief</span> in minutes.
                    </h1>

                    {/* Subtext */}
                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-lg">
                        One shared grid for field NGOs, local volunteers and donors — needs arrive raw, leave structured, and every delivery is traceable end to end.
                    </p>

                    {/* Action CTAs */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <Link
                            href="/ngo"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-semibold transition active:scale-95 shadow-sm"
                        >
                            Report a need <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/givers"
                            className="px-5 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold border border-slate-200 transition active:scale-95 shadow-sm"
                        >
                            Volunteer resources
                        </Link>
                    </div>

                    {/* Telemetry Counter Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-200/80">
                        <div>
                            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Active Needs</p>
                            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">38</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Across 4 disaster zones</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Giver Velocity</p>
                            <p className="text-2xl sm:text-3xl font-black text-[#0284C7] mt-1">142/hr</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Resources routed live</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Median Response</p>
                            <p className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">4.2 min</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Intake to dispatch</p>
                        </div>
                        <div>
                            <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Relief Funded</p>
                            <p className="text-2xl sm:text-3xl font-black text-purple-600 mt-1">84.5K</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">Verified micro grants</p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Live Relief Feed Card */}
                <div className="lg:col-span-5 lg:pl-4 space-y-3">
                    <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-soft space-y-5">
                        {/* Header */}
                        <div className="flex items-center justify-between text-xs pb-1">
                            <div className="flex items-center gap-2 font-bold text-slate-800">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                Live relief feed
                            </div>
                            <div className="flex items-center gap-1 text-slate-400 text-[11px] font-mono">
                                <Clock className="w-3 h-3" /> updated 6s ago
                            </div>
                        </div>

                        {/* List */}
                        <div className="space-y-2.5">
                            {reliefFeedItems.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between hover:bg-slate-100/60 transition"
                                >
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-bold text-slate-800">{item.title}</p>
                                        <p className="text-xs text-slate-500">{item.location}</p>
                                    </div>
                                    <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded-md border ${item.badgeColor}`}>
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Emergency Broadcast Pill */}
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 text-white flex items-center gap-2.5 text-xs font-semibold shadow-sm">
                            <Radio className="w-4 h-4 animate-pulse shrink-0" />
                            <span>3 SOS streams open — nearest volunteers already notified.</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Three Rails Section */}
            <div className="space-y-6 pt-6">
                <div className="text-[11px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    THREE RAILS, ONE GRID
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Rail 1: Need Intake */}
                    <Link
                        href="/ngo"
                        className="group p-7 rounded-3xl bg-white border border-slate-200 shadow-soft shadow-card-hover flex flex-col justify-between space-y-6"
                    >
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-2xl bg-cyan-50 border border-cyan-200/80 flex items-center justify-center text-[#0284C7]">
                                <Layers className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                                Need intake
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Paste a chaotic distress message or voice note. It becomes a structured list of supplies, people and locations with live target meters.
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-[#0284C7]">
                            Start intake <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    {/* Rail 2: Giver Matching */}
                    <Link
                        href="/givers"
                        className="group p-7 rounded-3xl bg-white border border-slate-200 shadow-soft shadow-card-hover flex flex-col justify-between space-y-6"
                    >
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600">
                                <HeartHandshake className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                                Giver matching
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Offer a vehicle, free hours or surplus gear. We match you to the nearest mission where that exact offer unblocks relief today.
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-teal-600">
                            Offer help <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>

                    {/* Rail 3: Live SOS */}
                    <Link
                        href="/sos"
                        className="group p-7 rounded-3xl bg-white border border-slate-200 shadow-soft shadow-card-hover flex flex-col justify-between space-y-6"
                    >
                        <div className="space-y-4">
                            <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-center justify-center text-rose-500">
                                <ShieldAlert className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                                Live SOS
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Stream camera frames and GPS from the field. Flood depth, stranded counts and spoken guidance come back within seconds.
                            </p>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-rose-600">
                            Open SOS <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                </div>
            </div>

            {/* Blue Banner: Last-Mile Mission Card */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0369A1] text-white shadow-soft relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="space-y-2 max-w-xl">
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                        Relief is a logistics problem. We solved the last mile.
                    </h2>
                    <p className="text-cyan-100 text-sm sm:text-base leading-relaxed">
                        Bring your field teams onto the grid in a day — no new hardware, no training weeks. Works over SMS, voice and low-bandwidth data.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <Link
                        href="/onboard"
                        className="px-5 py-3 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm hover:bg-slate-100 transition active:scale-95 shadow-sm"
                    >
                        Onboard your NGO
                    </Link>
                    <Link
                        href="/contact"
                        className="px-5 py-3 rounded-full bg-[#0284C7] text-white font-bold text-xs sm:text-sm hover:bg-[#075985] border border-cyan-400/30 transition active:scale-95 shadow-sm"
                    >
                        Talk to the team
                    </Link>
                </div>
            </div>

            {/* Coordinating Partners Trust Ticker */}
            <div className="pt-2 pb-6 space-y-4 text-center sm:text-left">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    COORDINATING WITH
                </p>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-8 text-xs font-semibold text-slate-500">
                    <span className="flex items-center gap-1.5 hover:text-slate-800 transition cursor-default">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span> Flood Watch Kerala
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-slate-800 transition cursor-default">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span> Relief Logistics Co-op
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-slate-800 transition cursor-default">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span> City Volunteer Corps
                    </span>
                    <span className="flex items-center gap-1.5 hover:text-slate-800 transition cursor-default">
                        <span className="w-2 h-2 rounded-full bg-slate-300"></span> District Disaster Cell
                    </span>
                </div>
            </div>

        </div>
    );
}