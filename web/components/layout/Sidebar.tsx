"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    CreditCard,
    Trophy,
    BarChart2,
    Settings,
    LogOut,
    Users,
    BookOpen,
    Ticket,
    Globe,
    Newspaper,
    Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/ui/mode-toggle";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Accounts", href: "/accounts" },
    { icon: CreditCard, label: "Payouts", href: "/payouts" },
    { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
    {
        icon: BarChart2,
        label: "Analytics",
        href: "/analytics",
        subItems: [
            { icon: Globe, label: "Market Heatmap", href: "/analytics/heatmap" },
            { icon: Newspaper, label: "Market News", href: "/analytics/news" },
            { icon: Calendar, label: "Economic Calendar", href: "/analytics/calendar" },
        ]
    },
];

const bottomItems = [
    { icon: Users, label: "Affiliate", href: "/affiliate" },
    { icon: Ticket, label: "Coupon Codes", href: "/coupons" },
    { icon: BookOpen, label: "Rules", href: "/rules" },
    { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col bg-card border-r border-border">
            <div className="flex h-16 items-center justify-between px-6 border-b border-border/50">
                <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                    <span className="h-8 w-8 rounded bg-primary text-primary-foreground flex items-center justify-center font-black">D</span>
                    DEV
                </h1>
                <ModeToggle />
            </div>

            <div className="flex-1 overflow-y-auto py-4">
                <nav className="space-y-1 px-3">
                    {sidebarItems.map((item) => (
                        <div key={item.label}>
                            <Link
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                    pathname.startsWith(item.href) ? "bg-accent/50 text-primary" : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                            {item.subItems && (
                                <div className="ml-9 mt-1 space-y-1">
                                    {item.subItems.map((sub) => (
                                        <Link
                                            key={sub.label}
                                            href={sub.href}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:text-foreground",
                                                pathname === sub.href ? "text-primary" : "text-muted-foreground"
                                            )}
                                        >
                                            <sub.icon className="h-4 w-4" />
                                            {sub.label}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="my-2 border-t border-border/50" />

                    <Link
                        href="/journal"
                        className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                            pathname.startsWith("/journal") ? "bg-accent/50 text-primary" : "text-muted-foreground"
                        )}
                    >
                        <BookOpen className="h-5 w-5" />
                        Trading Journal
                    </Link>
                </nav>
            </div>

            <div className="border-t border-border p-3">
                <div className="space-y-1">
                    <div className="px-3 py-2 text-xs text-muted-foreground mb-4">
                        <p className="font-semibold text-foreground mb-1">Support:</p>
                        <p className="font-mono text-[10px] truncate mb-0.5" title="devtrader2026@gmail.com">devtrader2026@gmail.com</p>
                        <p className="font-mono text-[10px]">+91 7906621066</p>
                    </div>

                    <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase mb-2">Other</h3>
                    {bottomItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                pathname === item.href ? "bg-accent/50 text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                    <button
                        onClick={() => import("next-auth/react").then(mod => mod.signOut())}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
