import React, { useState } from 'react';
import Button from './Button';
import { User } from '../types';
import { AVATARS } from '../constants';
import { LanguageCode, LANGUAGES, UI_TEXT } from '../translations';
import { supabase } from '../lib/supabase';

interface AuthViewProps {
  onLogin: (user: User, language: LanguageCode) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const t = (key: keyof typeof UI_TEXT['en']) => {
    return UI_TEXT[selectedLanguage][key] || UI_TEXT['en'][key];
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (mode === 'signup') {
        if (!username) throw new Error("Username is required for new pilgrims.");

        // 1. Sign Up
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("No user created");

        // 2. Create Profile in public.users
        const newUser: User = {
          id: authData.user.id,
          email: email,
          username: username,
          avatar: selectedAvatar,
          joinedDate: new Date().toISOString(),
          lastDailyClaim: 0,
          badges: ['beta']
        };

        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: newUser.id,
            username: newUser.username,
            avatar: newUser.avatar,
            joined_date: newUser.joinedDate,
            badges: newUser.badges,
            total_points: 0,
            last_daily_claim: 0
          }]);

        if (profileError) {
          // If profile creation fails, it might be because the trigger/auth isn't perfectly synced or RLS issues
          console.error("Profile creation error:", profileError);
        }

        // Check if email confirmation is required
        if (authData.session) {
             onLogin(newUser, selectedLanguage);
        } else {
             setSuccessMsg("Account created! Please check your email to confirm your account before logging in.");
             setMode('signin');
        }

      } else {
        // 1. Sign In
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Login failed");

        // 2. Fetch Profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
           if (profileError.code === 'PGRST116') {
              throw new Error("Profile not found. Please Sign Up to create your character.");
           }
           throw profileError;
        }

        const user: User = {
          id: profile.id,
          email: authData.user.email!,
          username: profile.username,
          avatar: profile.avatar,
          joinedDate: profile.joined_date,
          lastDailyClaim: profile.last_daily_claim,
          badges: profile.badges || []
        };

        onLogin(user, selectedLanguage);
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      let message = "Authentication failed";
      
      // Handle Supabase error objects safely
      if (err && typeof err === 'object') {
         if (err.message) message = err.message;
         else if (err.error_description) message = err.error_description;
         else message = JSON.stringify(err);
      } else if (typeof err === 'string') {
         message = err;
      }

      if (message.includes("Email not confirmed")) {
        message = "📧 Email not confirmed. Please check your inbox and click the verification link.";
      }

      setErrorMsg(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 bg-[url('https://image.pollinations.ai/prompt/pixel%20art%20starry%20night%20city%20silhouette?width=1200&height=800&nologo=true')] bg-cover bg-center">
      <div className="absolute inset-0 bg-black/70"></div>
      
      <div className="relative z-10 bg-gray-800 p-8 rounded-xl border-4 border-yellow-600 pixel-shadow max-w-md w-full animate-fade-in">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-retro text-yellow-500 mb-2 text-shadow-md">{t('identity')}</h1>
          <p className="text-gray-400 font-serif">
            {mode === 'signin' ? 'Resume your pilgrimage.' : 'Who shall walk this path?'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">

          {/* Language Selector */}
          <div className="flex justify-center gap-2 mb-4">
             {LANGUAGES.map(lang => (
               <button
                 key={lang.code}
                 type="button"
                 onClick={() => setSelectedLanguage(lang.code)}
                 className={`
                   text-xl w-10 h-10 rounded border-2 transition-transform hover:scale-110
                   ${selectedLanguage === lang.code ? 'bg-yellow-900 border-yellow-500 scale-110' : 'bg-gray-900 border-gray-600 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'}
                 `}
                 title={lang.name}
               >
                 {lang.flag}
               </button>
             ))}
          </div>
          
          {mode === 'signup' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                 <label className="text-gray-300 font-retro text-xs uppercase">{t('select_avatar')}</label>
              </div>

              {/* Avatar Presets */}
              <div className="grid grid-cols-6 gap-2">
                {AVATARS.map((avatar, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setSelectedAvatar(avatar)}
                    className={`
                      cursor-pointer rounded border-2 p-0.5 transition-all hover:scale-110
                      ${selectedAvatar === avatar ? 'border-yellow-500 opacity-100 ring-1 ring-yellow-500/50' : 'border-gray-700 opacity-50 hover:opacity-100'}
                    `}
                  >
                    <img src={avatar} alt="Preset" className="w-full h-full object-cover rounded-sm" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4 pt-2">
             <div>
                <label className="block text-gray-300 font-retro text-xs uppercase mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="pilgrim@journey.com"
                  className="w-full bg-black text-white p-3 border-2 border-gray-600 focus:border-yellow-500 outline-none font-mono text-sm"
                  required
                />
             </div>

             <div>
                <label className="block text-gray-300 font-retro text-xs uppercase mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-black text-white p-3 border-2 border-gray-600 focus:border-yellow-500 outline-none font-mono text-sm"
                  required
                  minLength={6}
                />
             </div>

             {mode === 'signup' && (
               <div>
                  <label className="block text-gray-300 font-retro text-xs uppercase mb-1">{t('enter_name')}</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    maxLength={15}
                    placeholder="Pilgrim Name..."
                    className="w-full bg-black text-white p-3 border-2 border-gray-600 focus:border-yellow-500 outline-none font-mono text-lg"
                    required
                  />
               </div>
             )}
          </div>

          {successMsg && (
            <div className="bg-green-900/50 border border-green-500 text-green-200 p-3 text-sm text-center rounded">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 text-sm text-center rounded">
              {errorMsg}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Connecting...' : (mode === 'signin' ? 'Enter World' : 'Begin Journey')}
          </Button>

          <div className="text-center">
            <button 
              type="button"
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setErrorMsg(''); setSuccessMsg(''); }}
              className="text-yellow-500 text-xs hover:underline font-mono"
            >
              {mode === 'signin' ? "Don't have a soul record? Create one." : "Already have an identity? Login."}
            </button>
          </div>

        </form>
      </div>
      
      <div className="relative z-10 mt-8 text-gray-500 text-xs font-mono text-center">
        Secured by Supabase<br/>
        All progress is synced to the cloud.
      </div>
    </div>
  );
};

export default AuthView;
