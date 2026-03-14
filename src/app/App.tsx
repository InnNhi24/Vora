/**
 * VORA - Dialogue synthesis with autonomous refinement
 * Mobile-first design with earth tones
 */

import { useState } from 'react';
import { OnboardingPage } from './pages/OnboardingPage';
import { InputStudioPage } from './pages/InputStudioPage';
import { OutputPage } from './pages/OutputPage';
import { generateDialogueWithRefinement } from './core/refinement-loop';
import { RefinementLog as RefinementLogType, RefinementAttempt } from './types/dialogue';
import { motion, AnimatePresence } from 'motion/react';

type Step = 'onboarding' | 'input' | 'output';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('onboarding');
  const [refinementLog, setRefinementLog] = useState<RefinementLogType | null>(null);

  const handleSynthesize = async (
    scenario: string
  ) => {
    setCurrentStep('output');
    setRefinementLog({
      scenario,
      attempts: [],
      totalIterations: 0,
      status: 'in-progress'
    });

    try {
      const log = await generateDialogueWithRefinement(
        scenario,
        '', // API key will be from environment variables
        'openai',
        (attempt: RefinementAttempt) => {
          setRefinementLog(prev => {
            if (!prev) {
              return {
                scenario,
                attempts: [attempt],
                totalIterations: 1,
                status: 'in-progress'
              };
            }
            return {
              ...prev,
              attempts: [...prev.attempts, attempt],
              totalIterations: prev.attempts.length + 1
            };
          });
        }
      );

      setRefinementLog(log);
    } catch (error) {
      console.error('Synthesis error:', error);
      setRefinementLog({
        scenario,
        attempts: [],
        totalIterations: 0,
        status: 'failed'
      });
    }
  };

  const handleRestart = () => {
    setCurrentStep('input');
    setRefinementLog(null);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      {/* Progress Indicator - Fixed at Top */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#F7F5F2]/80 backdrop-blur-sm border-b border-[#E5E2DD]">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2">
            {(['onboarding', 'input', 'output'] as Step[]).map((step, idx) => {
              const steps = ['onboarding', 'input', 'output'] as Step[];
              const currentIndex = steps.indexOf(currentStep);
              const stepIndex = steps.indexOf(step);
              
              return (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`rounded-full transition-all duration-500 ${
                      currentStep === step
                        ? 'bg-[#8C7851] w-8 h-2'
                        : stepIndex < currentIndex
                        ? 'bg-[#8C7851]/50 w-2 h-2'
                        : 'bg-[#D6CFC7] w-2 h-2'
                    }`}
                  />
                  {idx < 2 && <div className="w-6 h-px bg-[#E5E2DD]" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content - Add top padding for fixed header */}
      <div className="pt-16">
        <AnimatePresence mode="wait">
          {currentStep === 'onboarding' && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <OnboardingPage onGetStarted={() => setCurrentStep('input')} />
            </motion.div>
          )}

          {currentStep === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <InputStudioPage
                onSynthesize={handleSynthesize}
                onBack={() => setCurrentStep('onboarding')}
              />
            </motion.div>
          )}

          {currentStep === 'output' && refinementLog && (
            <motion.div
              key="output"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <OutputPage
                refinementLog={refinementLog}
                onRestart={handleRestart}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
