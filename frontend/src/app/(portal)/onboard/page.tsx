"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Building2,
    ShieldCheck,
    MapPin,
    Radio,
    CheckCircle2,
    ArrowRight,
    FileText,
    Sparkles,
    AlertCircle,
    Truck,
    Users,
    Lock,
    PhoneCall,
    MessageSquare
} from "lucide-react";

export default function OnboardNGOPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        orgName: "Rapid Response Alliance",
        regNumber: "NGO-DL-2024-8841",
        orgType: "Disaster Response",
        leadName: "Arjun Verma",
        leadRole: "Ground Operations Lead",
        leadPhone: "+91 98765 43210",
        leadEmail: "arjun@rapidresponse.org",
        operationalZones: ["Kerala Coast", "Assam Delta"],
        activePersonnel: 45,
        vehicleFleet: ["3x 4WD Cargo Trucks", "2x Inflatable Zodiac Boats"],
        alertChannel: "SMS + WhatsApp Fallback",
        solanaTreasuryAddress: "7XwKe...9pQz (Devnet Testnet Ready)",
        acceptsAutoRouting: true,
    });

    const handleNextStep = () => {
        if (currentStep < 3) {
            setCurrentStep((prev) => prev + 1);
        } else {
            setIsSubmitting(true);
            setTimeout(() => {
                setIsSubmitting(false);
                setIsCompleted(true);
            }, 1000);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-5 sm:px-8 py-10 lg:py-14 space-y-10">

            {/* Top Breadcrumb & Status */}
            <div className="flex items-center justify-between">
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Grid
                </Link>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-[11px] font-semibold">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                    VERIFIED RESPONDER NETWORK ONBOARDING
                </div>
            </div>

            {/* Screen Title */}
            <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E36] tracking-tight">
                    Join the Autonomous Generosity Grid
                </h1>
                <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
                    Connect your organization to real-time distress signals, AI SKU decomposition, and automated volunteer dispatch channels with zero infrastructure friction.
                </p>
            </div>

            {/* Step Indicators */}
            <div className="grid grid-cols-3 gap-3 border-b border-slate-200 pb-6">
                {[
                    { step: 1, title: "Organization Profile", icon: Building2 },
                    { step: 2, title: "Operational Assets & Range", icon: Truck },
                    { step: 3, title: "Dispatch & Verification", icon: ShieldCheck },
                ].map((item) => {
                    const Icon = item.icon;
                    const isActive = currentStep === item.step;
                    const isDone = currentStep > item.step || isCompleted;

                    return (
                        <div key={item.step} className="flex items-center gap-3">
                            <div
                                className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-bold transition ${isDone
                                        ? "bg-teal-600 text-white"
                                        : isActive
                                            ? "bg-[#0284C7] text-white shadow-sm"
                                            : "bg-slate-100 text-slate-400 border border-slate-200"
                                    }`}
                            >
                                {isDone ? <CheckCircle2 className="w-4 h-4" /> : item.step}
                            </div>
                            <div className="hidden sm:block">
                                <p className="text-[11px] font-mono text-slate-400 uppercase">Step 0{item.step}</p>
                                <p className={`text-xs font-bold ${isActive ? "text-slate-900" : "text-slate-500"}`}>
                                    {item.title}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Step Content Card */}
            {!isCompleted ? (
                <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-8">

                    {/* STEP 1: Organization Profile */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-slate-900">Entity Details & Legal Registration</h2>
                                <p className="text-xs text-slate-500">
                                    Ensure public credentials match your official disaster relief charter or registry.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Official Organization Name</label>
                                    <input
                                        type="text"
                                        value={formData.orgName}
                                        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Registration / Charter ID</label>
                                    <input
                                        type="text"
                                        value={formData.regNumber}
                                        onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800 font-mono"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Primary Contact Person</label>
                                    <input
                                        type="text"
                                        value={formData.leadName}
                                        onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Field Dispatch Phone (24/7)</label>
                                    <input
                                        type="tel"
                                        value={formData.leadPhone}
                                        onChange={(e) => setFormData({ ...formData, leadPhone: e.target.value })}
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800 font-mono"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Assets & Range */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-slate-900">Field Assets & Operational Coverage</h2>
                                <p className="text-xs text-slate-500">
                                    Defines where the grid automatically routes verified distress alerts to your dispatch teams.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Target Operating Zones</label>
                                    <input
                                        type="text"
                                        value={formData.operationalZones.join(", ")}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                operationalZones: e.target.value.split(",").map((s) => s.trim()),
                                            })
                                        }
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                                        placeholder="e.g. Kerala Coast, Assam Delta"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Active Ground Volunteers</label>
                                    <input
                                        type="number"
                                        value={formData.activePersonnel}
                                        onChange={(e) =>
                                            setFormData({ ...formData, activePersonnel: Number(e.target.value) })
                                        }
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                                    />
                                </div>

                                <div className="sm:col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Specialized Fleet & Gear</label>
                                    <input
                                        type="text"
                                        value={formData.vehicleFleet.join(", ")}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                vehicleFleet: e.target.value.split(",").map((s) => s.trim()),
                                            })
                                        }
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                                        placeholder="e.g. 4x4 Pickups, Inflatable Rafts, Mobile Generator Units"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Dispatch Channel & Verification */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-slate-900">Live Grid Integration Channels</h2>
                                <p className="text-xs text-slate-500">
                                    Choose how your field captains receive synthesized missions from Gemini and Solana fuel tokens.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    {
                                        title: "SMS & WhatsApp",
                                        desc: "Zero-app requirement for team captains in low connectivity areas.",
                                        icon: MessageSquare,
                                    },
                                    {
                                        title: "Audio Dispatch",
                                        desc: "Automated ElevenLabs voice hotline calling field phone trees.",
                                        icon: PhoneCall,
                                    },
                                    {
                                        title: "Tactical API / LoRa",
                                        desc: "Direct webhook payload delivery to internal CAD and mesh systems.",
                                        icon: Radio,
                                    },
                                ].map((channel) => (
                                    <button
                                        key={channel.title}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, alertChannel: channel.title })}
                                        className={`p-4 rounded-2xl text-left border transition space-y-2 ${formData.alertChannel.includes(channel.title)
                                                ? "bg-cyan-50/70 border-[#0284C7] shadow-sm"
                                                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                                            }`}
                                    >
                                        <channel.icon className="w-5 h-5 text-[#0284C7]" />
                                        <p className="text-sm font-bold text-slate-900">{channel.title}</p>
                                        <p className="text-xs text-slate-500 leading-relaxed">{channel.desc}</p>
                                    </button>
                                ))}
                            </div>

                            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                                    <Lock className="w-3.5 h-3.5 text-purple-700" />
                                    Devnet Solana Treasury for Micro-Grants
                                </div>
                                <input
                                    type="text"
                                    value={formData.solanaTreasuryAddress}
                                    onChange={(e) =>
                                        setFormData({ ...formData, solanaTreasuryAddress: e.target.value })
                                    }
                                    className="w-full p-2.5 text-xs font-mono rounded-xl bg-white border border-purple-200 text-purple-900"
                                    placeholder="Enter organization SPL wallet for emergency fuel blinks"
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={handlePrevStep}
                            disabled={currentStep === 1}
                            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition disabled:opacity-30"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            onClick={handleNextStep}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold transition active:scale-95 shadow-sm disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                "Connecting to Grid..."
                            ) : currentStep === 3 ? (
                                <>Complete Verification <CheckCircle2 className="w-4 h-4" /></>
                            ) : (
                                <>Next Step <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>

                </div>
            ) : (
                /* Onboarding Success View */
                <div className="p-8 sm:p-12 rounded-3xl bg-white border border-slate-200 shadow-soft text-center space-y-5">
                    <div className="w-14 h-14 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-7 h-7" />
                    </div>

                    <div className="space-y-2 max-w-md mx-auto">
                        <h2 className="text-2xl font-black text-slate-900">
                            Welcome to the Grid, {formData.orgName}!
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Your responder profile is verified and active. Autonomous dispatches matching your fleet capacity and zones will now route directly to your alert channels.
                        </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/ngo"
                            className="px-5 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold shadow-sm transition active:scale-95"
                        >
                            Test Need Decomposer
                        </Link>
                        <Link
                            href="/"
                            className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition active:scale-95"
                        >
                            Return to Grid Telemetry
                        </Link>
                    </div>
                </div>
            )}

            {/* Network Trust Notice */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <p>
                    Verified NGO accounts receive cryptographic signatures on incident reports, priority queue allocation on Solana Devnet fuel micro-grants, and direct audio bridges to SOS Sentinel victims.
                </p>
            </div>

        </div>
    );
}