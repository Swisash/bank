import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const getCookie = (name: string): string | undefined => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
};

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export const useChatBot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isStreaming, setIsStreaming] = useState<boolean>(false);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        const token = getCookie("auth_token");
        if (!token) return;

        // אתחול החיבור
        const socket = io("http://localhost:3000", {
            auth: { token }
        });
        socketRef.current = socket;

        socket.on("connect", () => setIsConnected(true));
        socket.on("disconnect", () => setIsConnected(false));

        // טיפול בסטרימינג
        socket.on("receive_chunk", (chunk: string) => {
            setMessages((prev) => {
                const lastMsg = prev[prev.length - 1];
                
                // אם ההודעה האחרונה היא כבר של הבוט, נשרשר אליה
                if (lastMsg && lastMsg.role === 'assistant') {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = {
                        ...lastMsg,
                        content: lastMsg.content + chunk
                    };
                    return newHistory;
                } 
                
                // אם זו תחילת תשובה חדשה (הודעה קודמת הייתה של יוזר)
                return [...prev, { id: Date.now().toString(), role: 'assistant', content: chunk }];
            });
        });

        socket.on("message_finished", () => {
            setIsStreaming(false);
        });

        return () => {
            socket.disconnect();
            socketRef.current = null;
        };
    }, []);

    const sendMessage = (text: string) => {
        // שימוש ב-Optional Chaining (?) פותר את שגיאת ה-TypeScript
        if (socketRef.current?.connected && text.trim()) {
            const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
            setMessages(prev => [...prev, userMsg]);
            
            setIsStreaming(true);
            socketRef.current.emit("send_message", { message: text });
        }
    };

    return { messages, isStreaming, isConnected, sendMessage };
};