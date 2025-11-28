
export type Language = 'ko' | 'en';

export type Player = 'black' | 'white';

export interface Coordinate {
  x: number;
  y: number;
}

export interface BoardState {
  [key: string]: Player; // key is "x,y"
}

export interface MoveResult {
  isCorrect: boolean;
  isScenarioComplete: boolean;
  newBoard: BoardState;
  message?: { ko: string; en: string }; // Custom message for this specific step
}

export interface Scenario {
  id: string;
  title: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  initialBoard: BoardState;
  playerToMove: Player;
  // Function to evaluate the move based on current board state
  evaluateMove: (move: Coordinate, currentBoard: BoardState) => MoveResult;
  successMessage: {
    ko: string;
    en: string;
  };
  failureMessage: {
    ko: string;
    en: string;
  };
}

export interface ContentText {
  title: string;
  subtitle: string;
  basicsTitle: string;
  basics1: string;
  basics2: string;
  basics3: string;
  winConditionTitle: string;
  winConditionDesc: string;
  tipsTitle: string;
  tipsDesc: string;
  
  // Attack Section
  attackTitle: string;
  attackDesc: string;

  tryItOut: string;
  reset: string;
  next: string;
  correct: string;
  wrong: string;
  footer: string;
  // New fields
  quizCompleteTitle: string;
  quizCompleteDesc: string;
  retryQuiz: string;
}