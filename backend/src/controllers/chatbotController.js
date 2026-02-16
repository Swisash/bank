import { Groq } from "groq-sdk";
import user from "../models/user.js"; 
import Message from "../models/message.js";
import { getSystemPrompt, BOT_MODEL } from "../config/chatbotConfig.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chatbot  = (io, socket) => {
    // אנחנו מאזינים לאירוע "send_message" מהפרונט
    socket.on("send_message", async (data) => {
        try {
            const { message } = data;
            const userId = socket.user.id; // המידע הזה מגיע מה-Middleware של ה-Socket

            // 1. שמירת הודעת המשתמש ב-DB
            await Message.create({
                userId,
                role: "user",
                content: message
            });

            // 2. שליפת היסטוריה ונתוני משתמש (בדיוק כמו שכתבת!)
            const lastMessages = await Message.find({ userId })
                .sort({ createdAt: -1 })
                .limit(10);

            const historyForAI = lastMessages.reverse().map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const userData = await user.findById(userId);
            if (!userData) {
                return socket.emit("error_message", "User Not Found");
            }

            // 3. פנייה ל-Groq עם streaming: true
            const stream = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: getSystemPrompt(userData) },
                    ...historyForAI
                ],
                model: BOT_MODEL,
                stream: true, // הפעלת הזרמה חיה
            });

            let fullReply = "";

            // 4. שליחת הנתונים ב"צ'אנקים" (מילים) לפרונט בזמן אמת
            for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || "";
                if (content) {
                    fullReply += content;
                    // שליחת המילה הנוכחית לפרונט
                    socket.emit("receive_chunk", content); 
                }
            }

            // 5. רק בסיום הסטרים - שומרים את התשובה המלאה ב-DB
            await Message.create({
                userId,
                role: "assistant",
                content: fullReply
            });

            // 6. מודיעים לפרונט שהתשובה הסתיימה
            socket.emit("message_finished");

        } catch (error) {
            console.error("ChatBot Socket Error:", error);
            socket.emit("error_message", "Error in processing the request");
        }
    });
};