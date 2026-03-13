/**
 * Custom audio player with sticky footer
 */

import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { DialogueStructure } from '../types/dialogue';
import { playDialogueWithVoices, stopPlayback } from '../core/voice-synthesis';
import { motion } from 'motion/react';

interface AudioPlayerProps {
  dialogue: DialogueStructure | null;
  onPlaybackProgress?: (turnIndex: number) => void;
}

export function AudioPlayer({ dialogue, onPlaybackProgress }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(-1);
  const [isMuted, setIsMuted] = useState(false);

  const progress = dialogue && currentTurn >= 0 
    ? ((currentTurn + 1) / dialogue.dialogue.length) * 100 
    : 0;

  const handlePlay = async () => {
    if (!dialogue) return;
    
    setIsPlaying(true);
    
    try {
      await playDialogueWithVoices(dialogue, (turnIndex) => {
        setCurrentTurn(turnIndex);
        if (onPlaybackProgress) {
          onPlaybackProgress(turnIndex);
        }
      });
    } catch (error) {
      console.error('Playback error:', error);
    } finally {
      setIsPlaying(false);
      setCurrentTurn(-1);
      if (onPlaybackProgress) {
        onPlaybackProgress(-1);
      }
    }
  };

  const handleStop = () => {
    stopPlayback();
    setIsPlaying(false);
    setCurrentTurn(-1);
    if (onPlaybackProgress) {
      onPlaybackProgress(-1);
    }
  };

  const handleRestart = () => {
    handleStop();
    setTimeout(handlePlay, 100);
  };

  if (!dialogue) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 shadow-2xl z-30"
    >
      <div className="absolute top-0 left-0 right-0 h-0.5">
        <div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {!isPlaying ? (
              <button
                onClick={handlePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-105"
              >
                <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
              </button>
            ) : (
              <button
                onClick={handleStop}
                className="w-12 h-12 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-all"
              >
                <Pause className="w-5 h-5 text-white" />
              </button>
            )}

            <button
              onClick={handleRestart}
              disabled={!isPlaying && currentTurn === -1}
              className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RotateCcw className="w-4 h-4 text-zinc-300" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            {isPlaying && currentTurn >= 0 ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                  <span className="text-sm font-medium text-zinc-100">
                    {dialogue.dialogue[currentTurn]?.speaker}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate">
                  {dialogue.dialogue[currentTurn]?.text}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-sm font-medium text-zinc-300">
                  Voice Synthesis Ready
                </div>
                <div className="text-xs text-zinc-500">
                  {dialogue.dialogue.length} turns • Character A (Male) & Character B (Female)
                </div>
              </div>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800/50">
            <span className="text-xs text-zinc-400">
              {isPlaying && currentTurn >= 0 ? currentTurn + 1 : 0} / {dialogue.dialogue.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-all"
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-zinc-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-zinc-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
