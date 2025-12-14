import React, { useState, useEffect } from 'react';
import Button from './Button';
import { GAMES, BADGES } from '../constants';
import { AppView, User } from '../types';
import { supabase } from '../lib/supabase';

interface WikiViewProps {
  onBack: () => void;
  onNavigate?: (view: AppView) => void;
  user: User | null;
}

type Tab = 'guide' | 'lore' | 'archetypes' | 'economy' | 'faq' | 'tv' | 'activities' | 'archive';

const ARCHETYPES = [
  { name: 'Knight', role: 'Defender', desc: 'Strong in spiritual warfare. Focuses on armor of God.', icon: '🛡️' },
  { name: 'Scribe', role: 'Scholar', desc: 'Master of scripture. Wisdom stat is highest.', icon: '📜' },
  { name: 'Shepherd', role: 'Guide', desc: 'Humble leader. High empathy and prayer stats.', icon: '🐑' },
  { name: 'Monk', role: 'Devotee', desc: 'Disciplined and focused. High resistance to temptation.', icon: '📿' },
  { name: 'Paladin', role: 'Champion', desc: 'Zealous for the truth. Radiates holy light.', icon: '⚔️' },
  { name: 'Bard', role: 'Worshipper', desc: 'Uses music and praise to break strongholds.', icon: '🎵' },
  { name: 'Prophet', role: 'Seer', desc: 'Sees the hidden spiritual reality. High insight.', icon: '👁️' },
];

