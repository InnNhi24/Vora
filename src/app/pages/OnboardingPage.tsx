/**
 * Onboarding page with scenario guidelines
 */

import { motion } from 'motion/react';
import { Target, Users, MessageCircle, Lightbulb, ArrowRight } from 'lucide-react';
import { VoraLogo } from '../components/VoraLogo';

interface OnboardingPageProps {
  onGetStarted: () => void;
}

export function OnboardingPage({ onGetStarted }: OnboardingPageProps) {
  const guidelines = [
    {
      icon: Target,
      title: 'Be Specific',
      description: 'Clearly describe the setting, context, and goal of the conversation.',
      example: '"A negotiation at a luxury perfume boutique"'
    },
    {
      icon: Users,
      title: 'Define Characters',
      description: 'Make it clear who the two speakers are and their relationship.',
      example: '"A sales consultant and a customer"'
    },
    {
      icon: MessageCircle,
      title: 'Set the Tone',
      description: 'Mention the mood, stakes, or emotional context of the interaction.',
      example: '"A tense job interview for a senior role"'
    },
    {
      icon: Lightbulb,
      title: 'Keep it Focused',
      description: 'Describe a single, complete interaction rather than multiple scenes.',
      example: '"Friends debating which movie to watch"'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      <div className="max-w-screen-xl mx-auto px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
              className="inline-block mb-6"
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8C7851] flex items-center justify-center shadow-lg p-3">
                <VoraLogo className="w-full h-full" />
              </div>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#3C3A36] mb-4"
            >
              Welcome to Vora
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg md:text-xl text-[#6B6862] max-w-2xl mx-auto"
            >
              AI-powered dialogue synthesis. Create authentic conversations with intelligent refinement.
            </motion.p>
          </div>

          {/* Guidelines Grid - Mobile-First */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12 md:mb-16">
            {guidelines.map((guide, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-white border border-[#E5E2DD] rounded-xl md:rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-[#F7F5F2] flex items-center justify-center">
                      <guide.icon className="w-6 h-6 text-[#8C7851]" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-[#3C3A36] mb-2">
                      {guide.title}
                    </h3>
                    <p className="text-sm text-[#6B6862] mb-3 leading-relaxed">
                      {guide.description}
                    </p>
                    <div className="bg-[#F7F5F2] rounded-lg p-3 border border-[#E5E2DD]">
                      <p className="text-xs text-[#3C3A36] font-medium">
                        {guide.example}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="text-center"
          >
            <button
              onClick={onGetStarted}
              className="group w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl font-semibold text-base md:text-lg text-white bg-[#8C7851] hover:bg-[#7A6845] transition-all hover:scale-105 shadow-lg"
            >
              <span>Start Journey</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <p className="text-sm text-[#6B6862] mt-4">
              No credit card required • Start creating in seconds
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}