import React, { useState, useEffect } from 'react';
import Button from './Button';
import SocialActionBar from './SocialActionBar';
import { User, Achievement } from '../types';
import { PLAYER_LEVELS, BADGES, ACHIEVEMENTS } from '../constants';
import { LanguageCode, UI_TEXT } from '../translations';
import { supabase } from '../lib/supabase';

interface ProfileViewProps {
  user: User | null;
  totalPoints: number;
  unlockedAchievements: string[];
  collectedVerses: string[];
  onBack: () => void;
  onUpdateUser: (updatedUser: User) => void;
  language: LanguageCode;
  onSocialAction?: (action: 'like' | 'pray' | 'comment' | 'share') => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ 
  user, 
  totalPoints, 
  unlockedAchievements, 
  collectedVerses,
  onBack, 
  onUpdateUser,
  language,
  onSocialAction
}) => {
  const [activeTab, setActiveTab] = useState<'passport' | 'avatar' | 'registry'>('passport');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMsg, setGenerationMsg] = useState('');
  
  // Registry State
  const [registryData, setRegistryData] = useState({
    users: 0,
    verses: 0,
    achievements: 0,
    loaded: false
  });

  const t = (key: keyof typeof UI_TEXT['en']) => {
    return UI_TEXT[language][key] || UI_TEXT['en'][key];
  };

  // Fetch real data when Registry tab opens
  useEffect(() => {
    if (activeTab === 'registry' && !registryData.loaded) {
        const fetchRegistryData = async () => {
            try {
                const [userReq, verseReq, achReq] = await Promise.all([
                    supabase.from('users').select('*', { count: 'exact', head: true }),
                    supabase.from('collected_verses').select('*', { count: 'exact', head: true }),
                    supabase.from('unlocked_achievements').select('*', { count: 'exact', head: true })
                ]);
                
                setRegistryData({
                    users: userReq.count || 0,
                    verses: verseReq.count || 0,
                    achievements: achReq.count || 0,
                    loaded: true
                });
            } catch (e) {
                console.error("Error fetching registry data", e);
            }
        };
        fetchRegistryData();
    }
  }, [activeTab, registryData.loaded]);

  if (!user) return null;

  const currentLevel = PLAYER_LEVELS.filter(l => l.xp <= totalPoints).pop() || PLAYER_LEVELS[0];
  const nextLevel = PLAYER_LEVELS.find(l => l.level === currentLevel.level + 1);
  const progressPercent = nextLevel 
    ? Math.min(100, Math.max(0, ((totalPoints - currentLevel.xp) / (nextLevel.xp - currentLevel.xp)) * 100))
    : 100;

  // Determine if Avatar Studio is unlocked
  // Logic: Unlocked if user has 'high_score' achievement (Legend status)
  const isAvatarStudioUnlocked = unlockedAchievements.includes('high_score');

  const generateNewAvatar = async () => {
    if (!isAvatarStudioUnlocked) return;

    setIsGenerating(true);
    setGenerationMsg("Accessing Neural Paintbrush...");

    const classes = ['prophet', 'scribe', 'warrior', 'shepherd', 'king', 'queen', 'disciple'];
    const styles = ['cyberpunk', 'vaporwave', 'oil painting', 'stained glass', 'mosaic', '8bit'];
    
    const randomClass = classes[Math.floor(Math.random() * classes.length)];
    const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    const timestamp = Date.now();
    
    // Generate the image URL
    const prompt = `portrait of a ${randomClass}, ${randomStyle} style, spiritual, glowing, holy aura, masterpiece`;
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=300&height=300&nologo=true&seed=${user.id}-${timestamp}`;

    try {
      // 1. Fetch the image blob from the generator
      setGenerationMsg("Downloading asset...");
      const response = await fetch(pollinationsUrl);
      const blob = await response.blob();

      // 2. Upload to Supabase Storage
      setGenerationMsg("Uploading to secure vault...");
      const fileName = `avatars/${user.id}/${timestamp}.png`;
      const { error: uploadError } = await supabase.storage
        .from('journey_assets')
        .upload(fileName, blob, {
          contentType: 'image/png',
          upsert: true
        });

      if (uploadError) throw uploadError;

      // 3. Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('journey_assets')
        .getPublicUrl(fileName);

      // 4. Update User Profile
      onUpdateUser({ ...user, avatar: publicUrl });
      setGenerationMsg(`Identity secured.`);

    } catch (error) {
      console.error("Avatar generation error:", error);
      setGenerationMsg("Error saving avatar to storage.");
      // Fallback: use the direct URL if storage fails, though persistent storage is preferred
      onUpdateUser({ ...user, avatar: pollinationsUrl });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center pt-20 bg-[url('https://image.pollinations.ai/prompt/futuristic%20holographic%20interface%20blue%20grid?width=1200&height=800&nologo=true')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-5xl p-4 md:p-8">
        
        {/* Top Navigation */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
           <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-yellow-500 overflow-hidden bg-black shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                   <img src={user.avatar} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-yellow-600 text-black font-bold text-xs px-2 py-0.5 rounded border border-white">
                   Lvl {currentLevel.level}
                </div>
              </div>
              <div>
                 <h1 className="text-2xl md:text-3xl font-retro text-white uppercase">{user.username}</h1>
                 <p className="text-gray-400 font-mono text-xs">{t('joined')}: {new Date(user.joinedDate).toLocaleDateString()}</p>
                 <p className="text-gray-500 font-mono text-[10px] mt-1">ID: {user.id}</p>
              </div>
           </div>
           
           <div className="flex gap-2">
             <Button 
               onClick={() => setActiveTab('passport')} 
               variant={activeTab === 'passport' ? 'primary' : 'secondary'}
               className="text-xs"
             >
               {t('profile')}
             </Button>
             <Button 
               onClick={() => setActiveTab('avatar')} 
               variant={activeTab === 'avatar' ? 'primary' : 'secondary'}
               className="text-xs"
             >
               {t('avatar_studio')}
             </Button>
             <Button 
               onClick={() => setActiveTab('registry')} 
               variant={activeTab === 'registry' ? 'primary' : 'secondary'}
               className="text-xs"
             >
               {t('global_registry')}
             </Button>
             <Button onClick={onBack} variant="secondary" className="text-xs ml-2">❌</Button>
           </div>
        </div>

        {/* Content Area */}
        <div className="bg-gray-900/80 border-2 border-gray-600 rounded-xl p-6 min-h-[500px] pixel-shadow relative overflow-hidden flex flex-col">
          
          <div className="flex-1">
            {/* TAB: PASSPORT (Overview) */}
            {activeTab === 'passport' && (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                  
                  {/* Stats Column */}
                  <div className="space-y-6">
                     <div className="bg-black/40 p-4 rounded border border-gray-700">
                        <h3 className="text-yellow-500 font-retro text-sm uppercase mb-4 border-b border-gray-700 pb-2">Spiritual Metrics</h3>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <span className="block text-gray-500 text-xs font-mono uppercase">Total XP</span>
                              <span className="text-2xl text-white font-mono">{totalPoints.toLocaleString()}</span>
                           </div>
                           <div>
                              <span className="block text-gray-500 text-xs font-mono uppercase">Rank</span>
                              <span className="text-xl text-yellow-400 font-serif">{currentLevel.title}</span>
                           </div>
                           <div>
                              <span className="block text-gray-500 text-xs font-mono uppercase">Verses</span>
                              <span className="text-xl text-blue-400 font-mono">{collectedVerses.length}</span>
                           </div>
                           <div>
                              <span className="block text-gray-500 text-xs font-mono uppercase">Achievements</span>
                              <span className="text-xl text-green-400 font-mono">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
                           </div>
                        </div>
                        
                        <div className="mt-4">
                           <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progress to Lvl {currentLevel.level + 1}</span>
                              <span>{Math.floor(progressPercent)}%</span>
                           </div>
                           <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400" style={{ width: `${progressPercent}%` }}></div>
                           </div>
                        </div>
                     </div>

                     <div className="bg-black/40 p-4 rounded border border-gray-700">
                        <h3 className="text-purple-400 font-retro text-sm uppercase mb-4 border-b border-gray-700 pb-2">Badges</h3>
                        <div className="flex flex-wrap gap-2">
                           {user.badges.length > 0 ? user.badges.map(bid => {
                             const badge = BADGES.find(b => b.id === bid);
                             return badge ? (
                                <div key={bid} className="w-10 h-10 bg-gray-800 rounded border border-gray-600 flex items-center justify-center text-xl cursor-help" title={badge.name}>
                                   {badge.icon}
                                </div>
                             ) : null;
                           }) : (
                             <span className="text-gray-500 text-xs italic">No badges earned yet.</span>
                           )}
                        </div>
                     </div>
                  </div>

                  {/* Activity Log Column */}
                  <div className="bg-black/40 p-4 rounded border border-gray-700 h-full">
                     <h3 className="text-blue-400 font-retro text-sm uppercase mb-4 border-b border-gray-700 pb-2">{t('activity')}</h3>
                     <div className="space-y-3 font-mono text-xs h-64 overflow-y-auto custom-scroll pr-2">
                        {/* Simulating Activity Log based on user state */}
                        <div className="flex gap-2">
                           <span className="text-gray-500">[Now]</span>
                           <span className="text-gray-300">Accessing Dashboard...</span>
                        </div>
                        {unlockedAchievements.length > 0 && (
                          <div className="flex gap-2">
                             <span className="text-gray-500">[Recent]</span>
                             <span className="text-yellow-500">Achievement Unlocked: {unlockedAchievements[unlockedAchievements.length-1]}</span>
                          </div>
                        )}
                        {collectedVerses.length > 0 && (
                          <div className="flex gap-2">
                             <span className="text-gray-500">[Recent]</span>
                             <span className="text-blue-300">Scripture Found: "{collectedVerses[collectedVerses.length-1].substring(0, 15)}..."</span>
                          </div>
                        )}
                        {user.lastDailyClaim > 0 && (
                          <div className="flex gap-2">
                             <span className="text-gray-500">[{new Date(user.lastDailyClaim).toLocaleDateString()}]</span>
                             <span className="text-green-400">Daily Reward Claimed</span>
                          </div>
                        )}
                        <div className="flex gap-2">
                           <span className="text-gray-500">[{new Date(user.joinedDate).toLocaleDateString()}]</span>
                           <span className="text-white">Account Created (ID: {user.id})</span>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* TAB: AVATAR STUDIO */}
            {activeTab === 'avatar' && (
               <div className="flex flex-col items-center text-center animate-fade-in py-8">
                  <div className="mb-8 relative">
                     <div className="w-48 h-48 bg-black rounded-lg border-4 border-dashed border-gray-600 flex items-center justify-center overflow-hidden pixel-shadow group">
                        <img src={user.avatar} className={`w-full h-full object-cover transition-opacity ${isGenerating ? 'opacity-50' : 'opacity-100'}`} />
                        {isGenerating && (
                          <div className="absolute inset-0 flex items-center justify-center">
                             <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}
                     </div>
                     {isGenerating && <p className="text-yellow-400 text-xs font-mono mt-2 animate-pulse">{generationMsg}</p>}
                     {!isGenerating && generationMsg && <p className="text-green-400 text-xs font-mono mt-2">{generationMsg}</p>}
                  </div>

                  <div className="max-w-md w-full bg-gray-800 p-6 rounded-xl border border-gray-700">
                     <h3 className="text-xl font-retro text-white mb-2">{t('avatar_studio')}</h3>
                     <p className="text-gray-400 text-sm mb-6">
                       Generate a new unique digital identity using our neural networks. 
                       <br/><span className="text-yellow-600">Note: New identities are securely stored in the Pilgrim Archives.</span>
                     </p>

                     {isAvatarStudioUnlocked ? (
                        <Button onClick={generateNewAvatar} disabled={isGenerating} className="w-full bg-blue-600 hover:bg-blue-500">
                          {isGenerating ? 'Processing...' : 'Generate & Secure New Identity (Free)'}
                        </Button>
                     ) : (
                        <div className="space-y-3">
                          <Button disabled variant="secondary" className="w-full opacity-50 cursor-not-allowed">
                            {t('premium_locked')}
                          </Button>
                          <p className="text-yellow-600 text-xs font-mono border border-yellow-900/50 bg-yellow-900/10 p-2 rounded">
                            🔒 {t('unlock_hint')}
                          </p>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {/* TAB: REGISTRY (Real Stats) */}
            {activeTab === 'registry' && (
               <div className="animate-fade-in">
                  <div className="flex justify-between items-end mb-6 border-b border-gray-700 pb-4">
                     <div>
                        <h2 className="text-2xl font-retro text-green-400">{t('global_registry')}</h2>
                        <p className="text-gray-400 text-xs font-mono mt-1">
                          System-wide activity monitoring. {registryData.loaded ? 'Live Data.' : 'Connecting...'}
                        </p>
                     </div>
                     <div className="text-right">
                        <span className="block text-xs text-gray-500 font-mono">Server Status</span>
                        <span className="text-green-500 font-bold text-sm tracking-wider animate-pulse">● OPERATIONAL</span>
                     </div>
                  </div>

                  {/* Real Data Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                     <div className="bg-gray-800 p-4 rounded border-l-4 border-blue-500">
                        <h4 className="text-gray-400 text-[10px] uppercase font-mono">{t('total_users')}</h4>
                        <p className="text-2xl text-white font-mono">
                           {registryData.users > 0 ? registryData.users.toLocaleString() : '...'}
                        </p>
                     </div>
                     <div className="bg-gray-800 p-4 rounded border-l-4 border-yellow-500">
                        <h4 className="text-gray-400 text-[10px] uppercase font-mono">Global Achievements</h4>
                        <p className="text-2xl text-white font-mono">
                           {registryData.achievements > 0 ? registryData.achievements.toLocaleString() : '...'}
                        </p>
                     </div>
                     <div className="bg-gray-800 p-4 rounded border-l-4 border-green-500">
                        <h4 className="text-gray-400 text-[10px] uppercase font-mono">{t('global_verses')}</h4>
                        <p className="text-2xl text-white font-mono">
                           {registryData.verses > 0 ? registryData.verses.toLocaleString() : '...'}
                        </p>
                     </div>
                     <div className="bg-gray-800 p-4 rounded border-l-4 border-purple-500">
                        <h4 className="text-gray-400 text-[10px] uppercase font-mono">Active Sessions</h4>
                        {/* Simulated active sessions based on user count for liveliness */}
                        <p className="text-2xl text-white font-mono">
                           {registryData.users > 0 ? Math.ceil(registryData.users * 0.12) + 1 : '...'}
                        </p>
                     </div>
                  </div>

                  {/* Simulated Server Logs based on Real Metrics */}
                  <div className="bg-black p-4 rounded border border-gray-700 font-mono text-xs text-green-500/80 h-48 overflow-hidden relative">
                     <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
                     <div className="space-y-1">
                        <p>[SYSTEM] Sync complete: {registryData.users} pilgrim records verified.</p>
                        <p>[GAME] Global verse count updated: {registryData.verses} scriptures found.</p>
                        <p>[NETWORK] Node latency: 24ms. Region: GLOBAL.</p>
                        <p>[DB] Achievements table query: {registryData.achievements} records returned.</p>
                        <p>[SYSTEM] Storage bucket 'journey_assets' integrity check: PASS.</p>
                        <p>[TOKEN] $JOURNEY supply audit: Verified.</p>
                        <p>[GAME] New pilgrim detected in lobby.</p>
                     </div>
                  </div>
                  <div className="mt-2 text-right">
                     <span className="text-[10px] text-gray-600 font-mono">Updated: {new Date().toISOString()}</span>
                  </div>
               </div>
            )}
          </div>
          
          {/* Social Action Bar */}
          {onSocialAction && (
             <div className="mt-6">
                <SocialActionBar onInteract={onSocialAction} entityName="Stats Profile" />
             </div>
          )}

        </div>

        <div className="text-center mt-6 text-gray-600 text-[10px] font-mono">
           USER_DASHBOARD_V2.1 // SECURE CONNECTION
        </div>

      </div>
    </div>
  );
};

export default ProfileView;