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

const BINARY_BIT_WIDTH = 8;

function formatNumberForBase(value: number, base: number): string {
  if (base === 2) {
    return value.toString(2).padStart(BINARY_BIT_WIDTH, '0');
  }
  return value.toString(base).toUpperCase();
}

function formatBasePrompt(fromBase: number, toBase: number, value: number): string {
  const formattedInput = formatNumberForBase(value, fromBase);
  const fromLabel =
    fromBase === 2
      ? `${BINARY_BIT_WIDTH}ビットの2進数「${formattedInput}」`
      : fromBase === 16
        ? `16進数の「${formattedInput}」(0x${formattedInput})`
        : `10進数の「${formattedInput}」`;
  const toLabel = toBase === 2 ? `${BINARY_BIT_WIDTH}ビットの2進数` : `${toBase}進数`;
  return `${fromLabel}を${toLabel}に変換せよ。`;
}

/**
 * Generates a random base conversion problem.
 */
export function generateCalculationQuestion(optionCount: number = 5): Question {
  const bases = [2, 10, 16];
  const fromBase = bases[Math.floor(Math.random() * bases.length)];
  const toBase = bases.filter(b => b !== fromBase)[Math.floor(Math.random() * (bases.length - 1))];
  const involvesHex = fromBase === 16 || toBase === 16;
  const minVal = involvesHex ? 16 : 1;
  const maxVal = 255;
  const value = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

  const questionText = formatBasePrompt(fromBase, toBase, value);
  const correctAnswer = formatNumberForBase(value, toBase);
  const distractors = generateBaseDistractors(value, toBase, optionCount - 1, minVal, maxVal);
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
 * Generates distractors for base conversion by applying small offsets or 1-bit flips
 * within the valid range [minVal, maxVal].
 */
function generateBaseDistractors(
  correctValue: number,
  base: number,
  count: number,
  minVal: number = 1,
  maxVal: number = 255
): string[] {
  const correctStr = formatNumberForBase(correctValue, base);
  const distractors = new Set<string>();
  const candidateOffsets = [-8, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 8];

  // Include 1-bit flip candidates for binary/hex problems
  const bitFlipCandidates: number[] = [];
  for (let bit = 0; bit < BINARY_BIT_WIDTH; bit++) {
    const flipped = correctValue ^ (1 << bit);
    if (flipped !== correctValue && flipped >= minVal && flipped <= maxVal) {
      bitFlipCandidates.push(flipped);
    }
  }

  const pool = new Set<number>();
  for (const offset of candidateOffsets) {
    const val = correctValue + offset;
    if (val !== correctValue && val >= minVal && val <= maxVal) {
      pool.add(val);
    }
  }
  for (const flipped of bitFlipCandidates) {
    pool.add(flipped);
  }

  const shuffledPool = Array.from(pool).sort(() => 0.5 - Math.random());
  for (const val of shuffledPool) {
    if (distractors.size >= count) break;
    const str = formatNumberForBase(val, base);
    if (str !== correctStr) {
      distractors.add(str);
    }
  }

  // Fallback widening loop guaranteed to terminate
  let spread = 12;
  while (distractors.size < count) {
    const val = Math.floor(Math.random() * (Math.min(maxVal, correctValue + spread) - Math.max(minVal, correctValue - spread) + 1)) + Math.max(minVal, correctValue - spread);
    if (val !== correctValue) {
      const str = formatNumberForBase(val, base);
      if (str !== correctStr) {
        distractors.add(str);
      }
    }
    spread = Math.min(maxVal, spread + 10);
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
      const fromBase = [2, 10, 16][Math.floor(Math.random() * 3)];
      let toBase = [2, 10, 16].filter(b => b !== fromBase)[Math.floor(Math.random() * 2)];
      
      // Specifically target the term if possible
      if (term === '2進数') toBase = 2;
      if (term === '16進数') toBase = 16;
      if (term === '10進数') toBase = 10;

      if (fromBase !== toBase) {
        const involvesHex = fromBase === 16 || toBase === 16;
        const involvesDec = fromBase === 10 || toBase === 10;
        const minVal = involvesHex ? 16 : 1;
        const maxVal = involvesDec ? 63 : 255;
        const value = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;

        const questionText = formatBasePrompt(fromBase, toBase, value);
        const correctAnswer = formatNumberForBase(value, toBase);
        const distractors = generateBaseDistractors(value, toBase, optionCount - 1, minVal, maxVal);
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
