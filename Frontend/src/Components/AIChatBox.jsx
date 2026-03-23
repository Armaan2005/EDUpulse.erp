import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, TextField, IconButton, Paper,
  Avatar, Divider, Chip
} from '@mui/material';
import { Send, SmartToy, Person, AutoAwesome, Close } from '@mui/icons-material';

const API = 'http://localhost:7000';
const primaryColor = '#0f2a44';
const secondaryColor = '#0f7fbf';

const SUGGESTIONS = {
  student: [
    "Meri attendance dikhao",
    "Pending assignments dikhao",
    "Latest notices dikhao",
    "Meri fees kitni hai?",
    "Marks dikhao",
  ],
  staff: [
    "Aaj ki attendance dikhao",
    "Sab students ki list dikhao",
    "Ek notice add karo",
    "Meri assignments dikhao",
    "Armaan ki aaj ki attendance Full mark karo",
  ]
};

const WELCOME = {
  student: '👋 Hi! Main EduPulse AI hoon.\n\nMain yeh sab kar sakta hoon:\n• Attendance, marks, fees dekhna\n• Notices aur assignments check karna\n• Assignment submit karna\n• Library, hostel info dekhna\n\nKuch bhi puchho! 😊',
  staff: '👋 Hi! Main EduPulse AI hoon.\n\nMain yeh sab kar sakta hoon:\n• Students ki attendance mark/dekhna\n• Assignment add/delete/dekhna\n• Notice add/delete/dekhna\n• Submissions dekhna\n• Student list dekhna\n\nKuch bhi puchho! 😊'
};

export default function AIChatBox({ role = 'student', onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: WELCOME[role] }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setShowSuggestions(false);
    const userMsg = { role: 'user', content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const history = newMessages.slice(-10).slice(0, -1);
      const endpoint = role === 'student' ? '/ai/student/chat' : '/ai/staff/chat';
      const res = await axios.post(
        `${API}${endpoint}`,
        { message: msg, history },
        { withCredentials: true }
      );
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ ' + (err.response?.data?.msg || 'Kuch error aaya. Dobara try karo.')
      }]);
    }
    setLoading(false);
  };

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column',
      width: 380, height: 520,
      borderRadius: 3, overflow: 'hidden',
      boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
      border: '1px solid #e0e0e0',
      bgcolor: 'white',
    }}>

      {/* Header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1, p: 1.5,
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        flexShrink: 0,
      }}>
        <AutoAwesome sx={{ color: '#FFD700', fontSize: 18 }} />
        <Typography variant="subtitle2" fontWeight="bold" color="white" fontSize="0.85rem">
          EduPulse AI — {role === 'staff' ? 'Teacher Assistant' : 'Student Assistant'}
        </Typography>
        <Chip label="Live" size="small" sx={{ bgcolor: '#27ae60', color: 'white', height: 18, fontSize: '0.65rem', ml: 0.5 }} />
        <IconButton onClick={onClose} size="small" sx={{ ml: 'auto', color: 'white', p: 0.3 }}>
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* Messages */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1.2, background: '#f8f9fb' }}>
        {messages.map((msg, i) => (
          <Box key={i} sx={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 0.7, alignItems: 'flex-end' }}>
            {msg.role === 'assistant' && (
              <Avatar sx={{ width: 24, height: 24, bgcolor: primaryColor, fontSize: 11, mb: 0.2, flexShrink: 0 }}>
                <SmartToy sx={{ fontSize: 13 }} />
              </Avatar>
            )}
            <Paper elevation={0} sx={{
              p: 1, px: 1.3, maxWidth: '82%',
              borderRadius: msg.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
              bgcolor: msg.role === 'user' ? primaryColor : 'white',
              color: msg.role === 'user' ? 'white' : '#333',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              whiteSpace: 'pre-wrap', fontSize: '0.82rem', lineHeight: 1.6,
            }}>
              {msg.content}
            </Paper>
            {msg.role === 'user' && (
              <Avatar sx={{ width: 24, height: 24, bgcolor: secondaryColor, fontSize: 11, mb: 0.2, flexShrink: 0 }}>
                <Person sx={{ fontSize: 13 }} />
              </Avatar>
            )}
          </Box>
        ))}

        {/* Loading dots */}
        {loading && (
          <Box sx={{ display: 'flex', gap: 0.7, alignItems: 'flex-end' }}>
            <Avatar sx={{ width: 24, height: 24, bgcolor: primaryColor, fontSize: 11 }}>
              <SmartToy sx={{ fontSize: 13 }} />
            </Avatar>
            <Paper elevation={0} sx={{ p: 1, px: 1.3, borderRadius: '4px 14px 14px 14px', bgcolor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', gap: 0.4, alignItems: 'center' }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#aaa', animation: 'pulse 1s infinite' }} />
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#aaa', animation: 'pulse 1s 0.2s infinite' }} />
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#aaa', animation: 'pulse 1s 0.4s infinite' }} />
            </Paper>
          </Box>
        )}

        {/* Quick suggestions */}
        {showSuggestions && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.3 }}>
            {SUGGESTIONS[role].map((s, i) => (
              <Chip key={i} label={s} size="small" onClick={() => sendMessage(s)}
                sx={{ fontSize: '0.7rem', cursor: 'pointer', height: 22, bgcolor: 'white', border: `1px solid ${secondaryColor}`, color: secondaryColor, '&:hover': { bgcolor: '#e3f2fd' } }}
              />
            ))}
          </Box>
        )}
        <div ref={bottomRef} />
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ display: 'flex', gap: 0.8, p: 1, background: 'white', flexShrink: 0 }}>
        <TextField
          fullWidth size="small"
          placeholder={role === 'staff' ? "Koi bhi kaam batao..." : "Kuch bhi puchho ya kaho..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          multiline maxRows={3}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, fontSize: '0.82rem' } }}
        />
        <IconButton onClick={() => sendMessage()} disabled={!input.trim() || loading}
          sx={{ bgcolor: primaryColor, color: 'white', borderRadius: 2, width: 36, height: 36, alignSelf: 'flex-end', '&:hover': { bgcolor: secondaryColor }, '&:disabled': { bgcolor: '#ddd' } }}>
          <Send sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>

      <style>{`@keyframes pulse { 0%,100%{opacity:0.4} 50%{opacity:1} }`}</style>
    </Box>
  );
}