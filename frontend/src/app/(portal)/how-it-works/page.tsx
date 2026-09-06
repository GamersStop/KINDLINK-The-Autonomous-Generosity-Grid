"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Cpu,
    Terminal,
    Database,
    Radio,
    Coins,
    Volume2,
    CheckCircle2,
    Copy,
    Layers,
    ArrowRight,
    ShieldCheck,
    Zap,
    Server
} from "lucide-react";

export default function HowItWorksPage() {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const stepsToRun = [
        {
            title: "1. Configure Environment Variables",
            desc: "Ensure your backend .env file contains the required API keys for AI decomposition and telemetry.",
            code: `GEMINI_API_KEY=your_gemini_api_key_here\nELEVENLABS_API_KEY=your_elevenlabs_api_key_here\nELEVENLABS_VOICE_ID=21m00Tcm4TlvDq8ikWAM\nPOSTGRES_USER=kindlink\nPOSTGRES_PASSWORD=kindlink_secret\nPOSTGRES_DB=kindlink_db`,
        },
        {
            title: "2. Spin Up Database & Backend Microservices",
            desc: "Launch PostgreSQL, FastAPI, and Next.js containers via Docker Compose.",
            code: `docker compose up -d --build`,
        },
        {
            title: "3. Run Database Migrations & Initial Setup",
            desc: "Verify database table creation for missions, volunteers, and verified NGOs.",
            code: `docker compose exec backend python -c "from src.core.database import init_db; init_db()"`,
        },
        {
            title: "4. Access the Local Coordination Rails",
            desc: "Open your browser to test each interactive node on the local network.",
            code: `Frontend:  http://localhost:3000\nAPI Docs:  http://localhost:8000/docs\nLive Grid: http://localhost:3000/live-grid`,
        },
    ];

    return (
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 lg:py-14 space-y-12">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Grid
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-[#0284C7] text-[11px] font-semibold">
                    <Zap className="w-3.5 h-3.5" />
                    TECHNICAL SYSTEM ARCHITECTURE & RUNBOOK
                </div>
            </div>

            <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E36] tracking-tight">
                    How KindLink Operates
                </h1>
                <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                    An autonomous, end-to-end disaster coordination grid bridging raw natural language distress pleas, computer vision triage, and on-chain escrow rails.
                </p>
            </div>

            {/* SECTION 1: System Architecture */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Layers className="w-5 h-5 text-[#0284C7]" />
                    <h2 className="text-lg font-bold text-slate-900">System Architecture & Data Pipeline</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* Card 1 */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
                        <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-[#0284C7] flex items-center justify-center">
                            <Cpu className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-mono font-bold text-cyan-700 uppercase">Input Layer</span>
                            <h3 className="text-base font-bold text-slate-900">Multimodal Intake & Vision</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Raw audio transcripts, chaotic text dispatches, or 6-second optical video feeds pass into <strong>Gemini 3.5 Flash</strong>. The model extracts GPS coordinates, urgency levels, water depth, and unbundles requests into itemized SKUs.
                            </p>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <Server className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-mono font-bold text-amber-700 uppercase">Core Dispatch</span>
                            <h3 className="text-base font-bold text-slate-900">FastAPI & SQLModel Rails</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Persistent PostgreSQL storage matches SKU requirements against registered volunteers and verified NGOs using radius thresholds, cargo limits, and blocked dates. Real-time telemetry feeds update every 12 seconds.
                            </p>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-soft space-y-4">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Coins className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5">
                            <span className="text-[10px] font-mono font-bold text-purple-700 uppercase">Settlement & Voice</span>
                            <h3 className="text-base font-bold text-slate-900">Solana & ElevenLabs</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Donors execute instant SOL escrow payments directly against specific SKU requirements. Simultaneously, <strong>ElevenLabs</strong> streams synthesized field directives to guide victims and keep field teams aligned.
                            </p>
                        </div>
                    </div>
                </div>

                {/* ASCII / Visual Flow Representation */}
                <div className="p-5 rounded-2xl bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
                    <p className="text-slate-500 uppercase font-bold text-[10px]">Data Flow Visualizer:</p>
                    <pre className="leading-relaxed">
                        {`[Distress Plea / Optical SOS] ──► [Gemini 3.5 Flash] ──► [Structured SKU Items]
                                                              │
   ┌──────────────────────────────────────────────────────────┴─────────────────────────┐
   ▼                                                                                    ▼
[PostgreSQL / FastAPI] ──► Live Grid Telemetry                       [ElevenLabs Voice Hotline]
   ▲                                                                                    ▼
   ├─► Radius & Cargo Matching (Volunteers & NGOs)                    Spoken Evacuation Directives
   └─► Solana Devnet Escrow (Instant SOL Micro-Grants)`}
                    </pre>
                </div>
            </div>

            {/* SECTION 2: Instructions to Run System */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                    <Terminal className="w-5 h-5 text-[#0284C7]" />
                    <h2 className="text-lg font-bold text-slate-900">Run &amp; Deploy Instructions</h2>
                </div>

                <div className="space-y-4">
                    {stepsToRun.map((step, idx) => (
                        <div
                            key={idx}
                            className="p-5 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                                    <p className="text-xs text-slate-500">{step.desc}</p>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(step.code, idx)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-[11px] font-bold text-slate-600 transition"
                                >
                                    {copiedIndex === idx ? (
                                        <>
                                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3.5 h-3.5" /> Copy Code
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs overflow-x-auto">
                                <pre>{step.code}</pre>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Links Footer */}
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-0.5 text-center sm:text-left">
                    <p className="text-xs font-bold text-slate-800">Ready to test the live network?</p>
                    <p className="text-[11px] text-slate-500">
                        Submit a test distress plea or register volunteer availability.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/ngo"
                        className="px-4 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition shadow-xs"
                    >
                        Open Decomposer &rarr;
                    </Link>
                    <Link
                        href="/live-grid"
                        className="px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition"
                    >
                        Inspect Live Grid
                    </Link>
                </div>
            </div>
        </div>
    );
}