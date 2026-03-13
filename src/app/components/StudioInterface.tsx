/**
 * Main studio interface combining input and output
 */

import { useState } from 'react';
import { DialogueStructure } from '../types/dialogue';
import { ScenarioInput } from './ScenarioInput';
import { DialogueDisplay } from './DialogueDisplay';
import { AudioPlayer } from './AudioPlayer';

export function StudioInterface() {
  const [dialogue, setDialogue] = useState<DialogueStructure | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(-1);

  const handleScenarioSubmit = async (data: any) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockDialogue: DialogueStructure = {
        metadata: {
          iterations: 1,
          scenario: data.context,
        },
        dialogue: [
          {
            speaker: 'Character A',
            text: 'This is a sample dialogue turn.',
            emotion: 'neutral',
          },
          {
            speaker: 'Character B',
            text: 'This is another sample turn.',
            emotion: 'curious',
          },
        ],
      };
      
      setDialogue(mockDialogue);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">
              Scenario Input
            </h2>
            <ScenarioInput onSubmit={handleScenarioSubmit} isLoading={isLoading} />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-zinc-900 mb-6">
              Generated Dialogue
            </h2>
            <DialogueDisplay dialogue={dialogue} currentTurn={currentTurn} />
          </div>
        </div>
      </div>

      <AudioPlayer dialogue={dialogue} onPlaybackProgress={setCurrentTurn} />
    </div>
  );
}
