/**
 * Inspector panel showing refinement process details
 */

import { useState, useEffect } from 'react';
import { RefinementAttempt } from '../types/dialogue';
import { X, CheckCircle2, XCircle, Code, Layers, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface InspectorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  attempts: RefinementAttempt[];
}

export function InspectorPanel({ isOpen, onClose, attempts }: InspectorPanelProps) {
  const [selectedAttempt, setSelectedAttempt] = useState<number>(0);

  useEffect(() => {
    if (attempts.length > 0) {
      setSelectedAttempt(attempts.length - 1);
    }
  }, [attempts]);

  const currentAttempt = attempts[selectedAttempt];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Slide-over Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-2xl bg-zinc-900 border-l border-zinc-800 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                  <Code className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg text-zinc-100">Advanced Inspector</h2>
                  <p className="text-xs text-zinc-500">Autonomous refinement diagnostics</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg hover:bg-zinc-800 flex items-center justify-center transition-colors text-zinc-400 hover:text-zinc-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-6">
                {attempts.length === 0 ? (
                  <div className="text-center py-12">
                    <Code className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                    <p className="text-zinc-500 text-sm">No synthesis attempts yet</p>
                  </div>
                ) : (
                  <>
                    {/* Iteration Selector */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                        <Layers className="w-4 h-4" />
                        Iteration Timeline
                      </div>
                      <div className="flex gap-2">
                        {attempts.map((attempt, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedAttempt(idx)}
                            className={`flex-1 p-3 rounded-lg border transition-all ${
                              selectedAttempt === idx
                                ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300'
                                : 'bg-zinc-800/50 border-zinc-700/50 text-zinc-400 hover:border-zinc-600'
                            }`}
                          >
                            <div className="text-xs font-medium mb-1">Iteration {idx + 1}</div>
                            <div className="flex items-center justify-center gap-1">
                              {attempt.success ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                              <span className="text-xs">
                                {attempt.success ? 'Pass' : 'Fail'}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-zinc-800" />

                    {/* Evaluation Score */}
                    {currentAttempt && (
                      <>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            <Gauge className="w-4 h-4" />
                            Evaluation Score
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                              <div className="text-2xl font-bold text-zinc-100 mb-1">
                                {currentAttempt.validation.errors.length === 0 ? '100' : 
                                 currentAttempt.validation.errors.length === 1 ? '66' : '33'}
                              </div>
                              <div className="text-xs text-zinc-500">Quality Score</div>
                            </div>
                            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                              <div className="text-2xl font-bold text-zinc-100 mb-1">
                                {currentAttempt.validation.errors.length}
                              </div>
                              <div className="text-xs text-zinc-500">Errors Found</div>
                            </div>
                            <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                              <div className="text-2xl font-bold text-zinc-100 mb-1">
                                {currentAttempt.attemptNumber}
                              </div>
                              <div className="text-xs text-zinc-500">Attempt #</div>
                            </div>
                          </div>
                        </div>

                        <Separator className="bg-zinc-800" />

                        {/* Validation Results */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                              Validation Results
                            </span>
                            <Badge variant={currentAttempt.success ? 'default' : 'destructive'}>
                              {currentAttempt.success ? 'All Checks Passed' : 'Validation Failed'}
                            </Badge>
                          </div>

                          {currentAttempt.validation.errors.length > 0 ? (
                            <div className="space-y-2">
                              {currentAttempt.validation.errors.map((error, idx) => (
                                <div
                                  key={idx}
                                  className="bg-red-950/30 border border-red-900/50 rounded-lg p-3"
                                >
                                  <div className="flex items-start gap-2">
                                    <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-red-300 leading-relaxed">{error}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="bg-green-950/30 border border-green-900/50 rounded-lg p-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                <p className="text-xs text-green-300">All validation criteria met</p>
                              </div>
                            </div>
                          )}
                        </div>

                        <Separator className="bg-zinc-800" />

                        {/* JSON Payload */}
                        <div className="space-y-3">
                          <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            JSON Payload
                          </div>
                          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto">
                            <pre className="text-xs text-zinc-300 font-mono">
                              {currentAttempt.parsedDialogue 
                                ? JSON.stringify(currentAttempt.parsedDialogue, null, 2)
                                : currentAttempt.rawResponse}
                            </pre>
                          </div>
                        </div>

                        <Separator className="bg-zinc-800" />

                        {/* Prompt Analysis */}
                        <div className="space-y-3">
                          <div className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Prompt Sent to LLM
                          </div>
                          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
                            <pre className="text-xs text-zinc-400 font-mono whitespace-pre-wrap">
                              {currentAttempt.prompt}
                            </pre>
                          </div>
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </ScrollArea>

            {/* Footer Stats */}
            {attempts.length > 0 && (
              <div className="border-t border-zinc-800 px-6 py-4 bg-zinc-900/50">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500">
                    Total Iterations: <span className="text-zinc-300 font-medium">{attempts.length}</span>
                  </span>
                  <span className="text-zinc-500">
                    Success Rate: <span className="text-green-400 font-medium">
                      {Math.round((attempts.filter(a => a.success).length / attempts.length) * 100)}%
                    </span>
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
