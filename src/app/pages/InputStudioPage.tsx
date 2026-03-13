/**
 * Input page for scenario description
 */

import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, Settings2, Sparkles } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { VoraLogo } from '../components/VoraLogo';

interface InputStudioPageProps {
  onSynthesize: (scenario: string, apiKey: string, provider: 'openai') => void;
  onBack: () => void;
}

export function InputStudioPage({ onSynthesize, onBack }: InputStudioPageProps) {
  const [scenario, setScenario] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [provider] = useState<'openai'>('openai');
  const [showSettings, setShowSettings] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [scenario]);

  const handleScenarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScenario(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleSubmit = () => {
    if (!scenario.trim()) {
      return;
    }
    
    if (!apiKey.trim()) {
      setShowSettings(true);
      return;
    }

    onSynthesize(scenario, apiKey, provider);
  };

  const quickScenarios = [
    {
      title: 'Business',
      text: 'A negotiation at a luxury car dealership where the customer wants a better price and the salesperson explains the value proposition'
    },
    {
      title: 'Education',
      text: 'A tutor helping a student understand calculus derivatives, breaking down the concept step by step with patience and encouragement'
    },
    {
      title: 'Lifestyle',
      text: 'Two friends planning a surprise birthday party, discussing decoration ideas, guest lists, and keeping it secret from the birthday person'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      <div className="max-w-screen-xl mx-auto px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onBack}
            className="flex items-center gap-2 text-[#6B6862] hover:text-[#3C3A36] transition-colors mb-6 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm md:text-base">Back to Guidelines</span>
          </motion.button>

          {/* Header with Logo */}
          <div className="text-center mb-8 md:mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', damping: 15 }}
              className="inline-block mb-4"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#8C7851] flex items-center justify-center p-2.5 opacity-90">
                <VoraLogo className="w-full h-full" />
              </div>
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#3C3A36] mb-3">
              Describe Your Dialogue
            </h1>
            <p className="text-base md:text-lg text-[#6B6862]">
              Paint the scene, and we'll bring it to life
            </p>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-6 overflow-hidden"
            >
              <div className="bg-white border border-[#E5E2DD] rounded-xl md:rounded-2xl p-4 md:p-6">
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h3 className="text-base md:text-lg font-semibold text-[#3C3A36] flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-[#8C7851]" />
                    Engine Configuration
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-sm text-[#6B6862] hover:text-[#3C3A36]"
                  >
                    Hide
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiKey" className="text-[#3C3A36] text-sm">OpenAI API Key</Label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="bg-[#F7F5F2] border-[#E5E2DD] text-[#3C3A36] placeholder:text-[#6B6862]"
                    />
                  </div>
                </div>

                <p className="text-xs text-[#6B6862] mt-4">
                  Your API key is processed locally and never stored. Using OpenAI GPT-4.
                </p>
              </div>
            </motion.div>
          )}

          {/* Main Input Area - Auto-expanding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-[#E5E2DD] rounded-xl md:rounded-2xl p-4 md:p-8 mb-6 hover:shadow-md transition-shadow"
          >
            <textarea
              ref={textareaRef}
              value={scenario}
              onChange={handleScenarioChange}
              placeholder="Example: A tense negotiation at a luxury perfume boutique where a customer is searching for the perfect anniversary gift, and the sales consultant skillfully guides them through scent profiles while building trust..."
              rows={1}
              className="w-full bg-transparent border-0 text-[#3C3A36] placeholder:text-[#6B6862] text-base md:text-lg resize-none focus:outline-none leading-relaxed min-h-[120px]"
            />

            {/* Character Counter */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#E5E2DD]">
              <span className="text-sm text-[#6B6862]">
                {charCount} characters
              </span>
              <span className={`text-xs px-3 py-1 rounded-full ${
                scenario.length > 50 
                  ? 'bg-[#8C7851]/10 text-[#8C7851] border border-[#8C7851]/20' 
                  : 'bg-[#E5E2DD] text-[#6B6862] border border-[#E5E2DD]'
              }`}>
                {scenario.length > 50 ? '✓ Good length' : 'Add more detail'}
              </span>
            </div>
          </motion.div>

          {/* Quick Scenarios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <p className="text-sm text-[#6B6862] mb-3">Quick Start Templates:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {quickScenarios.map((qs, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setScenario(qs.text);
                    setCharCount(qs.text.length);
                  }}
                  className="text-left p-4 bg-white hover:bg-[#F7F5F2] border border-[#E5E2DD] hover:border-[#8C7851] rounded-xl transition-all"
                >
                  <div className="text-xs font-semibold text-[#8C7851] mb-2">
                    {qs.title}
                  </div>
                  <p className="text-xs text-[#6B6862] line-clamp-3">
                    {qs.text}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3"
          >
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#F7F5F2] hover:bg-[#E5E2DD] border border-[#E5E2DD] text-[#3C3A36] transition-all"
            >
              <Settings2 className="w-4 h-4" />
              <span className="text-sm md:text-base">{showSettings ? 'Hide' : 'Configure'} Engine</span>
            </button>

            <button
              onClick={handleSubmit}
              disabled={!scenario.trim()}
              className="group px-8 md:px-10 py-4 rounded-xl md:rounded-2xl font-semibold text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:scale-105 disabled:hover:scale-100 bg-[#8C7851] hover:bg-[#7A6845] disabled:bg-[#D6CFC7] shadow-lg"
            >
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm md:text-base">Synthesize Dialogue</span>
              </div>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
