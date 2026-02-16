import React, { useState, useEffect, useRef } from 'react';
import { Box, Fab, Paper, Typography, TextField, IconButton, Zoom, CircularProgress } from '@mui/material';
import { Chat as ChatIcon, Close as CloseIcon, Send as SendIcon, SmartToy as BotIcon } from '@mui/icons-material';
import { useChatBot } from '../api/useChatBot.ts'; // ודאי שהשם והנתיב תקינים

const ChatBotUI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  
  // אנחנו שולפים את המערך messages ישירות מה-Hook
  // אין צורך לנהל useState נוסף של messages כאן ב-UI
  const { messages, isStreaming, isConnected, sendMessage } = useChatBot();
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // גלילה אוטומטית בכל פעם שמערך ההודעות משתנה (גם בזמן סטרימינג)
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim() || !isConnected) return;
    
    sendMessage(input); // ה-Hook יוסיף את הודעת המשתמש למערך בעצמו
    setInput("");
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right:10, zIndex: 1000 }}>
      <Zoom in={isOpen}>
        <Paper elevation={6} sx={{ 
          width: { xs: '90vw', sm: 350 }, 
          height: 500, 
          display: 'flex', 
          flexDirection: 'column', 
          mb: 2, 
          borderRadius: 3, 
          overflow: 'hidden' 
        }}>
          
          {/* Header */}
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
             <Box sx={{ display: 'flex', alignItems: "end", gap: 1 }}>
                <BotIcon /> 
                <Box>
                    <Typography variant="subtitle2" fontWeight="bold" lineHeight={1}>Bank Support</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8, textAlign: "right"}}>
                        {isConnected ? 'Available' : 'Connecting...'}
                    </Typography>
                </Box>
             </Box>
             <IconButton size="small" onClick={() => setIsOpen(false)} sx={{ color: 'white' }}><CloseIcon /></IconButton>
          </Box>

          {/* Messages Area */}
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', bgcolor: '#f5f5f5', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {messages.map((msg) => (
              <Box key={msg.id} sx={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%'
              }}>
                <Typography sx={{ 
                  p: 1.5, 
                  borderRadius: 2, 
                  fontSize: '0.875rem',
                  bgcolor: msg.role === 'user' ? 'primary.main' : 'white',
                  color: msg.role === 'user' ? 'white' : 'text.primary',
                  boxShadow: '0px 2px 4px rgba(0,0,0,0.05)',
                  borderTopRightRadius: msg.role === 'user' ? 0 : 8,
                  borderTopLeftRadius: msg.role === 'assistant' ? 0 : 8,
                  whiteSpace: 'pre-wrap' // שומר על ירידות שורה מהבוט
                }}>
                  {msg.content}
                </Typography>
              </Box>
            ))}
            
            {/* אנימציה כשהבוט חושב/מתחיל להגיב */}
            {isStreaming && messages[messages.length - 1]?.role === 'user' && (
               <Box sx={{ alignSelf: 'flex-start', p: 1 }}>
                  <CircularProgress size={18} />
               </Box>
            )}
            
            <div ref={chatEndRef} />
          </Box>

          {/* Input Area */}
          <Box sx={{ p: 2, display: 'flex', gap: 1, borderTop: 1, borderColor: 'divider', bgcolor: 'white' }}>
            <TextField 
              fullWidth 
              size="small" 
              placeholder="כתוב הודעה..."
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={!isConnected}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 5 } }}
            />
            <IconButton 
               color="primary" 
               onClick={handleSend} 
               disabled={!isConnected || !input.trim()}
               sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'white' }, '&.Mui-disabled': { bgcolor: '#eee' } }}
            >
                <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Zoom>

      <Fab 
        color="primary" 
        onClick={() => setIsOpen(!isOpen)} 
        sx={{ boxShadow: 4 }}
      >
        {isOpen ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </Box>
  );
};

export default ChatBotUI;