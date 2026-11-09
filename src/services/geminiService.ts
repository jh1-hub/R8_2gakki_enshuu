import { allTermsMap } from "../data/quizData";

export type QuestionType = 'TERM_TO_DESC' | 'DESC_TO_TERM' | 'CALCULATION';

export interface Question {
  term: string;
  description: string;
  correctAnswer: string;
  options: string[];
  type: QuestionType;
  patternIndex?: number;
}

/**
 * Generates a random base conversion problem.
 */
export function generateCalculationQuestion(optionCount: number = 5): Question {
  const value = Math.floor(Math.random() * 255) + 1; // 1-255 range for a bit more challenge
  const bases = [2, 10, 16];
  const fromBase = bases[Math.floor(Math.random() * bases.length)];
  const toBase = bases.filter(b => b !== fromBase)[Math.floor(Math.random() * (bases.length - 1))];

  const questionText = `${fromBase}進数の「${value.toString(fromBase).toUpperCase()}」を${toBase}進数に変換せよ。`;
  const correctAnswer = value.toString(toBase).toUpperCase();
  const distractors = generateBaseDistractors(value, toBase, optionCount - 1);
  const options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

  return {
    term: '基数変換', // Associated term for stats
    description: questionText,
    correctAnswer,
    options,
    type: 'CALCULATION',
    patternIndex: 1
  };
}

/**
 * Generates a distractor for base conversion by adding/subtracting small values
 * or making common mistakes (like swapping bases).
 */
function generateBaseDistractors(correctValue: number, base: number, count: number): string[] {
  const distractors = new Set<string>();
  while (distractors.size < count) {
    const offset = Math.floor(Math.random() * 10) - 5;
    if (offset === 0) continue;
    const val = Math.max(0, correctValue + offset);
    distractors.add(val.toString(base).toUpperCase());
  }
  return Array.from(distractors);
}

/**
 * Picks a pattern index based on the weighted distribution:
 * - Pattern 1 (基本): 66%
 * - Pattern 2 (特徴・仕組み): 25%
 * - Pattern 3 (実践・応用): 残り 9%
 */
function pickWeightedPatternIndex(length: number): number {
  if (length <= 1) return 0;
  const rand = Math.random();
  if (rand < 0.66) {
    return 0; // Pattern 1 (66%)
  } else if (rand < 0.91) {
    return Math.min(1, length - 1); // Pattern 2 (25%)
  } else {
    return Math.min(2, length - 1); // Pattern 3 (残り9%)
  }
}

/**
 * Generates a question from static data or dynamic logic.
 * Prioritizes distractors from the same subcategory/pool if provided.
 */
export async function generateQuestion(
  term: string, 
  relatedTerms: string[], 
  fallbackTerms?: string[],
  forcedType?: QuestionType,
  optionCount: number = 5
): Promise<Question> {
  // Special handling for base conversion terms
  if (term === '2進数' || term === '16進数' || term === '基数変換' || term === '10進数') {
    const isDynamic = Math.random() < 0.7; // 70% chance for a dynamic math problem
    if (isDynamic) {
      const value = Math.floor(Math.random() * 63) + 1; // 1-63 range for simplicity
      const fromBase = [2, 10, 16][Math.floor(Math.random() * 3)];
      let toBase = [2, 10, 16].filter(b => b !== fromBase)[Math.floor(Math.random() * 2)];
      
      // Specifically target the term if possible
      if (term === '2進数') toBase = 2;
      if (term === '16進数') toBase = 16;
      if (term === '10進数') toBase = 10;

      if (fromBase !== toBase) {
        const questionText = `${fromBase}進数の「${value.toString(fromBase).toUpperCase()}」を${toBase}進数に変換せよ。`;
        const correctAnswer = value.toString(toBase).toUpperCase();
        const distractors = generateBaseDistractors(value, toBase, optionCount - 1);
        const options = [correctAnswer, ...distractors].sort(() => 0.5 - Math.random());

        return {
          term,
          description: questionText,
          correctAnswer,
          options,
          type: 'CALCULATION',
          patternIndex: 1
        };
      }
    }
  }

  // Try to get distractors from related terms first
  let distractorPool = relatedTerms.filter(t => t !== term);
  
  // If not enough related terms, use fallback terms
  if (distractorPool.length < optionCount && fallbackTerms) {
    const additionalTerms = fallbackTerms.filter(t => t !== term && !distractorPool.includes(t));
    distractorPool = [...distractorPool, ...additionalTerms];
  }

  // 1/3 probability: Question is Term, Options are Descriptions (4 choices)
  // Or forced by parameter
  const isTermQuestion = forcedType ? forcedType === 'TERM_TO_DESC' : Math.random() < 0.33;

  // If options are descriptions, limit to 4 choices. Otherwise use the requested optionCount.
  const actualOptionCount = isTermQuestion ? Math.min(4, optionCount) : optionCount;

  const termData = allTermsMap[term];

  if (isTermQuestion && termData) {
    const patterns = termData.descriptions;
    const chosenIdx = pickWeightedPatternIndex(patterns.length);
    const correctDescription = patterns[chosenIdx];
    
    // Get distractors (descriptions of other terms)
    const distractors = distractorPool
      .sort(() => 0.5 - Math.random())
      .slice(0, actualOptionCount - 1)
      .map(t => {
        const tData = allTermsMap[t];
        const descPatterns = tData ? tData.descriptions : ["説明がありません。"];
        return descPatterns[pickWeightedPatternIndex(descPatterns.length)];
      });

    const options = [correctDescription, ...distractors].sort(() => 0.5 - Math.random());

    return {
      term: term,
      description: `${term} の説明として最も適切なものはどれか。`,
      correctAnswer: correctDescription,
      options: options,
      type: 'TERM_TO_DESC',
      patternIndex: chosenIdx + 1
    };
  }

  // Standard pattern: Question is Description, Options are Terms
  const otherOptions = distractorPool
    .sort(() => 0.5 - Math.random())
    .slice(0, actualOptionCount - 1); 

  const options = [term, ...otherOptions].sort(() => 0.5 - Math.random());

  // Check if static descriptions exist for this term
  if (termData) {
    const patterns = termData.descriptions;
    const chosenIdx = pickWeightedPatternIndex(patterns.length);
    const randomDescription = patterns[chosenIdx];
    
    return {
      term: term,
      description: randomDescription,
      correctAnswer: term,
      options: options,
      type: 'DESC_TO_TERM',
      patternIndex: chosenIdx + 1
    };
  }

  // Fallback if no static description is found (should not happen with complete data)
  return {
    term: term,
    description: `${term}に関する説明文が見つかりませんでした。`,
    correctAnswer: term,
    options: options,
    type: 'DESC_TO_TERM',
    patternIndex: 1
  };
}
