import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { User } from '../types';
import { LanguageCode, UI_TEXT } from '../translations';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

interface JourneyTVViewProps {
  user: User | null;
  onBack: () => void;
  onChat?: () => void;
  language?: LanguageCode;
}

interface ChatMessage {
  id: string;
  user: string;
  avatar?: string;
  text: string;
  created_at: string;
  is_me?: boolean;
}

const JourneyTVView: React.FC<JourneyTVViewProps> = ({ user, onBack, onChat, language = 'en' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  const t = (key: keyof typeof UI_TEXT['en']) => {
    return UI_TEXT[language][key] || UI_TEXT['en'][key];
  };

  // Load initial messages and subscribe to realtime
  useEffect(() => {
    const fetchHistory = async () => {
        const { data, error } = await supabase
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (data && !error) {
            const history = data.reverse().map((msg: any) => ({
                id: msg.id,
                user: msg.username,
                avatar: msg.avatar,
                text: msg.message,
                created_at: msg.created_at,
                is_me: user ? msg.user_id === user.id : false
            }));
            setMessages(history);
        }
    };

    fetchHistory();

    // Setup Realtime
    const channel = supabase.channel('public:chat_messages')
        .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'chat_messages' },
            (payload) => {
                const newMsg = payload.new;
                setMessages((prev) => {
                    // Prevent duplicates if local optimistic updates were used (removed for now)
                    if (prev.some(m => m.id === newMsg.id)) return prev;
                    
                    return [...prev, {
                        id: newMsg.id,
                        user: newMsg.username,
                        avatar: newMsg.avatar,
                        text: newMsg.message,
                        created_at: newMsg.created_at,
                        is_me: user ? newMsg.user_id === user.id : false
                    }];
                });
            }
        )
        .subscribe();
    
    channelRef.current = channel;

    return () => {
        supabase.removeChannel(channel);
    };
  }, [user]);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const messageText = input.trim();
    setInput('');
    
    try {
        const { error } = await supabase.from('chat_messages').insert({
            user_id: user.id,
            username: user.username,
            avatar: user.avatar,
            message: messageText
        });
        
        if (error) {
            console.error("Chat Insert Error:", error);
            alert("Failed to send message: " + error.message);
        } else {
            if (onChat) onChat();
        }
    } catch (err) {
        console.error("Failed to send message", err);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-black overflow-hidden relative pt-14 md:pt-16">
      {/* Background static effect */}
      <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-5 pointer-events-none bg-cover"></div>

      {/* LEFT/TOP: TV Content - Fixed Height on Mobile, Full on Desktop */}
      <div className="flex-none md:flex-1 flex flex-col p-2 md:p-6 h-[40vh] md:h-full relative z-10 border-b-4 md:border-b-0 md:border-r-4 border-gray-800 bg-gray-900/50">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-2 md:mb-4 flex-none">
          <div className="flex items-center gap-3">
             <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-red-600 animate-pulse"></div>
             <h1 className="text-xl md:text-3xl font-retro text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
               JOURNEY TV
             </h1>
          </div>
          <div className="flex gap-2">
            <Button onClick={onBack} variant="secondary" className="text-[10px] md:text-xs py-1 px-2 md:py-2 md:px-4">🏠 {t('home')}</Button>
            <Button onClick={onBack} variant="secondary" className="text-[10px] md:text-xs py-1 px-2 md:py-2 md:px-4">{t('power_off')}</Button>
          </div>
        </div>

        {/* Retro TV Bezel - Takes remaining space in this container */}
        <div className="flex-1 bg-gray-800 rounded-xl md:rounded-3xl p-2 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] border-t-2 border-l-2 border-gray-600 border-b-4 md:border-b-8 border-r-4 md:border-r-8 border-black flex flex-col justify-center min-h-0">
          
          {/* Screen Wrapper */}
          <div className="relative w-full h-full bg-black rounded overflow-hidden border-2 md:border-4 border-gray-900 shadow-inner ring-1 ring-white/10">
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/5 pointer-events-none z-20"></div>
             
             {/* YouTube Embed - Updated Link */}
             <iframe 
               className="w-full h-full absolute inset-0 z-10"
               src="https://www.youtube.com/embed/Pxpn0A2PdNU?si=nRHgRq5X__v5DRR8&autoplay=1&mute=1" 
               title="YouTube video player" 
               frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
               referrerPolicy="strict-origin-when-cross-origin" 
               allowFullScreen
             ></iframe>
             
             {/* Scanlines Overlay */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>
          </div>
          
        </div>
        
        <div className="mt-2 text-center flex-none hidden md:block">
           <p className="text-gray-500 font-serif italic text-xs">
             "Make a joyful noise unto the Lord, all the earth." - Psalm 98:4
           </p>
           <p className="text-gray-600 text-[10px] mt-1 font-mono">{t('stream_id')}: Pxpn0A2PdNU</p>
        </div>
      </div>

      {/* RIGHT/BOTTOM: Live Chat - Flexes to fill rest of screen */}
      <div className="flex-1 md:flex-none md:w-96 bg-gray-900 flex flex-col min-h-0 relative z-20 shadow-2xl">
        <div className="p-2 md:p-3 border-b border-gray-700 bg-gray-800 flex-none flex justify-between items-center">
           <h3 className="font-retro text-gray-300 text-xs">{t('live_chat')}</h3>
           <div className="flex gap-1">
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             <span className="text-[10px] text-gray-400 font-mono">LIVE CONNECTION</span>
           </div>
        </div>
        
        {/* Messages List - Scrolls independently */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 font-mono text-xs md:text-sm custom-scroll bg-black/20">
           {messages.length === 0 && (
               <div className="text-gray-600 text-center italic mt-10">Connecting to global frequency...</div>
           )}
           {messages.map(msg => (
             <div key={msg.id} className={`break-words animate-fade-in flex gap-2 ${msg.is_me ? 'flex-row-reverse text-right' : ''}`}>
               {msg.avatar && (
                   <div className="w-6 h-6 rounded border border-gray-600 overflow-hidden shrink-0 mt-0.5">
                       <img src={msg.avatar} className="w-full h-full object-cover" />
                   </div>
               )}
               <div className={`flex flex-col ${msg.is_me ? 'items-end' : 'items-start'}`}>
                  <span className={`font-bold text-[10px] ${msg.is_me ? 'text-yellow-500' : 'text-blue-400'}`}>
                      {msg.user}
                  </span>
                  <span className="text-gray-300 bg-gray-800/50 px-2 py-1 rounded inline-block">
                      {msg.text}
                  </span>
               </div>
             </div>
           ))}
           <div ref={chatEndRef} />
        </div>

        {/* Input Area - Fixed at bottom of chat container */}
        <form onSubmit={handleSend} className="p-2 bg-black border-t border-gray-700 flex-none">
           <div className="flex gap-2">
             <input 
               type="text" 
               value={input}
               onChange={(e) => setInput(e.target.value)}
               placeholder={user ? `${t('speak')}...` : "Login to chat"}
               disabled={!user}
               className="flex-1 bg-gray-800 text-white p-2 rounded border border-gray-600 focus:border-yellow-500 outline-none text-xs"
             />
             <Button className="text-xs py-2 px-3" disabled={!user || !input.trim()}>
               {t('send')}
             </Button>
           </div>
        </form>
      </div>

    </div>
  );
};

export default JourneyTVView;
