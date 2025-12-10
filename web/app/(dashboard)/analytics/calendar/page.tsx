"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EconomicCalendarPage() {
    return (
        <div className="space-y-6 h-[calc(100vh-100px)]">
            <h1 className="text-3xl font-bold">Economic Calendar</h1>
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent className="h-full p-0 overflow-hidden">
                    {/* TradingView Economic Calendar Widget */}
                    <div className="tradingview-widget-container h-full w-full">
                        <div className="tradingview-widget-container__widget h-full w-full"></div>
                        <iframe
                            src="https://s.tradingview.com/embed-widget/events/?locale=en#%7B%22colorTheme%22%3A%22dark%22%2C%22isTransparent%22%3Afalse%2C%22width%22%3A%22100%25%22%2C%22height%22%3A%22100%25%22%2C%22importanceFilter%22%3A%22-1%2C0%2C1%22%2C%22currencyFilter%22%3A%22USD%2CEUR%2CJPY%2CGBP%2CAUD%2CCAD%2CCHF%2CNZD%22%2C%22utm_source%22%3A%22www.tradingview.com%22%2C%22utm_medium%22%3A%22widget%22%2C%22utm_campaign%22%3A%22events%22%7D"
                            style={{ width: '100%', height: '100%', border: 'none' }}
                            title="Economic Calendar"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
