'use client';

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
    symbol?: string;
    theme?: 'dark' | 'light';
}

function TradingViewWidget({ symbol = "NASDAQ:AAPL", theme = "dark" }: TradingViewWidgetProps) {
    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Clear previous script
        if (container.current) {
            container.current.innerHTML = '';
            const widgetDiv = document.createElement("div");
            widgetDiv.className = "tradingview-widget-container__widget h-full w-full";
            container.current.appendChild(widgetDiv);
        }

        const script = document.createElement("script");
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
        script.type = "text/javascript";
        script.async = true;
        script.innerHTML = JSON.stringify({
            "autosize": true,
            "symbol": symbol,
            "interval": "D",
            "timezone": "Etc/UTC",
            "theme": theme,
            "style": "1",
            "locale": "en",
            "enable_publishing": false,
            "allow_symbol_change": true,
            "calendar": false,
            "support_host": "https://www.tradingview.com"
        });

        if (container.current) {
            container.current.appendChild(script);
        }
    }, [symbol, theme]); // Re-run when symbol changes

    return (
        <div className="h-full w-full" ref={container} />
    );
}

export default memo(TradingViewWidget);
