/**
 * Voice playback controls and visualization
 */

import { useState } from 'react';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

interface VoicePlayerProps {
  isPlaying: boolean;
  currentTurn: number;
  totalTurns: number;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function VoicePlayer({
  isPlaying,
  currentTurn,
  totalTurns,
  onPlay,
  onPause,
  onNext,
  onPrevious,
}: VoicePlayerProps) {
  const progress = totalTurns > 0 ? ((currentTurn + 1) / totalTurns) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-4">
        <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-600">
          Turn {currentTurn + 1} of {totalTurns}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            disabled={currentTurn <= 0}
            className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipBack className="w-4 h-4 text-zinc-700" />
          </button>

          {!isPlaying ? (
            <button
              onClick={onPlay}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 flex items-center justify-center transition-all shadow-lg"
            >
              <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
            </button>
          ) : (
            <button
              onClick={onPause}
              className="w-12 h-12 rounded-full bg-zinc-700 hover:bg-zinc-600 flex items-center justify-center transition-all"
            >
              <Pause className="w-5 h-5 text-white" />
            </button>
          )}

          <button
            onClick={onNext}
            disabled={currentTurn >= totalTurns - 1}
            className="w-10 h-10 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-4 h-4 text-zinc-700" />
          </button>
        </div>

        <div className="text-sm text-zinc-600">
          {Math.round(progress)}%
        </div>
      </div>
    </div>
  );
}
