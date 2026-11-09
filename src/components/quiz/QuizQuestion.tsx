import React from 'react';
import { motion } from 'framer-motion';
import { QuizOption } from './QuizOption';

interface QuizQuestionProps {
  currentQuestionIndex: number;
  question: any;
  isDailyChallenge: boolean;
  userAnswer: string | null;
  feedback: 'CORRECT' | 'WRONG' | null;
  penaltyActive: boolean;
  handleAnswer: (answer: string) => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  currentQuestionIndex,
  question,
  isDailyChallenge,
  userAnswer,
  feedback,
  penaltyActive,
  handleAnswer
}) => {
  return (
    <div className="flex-grow relative z-10">
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`p-6 md:p-12 rounded-[2rem] shadow-xl border mb-6 md:mb-8 relative overflow-hidden ${
          isDailyChallenge ? 'bg-white/5 border-white/10' : 'bg-theme-card border-theme-border'
        }`}
      >
        <div className={`absolute top-0 left-0 w-2 h-full ${isDailyChallenge ? 'bg-amber-400' : 'bg-theme-accent'}`} />
        {question.patternIndex && question.type !== 'CALCULATION' && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] md:text-xs font-bold px-2.5 py-0.5 rounded-full bg-theme-accent/15 text-theme-accent border border-theme-accent/30 tracking-wider">
              出題パターン {question.patternIndex} / 3
            </span>
          </div>
        )}
        <h3 className="text-xl md:text-3xl font-theme-heading leading-relaxed mb-0">
          {question.description}
        </h3>
      </motion.div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {question.options.map((option: string, idx: number) => (
          <QuizOption
            key={`${currentQuestionIndex}-${idx}`}
            option={option}
            idx={idx}
            isCorrect={option === question.correctAnswer}
            isSelected={option === userAnswer}
            feedback={feedback}
            isDailyChallenge={isDailyChallenge}
            penaltyActive={penaltyActive}
            handleAnswer={handleAnswer}
          />
        ))}
      </div>
    </div>
  );
};
