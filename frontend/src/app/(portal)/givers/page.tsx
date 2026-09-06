"use client";

import { useState, useEffect } from "react";
import GiverGate from "@/components/GiverGate";
import Link from "next/link";
import {
    ArrowLeft,
    RefreshCw,
    MapPin,
    CheckCircle2,
    AlertTriangle,
    Boxes,
    Calendar,
    Mic,
    MicOff,
    Coins,
    Hammer,
    GraduationCap,
    Apple,
    Truck,
    Layers,
    Sliders,
    Wallet,
    ShieldCheck,
    SendHorizontal,
    FileCheck,
    Award,
    Download,
    ExternalLink,
    X
} from "lucide-react";

interface SKUItem {
    id: string;
    category: "ration" | "labour" | "skill" | "money" | "logistics" | "medical" | string;
    title: string;
    targetQty: number;
    raisedQty: number;
    unit: string;
    urgency: string;
}

interface LiveMission {
    missionId: string;
    incidentZone: string;
    extractedCoordinates: string;
    reportedTimestamp: string;
    affectedCount: number;
    summary: string;
    priorityScore: number;
    status: string;
    escrowAllocatedSol: number;
    broadcastTimestamp: string;
    items: SKUItem[];
}

interface SubmittedOffer {
    id: number;
    fullName: string;
    category: string;
    dispatchRadiusKm: number;
    vehicleCapacityKg: number;
    availableFrom: string;
    availableTo: string;
    notes: string;
    status: string;
    createdAt: string;
}

interface CompletedService {
    id: number;
    giverEmail: string;
    missionId: string;
    itemKey: string;
    itemTitle: string;
    commitmentType: string;
    details: string;
    solAmount: number;
    txSignature: string;
    status: string;
    createdAt: string;
}

