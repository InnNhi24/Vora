/**
 * Live transcript display during playback
 */

import { DialogueStructure } from '../types/dialogue';

interface LiveTranscriptProps {
  dialogue: DialogueStructure | null;
  currentTurn: number;
}

export function LiveTranscript({ dialogue, currentTurn }: LiveTranscriptProps) {
  if (!dialogue || currentTurn < 0) {
    return (
      <div className="text-center text-zinc-400 py-8">
        Waiting for playback...
      </div>
    );
  }

  const turn = dialogue.dialogue[currentTurn];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-sm font-medium text-zinc-600">
          Turn {currentTurn + 1} of {dialogue.dialogue.length}
        </span>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200">
        <div className="text-sm font-semibold text-indigo-900 mb-2">
          {turn.speaker}
        </div>
        <div className="text-lg text-zinc-900 leading-relaxed">
          {turn.text}
        </div>
        {turn.emotion && (
          <div className="mt-3 text-xs text-indigo-600 font-medium">
            {turn.emotion}
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="h-1 bg-zinc-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
            style={{ width: `${((currentTurn + 1) / dialogue.dialogue.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
