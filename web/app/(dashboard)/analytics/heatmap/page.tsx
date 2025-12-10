"use client";

import { useEffect, useRef, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function HeatmapWidget() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(
        () => {
            if (container.current && !container.current.querySelector("script")) {
                const script = document.createElement("script");
                script.src = "https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js";
                script.type = "text/javascript";
                script.async = true;
                script.innerHTML = JSON.stringify({
                    "width": "100%",
                    "height": "100%",
                    "currencies": [
                        "EUR",
                        "USD",
                        "JPY",
                        "GBP",
                        "CHF",
                        "AUD",
                        "CAD",
                        "NZD",
                        "CNY"
                    ],
                    "isTransparent": false,
                    "colorTheme": "dark",
                    "locale": "en"
                });
                container.current.appendChild(script);
            }
        },
        []
    );

    return (
        <div className="tradingview-widget-container" ref={container} style={{ height: "100%", width: "100%" }}>
            <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
        </div>
    );
}

const MemoizedHeatmap = memo(HeatmapWidget);

export default function HeatmapPage() {
    return (
        <div className="space-y-6 h-[calc(100vh-100px)]">
            <h1 className="text-3xl font-bold">Market Heatmap</h1>
            <Card className="h-full border-0 shadow-none bg-transparent">
                <CardContent className="p-0 h-full">
                    <MemoizedHeatmap />
                </CardContent>
            </Card>
        </div>
    );
}