export default function GiversMatchingPage() {
    const [missions, setMissions] = useState<LiveMission[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState("volunteer@kindlink.org");

    // Form State
    const [formData, setFormData] = useState({
        fullName: "",
        contact: "",
        location: "",
        selectedCategory: "all",
        maxDistanceKm: 25,
        vehicleCapacityKg: 500,
        availableFrom: new Date().toISOString().split("T")[0],
        availableTo: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
        notes: "",
    });

    // Standby Registration State
    const [isSavingStandby, setIsSavingStandby] = useState(false);
    const [standbySuccessMessage, setStandbySuccessMessage] = useState<string | null>(null);

    // SOL Instant Payment Modal
    const [solModalItem, setSolModalItem] = useState<{ missionId: string; item: SKUItem } | null>(null);
    const [solAmount, setSolAmount] = useState("0.5");
    const [isPayingSol, setIsPayingSol] = useState(false);
    const [txSuccess, setTxSuccess] = useState<string | null>(null);

    // Date Booking state
    const [bookingLoadingItemKey, setBookingLoadingItemKey] = useState<string | null>(null);
    const [bookedItemKeys, setBookedItemKeys] = useState<Record<string, string>>({});

    // Drawers / Modals State
    const [showOffersModal, setShowOffersModal] = useState(false);
    const [showServicesModal, setShowServicesModal] = useState(false);
    const [myOffers, setMyOffers] = useState<SubmittedOffer[]>([]);
    const [myServices, setMyServices] = useState<CompletedService[]>([]);
    const [isDrawerLoading, setIsDrawerLoading] = useState(false);

    // Selected receipt for impact print preview
    const [receiptItem, setReceiptItem] = useState<CompletedService | null>(null);

    const fetchLiveFeed = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/v1/aid/missions/feed`);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const data: LiveMission[] = await res.json();
            setMissions(data);
        } catch (err: any) {
            console.error("Failed to load missions:", err);
            setError("Unable to sync live dispatch grid.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveFeed();
        const token = localStorage.getItem("kindlink_giver_token");
        if (token) {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            fetch(`${apiUrl}/api/v1/giver-auth/verify-session?token=${token}`)
                .then((r) => r.json())
                .then((d) => {
                    if (d.giver?.email) setCurrentUserEmail(d.giver.email);
                })
                .catch(() => { });
        }
    }, []);

    // Web Speech Recognition
    const toggleVoiceRecording = () => {
        const SpeechRecognition =
            (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
            return;
        }

        if (isRecording) {
            setIsRecording(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => setIsRecording(true);
        recognition.onend = () => setIsRecording(false);
        recognition.onerror = () => setIsRecording(false);

        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setFormData((prev) => ({
                ...prev,
                notes: prev.notes ? `${prev.notes} ${transcript}` : transcript,
            }));
        };

        recognition.start();
    };

    // Register Standby Profile in DB
    const handleSaveStandbyOffer = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingStandby(true);
        setStandbySuccessMessage(null);
        setError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/v1/volunteers/standby`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errJson = await res.json().catch(() => ({}));
                throw new Error(errJson.detail || "Failed to save standby offer");
            }

            setStandbySuccessMessage(
                "Offer saved. You are registered in the standby pool. The grid will alert you as new matching distress pleas arrive."
            );
        } catch (err: any) {
            setError(err.message || "Failed to connect to database registry.");
        } finally {
            setIsSavingStandby(false);
        }
    };

    // Instant SOL Payment Execution
    const handleExecuteSolPayment = async () => {
        if (!solModalItem) return;
        setIsPayingSol(true);
        setTxSuccess(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/v1/aid/missions/items/donate-sol`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemKey: solModalItem.item.id,
                    solAmount: parseFloat(solAmount),
                    donorWallet: "4Nm8...xY9q",
                    missionId: solModalItem.missionId,
                    giverEmail: currentUserEmail,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.detail || "Transaction failed on backend rails");
            }

            const result = await res.json();
            setTxSuccess(`Confirmed on Solana Devnet! Tx: ${result.txSignature}`);

            setTimeout(() => {
                setSolModalItem(null);
                setTxSuccess(null);
                fetchLiveFeed();
            }, 1500);
        } catch (e: any) {
            alert("Payment failed: " + e.message);
        } finally {
            setIsPayingSol(false);
        }
    };

    // Block Dates Execution
    const handleBlockDatesForItem = async (item: SKUItem, missionId: string) => {
        setBookingLoadingItemKey(item.id);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/v1/volunteers/commit-item`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    itemKey: item.id,
                    missionId: missionId,
                    itemTitle: item.title,
                    availableFrom: formData.availableFrom,
                    availableTo: formData.availableTo,
                    giverEmail: currentUserEmail,
                }),
            });

            if (!res.ok) throw new Error("Failed to block dates");

            setBookedItemKeys((prev) => ({
                ...prev,
                [item.id]: `Dates Blocked: ${formData.availableFrom} to ${formData.availableTo}`,
            }));

            fetchLiveFeed();
        } catch (err: any) {
            alert("Failed to confirm dates: " + err.message);
        } finally {
            setBookingLoadingItemKey(null);
        }
    };

    // Open "My Submitted Offers" Modal
    const handleOpenMyOffers = async () => {
        setShowOffersModal(true);
        setIsDrawerLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(`${apiUrl}/api/v1/volunteers/my-offers?email=${currentUserEmail}`);
            if (res.ok) {
                const data = await res.json();
                setMyOffers(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsDrawerLoading(false);
        }
    };

    // Open "Previously Completed Services" Modal
    const handleOpenCompletedServices = async () => {
        setShowServicesModal(true);
        setIsDrawerLoading(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const res = await fetch(
                `${apiUrl}/api/v1/volunteers/my-completed-services?email=${currentUserEmail}`
            );
            if (res.ok) {
                const data = await res.json();
                setMyServices(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsDrawerLoading(false);
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case "money":
                return <Coins className="w-4 h-4 text-emerald-600" />;
            case "logistics":
            case "transport":
                return <Truck className="w-4 h-4 text-cyan-600" />;
            case "labour":
                return <Hammer className="w-4 h-4 text-amber-600" />;
            case "skill":
                return <GraduationCap className="w-4 h-4 text-indigo-600" />;
            case "ration":
            case "food":
                return <Apple className="w-4 h-4 text-rose-600" />;
            case "medical":
                return <ShieldCheck className="w-4 h-4 text-rose-500" />;
            default:
                return <Layers className="w-4 h-4 text-slate-600" />;
        }
    };

    const filteredMissions = missions.filter((m) => {
        if (formData.selectedCategory === "all") return true;
        return m.items.some((item) => {
            const itemCat = item.category.toLowerCase();
            const selected = formData.selectedCategory.toLowerCase();
            if (selected === "ration" && (itemCat === "food" || itemCat === "ration")) return true;
            if (selected === "logistics" && (itemCat === "transport" || itemCat === "logistics")) return true;
            return itemCat === selected;
        });
    });

    return (
        <GiverGate>
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 lg:py-14 space-y-8">
                {/* Top Header */}
                <div className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back to Live Grid
                    </Link>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        MULTI-MODAL AID RAILS: MONEY • LOGISTICS • LABOUR • SKILL • RATIONS
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E36] tracking-tight">
                            Volunteer Matching &amp; Support Options
                        </h1>
                        <p className="text-slate-600 text-sm max-w-2xl">
                            Choose how to assist ground missions: Pick an immediate match, or register your parameters in the standby database if no current mission fits your schedule.
                        </p>
                    </div>

                    <button
                        onClick={fetchLiveFeed}
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition shadow-xs"
                    >
                        <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh Feed
                    </button>
                </div>

                {error && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {standbySuccessMessage && (
                    <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>{standbySuccessMessage}</span>
                    </div>
                )}

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Form & History Action Buttons */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-soft space-y-5">
                            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                                    <Sliders className="w-4 h-4 text-[#0284C7]" />
                                    Support Preference
                                </h2>
                                <button
                                    type="button"
                                    onClick={toggleVoiceRecording}
                                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition ${isRecording ? "bg-rose-500 text-white animate-pulse" : "bg-cyan-50 text-cyan-800 hover:bg-cyan-100"
                                        }`}
                                >
                                    {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                                    {isRecording ? "Listening..." : "Voice Input"}
                                </button>
                            </div>

                            <form onSubmit={handleSaveStandbyOffer} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-slate-600 mb-2">I want to help with:</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: "all", label: "All Needs", icon: Layers },
                                            { id: "money", label: "Money (SOL)", icon: Coins },
                                            { id: "logistics", label: "Transportation / Vehicle", icon: Truck },
                                            { id: "labour", label: "Hard Labour", icon: Hammer },
                                            { id: "skill", label: "Skill / Teach", icon: GraduationCap },
                                            { id: "ration", label: "Food / Ration", icon: Apple },
                                        ].map((tab) => {
                                            const Icon = tab.icon;
                                            const isSelected = formData.selectedCategory === tab.id;
                                            return (
                                                <button
                                                    key={tab.id}
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, selectedCategory: tab.id })}
                                                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left font-semibold transition ${isSelected
                                                            ? "bg-[#0B1E36] text-white border-[#0B1E36]"
                                                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                                                        }`}
                                                >
                                                    <Icon className="w-4 h-4 shrink-0" />
                                                    <span className="text-[11px] leading-tight">{tab.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-600 mb-1">Your Full Name / Entity</label>
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="e.g. Maya Sharma / Delta Evac Volunteer"
                                        className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                                    />
                                </div>

                                {formData.selectedCategory === "money" ? (
                                    <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
                                        <span className="font-bold flex items-center gap-1.5 text-xs">
                                            <Wallet className="w-4 h-4 text-emerald-600" /> Instant Solana Devnet Escrow Pay
                                        </span>
                                        <p className="text-[11px] text-emerald-700 leading-relaxed">
                                            Select any SKU on the right to sponsor directly via Solana devnet micro-grants, or click save below to register as a standby funding donor.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3.5">
                                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-slate-700">Dispatch Radius</span>
                                                <span className="font-mono font-bold text-[#0284C7]">{formData.maxDistanceKm} km</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="2"
                                                max="100"
                                                step="2"
                                                value={formData.maxDistanceKm}
                                                onChange={(e) => setFormData({ ...formData, maxDistanceKm: Number(e.target.value) })}
                                                className="w-full accent-[#0284C7] cursor-pointer"
                                            />
                                        </div>

                                        {formData.selectedCategory === "logistics" && (
                                            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 transition-all">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                                                        <Truck className="w-3.5 h-3.5 text-cyan-600" />
                                                        Vehicle Cargo Payload
                                                    </span>
                                                    <span className="font-mono font-bold text-[#0284C7]">{formData.vehicleCapacityKg} kg</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="25"
                                                    max="2500"
                                                    step="25"
                                                    value={formData.vehicleCapacityKg}
                                                    onChange={(e) => setFormData({ ...formData, vehicleCapacityKg: Number(e.target.value) })}
                                                    className="w-full accent-[#0284C7] cursor-pointer"
                                                />
                                            </div>
                                        )}

                                        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                                                <Calendar className="w-3.5 h-3.5 text-[#0284C7]" />
                                                Block Your Availability Dates
                                            </span>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div>
                                                    <label className="block text-[10px] text-slate-500 font-semibold mb-1">From Date</label>
                                                    <input
                                                        type="date"
                                                        value={formData.availableFrom}
                                                        onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
                                                        className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] text-slate-500 font-semibold mb-1">To Date</label>
                                                    <input
                                                        type="date"
                                                        value={formData.availableTo}
                                                        onChange={(e) => setFormData({ ...formData, availableTo: e.target.value })}
                                                        className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block font-semibold text-slate-600 mb-1">Voice / Cargo Details</label>
                                    <textarea
                                        rows={3}
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        placeholder="Mention vehicle type, towing equipment, teaching subject, or capacity..."
                                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSavingStandby}
                                    className="w-full py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold transition active:scale-95 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSavingStandby ? (
                                        <>
                                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Saving to Database...
                                        </>
                                    ) : (
                                        <>
                                            <SendHorizontal className="w-3.5 h-3.5" /> Save Details to Standby Registry
                                        </>
                                    )}
                                </button>
                                <p className="text-[10px] text-slate-400 text-center">
                                    No matching mission right now? Click above to index your details so the autonomous grid matches you when new distress pleas are dispatched.
                                </p>
                            </form>
                        </div>

                        {/* User Service Records & Impact Certificate Action Buttons */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <button
                                type="button"
                                onClick={handleOpenMyOffers}
                                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-soft transition text-left flex flex-col justify-between space-y-2 group"
                            >
                                <div className="w-7 h-7 rounded-xl bg-cyan-50 text-[#0284C7] flex items-center justify-center">
                                    <FileCheck className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition">
                                        My Submitted Offers
                                    </p>
                                    <p className="text-[10px] text-slate-400">View standby availability</p>
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={handleOpenCompletedServices}
                                className="p-3.5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 shadow-soft transition text-left flex flex-col justify-between space-y-2 group"
                            >
                                <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                                    <Award className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition">
                                        Completed Services
                                    </p>
                                    <p className="text-[10px] text-slate-400">Generate Impact Receipt</p>
                                </div>
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Mission Requirements */}
                    <div className="lg:col-span-7 space-y-5">
                        <div className="flex items-center justify-between pb-1">
                            <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                Categorized Mission Requirements ({filteredMissions.length} Active)
                            </h2>
                            <span className="text-[11px] font-mono text-slate-400">Claim items individually</span>
                        </div>

                        {isLoading ? (
                            <div className="py-24 text-center space-y-3">
                                <RefreshCw className="w-7 h-7 text-[#0284C7] animate-spin mx-auto" />
                                <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Querying Live Grid...</p>
                            </div>
                        ) : filteredMissions.length === 0 ? (
                            <div className="p-16 rounded-3xl bg-white border border-dashed border-slate-200 text-center space-y-3">
                                <Boxes className="w-8 h-8 text-slate-300 mx-auto" />
                                <p className="text-sm font-semibold text-slate-700">No active requirements in this category</p>
                                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                    No active matches found. Use the &quot;Save Details to Standby Registry&quot; button on the left to save your availability into the database.
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col space-y-6">
                                {filteredMissions.map((mission) => (
                                    <div key={mission.missionId} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-4">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                                        {mission.missionId}
                                                    </span>
                                                    <h3 className="text-base font-bold text-slate-900">{mission.incidentZone}</h3>
                                                </div>
                                                <p className="text-xs text-slate-500 font-mono flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5 text-[#0284C7]" />
                                                    {mission.extractedCoordinates}
                                                </p>
                                            </div>

                                            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border bg-amber-50 text-amber-700 border-amber-200">
                                                PRIORITY {mission.priorityScore}
                                            </span>
                                        </div>

                                        <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                                            {mission.summary}
                                        </p>

                                        <div className="space-y-2.5">
                                            {mission.items.map((item) => {
                                                const isBooked = bookedItemKeys[item.id];
                                                const isBookingThis = bookingLoadingItemKey === item.id;

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 rounded-xl bg-white border border-slate-200">
                                                                {getCategoryIcon(item.category)}
                                                            </div>
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-bold text-xs text-slate-900">{item.title}</span>
                                                                    <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 bg-white border border-slate-200 rounded text-slate-600">
                                                                        {item.category}
                                                                    </span>
                                                                </div>
                                                                <p className="text-[11px] text-slate-500 font-mono">
                                                                    Target: {item.targetQty} {item.unit} • Raised: {item.raisedQty} {item.unit}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <button
                                                                type="button"
                                                                onClick={() => setSolModalItem({ missionId: mission.missionId, item })}
                                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs active:scale-95 transition"
                                                            >
                                                                <Coins className="w-3 h-3" />
                                                                Pay by SOL
                                                            </button>

                                                            {isBooked ? (
                                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 text-[11px] font-bold">
                                                                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                                                                    Confirmed
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    disabled={isBookingThis}
                                                                    onClick={() => handleBlockDatesForItem(item, mission.missionId)}
                                                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0B1E36] hover:bg-slate-800 text-white text-[11px] font-bold shadow-xs active:scale-95 transition disabled:opacity-50"
                                                                >
                                                                    {isBookingThis ? (
                                                                        <>
                                                                            <RefreshCw className="w-3 h-3 animate-spin" /> Scheduling...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <Calendar className="w-3 h-3 text-cyan-400" /> Block Dates
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* MODAL 1: My Submitted Offers */}
                {showOffersModal && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[80vh] flex flex-col">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <FileCheck className="w-5 h-5 text-[#0284C7]" />
                                    <h3 className="font-bold text-slate-800 text-sm">My Submitted Standby Offers</h3>
                                </div>
                                <button
                                    onClick={() => setShowOffersModal(false)}
                                    className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto space-y-3 flex-1 pr-1 text-xs">
                                {isDrawerLoading ? (
                                    <div className="py-12 text-center space-y-2">
                                        <RefreshCw className="w-5 h-5 text-[#0284C7] animate-spin mx-auto" />
                                        <p className="text-slate-400 font-mono">Querying your offers...</p>
                                    </div>
                                ) : myOffers.length === 0 ? (
                                    <p className="py-12 text-center text-slate-400">
                                        No standby offers submitted yet. Fill the form on the left to index availability.
                                    </p>
                                ) : (
                                    myOffers.map((offer) => (
                                        <div
                                            key={offer.id}
                                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-slate-900">{offer.fullName || "Volunteer"}</span>
                                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                                                    {offer.category}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 font-mono">
                                                Radius: {offer.dispatchRadiusKm} km • Availability: {offer.availableFrom} to {offer.availableTo}
                                            </p>
                                            {offer.notes && (
                                                <p className="text-slate-600 italic bg-white p-2 rounded-lg border border-slate-100">
                                                    &quot;{offer.notes}&quot;
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 2: Completed Services & Impact History */}
                {showServicesModal && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="w-full max-w-xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[85vh] flex flex-col">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-teal-600" />
                                    <h3 className="font-bold text-slate-800 text-sm">Completed Services &amp; Impact History</h3>
                                </div>
                                <button
                                    onClick={() => setShowServicesModal(false)}
                                    className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="overflow-y-auto space-y-3 flex-1 pr-1 text-xs">
                                {isDrawerLoading ? (
                                    <div className="py-12 text-center space-y-2">
                                        <RefreshCw className="w-5 h-5 text-teal-600 animate-spin mx-auto" />
                                        <p className="text-slate-400 font-mono">Fetching commitment records...</p>
                                    </div>
                                ) : myServices.length === 0 ? (
                                    <p className="py-12 text-center text-slate-400">
                                        No completed services yet. Block dates or sponsor a mission via SOL to generate receipts.
                                    </p>
                                ) : (
                                    myServices.map((service) => (
                                        <div
                                            key={service.id}
                                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4"
                                        >
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900">{service.itemTitle}</span>
                                                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                                                        {service.missionId}
                                                    </span>
                                                </div>
                                                <p className="text-slate-500 text-[11px]">{service.details}</p>
                                                <p className="text-[10px] font-mono text-slate-400 truncate max-w-[220px] sm:max-w-xs">
                                                    Tx: {service.txSignature}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowServicesModal(false);
                                                    setReceiptItem(service);
                                                }}
                                                className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-1.5 transition active:scale-95 shrink-0 shadow-xs"
                                            >
                                                <Award className="w-3.5 h-3.5" /> Impact Receipt
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL 3: Printable Impact Certificate */}
                {receiptItem && (
                    <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="w-full max-w-md bg-white rounded-3xl p-7 shadow-2xl border border-slate-200 space-y-6 text-center">
                            <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto">
                                <Award className="w-8 h-8" />
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-teal-700">
                                    KINDLINK DISASTER RESPONSE MESH
                                </span>
                                <h3 className="text-xl font-black text-slate-900">Certificate of Verified Impact</h3>
                                <p className="text-xs text-slate-500">Cryptographically recorded on autonomous relief grid</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs space-y-2 font-mono">
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Contributor:</span>
                                    <span className="font-bold text-slate-800">{receiptItem.giverEmail}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Mission Node:</span>
                                    <span className="font-bold text-slate-800">{receiptItem.missionId}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Allocated Resource:</span>
                                    <span className="font-bold text-slate-800">{receiptItem.itemTitle}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Action:</span>
                                    <span className="font-bold text-slate-800">{receiptItem.details}</span>
                                </div>
                                <div className="flex flex-col pt-1 border-t border-slate-200 gap-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400">Verification Hash:</span>
                                        {receiptItem.txSignature && !receiptItem.txSignature.startsWith("BLOCK-") && (
                                            <span className="text-[9px] font-sans font-bold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800">
                                                SOLANA DEVNET
                                            </span>
                                        )}
                                    </div>
                                    <span className="font-bold text-teal-700 text-[11px] break-all select-all">
                                        {receiptItem.txSignature}
                                    </span>
                                    {receiptItem.txSignature && !receiptItem.txSignature.startsWith("BLOCK-") && (
                                        <a
                                            href={`https://explorer.solana.com/tx/${receiptItem.txSignature}?cluster=devnet`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#0284C7] hover:underline"
                                        >
                                            Verify on Solana Explorer <ExternalLink className="w-3 h-3" />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="flex-1 py-3 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 shadow-xs"
                                >
                                    <Download className="w-3.5 h-3.5" /> Download / Print Receipt
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReceiptItem(null);
                                        setShowServicesModal(true);
                                    }}
                                    className="px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Pay with SOL Modal */}
                {solModalItem && (
                    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                                <div className="flex items-center gap-2">
                                    <Coins className="w-5 h-5 text-emerald-600" />
                                    <h3 className="font-bold text-slate-800 text-sm">Instant SOL Sponsorship</h3>
                                </div>
                                <button
                                    onClick={() => setSolModalItem(null)}
                                    className="text-xs text-slate-400 hover:text-slate-600"
                                >
                                    Cancel
                                </button>
                            </div>

                            <div className="space-y-3 text-xs">
                                <p className="text-slate-600">
                                    You are funding: <strong>{solModalItem.item.title}</strong>
                                </p>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Select Escrow Amount (SOL)</label>
                                    <div className="flex gap-2">
                                        {["0.1", "0.5", "1.0", "2.0"].map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => setSolAmount(val)}
                                                className={`flex-1 py-2 rounded-xl font-mono font-bold border transition ${solAmount === val
                                                        ? "bg-emerald-50 border-emerald-500 text-emerald-800"
                                                        : "bg-slate-50 border-slate-200 text-slate-600"
                                                    }`}
                                            >
                                                {val} SOL
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {txSuccess && (
                                    <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                                        <span>{txSuccess}</span>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleExecuteSolPayment}
                                disabled={isPayingSol || !!txSuccess}
                                className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isPayingSol ? (
                                    <>
                                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Transacting on Devnet...
                                    </>
                                ) : (
                                    <>
                                        <Wallet className="w-3.5 h-3.5" /> Confirm &amp; Transact {solAmount} SOL
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </GiverGate>
    );
}