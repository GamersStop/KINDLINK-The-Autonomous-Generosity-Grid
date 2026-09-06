"use client";

import { useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Building2,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
    Sparkles,
    AlertCircle,
    Truck,
    Lock,
    PhoneCall,
    MessageSquare,
    Radio,
    AlertTriangle,
    RefreshCw,
    Eye,
    EyeOff
} from "lucide-react";

export default function OnboardNGOPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    // Form State with password credentials
    const [formData, setFormData] = useState({
        orgName: "",
        regNumber: "",
        orgType: "Disaster Response",
        leadName: "",
        leadRole: "Ground Operations Lead",
        leadPhone: "",
        leadEmail: "",
        password: "",
        confirmPassword: "",
        operationalZones: ["Kerala Coast", "Assam Delta"],
        activePersonnel: 15,
        vehicleFleet: ["4WD Cargo Trucks", "Inflatable Rafts"],
        alertChannel: "SMS & WhatsApp",
        solanaTreasuryAddress: "",
        acceptsAutoRouting: true,
    });

    const handleNextStep = async () => {
        setErrorMessage(null);

        // Validation for Step 1
        if (currentStep === 1) {
            if (
                !formData.orgName.trim() ||
                !formData.regNumber.trim() ||
                !formData.leadName.trim() ||
                !formData.leadPhone.trim() ||
                !formData.leadEmail.trim()
            ) {
                setErrorMessage("Please fill all mandatory organization details and charter registration.");
                return;
            }
            if (!formData.password) {
                setErrorMessage("Please choose a secure password for your NGO account.");
                return;
            }
            if (formData.password.length < 8) {
                setErrorMessage("Password must be at least 8 characters long.");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                setErrorMessage("Passwords do not match. Please re-verify.");
                return;
            }
            setCurrentStep(2);
            return;
        }

        // Validation for Step 2
        if (currentStep === 2) {
            if (formData.operationalZones.length === 0 || !formData.operationalZones[0]) {
                setErrorMessage("Please specify at least one target operational zone.");
                return;
            }
            setCurrentStep(3);
            return;
        }

        // Step 3: Submit to PostgreSQL
        if (currentStep === 3) {
            setIsSubmitting(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
                const { confirmPassword, ...payload } = formData;

                const res = await fetch(`${apiUrl}/api/v1/ngo-auth/onboard`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.detail || `Server returned error status ${res.status}`);
                }

                setIsCompleted(true);
            } catch (err: any) {
                setErrorMessage(err.message || "Failed to submit verification.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const handlePrevStep = () => {
        setErrorMessage(null);
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

            {/* Error Message */}
            {errorMessage && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Step Content Card */}
            {!isCompleted ? (
                <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-8">
                    {/* STEP 1: Organization Profile & Auth Credentials */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-lg font-bold text-slate-900">Entity Details & Access Credentials</h2>
                                <p className="text-xs text-slate-500">
                                    Charter registration numbers must be unique to avoid duplicate entity credentials.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Official Organization Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.orgName}
                                        placeholder="e.g. Rapid Response Alliance"
                                        onChange={(e) => setFormData({ ...formData, orgName: e.target.value })}
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Registration / Charter ID (Unique) *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.regNumber}
                                        placeholder="e.g. NGO-MH-2026-9901"
                                        onChange={(e) => setFormData({ ...formData, regNumber: e.target.value })}
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800 font-mono"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Primary Contact Person *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.leadName}
                                        placeholder="e.g. Arjun Verma"
                                        onChange={(e) => setFormData({ ...formData, leadName: e.target.value })}
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Field Dispatch Phone (24/7) *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.leadPhone}
                                        placeholder="+91 98765 43210"
                                        onChange={(e) => setFormData({ ...formData, leadPhone: e.target.value })}
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800 font-mono"
                                    />
                                </div>

                                <div className="sm:col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Lead Email Address *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.leadEmail}
                                        placeholder="operations@responsealliance.org"
                                        onChange={(e) => setFormData({ ...formData, leadEmail: e.target.value })}
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                                    />
                                </div>

                                {/* Password Field */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Create Access Password *</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={formData.password}
                                            placeholder="Minimum 8 characters"
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full p-3 pr-10 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Confirm Password *</label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.confirmPassword}
                                        placeholder="Re-type password"
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
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
                                    <label className="text-xs font-bold text-slate-700">Target Operating Zones (comma separated)</label>
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
                                        placeholder="e.g. Kerala Coast, Assam Delta, Ward 7"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Active Ground Volunteers Count</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.activePersonnel}
                                        onChange={(e) =>
                                            setFormData({ ...formData, activePersonnel: Number(e.target.value) })
                                        }
                                        className="w-full p-3 text-sm rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-100 text-slate-800"
                                    />
                                </div>

                                <div className="sm:col-span-2 space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Specialized Fleet & Gear (comma separated)</label>
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
                                                ? "bg-cyan-50/70 border-[#0284C7] shadow-xs"
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
                                    className="w-full p-2.5 text-xs font-mono rounded-xl bg-white border border-purple-200 text-purple-900 focus:outline-none"
                                    placeholder="Enter organization SPL wallet address"
                                />
                            </div>
                        </div>
                    )}

                    {/* Action Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={handlePrevStep}
                            disabled={currentStep === 1 || isSubmitting}
                            className="text-xs font-bold text-slate-500 hover:text-slate-900 transition disabled:opacity-30"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            onClick={handleNextStep}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold transition active:scale-95 shadow-xs disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying &amp; Persisting...
                                </>
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
                            Your responder profile is verified and active with registration key <span className="font-mono font-bold text-slate-800">{formData.regNumber}</span>. Autonomous dispatches matching your fleet capacity and zones will now route directly to your alert channels.
                        </p>
                    </div>

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                        <Link
                            href="/ngo"
                            className="px-5 py-2.5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs sm:text-sm font-bold shadow-xs transition active:scale-95"
                        >
                            Test Need Decomposer
                        </Link>
                        <Link
                            href="/live-grid"
                            className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-bold transition active:scale-95"
                        >
                            View Capacity on Live Grid
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