
import React, { useState, useEffect } from 'react';
import { AppView, GameState, GameModeId, User, Achievement, SupportTicket, BiblePlan } from './types';
import { GAMES, ACHIEVEMENTS, PLAYER_LEVELS, BADGES, DEFAULT_PLANS } from './constants';
import { UI_TEXT, LanguageCode } from './translations';
import { AudioSystem } from './utils/audio';
import { supabase } from './lib/supabase';
import LevelMap from './components/LevelMap';
import GameView from './components/GameView';
import JournalView from './components/JournalView';
import DevotionalView from './components/DevotionalView';
import PlansView from './components/PlansView';
import JourneyTVView from './components/JourneyTVView';
import GameLibraryView from './components/GameLibraryView';
import BibleReaderView from './components/BibleReaderView';
import AuthView from './components/AuthView';
import LeaderboardView from './components/LeaderboardView';
import AchievementPopup from './components/AchievementPopup';
import LevelUpModal from './components/LevelUpModal';
import DailyRewardModal from './components/DailyRewardModal';
import WikiView from './components/WikiView';
import TokenLaunchView from './components/TokenLaunchView';
import ProfileView from './components/ProfileView';
import SupportView from './components/SupportView';
import AdminView from './components/AdminView';
import Button from './components/Button';

const FloatingHomeButton = ({ onClick }: { onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="fixed bottom-6 left-6 z-[90] w-14 h-14 bg-yellow-600 text-white rounded-full border-4 border-gray-900 shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center justify-center text-2xl hover:bg-yellow-500 hover:scale-110 transition-all active:scale-95 animate-bounce-slow"
    aria-label="Home"
    title="Return Home"
  >
    🏠
  </button>
);

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>({
    user: null,
    totalPoints: 0,
    activeGameId: 'pilgrim',
    progress: { pilgrim: 1, david: 1, paul: 1 },
    view: AppView.AUTH, // Start at Auth
    chatHistory: {},
    collectedVerses: [],
    unlockedAchievements: [],
    language: 'en',
    supportTickets: [],
    plans: DEFAULT_PLANS,
    rank: 0
  });

  const [notification, setNotification] = useState<Achievement | null>(null);
  const [showLevelUp, setShowLevelUp] = useState<{level: number, title: string} | null>(null);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // --- SUPABASE DATA LOADING ---
  const loadUserData = async (userId: string, currentPoints: number) => {
    setIsLoadingData(true);
    try {
      // 1. Progress
      const { data: progressData } = await supabase.from('user_progress').select('*').eq('user_id', userId);
      const newProgress = { ...gameState.progress };
      progressData?.forEach((p: any) => {
        newProgress[p.game_id as GameModeId] = p.level_id;
      });

      // 2. Verses
      const { data: verseData } = await supabase.from('collected_verses').select('verse_text').eq('user_id', userId);
      const verses = verseData?.map((v: any) => v.verse_text) || [];

      // 3. Achievements
      const { data: achData } = await supabase.from('unlocked_achievements').select('achievement_id').eq('user_id', userId);
      const achievements = achData?.map((a: any) => a.achievement_id) || [];

      // 4. Plans
      const { data: planData } = await supabase.from('user_plans').select('*').eq('user_id', userId);
      // Merge DB plans with default plans (keeping DB version if exists)
      let finalPlans = [...DEFAULT_PLANS];
      
      if (planData && planData.length > 0) {
         // Map DB snake_case to camelCase plan objects
         const dbPlans: BiblePlan[] = planData.map((p: any) => ({
            id: p.id,
            title: p.title,
            desc: p.description,
            category: p.category,
            image: p.image,
            duration: p.duration,
            progress: p.progress,
            isActive: p.is_active,
            startDate: p.start_date,
            endDate: p.end_date,
            days: p.days_json || [] // Safety check for null JSON
         }));

         const dbIds = new Set(dbPlans.map(p => p.id));
         const unstartedDefaults = DEFAULT_PLANS.filter(dp => !dbIds.has(dp.id));
         finalPlans = [...dbPlans, ...unstartedDefaults];
      }

      // 5. Support Tickets
      const { data: ticketData } = await supabase.from('support_tickets').select('*').eq('user_id', userId);
      const tickets: SupportTicket[] = ticketData?.map((t: any) => ({
         id: t.id,
         subject: t.subject,
         category: t.category,
         status: t.status,
         createdAt: t.created_at,
         lastUpdated: t.last_updated,
         messages: t.messages_json || []
      })) || [];

      // 6. Calculate Rank (Count users with MORE points than current user)
      const { count: higherRankedUsers } = await supabase
        .from('users')
        .select('id', { count: 'exact', head: true })
        .gt('total_points', currentPoints);
        
      const realRank = (higherRankedUsers || 0) + 1;

      setGameState(prev => ({
        ...prev,
        progress: newProgress,
        collectedVerses: verses,
        unlockedAchievements: achievements,
        plans: finalPlans,
        supportTickets: tickets,
        rank: realRank
      }));

    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Check Daily Reward on User State Change
  useEffect(() => {
    if (gameState.user && gameState.view === AppView.LANDING) {
       const now = Date.now();
       const ONE_DAY_MS = 24 * 60 * 60 * 1000;
       
       if (now - gameState.user.lastDailyClaim > ONE_DAY_MS) {
         setShowDailyReward(true);
       }
    }
  }, [gameState.user, gameState.view]);

  // Helper for UI Text
  const t = (key: keyof typeof UI_TEXT['en']) => {
    return UI_TEXT[gameState.language][key] || UI_TEXT['en'][key];
  };

  const handleNav = (view: AppView) => {
    setGameState(prev => ({ ...prev, view }));
    // Initialize audio context on navigation to ensure it's ready
    AudioSystem.init();
  };

  const handleLogin = async (user: User, language: LanguageCode) => {
    // Re-fetch profile to get Role and exact Points
    const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();
    
    const updatedUser = { ...user, role: profile?.role || 'user' };
    const points = profile?.total_points || 0;

    setGameState(prev => ({
      ...prev,
      user: updatedUser,
      language,
      totalPoints: points,
      view: AppView.LANDING
    }));
    
    loadUserData(user.id, points);
    AudioSystem.init();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setGameState(prev => ({
      ...prev,
      user: null,
      view: AppView.AUTH,
      plans: DEFAULT_PLANS,
      rank: 0
    }));
  };

  const handleUpdateUser = async (updatedUser: User) => {
    setGameState(prev => ({ ...prev, user: updatedUser }));
    // Sync to DB
    if (gameState.user) {
        await supabase.from('users').update({
            avatar: updatedUser.avatar,
            username: updatedUser.username
        }).eq('id', gameState.user.id);
    }
  };

  const handleGameSelect = (gameId: GameModeId) => {
    setGameState(prev => ({
      ...prev,
      activeGameId: gameId,
      view: AppView.MAP
    }));
  };

  const handleClaimDaily = async () => {
    if (!gameState.user) return;
    
    const now = Date.now();
    // Add 10 points locally
    addPoints(10);
    AudioSystem.playAchievement();
    
    // Update local state
    const updatedUser = {
      ...gameState.user,
      lastDailyClaim: now
    };
    
    setGameState(prev => ({
      ...prev,
      user: updatedUser
    }));
    
    // Sync to DB
    await supabase.from('users').update({ last_daily_claim: now }).eq('id', gameState.user.id);
    
    setShowDailyReward(false);
  };

  // --- SUPPORT SYSTEM ---
  const handleCreateTicket = async (ticket: SupportTicket) => {
    if (!gameState.user) return;

    // Optimistic UI Update
    setGameState(prev => ({
      ...prev,
      supportTickets: [ticket, ...prev.supportTickets]
    }));

    // Sync to DB
    await supabase.from('support_tickets').insert([{
        id: ticket.id,
        user_id: gameState.user.id,
        subject: ticket.subject,
        category: ticket.category,
        status: ticket.status,
        created_at: ticket.createdAt,
        last_updated: ticket.lastUpdated,
        messages_json: ticket.messages
    }]);

    // Simulate Agent Response
    setTimeout(async () => {
       const responseText = "Hello! Thank you for reaching out to Journey Support. A member of our team has received your request and will review it shortly. God bless!";
       
       setGameState(current => {
         const updatedTickets = current.supportTickets.map(t => {
           if (t.id === ticket.id) {
             const updatedT = {
               ...t,
               status: 'in_progress' as const,
               lastUpdated: Date.now(),
               messages: [...t.messages, {
                 id: `msg-${Date.now()}`,
                 sender: 'agent' as const,
                 text: responseText,
                 timestamp: Date.now()
               }]
             };
             supabase.from('support_tickets').update({
                 status: 'in_progress',
                 last_updated: Date.now(),
                 messages_json: updatedT.messages
             }).eq('id', ticket.id).then();
             return updatedT;
           }
           return t;
         });
         return { ...current, supportTickets: updatedTickets };
       });
       AudioSystem.playMessage();
    }, 5000);
  };

  // --- PLANS SYSTEM ---
  const handleUpdatePlans = async (newPlans: BiblePlan[]) => {
    setGameState(prev => ({
      ...prev,
      plans: newPlans
    }));

    if (!gameState.user) return;

    for (const plan of newPlans) {
        if (plan.isActive || plan.category === 'Custom') {
            await supabase.from('user_plans').upsert({
                id: plan.id,
                user_id: gameState.user.id,
                title: plan.title,
                description: plan.desc,
                category: plan.category,
                image: plan.image,
                duration: plan.duration,
                progress: plan.progress,
                is_active: plan.isActive,
                start_date: plan.startDate,
                end_date: plan.endDate,
                days_json: plan.days,
                updated_at: new Date().toISOString()
            });
        }
    }
  };

  // --- PROGRESSION LOGIC ---

  const checkLevelUp = (currentPoints: number, newPoints: number) => {
     const currentLevel = PLAYER_LEVELS.filter(l => l.xp <= currentPoints).pop();
     const nextLevel = PLAYER_LEVELS.filter(l => l.xp <= newPoints).pop();

     if (currentLevel && nextLevel && nextLevel.level > currentLevel.level) {
       setShowLevelUp({ level: nextLevel.level, title: nextLevel.title });
       setTimeout(() => AudioSystem.playAchievement(), 500); 
     }
  };

  const unlockAchievement = async (id: string) => {
    if (gameState.unlockedAchievements.includes(id)) return;

    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    if (!achievement) return;

    setNotification(achievement);
    AudioSystem.playAchievement();
    
    const newTotal = gameState.totalPoints + achievement.xpReward;
    
    setGameState(prev => ({
      ...prev,
      unlockedAchievements: [...prev.unlockedAchievements, id],
      totalPoints: newTotal
    }));
    
    if (gameState.user) {
        await supabase.from('unlocked_achievements').insert({
            user_id: gameState.user.id,
            achievement_id: id
        });
        await supabase.from('users').update({ total_points: newTotal }).eq('id', gameState.user.id);
    }
    
    checkLevelUp(gameState.totalPoints, newTotal);
  };

  const addPoints = async (amount: number) => {
    const oldPoints = gameState.totalPoints;
    const newPoints = oldPoints + amount;
    
    setGameState(prev => ({ ...prev, totalPoints: newPoints }));
    
    if (gameState.user) {
        await supabase.from('users').update({ total_points: newPoints }).eq('id', gameState.user.id);
    }

    checkLevelUp(oldPoints, newPoints);
    if (newPoints >= 1000) unlockAchievement('high_score');
  };

  const handleSocialInteraction = async (action: 'like' | 'pray' | 'comment' | 'share') => {
    AudioSystem.playVoxelTap();
    let points = 5;
    if (action === 'share' || action === 'comment') points = 10;
    
    addPoints(points);
    if (action === 'comment') unlockAchievement('socialite'); 

    if (gameState.user) {
        const entity = gameState.view; 
        try {
            await supabase.from('social_interactions').insert({
                user_id: gameState.user.id,
                action_type: action,
                entity_context: entity
            });
        } catch (e) {
            console.error("Failed to record social interaction", e);
        }
    }
  };

  // --- EVENT HANDLERS ---

  const activeGame = GAMES.find(g => g.id === gameState.activeGameId) || GAMES[0];
  const [playingLevelId, setPlayingLevelId] = useState<number>(1);

  const onLevelSelectWrapper = (levelId: number) => {
    setPlayingLevelId(levelId);
    handleNav(AppView.GAME);
  };

  const handleLevelComplete = async (verse: string) => {
    const currentProgress = gameState.progress[gameState.activeGameId];
    const nextLevelId = playingLevelId + 1;
    const isVictory = nextLevelId > activeGame.levels.length;
    
    const newVerses = gameState.collectedVerses.includes(verse) 
      ? gameState.collectedVerses 
      : [...gameState.collectedVerses, verse];

    const newProgressVal = Math.max(currentProgress, nextLevelId);
    
    setGameState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [prev.activeGameId]: newProgressVal
      },
      collectedVerses: newVerses,
      view: isVictory ? AppView.VICTORY : AppView.MAP
    }));

    if (newProgressVal > currentProgress || !gameState.collectedVerses.includes(verse)) {
        addPoints(100);
    }

    if (gameState.user) {
        await supabase.from('user_progress').upsert({
            user_id: gameState.user.id,
            game_id: gameState.activeGameId,
            level_id: newProgressVal
        });

        if (!gameState.collectedVerses.includes(verse)) {
            await supabase.from('collected_verses').insert({
                user_id: gameState.user.id,
                verse_text: verse
            });
        }
    }
    
    unlockAchievement('first_step');
    if (newVerses.length >= 5) unlockAchievement('prayer_warrior');
  };

  const handleBackToHome = () => handleNav(AppView.LANDING);
  const handleBackToLibrary = () => handleNav(AppView.GAME_LIBRARY);
  const handleBackToMap = () => handleNav(AppView.MAP);

  const getCurrentPlayerLevel = () => {
    return PLAYER_LEVELS.filter(l => l.xp <= gameState.totalPoints).pop() || PLAYER_LEVELS[0];
  };

  const StatusBar = () => {
    if (!gameState.user) return null;
    const playerLvl = getCurrentPlayerLevel();

    return (
      <div className="fixed top-0 left-0 right-0 z-[60] flex justify-between items-center px-2 md:px-4 py-2 bg-black/90 border-b border-gray-800 text-xs font-mono pointer-events-none backdrop-blur-sm shadow-xl">
         <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
            <div 
               onClick={() => handleNav(AppView.PROFILE)}
               className="w-8 h-8 md:w-10 md:h-10 rounded border-2 border-yellow-700 overflow-hidden relative shadow-lg group cursor-pointer hover:scale-110 transition-transform"
               title="Open Profile"
            >
               <img src={gameState.user.avatar} className="w-full h-full object-cover" />
               <div className="absolute bottom-0 right-0 bg-yellow-600 text-[8px] px-1 font-bold text-black leading-tight">
                 {playerLvl.level}
               </div>
            </div>
            <div className="flex flex-col">
               <span 
                 onClick={() => handleNav(AppView.PROFILE)}
                 className="text-gray-100 font-bold truncate max-w-[100px] md:max-w-none cursor-pointer hover:text-yellow-400"
               >
                 {gameState.user.username}
               </span>
               <span className="text-yellow-500 text-[9px] md:text-[10px] uppercase">{playerLvl.title}</span>
            </div>
         </div>
         <div className="flex items-center gap-2 md:gap-4">
             {gameState.user.role === 'admin' && (
               <button 
                 onClick={() => handleNav(AppView.ADMIN)}
                 className="pointer-events-auto bg-red-900 border border-red-600 text-white text-[9px] px-2 py-1 rounded animate-pulse hover:bg-red-800"
               >
                 ADMIN
               </button>
             )}
             <div className="text-right">
                <div className="text-yellow-400 font-retro text-[10px] md:text-xs">{gameState.totalPoints.toLocaleString()} XP</div>
                <div className="w-16 md:w-24 h-2 bg-gray-800 mt-1 rounded-full overflow-hidden border border-gray-600">
                   <div 
                     className="h-full bg-gradient-to-r from-blue-600 to-blue-400" 
                     style={{ width: `${(gameState.totalPoints % 1000) / 10}%` }} 
                   ></div>
                </div>
             </div>
             {gameState.view === AppView.LANDING && (
               <button onClick={handleLogout} className="text-red-500 hover:text-red-300 pointer-events-auto border border-red-900/50 px-2 py-1 rounded bg-black/50 hover:bg-red-900/20 transition-colors">
                  {t('exit')}
               </button>
             )}
         </div>
      </div>
    );
  };

  const showFloatingHome = 
    gameState.user && 
    gameState.view !== AppView.AUTH && 
    gameState.view !== AppView.LANDING && 
    gameState.view !== AppView.GAME && 
    gameState.view !== AppView.TV &&
    gameState.view !== AppView.PROFILE &&
    gameState.view !== AppView.SUPPORT &&
    gameState.view !== AppView.ADMIN;

  return (
    <>
      <AchievementPopup achievement={notification} onClose={() => setNotification(null)} />
      {showLevelUp && <LevelUpModal level={showLevelUp.level} title={showLevelUp.title} onClose={() => setShowLevelUp(null)} />}
      
      {showDailyReward && <DailyRewardModal onClaim={handleClaimDaily} />}
      
      {showFloatingHome && <FloatingHomeButton onClick={handleBackToHome} />}
      
      {gameState.view !== AppView.GAME && <StatusBar />}
      
      {gameState.view === AppView.AUTH && <AuthView onLogin={handleLogin} />}

      {/* Landing View */}
      {gameState.view === AppView.LANDING && (
        <div className="min-h-screen bg-[#2a2420] flex flex-col items-center pt-20 p-4 md:p-8 relative overflow-hidden">
          
          <div className="absolute inset-0 bg-[url('https://image.pollinations.ai/prompt/pixel%20art%20ancient%20biblical%20map%20middle%20east%20parchment%20texture%20mountains%20rivers?width=1200&height=800&nologo=true')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-amber-900/20 to-black/90"></div>
          
          <div className="relative z-10 w-full max-w-5xl mb-8 flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
             <div className="text-left animate-slide-in">
                 <h1 className="text-4xl md:text-6xl font-retro text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[4px_4px_0_rgba(0,0,0,1)] tracking-tighter animate-glow">
                   THE JOURNEY
                 </h1>
                 <p className="text-blue-300 text-sm md:text-xl font-cinzel tracking-[0.2em] mt-2">Faith • Adventure • Spirit</p>
             </div>
             
             <div className="flex gap-4">
               <a href="https://x.com/yourjourneyapp" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" title="Follow us on X">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>
               </a>
             </div>
          </div>

          <div className="relative z-10 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 grid-rows-auto gap-3 md:gap-4 pb-12">
              
              {/* Game Library */}
              <div 
                onClick={() => handleNav(AppView.GAME_LIBRARY)}
                className="col-span-2 md:col-span-2 row-span-2 bg-gradient-to-br from-blue-900 to-black rounded-2xl border-4 border-blue-600/50 hover:border-yellow-400 cursor-pointer transition-all hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] group relative overflow-hidden min-h-[250px] md:min-h-[300px]"
              >
                <div className="absolute inset-0 bg-[url('https://image.pollinations.ai/prompt/pixel%20art%20fantasy%20map%20adventure?width=600&height=400&nologo=true')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full">
                   <div className="bg-blue-600/90 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded inline-block mb-2 backdrop-blur-sm border border-blue-400">ARCADE MODE</div>
                   <h2 className="text-2xl md:text-4xl font-retro text-white mb-2 group-hover:text-yellow-300 transition-colors drop-shadow-md">{t('play')}</h2>
                   <p className="text-blue-100 font-serif text-sm md:text-base opacity-90">Enter the stories. Walk the ancient paths.</p>
                   <div className="mt-4 flex gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                      <span className="text-xs text-yellow-400 font-mono">3 Campaigns Available</span>
                   </div>
                </div>
              </div>

              {/* TV */}
              <div 
                onClick={() => handleNav(AppView.TV)}
                className="col-span-2 md:col-span-1 bg-black rounded-2xl border-4 border-gray-700 hover:border-red-500 cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden group min-h-[140px]"
              >
                <div className="absolute inset-0 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] opacity-20 bg-cover"></div>
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-4">
                  <div className="absolute top-3 right-3 flex items-center gap-1">
                     <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
                     <span className="text-[9px] text-red-500 font-bold uppercase">Live</span>
                  </div>
                  <div className="text-4xl md:text-5xl mb-2 group-hover:scale-110 transition-transform">📺</div>
                  <h3 className="text-lg font-retro text-white">{t('tv')}</h3>
                </div>
              </div>

              {/* Devotional */}
              <div 
                onClick={() => { handleNav(AppView.DEVOTIONAL); addPoints(10); unlockAchievement('devoted'); }}
                className="col-span-1 bg-stone-100 rounded-2xl border-4 border-stone-300 hover:border-orange-500 cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden group p-4 flex flex-col items-center justify-center text-center"
              >
                <div className="text-3xl md:text-4xl mb-2 group-hover:rotate-12 transition-transform">📖</div>
                <h3 className="text-sm md:text-lg font-bold font-serif text-stone-900 leading-tight">{t('devotional')}</h3>
                <span className="text-[10px] text-orange-600 font-bold mt-1">+10 XP</span>
              </div>

              {/* Bible */}
              <div 
                onClick={() => { handleNav(AppView.BIBLE); unlockAchievement('scholar'); }}
                className="col-span-1 bg-red-900 rounded-2xl border-4 border-red-700 hover:border-red-400 cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden group p-4 flex flex-col items-center justify-center text-center"
              >
                <div className="text-3xl md:text-4xl mb-2 text-white/90">✝️</div>
                <h3 className="text-sm md:text-lg font-retro text-white leading-tight">{t('bible')}</h3>
                <span className="text-[10px] text-red-300 font-mono mt-1">Reader</span>
              </div>

              {/* Plans */}
              <div 
                onClick={() => handleNav(AppView.PLANS)}
                className="col-span-1 bg-green-900 rounded-2xl border-4 border-green-700 hover:border-green-400 cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden group p-4 flex flex-col items-center justify-center text-center"
              >
                <div className="text-3xl md:text-4xl mb-2">🌱</div>
                <h3 className="text-sm md:text-lg font-retro text-white leading-tight">{t('plans')}</h3>
              </div>

              {/* Journal */}
              <div 
                onClick={() => handleNav(AppView.JOURNAL)}
                className="col-span-1 bg-amber-100 rounded-2xl border-4 border-amber-300 hover:border-amber-600 cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden group p-4 flex flex-col items-center justify-center text-center"
              >
                <div className="text-3xl md:text-4xl mb-2 text-amber-800">📜</div>
                <h3 className="text-sm md:text-lg font-retro text-amber-900 leading-tight">{t('journal')}</h3>
              </div>
              
              {/* Leaderboard */}
              <div 
                onClick={() => handleNav(AppView.LEADERBOARD)}
                className="col-span-2 bg-purple-900 rounded-2xl border-4 border-purple-600 hover:border-purple-400 cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden group p-4 flex items-center justify-between"
              >
                 <div className="flex items-center gap-3">
                   <div className="text-3xl md:text-4xl animate-bounce">🏆</div>
                   <div className="text-left">
                     <h3 className="text-base md:text-xl font-retro text-white">{t('leaderboard')}</h3>
                     <p className="text-xs text-purple-300">Global Rankings</p>
                   </div>
                 </div>
                 <div className="text-right">
                    <span className="text-xs text-purple-300 block uppercase">Your Rank</span>
                    <span className="text-xl md:text-2xl font-mono text-yellow-400 font-bold">
                        #{gameState.rank > 0 ? gameState.rank : '-'}
                    </span>
                 </div>
              </div>

               {/* Wiki */}
               <div 
                onClick={() => handleNav(AppView.WIKI)}
                className="col-span-1 bg-gray-700 rounded-2xl border-4 border-gray-500 hover:border-white cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden group p-4 flex flex-col items-center justify-center text-center"
              >
                <div className="text-3xl md:text-4xl mb-2">📘</div>
                <h3 className="text-sm md:text-lg font-retro text-white leading-tight">{t('wiki')}</h3>
                <span className="text-[10px] text-gray-400 font-mono mt-1">Guide</span>
              </div>

              {/* Token */}
              <div 
                onClick={() => handleNav(AppView.TOKEN)}
                className="col-span-1 bg-gradient-to-b from-green-900 to-black rounded-2xl border-4 border-green-600 hover:border-green-400 cursor-pointer transition-all hover:-translate-y-1 relative overflow-hidden group p-4 flex flex-col items-center justify-center text-center"
              >
                <div className="absolute inset-0 bg-[url('https://image.pollinations.ai/prompt/pixel%20art%20matrix%20rain?width=200&height=200&nologo=true')] opacity-20"></div>
                <div className="text-3xl md:text-4xl mb-2 animate-pulse">🪙</div>
                <h3 className="text-sm md:text-lg font-retro text-green-400 leading-tight">{t('token')}</h3>
                <span className="text-[8px] bg-green-500 text-black px-1 rounded font-bold mt-1">LAUNCH</span>
              </div>

          </div>

          <div className="relative z-10 text-gray-500 text-[10px] md:text-xs font-mono pb-8 flex flex-col items-center gap-2 text-center">
             <div>
                Inspired by faith • Developed by <a href="https://x.com/blackralphsol" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:text-yellow-400">blackralph.sol</a>
             </div>
             <div>
                Secured by Supabase
             </div>
          </div>
        </div>
      )}

      {/* Admin View */}
      {gameState.view === AppView.ADMIN && gameState.user?.role === 'admin' && (
        <AdminView currentUser={gameState.user} onBack={handleBackToHome} />
      )}

      {/* Other Views */}
      {gameState.view === AppView.BIBLE && <BibleReaderView onBack={handleBackToHome} />}
      
      {gameState.view === AppView.GAME_LIBRARY && (
        <GameLibraryView 
          onSelectGame={handleGameSelect} 
          onBack={handleBackToHome}
          language={gameState.language}
        />
      )}

      {gameState.view === AppView.WIKI && (
        <WikiView 
          onBack={handleBackToHome} 
          onNavigate={handleNav}
          user={gameState.user}
        />
      )}

      {gameState.view === AppView.SUPPORT && (
        <SupportView 
          user={gameState.user}
          tickets={gameState.supportTickets}
          onCreateTicket={handleCreateTicket}
          onBack={handleBackToHome}
          language={gameState.language}
        />
      )}

      {gameState.view === AppView.TOKEN && (
        <TokenLaunchView 
          onBack={handleBackToHome} 
          onGoToTV={() => handleNav(AppView.TV)}
        />
      )}

      {gameState.view === AppView.PROFILE && (
        <ProfileView 
          user={gameState.user}
          totalPoints={gameState.totalPoints}
          unlockedAchievements={gameState.unlockedAchievements}
          collectedVerses={gameState.collectedVerses}
          onBack={handleBackToHome}
          onUpdateUser={handleUpdateUser}
          language={gameState.language}
          onSocialAction={handleSocialInteraction}
        />
      )}

      {gameState.view === AppView.VICTORY && (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-black flex flex-col items-center justify-center p-6 text-center">
          <h1 className="text-4xl md:text-6xl font-retro text-yellow-300 mb-8 animate-bounce">JOURNEY COMPLETE</h1>
          <p className="text-white text-lg md:text-xl mb-8 max-w-lg">
            You have walked the path of {activeGame.title}. Your faith has opened the way.
          </p>
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
             <Button onClick={() => handleNav(AppView.GAME_LIBRARY)} className="w-full">
               Return to Library
             </Button>
             <Button variant="secondary" onClick={() => handleNav(AppView.JOURNAL)} className="w-full">
               View Collected Verses
             </Button>
          </div>
        </div>
      )}

      {gameState.view === AppView.JOURNAL && (
        <JournalView 
          state={gameState} 
          onBack={handleBackToHome} 
          onSocialAction={handleSocialInteraction}
        />
      )}

      {gameState.view === AppView.TV && (
        <JourneyTVView 
          user={gameState.user} 
          onBack={handleBackToHome} 
          onChat={() => { addPoints(5); unlockAchievement('socialite'); }}
          language={gameState.language}
        />
      )}
      
      {gameState.view === AppView.DEVOTIONAL && (
        <DevotionalView 
          onBack={handleBackToHome} 
          onSocialAction={handleSocialInteraction} 
        />
      )}

      {gameState.view === AppView.PLANS && (
        <PlansView 
          onBack={handleBackToHome} 
          onAddPoints={addPoints}
          onSocialAction={handleSocialInteraction}
          language={gameState.language}
          plans={gameState.plans}
          onUpdatePlans={handleUpdatePlans}
        />
      )}

      {gameState.view === AppView.LEADERBOARD && (
        <LeaderboardView 
          currentUser={gameState.user} 
          currentPoints={gameState.totalPoints} 
          onBack={handleBackToHome} 
        />
      )}

      {gameState.view === AppView.MAP && (
        <>
          <LevelMap 
            gameConfig={activeGame}
            unlockedLevelId={gameState.progress[gameState.activeGameId]} 
            onSelectLevel={onLevelSelectWrapper} 
            onLibrary={handleBackToLibrary}
            onHome={handleBackToHome}
            language={gameState.language}
          />
          <div className="fixed top-2 right-2 md:top-4 md:right-4 z-50">
             <Button onClick={() => handleNav(AppView.JOURNAL)} variant="secondary" className="text-[10px] md:text-xs py-2 px-3">
               {t('journal')}
             </Button>
          </div>
        </>
      )}

      {gameState.view === AppView.GAME && (() => {
          const currentLevelConfig = activeGame.levels.find(l => l.id === playingLevelId);
          if (!currentLevelConfig) return <div>Error: Level not found</div>;

          return (
            <div className="min-h-screen bg-gray-800 flex items-center justify-center p-0 md:p-6 pt-12 md:pt-6">
               <GameView 
                 level={currentLevelConfig} 
                 onBack={handleBackToMap}
                 onHome={handleBackToHome}
                 onComplete={handleLevelComplete}
                 language={gameState.language}
               />
            </div>
          );
      })()}
    </>
  );
};

export default App;
