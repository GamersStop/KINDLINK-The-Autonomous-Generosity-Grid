"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Camera,
    AlertOctagon,
    RefreshCw,
    Play,
    Volume2,
    CheckCircle2,
    AlertTriangle,
    Radio
} from "lucide-react";

interface SentinelAuditData {
    missionId: string;
    threatLevel: string;
    estimatedWaterDepth: string;
    trappedVictimsCount: number;
    structuralEvaluation: string;
    environmentalHazards: string[];
    spokenDirective: string;
    audioBase64?: string;
}

export default function LiveSentinelSOSPage() {
    const [streamActive, setStreamActive] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditData, setAuditData] = useState<SentinelAuditData | null>(null);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

    // Helper to play base64 audio or synthesize speech fallback
    const playAudio = (b64Audio?: string, fallbackText?: string) => {
        if (b64Audio) {
            const snd = new Audio(`data:audio/mp3;base64,${b64Audio}`);
            snd.play().catch((e) => console.warn("Audio autoplay blocked:", e));
        } else if (fallbackText && "speechSynthesis" in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(fallbackText);
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
        }
    };

    // Get geolocation on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                () => console.warn("GPS access denied")
            );
        }
        return () => {
            stopCamera();
        };
    }, []);

    const stopCamera = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
            mediaStreamRef.current = null;
        }
    };

    // 1. One-touch SOS: Prompt user with audio, open camera, record 7s footage, and run Gemini audit
    const handleTriggerSOS = async () => {
        setIsAuditing(true);
        setStatusMessage("Activating sensor stream...");

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

        // Play initial ElevenLabs prompt
        try {
            const calmRes = await fetch(`${apiUrl}/api/v1/sentinel/calm-audio?prompt_type=request_camera`);
            if (calmRes.ok) {
                const { audioBase64, text } = await calmRes.json();
                playAudio(audioBase64, text);
            }
        } catch {
            playAudio(undefined, "We are here to help. Please enable your camera now.");
        }

        // 2. Request camera feed
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
                audio: false,
            });

            mediaStreamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                await videoRef.current.play();
            }
            setStreamActive(true);

            // Play calming speech while frames collect
            setTimeout(async () => {
                try {
                    const calmRes2 = await fetch(`${apiUrl}/api/v1/sentinel/calm-audio?prompt_type=calm_down`);
                    if (calmRes2.ok) {
                        const { audioBase64, text } = await calmRes2.json();
                        playAudio(audioBase64, text);
                    }
                } catch {
                    playAudio(undefined, "Please stay calm. Analyzing surroundings and dispatching aid.");
                }
            }, 2000);

            // 3. Collect keyframes across 6 seconds
            setStatusMessage("Recording 6-second situational assessment...");
            const frames: string[] = [];
            const canvas = document.createElement("canvas");
            const captureInterval = setInterval(() => {
                if (videoRef.current && videoRef.current.videoWidth > 0) {
                    canvas.width = videoRef.current.videoWidth;
                    canvas.height = videoRef.current.videoHeight;
                    const ctx = canvas.getContext("2d");
                    if (ctx) {
                        ctx.drawImage(videoRef.current, 0, 0);
                        frames.push(canvas.toDataURL("image/jpeg", 0.7));
                    }
                }
            }, 1200);

            // 4. After 6 seconds, send collected frames to Gemini
            setTimeout(async () => {
                clearInterval(captureInterval);
                setStatusMessage("Gemini 3.5 Flash evaluating hazards & pushing to grid...");

                try {
                    const response = await fetch(`${apiUrl}/api/v1/sentinel/audit-broadcast`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            videoFramesBase64: frames,
                            latitude: coords?.lat,
                            longitude: coords?.lng,
                        }),
                    });

                    if (!response.ok) throw new Error("Audit service failed");
                    const data: SentinelAuditData = await response.json();
                    setAuditData(data);
                    setStatusMessage(null);

                    // 5. Speak out the live analysis directive
                    if (data.audioBase64) {
                        playAudio(data.audioBase64);
                    } else {
                        playAudio(
                            undefined,
                            `${data.spokenDirective}. Rescue is dispatched as soon as possible.`
                        );
                    }
                } catch (err: any) {
                    console.error("SOS processing error:", err);
                    setStatusMessage("Audit connection error. Local SOS registered.");
                } finally {
                    setIsAuditing(false);
                }
            }, 6000);

        } catch (err: any) {
            console.error("Camera permission denied:", err);
            setIsAuditing(false);
            setStatusMessage("Camera access required for live sensory triage.");
            playAudio(undefined, "Camera access was denied. Please allow camera access to assess the situation.");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-14 space-y-8">
            {/* Top Breadcrumb & Status */}
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Grid
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-semibold">
                    <Radio className="w-3 h-3 text-rose-600 animate-pulse" />
                    SENTINEL AI SENSORY PROTOCOL
                </div>
            </div>

            {/* Screen Title */}
            <div className="space-y-1">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E36] tracking-tight">
                    Live Sentinel SOS
                </h1>
                <p className="text-slate-600 text-sm max-w-2xl">
                    One-touch field triage. Multimodal vision models audit flood depths and trapped victims from camera frames, while ElevenLabs streams immediate audio safety directives.
                </p>
            </div>

            {/* Main 2-Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Camera Viewfinder & Trigger */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="relative aspect-video w-full rounded-3xl bg-slate-950 overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`w-full h-full object-cover ${streamActive ? "block" : "hidden"}`}
                        />

                        {!streamActive && (
                            <div className="text-center p-6 space-y-4">
                                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mx-auto text-slate-400">
                                    <Camera className="w-7 h-7" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-semibold text-slate-300">Camera preview offline</p>
                                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                                        Press the button below to grant camera access and activate instant multimodal hazard analysis.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* In-feed status indicator */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] text-white/80 font-mono bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl">
                            <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${streamActive ? "bg-emerald-500 animate-pulse" : "bg-slate-500"}`} />
                                <span>{streamActive ? "LIVE OPTICAL FEED" : "STANDBY"}</span>
                            </div>
                            <span>
                                {coords ? `GPS: ${coords.lat.toFixed(3)}°, ${coords.lng.toFixed(3)}°` : "GPS Acquiring..."}
                            </span>
                        </div>
                    </div>

                    {/* Broadcast Trigger Button */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-3">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                                    Immediate High-Urgency Broadcast
                                </h4>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Pushes this sensor telemetry directly to the nearest registered 4x4 and boat volunteers while queuing Solana Devnet fuel micro-grants.
                                </p>
                            </div>
                        </div>

                        {statusMessage && (
                            <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 animate-spin text-cyan-600 shrink-0" />
                                <span>{statusMessage}</span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleTriggerSOS}
                            disabled={isAuditing}
                            className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm tracking-wide transition active:scale-[0.98] shadow-lg shadow-rose-600/20 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isAuditing ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" /> EXECUTING SENSORY AUDIT...
                                </>
                            ) : (
                                <>
                                    <AlertOctagon className="w-4 h-4" /> BROADCAST EMERGENCY SOS
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Right Column: Vision Hazard Extraction & Spoken Directive */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-soft space-y-6">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            Vision Hazard Extraction
                        </span>
                        <span
                            className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${auditData?.threatLevel.includes("EXTREME")
                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                                }`}
                        >
                            {auditData ? auditData.threatLevel : "AWAITING TELEMETRY"}
                        </span>
                    </div>

                    {/* Depth & Victims */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                                Est. Water Depth
                            </span>
                            <p className="text-lg font-bold text-slate-900">
                                {auditData ? auditData.estimatedWaterDepth : "--"}
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">
                                Trapped Victims
                            </span>
                            <p className="text-lg font-bold text-slate-900">
                                {auditData ? `${auditData.trappedVictimsCount} Detected` : "--"}
                            </p>
                        </div>
                    </div>

                    {/* Structural Evaluation */}
                    <div className="space-y-1.5">
                        <span className="text-xs font-bold text-slate-700">Structural Evaluation</span>
                        <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 leading-relaxed">
                            {auditData
                                ? auditData.structuralEvaluation
                                : "Optical feed inactive. Activate emergency broadcast to calculate structural integrity."}
                        </p>
                    </div>

                    {/* Key Environmental Hazards */}
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-700">Key Environmental Hazards</span>
                        <div className="space-y-2">
                            {auditData && auditData.environmentalHazards.length > 0 ? (
                                auditData.environmentalHazards.map((hazard, idx) => (
                                    <div
                                        key={idx}
                                        className="p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 text-rose-800 text-xs flex items-center gap-2"
                                    >
                                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                                        <span>{hazard}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 italic">No hazards scanned yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Spoken Lifeline Directive */}
                    <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/70 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-cyan-950 flex items-center gap-1.5">
                                <Volume2 className="w-4 h-4 text-cyan-700" /> Spoken Lifeline Audio
                            </span>
                            <span className="text-[10px] font-mono text-cyan-700 font-bold bg-cyan-100/70 px-2 py-0.5 rounded-md">
                                ElevenLabs
                            </span>
                        </div>

                        <p className="text-xs text-slate-700 italic leading-relaxed">
                            &quot;{auditData ? auditData.spokenDirective : "Awaiting transmission directive..."}&quot;
                        </p>

                        {auditData && (
                            <button
                                type="button"
                                onClick={() => playAudio(auditData.audioBase64, auditData.spokenDirective)}
                                className="w-full py-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 shadow-xs"
                            >
                                <Play className="w-3.5 h-3.5 fill-white" /> Replay Audio Directive
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}