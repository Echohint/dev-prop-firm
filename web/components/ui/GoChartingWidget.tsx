'use client';

import React, { memo } from 'react';

interface GoChartingWidgetProps {
    symbol?: string;
    theme?: 'dark' | 'light';
}

function GoChartingWidget({ symbol = "BTCUSD", theme = "dark" }: GoChartingWidgetProps) {
    // GoCharting uses specific ticker formats, but let's try to map or pass directly.
    // Usually it's EXCHANGE:SYMBOL or just SYMBOL. 
    // If symbol is NASDAQ:AAPL, GoCharting might expect just AAPL or similar.
    // For safety, let's use the symbol as is, or maybe strip exchange?
    // Let's rely on the user typing the right thing or default to BTCUSD if unsure.

    // Clean symbol for GoCharting if needed.
    // Example: "NASDAQ:AAPL" -> "AAPL" if GoCharting prefers that.
    // But GoCharting supports many exchanges. Let's try passing the full string first.

    return (
        <iframe
            src={`https://gocharting.com/terminal?ticker=${symbol}`}
            className="w-full h-full border-none"
            title="GoCharting Terminal"
            allowFullScreen
        />
    );
}

export default memo(GoChartingWidget);
