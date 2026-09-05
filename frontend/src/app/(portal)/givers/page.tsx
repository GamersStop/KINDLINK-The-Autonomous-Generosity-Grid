"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Sparkles,
    Mic,
    Square,
    Volume2,
    Truck,
    Clock,
    MapPin,
    CheckCircle2,
    ArrowRight,
    ShieldCheck,
    Navigation,
    HeartHandshake,
    Compass,
    AlertCircle
} from "lucide-react";

interface MissionMatch {
    id: string;
    title: string;
    location: string;
    distance: string;
    urgency: "CRITICAL" | "HIGH" | "NORMAL";
    matchScore: number;
    unblocksText: string;
    category: "Logistics" | "Medical" | "Food & Water";
}

export default function GiverVoiceIntakePage() {
    // Interactive Voice & Form States
    const [isRecording, setIsRecording] = useState(false);
    const [recordingSeconds, setRecordingSeconds] = useState(0);
    const [voiceTranscript, setVoiceTranscript] = useState(
        "Hi, I have a 4x4 pickup truck with high ground clearance parked in South Aluva. I'm free for the next 5 hours and can carry clean water drums or take volunteers into flooded pockets."
    );

    const [selectedVehicle, setSelectedVehicle] = useState("4x4 / High Clearance");
    const [availableHours, setAvailableHours] = useState(5);
    const [radiusKm, setRadiusKm] = useState(15);
    const [isSearching, setIsSearching] = useState(false);

    // Ranked Matches matching the Giver's Profile
    const sampleMatches: MissionMatch[] = [
        {
            id: "mission-101",
            title: "Sector 4 School Water Shuttle",
            location: "North Delta · 3.8 km away",
            distance: "3.8 km",
            urgency: "CRITICAL",
            matchScore: 98,
            unblocksText: "Your 4x4 truck can navigate the 2.5ft access road to deliver 500L water cans.",
            category: "Logistics"
        },
        {
            id: "mission-102",
            title: "Elderly Dialysis Clinic Shuttle",
            location: "Riverbank Hub · 7.2 km away",
            distance: "7.2 km",
            urgency: "HIGH",
            matchScore: 91,
            unblocksText: "Requires 3 hours availability to transfer 4 patients before sunset.",
            category: "Medical"
        },
        {
            id: "mission-103",
            title: "Camp B Dry Provisions Drop",
            location: "Assam Outpost · 11.0 km away",
            distance: "11.0 km",
            urgency: "NORMAL",
            matchScore: 84,
            unblocksText: "Matches your cargo bed capacity for 120 dry meal kit distribution.",
            category: "Food & Water"
        }
    ];

    const handleToggleRecord = () => {
        if (!isRecording) {
            setIsRecording(true);
            setRecordingSeconds(0);
            const timer = setInterval(() => {
                setRecordingSeconds((prev) => {
                    if (prev >= 6) {
                        clearInterval(timer);
                        setIsRecording(false);
                        return 0;
                    }
                    return prev + 1;
                });
            }, 1000);
        } else {
            setIsRecording(false);
            setRecordingSeconds(0);
        }
    };

    const handleTriggerSearch = () => {
        setIsSearching(true);
        setTimeout(() => {
            setIsSearching(false);
        }, 700);
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
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-[11px] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                    ELEVENLABS CONVERSATIONAL VOICE INTAKE
                </div>
            </div>

            {/* Screen Title */}
            <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E36] tracking-tight">
                    Giver Hub & Resource Matching
                </h1>
                <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Tell us what you can spare — a vehicle, volunteer hours, specialized skills, or medical gear. The grid pairs your exact capacity to the highest-priority field bottleneck.
                </p>
            </div>

            {/* Two Column Layout: Intake vs Matches */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Voice & Profile Intake Form */}
                <div className="lg:col-span-6 space-y-6">

                    {/* ElevenLabs Interactive Voice Card */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-5">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                                <Mic className="w-4 h-4 text-teal-600" />
                                Empathetic Voice Intake
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">Zero Typing Required</span>
                        </div>

                        {/* Voice Prompt Player / Recorder */}
                        <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="space-y-1 text-center sm:text-left">
                                <p className="text-sm font-bold text-slate-800">Speak your offer naturally</p>
                                <p className="text-xs text-slate-500 max-w-xs">
                                    Say what vehicle you have, your current location, and how long you are free to assist.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleToggleRecord}
                                className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition shadow-sm ${isRecording
                                        ? "bg-rose-600 text-white animate-pulse"
                                        : "bg-teal-600 hover:bg-teal-700 text-white active:scale-95"
                                    }`}
                            >
                                {isRecording ? (
                                    <>
                                        <Square className="w-3.5 h-3.5 fill-current" /> Stop ({recordingSeconds}s)
                                    </>
                                ) : (
                                    <>
                                        <Mic className="w-4 h-4" /> Tap to Speak
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Simulated Live Audio Waveform / Transcript Box */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Volume2 className="w-3.5 h-3.5 text-teal-600" /> Real-time Speech Transcript
                                </span>
                                <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                                    Transcribed
                                </span>
                            </div>
                            <textarea
                                rows={3}
                                value={voiceTranscript}
                                onChange={(e) => setVoiceTranscript(e.target.value)}
                                className="w-full text-xs sm:text-sm p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100 transition resize-none"
                            />
                        </div>
                    </div>

                    {/* Granular Filter Form */}
                    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Specific Capacity Parameters
                        </h3>

                        {/* Vehicle Options */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <Truck className="w-3.5 h-3.5 text-[#0284C7]" /> Vehicle Transport Type
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {[
                                    "None / Foot",
                                    "Two-Wheeler",
                                    "Sedan / Hatch",
                                    "4x4 / High Clearance",
                                    "Cargo Van",
                                    "Rescue Boat"
                                ].map((vehicle) => (
                                    <button
                                        key={vehicle}
                                        type="button"
                                        onClick={() => setSelectedVehicle(vehicle)}
                                        className={`p-2.5 rounded-xl text-xs font-semibold text-center border transition ${selectedVehicle === vehicle
                                                ? "bg-[#0284C7] text-white border-[#0284C7] shadow-sm"
                                                : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                            }`}
                                    >
                                        {vehicle}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sliders: Hours and Radius */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-700">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-amber-500" /> Availability Window
                                    </span>
                                    <span className="text-[#0284C7] font-mono">{availableHours} hrs</span>
                                </div>
                                <input
                                    type="range"
                                    min={1}
                                    max={24}
                                    value={availableHours}
                                    onChange={(e) => setAvailableHours(Number(e.target.value))}
                                    className="w-full accent-[#0284C7] bg-slate-200 h-2 rounded-lg cursor-pointer"
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-slate-700">
                                    <span className="flex items-center gap-1">
                                        <Navigation className="w-3.5 h-3.5 text-teal-600" /> Max Mission Radius
                                    </span>
                                    <span className="text-[#0284C7] font-mono">{radiusKm} km</span>
                                </div>
                                <input
                                    type="range"
                                    min={2}
                                    max={50}
                                    value={radiusKm}
                                    onChange={(e) => setRadiusKm(Number(e.target.value))}
                                    className="w-full accent-[#0284C7] bg-slate-200 h-2 rounded-lg cursor-pointer"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleTriggerSearch}
                            className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition active:scale-95 flex items-center justify-center gap-2 shadow-sm"
                        >
                            <Compass className="w-4 h-4 text-teal-400" /> Re-Rank Matched Missions
                        </button>
                    </div>

                </div>

                {/* Right Column: Ranked Mission Matches Feed */}
                <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between pb-1">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <HeartHandshake className="w-4 h-4 text-teal-600" />
                            Proximity Match Recommendations
                        </h3>
                        <span className="text-xs text-slate-500 font-mono">
                            3 Direct Dispatches Found
                        </span>
                    </div>

                    <div className="space-y-4">
                        {sampleMatches.map((mission) => (
                            <div
                                key={mission.id}
                                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-soft hover:border-slate-300 transition-all space-y-4"
                            >
                                {/* Mission Card Top Line */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                            {mission.category}
                                        </span>
                                        <h4 className="text-base font-extrabold text-slate-900">{mission.title}</h4>
                                        <p className="text-xs text-slate-500 flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5 text-[#0284C7]" /> {mission.location}
                                        </p>
                                    </div>

                                    <div className="text-right shrink-0">
                                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-xs font-mono font-bold">
                                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> {mission.matchScore}% MATCH
                                        </div>
                                        <p className={`text-[10px] font-bold uppercase mt-1 ${mission.urgency === "CRITICAL" ? "text-rose-600" : "text-amber-600"
                                            }`}>
                                            {mission.urgency} NEED
                                        </p>
                                    </div>
                                </div>

                                {/* Why this match unblocks relief */}
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                                    <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                                    <div>
                                        <span className="font-bold text-slate-800">Unblocking Impact: </span>
                                        {mission.unblocksText}
                                    </div>
                                </div>

                                {/* Action Buttons: Solana Fuel Sponsor or Accept Route */}
                                <div className="flex items-center justify-between gap-3 pt-1">
                                    <button
                                        type="button"
                                        className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
                                    >
                                        View Coordinates
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/checkout?missionId=${mission.id}`}
                                            className="px-3.5 py-2 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition"
                                        >
                                            Blink Fuel (0.05 SOL)
                                        </Link>
                                        <button
                                            type="button"
                                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition shadow-sm active:scale-95"
                                        >
                                            Accept Mission <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Notice Banner */}
                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-800">
                        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p>
                            Accepting a mission generates an offline volunteer QR pass so checkpoints grant you priority passage across disaster cordons.
                        </p>
                    </div>
                </div>

            </div>

        </div>
    );
}