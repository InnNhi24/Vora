/**
 * Display component for dialogue output
 */

import { DialogueStructure } from '../types/dialogue';
import { User, Bot } from 'lucide-react';
import { isSpeakerA } from '../utils/speaker';

interface DialogueDisplayProps {
  dialogue: DialogueStructure | null;
  currentTurn?: number;
}

export function DialogueDisplay({ dialogue, currentTurn = -1 }: DialogueDisplayProps) {
  if (!dialogue) {
    return (
      <div className="text-center text-zinc-500 py-12">
        No dialogue generated yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-zinc-900">Generated Dialogue</h3>
        <p className="text-sm text-zinc-600 mt-1">{dialogue.metadata.scenario || 'No scenario provided'}</p>
      </div>

      <div className="space-y-4 md:space-y-6">
        {dialogue.dialogue.map((turn, index) => {
          const isCharacterA = isSpeakerA(turn.speaker);
          const isCurrentlyPlaying = currentTurn === index;
          
          return (
            <div
              key={index}
              className={`flex gap-3 md:gap-4 ${isCurrentlyPlaying ? 'scale-[1.01]' : ''} transition-transform`}
            >
              {/* Avatar - Left for A, Right for B */}
              {isCharacterA && (
                <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-zinc-200 ${
                  isCurrentlyPlaying ? 'ring-4 ring-indigo-300 ring-offset-2 ring-offset-white' : ''
                }`}>
                  <User className="w-5 h-5 md:w-6 md:h-6 text-zinc-600" />
                </div>
              )}

              {/* Content */}
              <div className={`flex-1 min-w-0 ${!isCharacterA ? 'text-right' : ''}`}>
                <div className={`flex items-center gap-2 mb-2 ${!isCharacterA ? 'justify-end' : ''}`}>
                  <span className="text-xs md:text-sm font-semibold text-zinc-700">
                    {turn.speaker}
                  </span>
                  {turn.emotion && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-600">
                      {turn.emotion}
                    </span>
                  )}
                </div>

                {/* Character A: Left, Light Grey. Character B: Right, Darker Grey */}
                <div className={`inline-block max-w-full md:max-w-[85%] rounded-2xl px-4 md:px-5 py-3 md:py-4 ${
                  isCharacterA 
                    ? 'bg-zinc-100' 
                    : 'bg-zinc-200'
                } ${isCurrentlyPlaying ? 'ring-2 ring-indigo-400' : ''}`}>
                  <p className="text-zinc-900 leading-relaxed text-sm md:text-base text-left">
                    {turn.text}
                  </p>
                </div>
              </div>

              {/* Avatar - Right for B */}
              {!isCharacterA && (
                <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-zinc-300 ${
                  isCurrentlyPlaying ? 'ring-4 ring-indigo-300 ring-offset-2 ring-offset-white' : ''
                }`}>
                  <Bot className="w-5 h-5 md:w-6 md:h-6 text-zinc-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
