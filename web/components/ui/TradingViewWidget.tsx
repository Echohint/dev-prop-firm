'use client';

import React, { useEffect, useRef, memo } from 'react';

interface TradingViewWidgetProps {
    symbol?: string;
    theme?: 'dark' | 'light';
    autosize?: boolean;
}

let tvScriptLoadingPromise: Promise<void> | undefined;

function TradingViewWidget({ symbol = "NASDAQ:AAPL", theme = "light", autosize = true }: TradingViewWidgetProps) {
    const onLoadScriptRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        onLoadScriptRef.current = createWidget;

        if (!tvScriptLoadingPromise) {
            tvScriptLoadingPromise = new Promise((resolve) => {
                const script = document.createElement('script');
                script.id = 'tradingview-widget-loading-script';
                script.src = 'https://s3.tradingview.com/tv.js';
                script.type = 'text/javascript';
                script.onload = () => resolve();

                document.head.appendChild(script);
            });
        }

        tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

        return () => {
            onLoadScriptRef.current = null;
        };

        function createWidget() {
            if (document.getElementById('tradingview_widget') && 'TradingView' in window) {
                new (window as any).TradingView.widget({
                    autosize: true,
                    symbol: symbol,
                    interval: "D",
                    timezone: "Etc/UTC",
                    theme: theme,
                    style: "1",
                    locale: "en",
                    toolbar_bg: "#f1f3f6",
                    enable_publishing: false,
                    allow_symbol_change: true,
                    container_id: "tradingview_widget"
                });
            }
        }
    }, [symbol, theme]);

    return (
        <div className='tradingview-widget-container h-full w-full'>
            <div id='tradingview_widget' className='h-full w-full' />
        </div>
    );
}

export default memo(TradingViewWidget);
