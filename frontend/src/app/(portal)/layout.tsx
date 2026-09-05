import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
    title: "KindLink | Autonomous Generosity Grid",
    description: "Where urgent human pleas become verified relief in minutes.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-[#FAFAF8] text-slate-900 antialiased flex flex-col justify-between">
                {/* Top Floating Glass Header */}
                <header className="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-slate-200/70 px-6 lg:px-12 py-3.5 transition-all">
                    <div className="max-w-6xl mx-auto flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2.5 group">
                            <div className="h-8 w-8 rounded-full bg-[#0A2540] flex items-center justify-center text-white font-bold text-xs tracking-wider group-hover:bg-[#0284C7] transition-colors">
                                KL
                            </div>
                            <span className="font-extrabold text-lg tracking-tight text-slate-900">
                                KindLink
                            </span>
                        </Link>

                        {/* Navigation links */}
                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                            <Link href="/how-it-works" className="hover:text-slate-950 transition">
                                How it works
                            </Link>
                            <Link href="/live-grid" className="hover:text-slate-950 transition">
                                Live grid
                            </Link>
                            <Link href="/partners" className="hover:text-slate-950 transition">
                                Partners
                            </Link>
                        </nav>

                        {/* Action CTA */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/ngo"
                                className="text-xs sm:text-sm font-semibold px-4 py-2 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white shadow-sm transition active:scale-95"
                            >
                                Report a need
                            </Link>
                        </div>
                    </div>
                </header>

                {/* Content Viewport */}
                <main className="flex-1 bg-subtle-grid">{children}</main>

                {/* Humanitarian Footnote */}
                <footer className="border-t border-slate-200/80 bg-white py-6 px-6 lg:px-12 text-xs text-slate-400 font-medium">
                    <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p>© 2026 KindLink — relief coordination grid</p>
                        <p className="flex items-center gap-1.5">
                            Field support: <span className="text-slate-600 hover:underline cursor-pointer">help@kindlink.org</span>
                        </p>
                    </div>
                </footer>
            </body>
        </html>
    );
}