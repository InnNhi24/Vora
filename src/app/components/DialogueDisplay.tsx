/**
 * Display component for dialogue output
 */

import { DialogueStructure } from '../types/dialogue';

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

      <div className="space-y-3">
        {dialogue.dialogue.map((turn, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg transition-all ${
              index === currentTurn
                ? 'bg-indigo-50 border-2 border-indigo-300'
                : 'bg-zinc-50 border border-zinc-200'
            }`}
          >
            <div className="font-medium text-sm text-zinc-700 mb-1">
              {turn.speaker}
            </div>
            <div className="text-zinc-900">{turn.text}</div>
            {turn.emotion && (
              <div className="text-xs text-zinc-500 mt-2">
                Emotion: {turn.emotion}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