const WikiView: React.FC<WikiViewProps> = ({ onBack, onNavigate, user }) => {
  const [activeTab, setActiveTab] = useState<Tab>('guide');
  const [searchQuery, setSearchQuery] = useState('');
  const [archiveImages, setArchiveImages] = useState<{name: string, url: string, type: 'Avatar' | 'Plan'}[]>([]);
  const [loadingArchive, setLoadingArchive] = useState(false);

  useEffect(() => {
    if (activeTab === 'archive' && user) {
        fetchArchive();
    }
  }, [activeTab, user]);

  const fetchArchive = async () => {
    if (!user) return;
    setLoadingArchive(true);
    const images: {name: string, url: string, type: 'Avatar' | 'Plan'}[] = [];
    
    try {
        // Fetch Avatars
        const { data: avatars } = await supabase.storage.from('journey_assets').list(`avatars/${user.id}`);
        if (avatars) {
            avatars.forEach(file => {
                const { data } = supabase.storage.from('journey_assets').getPublicUrl(`avatars/${user.id}/${file.name}`);
                images.push({ name: file.name, url: data.publicUrl, type: 'Avatar' });
            });
        }

        // Fetch Plans
        const { data: plans } = await supabase.storage.from('journey_assets').list(`plans/${user.id}`);
        if (plans) {
            plans.forEach(file => {
                const { data } = supabase.storage.from('journey_assets').getPublicUrl(`plans/${user.id}/${file.name}`);
                images.push({ name: file.name, url: data.publicUrl, type: 'Plan' });
            });
        }
    } catch (e) {
        console.error("Error fetching archive", e);
    }
    
    setArchiveImages(images);
    setLoadingArchive(false);
  };

  const renderTabButton = (id: Tab, label: string, icon: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        w-full text-left p-3 rounded-lg mb-2 flex items-center gap-3 transition-all
        ${activeTab === id 
          ? 'bg-yellow-600 text-white shadow-lg border-l-4 border-white' 
          : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'}
      `}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-retro text-xs uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-4 pt-20 md:p-8 md:pt-24 flex flex-col items-center bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')] animate-fade-in">
      
      {/* Search & Header Bar */}
      <div className="max-w-6xl w-full mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-800 p-4 rounded-xl border-b-4 border-yellow-600 shadow-xl">
         <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500 rounded flex items-center justify-center text-2xl border-2 border-white shadow-inner">
              📘
            </div>
            <div>
               <h1 className="text-2xl md:text-3xl font-retro text-white leading-none">THE CODEX</h1>
               <p className="text-gray-400 text-xs font-mono mt-1">v4.2 Knowledge Base</p>
            </div>
         </div>

         <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
               <input 
                 type="text" 
                 placeholder="Search database..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full bg-black border-2 border-gray-600 rounded p-2 pl-8 text-white text-xs font-mono focus:border-yellow-500 outline-none"
               />
               <span className="absolute left-2 top-2 text-gray-500">🔍</span>
            </div>
            <Button onClick={onBack} variant="secondary" className="text-xs px-3 py-2">
              ✖
            </Button>
         </div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-4 gap-6 h-full min-h-[600px]">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-1 bg-gray-900/50 p-4 rounded-xl border-2 border-gray-700 h-fit">
           <h3 className="text-gray-500 text-[10px] font-mono uppercase mb-4 ml-2">Categories</h3>
           <nav>
             {renderTabButton('guide', 'Gameplay', '🎮')}
             {renderTabButton('archive', "Pilgrim's Archive", '🏛️')}
             {renderTabButton('activities', 'Activities', '🧩')}
             {renderTabButton('lore', 'Realms & Lore', '🗺️')}
             {renderTabButton('archetypes', 'Archetypes', '🛡️')}
             {renderTabButton('tv', 'Journey TV', '📺')}
             {renderTabButton('economy', 'Economy & XP', '💎')}
             {renderTabButton('faq', 'Support / FAQ', '❓')}
           </nav>

           <div className="mt-8 bg-blue-900/20 p-4 rounded border border-blue-800/50">
             <h4 className="text-blue-400 text-xs font-bold mb-2">Did you know?</h4>
             <p className="text-gray-400 text-[10px] italic">
               "Wearing the 'Prayer Warrior' badge increases your reputation in the community chats."
             </p>
           </div>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 bg-gray-800 p-6 md:p-8 rounded-xl border-2 border-gray-700 shadow-2xl relative overflow-hidden">
           
           {/* Background Decoration */}
           <div className="absolute top-0 right-0 p-32 bg-yellow-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

           {/* TAB: GUIDE */}
           {activeTab === 'guide' && (
             <div className="space-y-8 animate-fade-in">
                <div>
                   <h2 className="text-3xl font-retro text-yellow-400 mb-4">How to Play</h2>
                   <p className="text-gray-300 font-serif text-lg leading-relaxed">
                     The Journey is not just a game; it is a spiritual exercise. You navigate biblical narratives using conversational AI. Your goal is not to "beat" the level, but to align your heart with the lesson God is teaching the character.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-black/30 p-4 rounded border-l-4 border-green-500">
                      <h3 className="text-white font-bold mb-1">1. The Encounter</h3>
                      <p className="text-sm text-gray-400">
                        You step into the shoes of a biblical figure (e.g., David, Peter). The Guide (AI) sets the scene. Read carefully.
                      </p>
                   </div>
                   <div className="bg-black/30 p-4 rounded border-l-4 border-blue-500">
                      <h3 className="text-white font-bold mb-1">2. The Response</h3>
                      <p className="text-sm text-gray-400">
                        Type your response naturally. Speak from the heart. Admit fear, ask for help, or quote scripture.
                      </p>
                   </div>
                   <div className="bg-black/30 p-4 rounded border-l-4 border-purple-500">
                      <h3 className="text-white font-bold mb-1">3. The Interaction</h3>
                      <p className="text-sm text-gray-400">
                        You can interact with the 3D world by hovering over blocks to find clues or simply enjoy the atmosphere.
                      </p>
                   </div>
                   <div className="bg-black/30 p-4 rounded border-l-4 border-yellow-500">
                      <h3 className="text-white font-bold mb-1">4. The Revelation</h3>
                      <p className="text-sm text-gray-400">
                        When you demonstrate the target Virtue (e.g., Courage, Faith), the level clears and a Verse is unlocked in your Journal.
                      </p>
                   </div>
                </div>
             </div>
           )}

            {/* TAB: ARCHIVE */}
            {activeTab === 'archive' && (
             <div className="space-y-8 animate-fade-in h-full flex flex-col">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-retro text-yellow-400 mb-2">Pilgrim's Archive</h2>
                        <p className="text-gray-300 text-sm">
                            Your generated assets, avatars, and plans. Stored securely in the vault.
                        </p>
                    </div>
                    <div className="bg-yellow-900/30 border border-yellow-500 px-3 py-1 rounded text-[10px] text-yellow-300 font-mono">
                        FUTURE NFT READY
                    </div>
                </div>

                {!user ? (
                    <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-gray-700 rounded-xl p-8">
                        <span className="text-4xl mb-4">🔒</span>
                        <p className="text-gray-400 font-serif">Login to access your personal vault.</p>
                    </div>
                ) : loadingArchive ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <span className="text-yellow-500 text-xl animate-pulse font-mono">Retrieving assets...</span>
                    </div>
                ) : archiveImages.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-gray-700 rounded-xl p-8">
                        <span className="text-4xl mb-4">🕸️</span>
                        <p className="text-gray-400 font-serif">Your vault is empty. Generate an avatar or plan to start collecting.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto max-h-[500px] pr-2 custom-scroll">
                        {archiveImages.map((img, idx) => (
                            <div key={idx} className="bg-black p-2 rounded border border-gray-700 hover:border-yellow-500 transition-colors group relative">
                                <div className="aspect-square overflow-hidden rounded bg-gray-900 mb-2">
                                    <img src={img.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-mono text-gray-400 truncate w-20">{new Date(parseInt(img.name.split('.')[0])).toLocaleDateString() || 'Unknown'}</span>
                                    <span className={`text-[9px] px-1.5 rounded font-bold uppercase ${img.type === 'Avatar' ? 'bg-blue-900 text-blue-200' : 'bg-green-900 text-green-200'}`}>
                                        {img.type}
                                    </span>
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <a href={img.url} target="_blank" rel="noopener noreferrer" className="bg-black/50 hover:bg-black text-white p-1 rounded">
                                        ↗️
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
             </div>
           )}

            {/* TAB: ACTIVITIES */}
            {activeTab === 'activities' && (
             <div className="space-y-8 animate-fade-in">
                <div className="relative rounded-xl overflow-hidden border-4 border-green-600 shadow-[0_0_30px_rgba(34,197,94,0.3)] bg-gray-900">
                   <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10"></div>
                   <img src="https://image.pollinations.ai/prompt/pixel%20art%20bible%20study%20group%20outdoor?width=800&height=300&nologo=true" className="w-full h-48 object-cover opacity-60" />
                   <div className="absolute bottom-0 left-0 p-6 z-20">
                      <h2 className="text-3xl md:text-4xl font-retro text-white mb-2 text-shadow-md">BIBLE ACTIVITIES</h2>
                      <p className="text-green-300 font-mono text-sm">Engage with the Word in new ways.</p>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {/* Activity 1 */}
                   <div className="bg-gray-900 border border-gray-600 p-6 rounded-lg hover:border-yellow-500 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                         <span className="text-3xl">🕯️</span>
                         <h3 className="text-xl font-bold text-white font-serif">Lectio Divina</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        A traditional practice of scriptural reading, meditation and prayer intended to promote communion with God.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                         <li><strong>Read:</strong> Read a short passage slowly.</li>
                         <li><strong>Reflect:</strong> Think about which word speaks to you.</li>
                         <li><strong>Respond:</strong> Pray about that word.</li>
                         <li><strong>Rest:</strong> Sit in God's presence.</li>
                      </ul>
                   </div>

                   {/* Activity 2 */}
                   <div className="bg-gray-900 border border-gray-600 p-6 rounded-lg hover:border-yellow-500 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                         <span className="text-3xl">🗺️</span>
                         <h3 className="text-xl font-bold text-white font-serif">Verse Mapping</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Deconstruct a verse to understand its deeper meaning, history, and context.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                         <li>Select a verse.</li>
                         <li>Write out different translations (KJV, ESV, NIV).</li>
                         <li>Circle key words and look up Hebrew/Greek definitions.</li>
                         <li>Write a personal application summary.</li>
                      </ul>
                   </div>

                   {/* Activity 3 */}
                   <div className="bg-gray-900 border border-gray-600 p-6 rounded-lg hover:border-yellow-500 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                         <span className="text-3xl">🚶</span>
                         <h3 className="text-xl font-bold text-white font-serif">Prayer Walk</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Intercede for your community while physically walking through it.
                      </p>
                      <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                         <li>Walk your neighborhood.</li>
                         <li>Pray for each house you pass.</li>
                         <li>Ask God to bless the schools and businesses.</li>
                         <li>Listen for spiritual promptings.</li>
                      </ul>
                   </div>

                   {/* Activity 4 */}
                   <div className="bg-gray-900 border border-gray-600 p-6 rounded-lg hover:border-yellow-500 transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                         <span className="text-3xl">🧩</span>
                         <h3 className="text-xl font-bold text-white font-serif">Scripture Scavenger Hunt</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        Find objects in your home that represent biblical truths. Great for families!
                      </p>
                      <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                         <li>Find something <strong>rock</strong> hard (Psalm 18:2).</li>
                         <li>Find something <strong>light</strong> giving (Psalm 119:105).</li>
                         <li>Find something with <strong>bread</strong> (John 6:35).</li>
                         <li>Find water (John 4:14).</li>
                      </ul>
                   </div>
                </div>

                <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/30 text-center mt-6">
                   <h3 className="text-blue-300 font-retro mb-2">Want to lead a group?</h3>
                   <p className="text-gray-400 text-sm">
                      Check the <button onClick={() => setActiveTab('faq')} className="text-white underline">FAQ</button> for resources on starting a digital small group in The Journey.
                   </p>
                </div>
             </div>
           )}

           {/* TAB: LORE */}
           {activeTab === 'lore' && (
             <div className="space-y-6 animate-fade-in">
                <h2 className="text-3xl font-retro text-yellow-400 mb-6">The Realms</h2>
                
                {GAMES.map(game => (
                  <div key={game.id} className="flex flex-col md:flex-row gap-4 bg-gray-900/50 p-4 rounded-lg border border-gray-600">
                     <div className="w-full md:w-32 h-32 bg-black rounded overflow-hidden shrink-0">
                        <img src={game.image} className="w-full h-full object-cover opacity-80" />
                     </div>
                     <div>
                        <h3 className="text-xl text-white font-retro mb-1">{game.title}</h3>
                        <p className="text-sm text-gray-300 font-serif mb-3">{game.description}</p>
                        <div className="flex gap-2">
                           <span className="text-[10px] bg-blue-900 text-blue-200 px-2 py-1 rounded">
                             {game.levels.length} Chapters
                           </span>
                           <span className="text-[10px] bg-purple-900 text-purple-200 px-2 py-1 rounded">
                             Difficulty: Normal
                           </span>
                        </div>
                     </div>
                  </div>
                ))}

                <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded">
                   <h3 className="font-retro text-yellow-500 text-sm mb-2">THE BACKSTORY</h3>
                   <p className="text-xs text-yellow-200/80 font-mono leading-relaxed">
                      "In the digital age, the ancient texts became fragmented data. The Journey Project was initiated to reconstruct the spiritual history of humanity within the Voxel Verse. We are the digital pilgrims, re-walking the paths of the ancients to recover the lost code of the soul."
                   </p>
                </div>
             </div>
           )}

           {/* TAB: JOURNEY TV */}
           {activeTab === 'tv' && (
             <div className="space-y-8 animate-fade-in">
                <div className="relative rounded-xl overflow-hidden border-4 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.3)]">
                   <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10"></div>
                   <img src="https://image.pollinations.ai/prompt/pixel%20art%20tv%20studio%20broadcast%20christian?width=800&height=300&nologo=true" className="w-full h-48 object-cover opacity-60" />
                   <div className="absolute bottom-0 left-0 p-6 z-20">
                      <h2 className="text-3xl md:text-4xl font-retro text-white mb-2 text-shadow-md">THE GOSPEL LIVE</h2>
                      <p className="text-red-300 font-mono text-sm">Streaming to the ends of the earth.</p>
                   </div>
                </div>

                <div>
                   <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                   <p className="text-gray-300 leading-relaxed font-serif text-lg">
                      Journey TV is set to become one of the world's largest free streaming platforms dedicated to the Gospel. 
                      In an age of noise, we broadcast the frequency of Truth. We are building a global network to spread the message of hope, redemption, and love to every digital corner of the world.
                   </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="bg-gray-900 p-4 rounded border-l-4 border-red-500">
                      <h4 className="text-white font-bold mb-1">🔴 Live Streams</h4>
                      <p className="text-sm text-gray-400">24/7 Worship and Prayer rooms connecting believers globally in real-time.</p>
                   </div>
                   <div className="bg-gray-900 p-4 rounded border-l-4 border-blue-500">
                      <h4 className="text-white font-bold mb-1">🎤 Interviews</h4>
                      <p className="text-sm text-gray-400">Deep dives with theologians, musicians, and missionaries from the field.</p>
                   </div>
                   <div className="bg-gray-900 p-4 rounded border-l-4 border-yellow-500">
                      <h4 className="text-white font-bold mb-1">🎵 Music</h4>
                      <p className="text-sm text-gray-400">Premieres of new Christian lo-fi, worship, and gospel tracks.</p>
                   </div>
                   <div className="bg-gray-900 p-4 rounded border-l-4 border-purple-500">
                      <h4 className="text-white font-bold mb-1">🎬 Original Programs</h4>
                      <p className="text-sm text-gray-400">Animated bible stories and youth-focused spiritual content.</p>
                   </div>
                </div>

                <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl text-center">
                   <h3 className="font-retro text-red-400 mb-2">ON AIR NOW</h3>
                   <p className="text-gray-400 text-sm mb-6">Join the live chat and fellowship with other pilgrims.</p>
                   
                   {onNavigate ? (
                     <button 
                       onClick={() => onNavigate(AppView.TV)}
                       className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded shadow-[0_0_15px_rgba(220,38,38,0.6)] hover:shadow-[0_0_25px_rgba(220,38,38,0.8)] transition-all transform hover:scale-105 font-retro"
                     >
                       TUNE IN TO JOURNEY TV
                     </button>
                   ) : (
                     <div className="text-red-500">TV Module Unavailable</div>
                   )}
                </div>
             </div>
           )}

           {/* TAB: ARCHETYPES */}
           {activeTab === 'archetypes' && (
             <div className="animate-fade-in">
                <h2 className="text-3xl font-retro text-yellow-400 mb-6">Character Archetypes</h2>
                <p className="text-gray-300 mb-6">
                  Your identity in the Journey affects how you are perceived in the community.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {ARCHETYPES.map((arch) => (
                      <div key={arch.name} className="flex items-center gap-4 bg-gray-900 p-3 rounded border border-gray-700 hover:border-yellow-500 transition-colors">
                         <div className="text-3xl bg-black w-12 h-12 flex items-center justify-center rounded-full border border-gray-600">
                           {arch.icon}
                         </div>
                         <div>
                            <h4 className="text-white font-bold font-serif">{arch.name}</h4>
                            <span className="text-[10px] uppercase text-yellow-600 tracking-wider font-bold block mb-1">{arch.role}</span>
                            <p className="text-xs text-gray-400">{arch.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </div>
           )}

           {/* TAB: ECONOMY */}
           {activeTab === 'economy' && (
             <div className="space-y-6 animate-fade-in">
                <h2 className="text-3xl font-retro text-green-400 mb-6">Spiritual Economy</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                   <div className="bg-gray-900 p-4 rounded text-center border-t-4 border-yellow-500">
                      <div className="text-3xl mb-2">⚡</div>
                      <h3 className="font-bold text-white">XP (Spirit)</h3>
                      <p className="text-xs text-gray-400 mt-2">Earned by completing levels, praying, and engaging in chat.</p>
                   </div>
                   <div className="bg-gray-900 p-4 rounded text-center border-t-4 border-blue-500">
                      <div className="text-3xl mb-2">🎖️</div>
                      <h3 className="font-bold text-white">Badges</h3>
                      <p className="text-xs text-gray-400 mt-2">Unique honors for specific milestones (e.g., 7-day streak).</p>
                   </div>
                   <div className="bg-gray-900 p-4 rounded text-center border-t-4 border-green-500">
                      <div className="text-3xl mb-2">🪙</div>
                      <h3 className="font-bold text-white">$JOURNEY</h3>
                      <p className="text-xs text-gray-400 mt-2">Community utility token on Solana. Governance & Premium features.</p>
                   </div>
                </div>

                <h3 className="text-xl font-retro text-white mb-4">Badge Index</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                   {BADGES.map(badge => (
                     <div key={badge.id} className="flex items-center gap-3 bg-black/40 p-2 rounded border border-gray-700">
                        <div className="text-2xl">{badge.icon}</div>
                        <div>
                           <div className="text-sm font-bold text-gray-200">{badge.name}</div>
                           <div className="text-[10px] text-gray-500">{badge.description}</div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
           )}

           {/* TAB: FAQ */}
           {activeTab === 'faq' && (
             <div className="animate-fade-in space-y-6">
                <h2 className="text-3xl font-retro text-red-400 mb-6">Support & FAQ</h2>

                <div className="space-y-4">
                   <div className="bg-gray-900 p-4 rounded border-l-2 border-gray-500">
                      <h4 className="text-white font-bold text-sm">Is this app free?</h4>
                      <p className="text-gray-400 text-xs mt-1">Yes! The core journey is completely free. We use a "Simulation Mode" if no API key is provided, or you can connect your own.</p>
                   </div>
                   <div className="bg-gray-900 p-4 rounded border-l-2 border-gray-500">
                      <h4 className="text-white font-bold text-sm">How do I save progress?</h4>
                      <p className="text-gray-400 text-xs mt-1">Progress is saved automatically to your device's local storage. Do not clear your browser cache if you want to keep your save.</p>
                   </div>
                   <div className="bg-gray-900 p-4 rounded border-l-2 border-gray-500">
                      <h4 className="text-white font-bold text-sm">Can I play offline?</h4>
                      <p className="text-gray-400 text-xs mt-1">Yes, the Simulation Mode works without an internet connection once the app is loaded.</p>
                   </div>
                </div>

                <div className="mt-8 bg-blue-900/30 p-6 rounded-xl border-2 border-blue-500 text-center">
                   <h3 className="font-retro text-white mb-2">Still need help?</h3>
                   <p className="text-sm text-blue-200 mb-4">Our prayer team and support staff are available.</p>
                   
                   {onNavigate ? (
                     <button 
                       onClick={() => onNavigate(AppView.SUPPORT)}
                       className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded transition-colors"
                     >
                       Contact Support
                     </button>
                   ) : (
                     <a 
                       href="mailto:support@journeyapp.com"
                       className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded transition-colors"
                     >
                       Email Support
                     </a>
                   )}
                </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};

export default WikiView;
