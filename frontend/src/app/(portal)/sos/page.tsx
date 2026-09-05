"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    ShieldAlert,
    Camera,
    Navigation,
    Radio,
    Volume2,
    AlertTriangle,
    Users,
    Droplets,
    CheckCircle2,
    RefreshCw,
    Zap,
    Play,
    Pause,
    MapPin,
    ExternalLink
} from "lucide-react";

interface HazardAudit {
    floodDepthEst: string;
    strandedCount: number;
    hazardLevel: "EXTREME" | "HIGH" | "MODERATE";
    structuralRisk: string;
    identifiedHazards: string[];
    spokenDirective: string;
}

export default function LiveSentinelSOSPage() {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [isAuditing, setIsAuditing] = useState(false);
    const [sosDispatched, setSosDispatched] = useState(false);
    const [isPlayingAudio, setIsPlayingAudio] = useState(false);

    // GPS Telemetry State
    const [coordinates, setCoordinates] = useState({
        lat: "10.0251° N",
        lng: "76.3114° E",
        accuracy: "±4 meters",
        altitude: "14m ASL"
    });

    // Simulated Gemini 2.5 Flash Vision Hazard Audit
    const [hazardAudit, setHazardAudit] = useState<HazardAudit | null>({
        floodDepthEst: "3.5 - 4.0 Feet",
        strandedCount: 8,
        hazardLevel: "EXTREME",
        structuralRisk: "Submerged ground floor; foundation stable on upper masonry",
        identifiedHazards: [
            "Submerged live electrical junction",
            "Rising storm current (0.8 m/s)",
            "Vulnerable minors present without life-vests"
        ],
        spokenDirective: "Move all individuals to the upper eastern terrace immediately. Keep away from exposed power conduits. Rescue boat dispatched."
    });

    // Toggle Camera Stream
    const startCamera = async () => {
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "environment" }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                }
                setCameraActive(true);
            }
        } catch {
            // Fallback for dev environments without camera hardware
            setCameraActive(true);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        setCameraActive(false);
    };

    const runHazardAudit = () => {
        setIsAuditing(true);
        setTimeout(() => {
            setIsAuditing(false);
        }, 1200);
    };

    const triggerSOSBroadcast = () => {
        setSosDispatched(true);
    };

    return (
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 lg:py-14 space-y-8">

            {/* Top Header & Breadcrumb */}
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Grid
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-semibold">
                    <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                    SENTINEL AI SENSORY PROTOCOL
                </div>
            </div>

            {/* Screen Title */}
            <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E36] tracking-tight flex items-center gap-3">
                    Live Sentinel SOS
                </h1>
                <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                    One-touch field triage. Multimodal vision models audit flood depths and trapped victims from camera frames, while ElevenLabs streams immediate audio safety directives.
                </p>
            </div>

            {/* Main 2-Column Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Live Viewfinder & Telemetry HUD */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="p-4 sm:p-5 rounded-3xl bg-slate-950 text-white shadow-soft relative overflow-hidden border border-slate-800 space-y-4">

                        {/* Viewfinder Frame */}
                        <div className="relative aspect-video sm:aspect-[4/3] rounded-2xl bg-slate-900 overflow-hidden flex items-center justify-center border border-slate-800">

                            {cameraActive ? (
                                <video
                                    ref={videoRef}
                                    playsInline
                                    autoPlay
                                    muted
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center space-y-3 p-6">
                                    <Camera className="w-10 h-10 text-slate-600 mx-auto" />
                                    <p className="text-xs text-slate-400 max-w-xs">
                                        Camera preview offline. Activate sensory stream to begin real-time frame hazard evaluation.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={startCamera}
                                        className="px-4 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-semibold shadow-sm transition active:scale-95"
                                    >
                                        Enable Camera Feed
                                    </button>
                                </div>
                            )}

                            {/* Viewfinder Tactical Reticle & Overlay */}
                            {cameraActive && (
                                <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between">
                                    <div className="flex justify-between items-start text-[10px] font-mono text-emerald-400 bg-slate-950/60 backdrop-blur-md p-2 rounded-lg border border-emerald-500/20">
                                        <span className="flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                                            REC // SENSOR 01
                                        </span>
                                        <span>1080P • 30 FPS</span>
                                    </div>

                                    <div className="flex justify-between items-end text-[10px] font-mono text-cyan-400 bg-slate-950/60 backdrop-blur-md p-2 rounded-lg border border-cyan-500/20">
                                        <div>
                                            <span>GPS: {coordinates.lat}, {coordinates.lng}</span>
                                            <p className="text-slate-400">ALT: {coordinates.altitude}</p>
                                        </div>
                                        <span className="text-emerald-400 font-bold">FRAME READY</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Viewfinder Action Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                            <div className="flex items-center gap-2">
                                {cameraActive ? (
                                    <button
                                        type="button"
                                        onClick={stopCamera}
                                        className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                                    >
                                        Stop Feed
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={startCamera}
                                        className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                                    >
                                        Start Feed
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={runHazardAudit}
                                    disabled={isAuditing}
                                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold shadow-sm transition active:scale-95 disabled:opacity-50"
                                >
                                    {isAuditing ? (
                                        <>
                                            <RefreshCw className="w-3 h-3 animate-spin" /> Auditing Frame...
                                        </>
                                    ) : (
                                        <>
                                            <Zap className="w-3 h-3 text-amber-300" /> Run Gemini Audit
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                                <Navigation className="w-3 h-3 text-cyan-400" />
                                Acc: {coordinates.accuracy}
                            </div>
                        </div>
                    </div>

                    {/* Instant SOS Distress Rail */}
                    <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200/90 shadow-soft space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <h3 className="text-base font-extrabold text-rose-900 flex items-center gap-2">
                                    <ShieldAlert className="w-5 h-5 text-rose-600" />
                                    Immediate High-Urgency Broadcast
                                </h3>
                                <p className="text-xs text-rose-700 leading-relaxed max-w-md">
                                    Pushes this sensor telemetry directly to the nearest 5 registered 4x4 and boat volunteers while queuing Solana Devnet fuel micro-grants.
                                </p>
                            </div>
                        </div>

                        {sosDispatched ? (
                            <div className="p-3.5 rounded-2xl bg-white border border-rose-200 flex items-center justify-between text-xs font-bold text-rose-700">
                                <span className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    SOS Dispatched to Grid — 3 Responders Moving
                                </span>
                                <span className="font-mono text-[10px] bg-rose-100 px-2 py-0.5 rounded">
                                    PRIORITY 1
                                </span>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={triggerSOSBroadcast}
                                className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white text-sm font-black tracking-wide shadow-md transition flex items-center justify-center gap-2"
                            >
                                <Radio className="w-4 h-4 animate-ping" />
                                BROADCAST EMERGENCY SOS
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Column: AI Hazard Triage & Voice Directive */}
                <div className="lg:col-span-5 space-y-5">
                    {hazardAudit ? (
                        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-6">

                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Vision Hazard Extraction
                                </span>
                                <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-200">
                                    {hazardAudit.hazardLevel} THREAT
                                </span>
                            </div>

                            {/* Metric Indicators */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                    <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                                        <Droplets className="w-3 h-3 text-cyan-600" /> Est. Water Depth
                                    </span>
                                    <p className="text-lg font-black text-slate-900">{hazardAudit.floodDepthEst}</p>
                                </div>

                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                                    <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                                        <Users className="w-3 h-3 text-purple-600" /> Trapped Victims
                                    </span>
                                    <p className="text-lg font-black text-slate-900">{hazardAudit.strandedCount} Detected</p>
                                </div>
                            </div>

                            {/* Structural Analysis */}
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-700">Structural Evaluation</p>
                                <p className="text-xs text-slate-600 leading-relaxed p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    {hazardAudit.structuralRisk}
                                </p>
                            </div>

                            {/* Identified Obstacles */}
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-700">Key Environmental Hazards</p>
                                <div className="space-y-1.5">
                                    {hazardAudit.identifiedHazards.map((hazard, idx) => (
                                        <div
                                            key={idx}
                                            className="text-xs text-rose-700 bg-rose-50/70 border border-rose-100 px-3 py-2 rounded-xl flex items-center gap-2 font-medium"
                                        >
                                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                                            <span>{hazard}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ElevenLabs Spoken Lifeline Card */}
                            <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200/80 space-y-3">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-bold text-cyan-900 flex items-center gap-1.5">
                                        <Volume2 className="w-3.5 h-3.5 text-cyan-700" />
                                        Spoken Lifeline Audio
                                    </span>
                                    <span className="text-[10px] font-mono text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded">
                                        ElevenLabs
                                    </span>
                                </div>

                                <p className="text-xs text-cyan-950 italic leading-relaxed">
                                    &ldquo;{hazardAudit.spokenDirective}&rdquo;
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                                    className="w-full py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
                                >
                                    {isPlayingAudio ? (
                                        <>
                                            <Pause className="w-3.5 h-3.5" /> Pause Spoken Guidance
                                        </>
                                    ) : (
                                        <>
                                            <Play className="w-3.5 h-3.5 fill-current" /> Play Audio Directives
                                        </>
                                    )}
                                </button>
                            </div>

                        </div>
                    ) : (
                        <div className="p-10 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
                            <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto" />
                            <p className="text-sm font-semibold text-slate-600">Awaiting Sensor Trigger</p>
                            <p className="text-xs text-slate-400 max-w-xs mx-auto">
                                Turn on the camera and select Run Gemini Audit to assess situational danger.
                            </p>
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}