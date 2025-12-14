import React, { useState } from 'react';
import Button from './Button';

interface SocialActionBarProps {
  onInteract: (action: 'like' | 'pray' | 'comment' | 'share') => void;
  entityName?: string; // e.g., "Daily Devotional" or "User Profile"
}

const SocialActionBar: React.FC<SocialActionBarProps> = ({ onInteract, entityName = "Content" }) => {
  const [liked, setLiked] = useState(false);
  const [prayed, setPrayed] = useState(false);
  
  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    onInteract('like');
  };

  const handlePray = () => {
    if (prayed) return;
    setPrayed(true);
    onInteract('pray');
  };

  const handleComment = () => {
    // Simulation of a comment modal
    const comment = window.prompt(`Leave a thought on ${entityName}:`);
    if (comment && comment.trim().length > 0) {
      onInteract('comment');
    }
  };

  const handleShare = async () => {
    onInteract('share');
    
    // Attempt native share, fallback to clipboard
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'The Journey',
          text: `Check out ${entityName} on The Journey App!`,
          url: window.location.href
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback
      alert("Link copied to clipboard! (Simulated)");
    }
  };

  return (
    <div className="w-full bg-gray-900 border-t-4 border-gray-700 p-3 flex justify-around items-center pixel-shadow-sm mt-4 animate-slide-up">
      
      {/* LIKE */}
      <button 
        onClick={handleLike}
        className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${liked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
      >
        <span className={`text-2xl ${liked ? 'animate-bounce' : ''}`}>
          {liked ? '❤️' : '♡'}
        </span>
        <span className="text-[10px] font-retro uppercase">Like</span>
      </button>

      {/* PRAY */}
      <button 
        onClick={handlePray}
        className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${prayed ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-200'}`}
      >
        <span className={`text-2xl ${prayed ? 'animate-pulse' : ''}`}>
          🙏
        </span>
        <span className="text-[10px] font-retro uppercase">Pray</span>
      </button>

      {/* COMMENT */}
      <button 
        onClick={handleComment}
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-blue-400 transition-all active:scale-95"
      >
        <span className="text-2xl">💬</span>
        <span className="text-[10px] font-retro uppercase">Post</span>
      </button>

      {/* SHARE */}
      <button 
        onClick={handleShare}
        className="flex flex-col items-center gap-1 text-gray-400 hover:text-green-400 transition-all active:scale-95"
      >
        <span className="text-2xl">↗️</span>
        <span className="text-[10px] font-retro uppercase">Share</span>
      </button>
      
      {/* Earn Hint */}
      <div className="hidden md:block absolute right-4 top-[-20px] bg-yellow-600 text-white text-[9px] px-2 rounded font-mono border border-yellow-400">
        Interact to Earn XP
      </div>
    </div>
  );
};

export default SocialActionBar;