/**
 * Output page displaying generated dialogue with playback controls
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Download, FileText, Music, 
  Play, Pause, RotateCcw, Terminal, 
  CheckCircle2, Loader2, User, Bot 
} from 'lucide-react';
import { DialogueStructure } from '../types/dialogue';
import { RefinementLog, RefinementAttempt } from '../types/dialogue';
import { playDialogueWithVoices, stopPlayback } from '../core/voice-synthesis';
import { exportToPDF, exportToAudio } from '../utils/export';
import { InspectorPanel } from '../components/InspectorPanel';
import { VoraLogo } from '../components/VoraLogo';
import { isSpeakerA } from '../utils/speaker';

interface OutputPageProps {
  refinementLog: RefinementLog;
  onRestart: () => void;
}

export function OutputPage({ refinementLog, onRestart }: OutputPageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTurn, setCurrentTurn] = useState(-1);
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);

  const isProcessing = refinementLog.status === 'in-progress';
  const hasFailed = refinementLog.status === 'failed';
  const dialogue = refinementLog.finalDialogue;

  // Show dialogue after processing completes
  useEffect(() => {
    if (dialogue && !isProcessing) {
      const timer = setTimeout(() => setShowDialogue(true), 500);
      return () => clearTimeout(timer);
    }

    setShowDialogue(false);
  }, [dialogue, isProcessing]);

  const handlePlay = async () => {
    if (!dialogue) return;
    
    setIsPlaying(true);
    
    try {
      await playDialogueWithVoices(dialogue, (turnIndex) => {
        setCurrentTurn(turnIndex);
      });
    } catch (error) {
      console.error('Playback error:', error);
    } finally {
      setIsPlaying(false);
      setCurrentTurn(-1);
    }
  };

  const handleStop = () => {
    stopPlayback();
    setIsPlaying(false);
    setCurrentTurn(-1);
  };

  const handleExportPDF = async () => {
    if (!dialogue) return;
    try {
      await exportToPDF(dialogue);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF');
    }
  };

  const handleExportAudio = async () => {
    if (!dialogue) return;
    try {
      await exportToAudio(dialogue);
    } catch (error) {
      console.error('Audio export error:', error);
      alert(error instanceof Error ? error.message : 'Audio export is currently unavailable.');
    }
  };

  const handleExportJSON = () => {
    if (!dialogue) return;
    const dataStr = JSON.stringify(dialogue, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vora-dialogue-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] pb-24">
      <div className="max-w-screen-xl mx-auto px-4 py-8 md:py-12">
        {/* Processing State */}
        <AnimatePresence mode="wait">
          {isProcessing && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[80vh]"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[#8C7851] flex items-center justify-center mb-8 shadow-lg p-4"
              >
                <VoraLogo className="w-full h-full" />
              </motion.div>

              <h2 className="text-2xl md:text-3xl font-bold text-[#3C3A36] mb-4 text-center">
                Synthesizing Your Dialogue
              </h2>
              
              <p className="text-base md:text-lg text-[#6B6862] mb-12 text-center">
                The autonomous refinement engine is optimizing...
              </p>

              {/* Refinement Progress */}
              <div className="w-full max-w-md space-y-3">
                {refinementLog.attempts.map((attempt, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className={`flex items-center gap-4 p-4 rounded-xl border ${
                      attempt.success 
                        ? 'bg-[#8C7851]/5 border-[#8C7851]/30' 
                        : 'bg-[#A0522D]/5 border-[#A0522D]/30'
                    }`}
                  >
                    {attempt.success ? (
                      <CheckCircle2 className="w-5 h-5 text-[#8C7851] flex-shrink-0" />
                    ) : (
                      <Loader2 className="w-5 h-5 text-[#A0522D] flex-shrink-0 animate-spin" />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#3C3A36]">
                        Iteration {attempt.attemptNumber}
                      </div>
                      <div className="text-xs text-[#6B6862]">
                        {attempt.success 
                          ? 'All validation criteria passed' 
                          : attempt.validation.errors[0] || 'Validating...'}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Failed State */}
          {hasFailed && !dialogue && (
            <motion.div
              key="failed"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[80vh]"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#A0522D]/10 border border-[#A0522D]/30 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-[#A0522D]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-[#3C3A36] mb-4 text-center">
                Synthesis Incomplete
              </h2>
              
              <p className="text-base md:text-lg text-[#6B6862] mb-8 max-w-md text-center px-4">
                The autonomous refinement process exhausted all attempts. 
                Try simplifying your scenario or check the inspector for details.
              </p>

              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto px-4">
                <button
                  onClick={() => setInspectorOpen(true)}
                  className="px-6 py-3 rounded-xl bg-[#F7F5F2] hover:bg-[#E5E2DD] border border-[#E5E2DD] text-[#3C3A36] transition-all"
                >
                  <Terminal className="w-4 h-4 inline mr-2" />
                  View Inspector
                </button>
                <button
                  onClick={onRestart}
                  className="px-6 py-3 rounded-xl bg-[#8C7851] hover:bg-[#7A6845] text-white font-medium transition-all shadow-lg"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {/* Success State */}
          {dialogue && showDialogue && (
            <motion.div
              key="success"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Header with Actions */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[#3C3A36] mb-2">
                    Your Dialogue is Ready
                  </h2>
                  <p className="text-[#6B6862] text-sm md:text-base">
                    {dialogue.dialogue.length} turns • {refinementLog.totalIterations} iteration
                    {refinementLog.totalIterations !== 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button
                    onClick={() => setInspectorOpen(true)}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-[#F7F5F2] hover:bg-[#E5E2DD] border border-[#E5E2DD] text-[#3C3A36] transition-all text-sm"
                  >
                    <Terminal className="w-4 h-4 inline mr-2" />
                    Inspector
                  </button>
                  <button
                    onClick={onRestart}
                    className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-[#F7F5F2] hover:bg-[#E5E2DD] border border-[#E5E2DD] text-[#3C3A36] transition-all text-sm"
                  >
                    <RotateCcw className="w-4 h-4 inline mr-2" />
                    New
                  </button>
                </div>
              </motion.div>

              {/* Dialogue Display - Vertical thread, Chat UI style */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white border border-[#E5E2DD] rounded-xl md:rounded-2xl p-4 md:p-8 mb-6"
              >
                <div className="space-y-4 md:space-y-6">
                  {dialogue.dialogue.map((turn, index) => {
                    const isCharacterA = isSpeakerA(turn.speaker);
                    const isCurrentlyPlaying = currentTurn === index;
                    
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: isCharacterA ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex gap-3 md:gap-4 ${isCurrentlyPlaying ? 'scale-[1.01]' : ''} transition-transform`}
                      >
                        {/* Avatar - Left for A, Right for B */}
                        {isCharacterA && (
                          <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-[#E5E2DD] ${
                            isCurrentlyPlaying ? 'ring-4 ring-[#8C7851]/30 ring-offset-2 ring-offset-white' : ''
                          }`}>
                            <User className="w-5 h-5 md:w-6 md:h-6 text-[#3C3A36]" />
                          </div>
                        )}

                        {/* Content */}
                        <div className={`flex-1 min-w-0 ${!isCharacterA ? 'text-right' : ''}`}>
                          <div className={`flex items-center gap-2 mb-2 ${!isCharacterA ? 'justify-end' : ''}`}>
                            <span className="text-xs md:text-sm font-semibold text-[#3C3A36]">
                              {turn.speaker}
                            </span>
                            {turn.emotion && (
                              <span className="text-xs px-2 py-0.5 rounded-full bg-[#E5E2DD] text-[#6B6862]">
                                {turn.emotion}
                              </span>
                            )}
                            {isCurrentlyPlaying && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-1 text-xs text-[#8C7851]"
                              >
                                {/* Waveform animation */}
                                <div className="flex items-center gap-0.5">
                                  <motion.div
                                    animate={{ height: [4, 12, 4] }}
                                    transition={{ duration: 0.5, repeat: Infinity }}
                                    className="w-1 bg-[#8C7851] rounded-full"
                                  />
                                  <motion.div
                                    animate={{ height: [8, 4, 8] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.1 }}
                                    className="w-1 bg-[#8C7851] rounded-full"
                                  />
                                  <motion.div
                                    animate={{ height: [4, 12, 4] }}
                                    transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                                    className="w-1 bg-[#8C7851] rounded-full"
                                  />
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {/* Bot A: Left, Soft Grey. Bot B: Right, Warm Taupe */}
                          <div className={`inline-block max-w-full md:max-w-[85%] rounded-2xl px-4 md:px-5 py-3 md:py-4 ${
                            isCharacterA 
                              ? 'bg-[#E5E2DD]' 
                              : 'bg-[#D6CFC7]'
                          } ${isCurrentlyPlaying ? 'ring-2 ring-[#8C7851]/40' : ''}`}>
                            <p className="text-[#3C3A36] leading-relaxed text-sm md:text-base text-left">
                              {turn.text}
                            </p>
                          </div>
                        </div>

                        {/* Avatar - Right for B */}
                        {!isCharacterA && (
                          <div className={`flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-[#D6CFC7] ${
                            isCurrentlyPlaying ? 'ring-4 ring-[#8C7851]/30 ring-offset-2 ring-offset-white' : ''
                          }`}>
                            <Bot className="w-5 h-5 md:w-6 md:h-6 text-[#3C3A36]" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Export Buttons - Full width */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6"
              >
                <button
                  onClick={handleExportPDF}
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-white hover:bg-[#F7F5F2] border border-[#E5E2DD] text-[#3C3A36] transition-all hover:shadow-md"
                >
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Export PDF</span>
                </button>
                <button
                  onClick={handleExportAudio}
                  disabled
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-[#F7F5F2] border border-[#E5E2DD] text-[#6B6862] cursor-not-allowed opacity-70"
                >
                  <Music className="w-5 h-5" />
                  <span className="font-medium">Audio Export Soon</span>
                </button>
                <button
                  onClick={handleExportJSON}
                  className="flex items-center justify-center gap-2 px-5 py-4 rounded-xl bg-white hover:bg-[#F7F5F2] border border-[#E5E2DD] text-[#3C3A36] transition-all hover:shadow-md"
                >
                  <Download className="w-5 h-5" />
                  <span className="font-medium">Export JSON</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Inspector Panel */}
        <InspectorPanel
          isOpen={inspectorOpen}
          onClose={() => setInspectorOpen(false)}
          attempts={refinementLog?.attempts || []}
        />
      </div>

      {/* Fixed Audio Bar at Bottom */}
      {dialogue && showDialogue && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E2DD] shadow-2xl z-50"
        >
          <div className="max-w-screen-xl mx-auto px-4 py-4 md:py-6">
            <div className="flex items-center justify-between gap-4">
              {/* Playback Controls */}
              <div className="flex items-center gap-3 md:gap-4">
                {!isPlaying ? (
                  <button
                    onClick={handlePlay}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#8C7851] hover:bg-[#7A6845] hover:scale-110 flex items-center justify-center transition-all shadow-lg"
                  >
                    <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" fill="white" />
                  </button>
                ) : (
                  <button
                    onClick={handleStop}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#6B6862] hover:bg-[#5F5D50] flex items-center justify-center transition-all"
                  >
                    <Pause className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </button>
                )}

                <div className="hidden md:block">
                  <div className="text-sm font-medium text-[#3C3A36]">
                    {isPlaying && currentTurn >= 0 
                      ? `Playing: ${dialogue.dialogue[currentTurn]?.speaker}` 
                      : 'Voice Playback Ready'}
                  </div>
                  <div className="text-xs text-[#6B6862]">
                    {isPlaying && currentTurn >= 0 
                      ? `Turn ${currentTurn + 1} of ${dialogue.dialogue.length}`
                      : 'Click play to hear the dialogue'}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="flex-1 hidden md:block">
                <div className="h-2 bg-[#E5E2DD] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#8C7851]"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: isPlaying && currentTurn >= 0 
                        ? `${((currentTurn + 1) / dialogue.dialogue.length) * 100}%` 
                        : '0%'
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
