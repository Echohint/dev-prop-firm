"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MessageCircle, X, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: "Hello! I'm the Dev Prop Firm AI assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput("");

        // Simulated AI Logic
        setTimeout(() => {
            let botResponse = "I'm still learning. Can you contact support at devtrader2026@gmail.com?";
            const lowerInput = userMsg.toLowerCase();

            if (lowerInput.includes("rule")) {
                botResponse = "We have a strictly defined set of rules: 5% Daily Loss, 10% Max Loss. Visit the 'Rules' page for more details.";
            } else if (lowerInput.includes("payout") || lowerInput.includes("withdraw")) {
                botResponse = "You can request a payout from the 'Payouts' section. We process Crypto and Bank Transfers instantly.";
            } else if (lowerInput.includes("heatmap")) {
                botResponse = "Check out our Market Heatmap under 'Analytics' -> 'Market Heatmap' to see currency strength!";
            } else if (lowerInput.includes("news")) {
                botResponse = "Stay updated! Visit 'Analytics' -> 'Market News' for the latest economic events.";
            } else if (lowerInput.includes("theme") || lowerInput.includes("dark") || lowerInput.includes("light")) {
                botResponse = "You can toggle Dark/Light mode using the Sun/Moon icon in your sidebar.";
            } else if (lowerInput.includes("buy") || lowerInput.includes("challenge")) {
                botResponse = "To start getting funded, go to 'Accounts' -> 'New Challenge'. We accept UPI, Razorpay, and Crypto.";
            } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
                botResponse = "Hi there! Ready to dominate the markets?";
            }

            setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {!isOpen && (
                <Button
                    className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 transition-all hover:scale-110"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageCircle className="h-8 w-8 text-primary-foreground" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-80 h-96 flex flex-col shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300">
                    <CardHeader className="py-3 px-4 bg-primary text-primary-foreground rounded-t-lg flex flex-row justify-between items-center">
                        <div className="font-bold flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                            Dev Bot
                        </div>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-primary-foreground hover:bg-primary-foreground/20" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 flex flex-col overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted border'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-3 border-t bg-background flex gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                className="flex-1 h-9 rounded-full"
                            />
                            <Button size="icon" className="h-9 w-9 rounded-full" onClick={handleSend}>
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
