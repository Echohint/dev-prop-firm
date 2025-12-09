"use client";

import { useEffect, useRef, memo } from 'react';
import { Card, CardContent } from "@/components/ui/card";

function TimelineWidget() {
    const container = useRef<HTMLDivElement>(null);

    useEffect(
        () => {
            if (container.current && !container.current.querySelector("script")) {
                const script = document.createElement("script");
                script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
                script.type = "text/javascript";
                script.async = true;
                script.innerHTML = JSON.stringify({
                    "feedMode": "all_symbols",
                    "isTransparent": false,
                    "displayMode": "regular",
                    "width": "100%",
                    "height": "100%",
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

const MemoizedTimeline = memo(TimelineWidget);

export default function NewsPage() {
    return (
        <div className="space-y-6 h-[calc(100vh-100px)]">
            <h1 className="text-3xl font-bold">Market News</h1>
            <Card className="h-full border-0 shadow-none bg-transparent">
                <CardContent className="p-0 h-full">
                    <MemoizedTimeline />
                </CardContent>
            </Card>
        </div>
    );
}
