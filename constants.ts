
import { BoardState, ContentText, Language, Player, Scenario, MoveResult } from './types';

export const TEXT_CONTENT: Record<Language, ContentText> = {
  ko: {
    title: "가장 쉬운 오목 가이드",
    subtitle: "복잡한 규칙은 빼고, 누구나 즐길 수 있는 기본 오목을 배워보세요.",
    basicsTitle: "기본 규칙",
    basics1: "1. 흑과 백이 번갈아 가며 바둑판의 선이 교차하는 점에 돌을 놓습니다.",
    basics2: "2. 흑이 먼저 시작합니다.",
    basics3: "3. 가로, 세로, 대각선 어느 방향이든 같은 색 돌 5개를 먼저 나란히 만들면 승리합니다.",
    winConditionTitle: "승리 조건: 오목(5목)",
    winConditionDesc: "아래 예시처럼 5개의 돌이 이어지면 게임이 끝납니다.",
    tipsTitle: "필수 방어 전략",
    tipsDesc: "상대방이 이기지 못하게 막는 것이 공격만큼 중요합니다. 다음 상황들은 반드시 막아야 합니다.",
    attackTitle: "승리를 위한 공격 패턴",
    attackDesc: "무조건 막기만 해서는 이길 수 없습니다. 주도권을 가져오는 공격 방법을 단계별로 배워보세요.",
    tryItOut: "직접 둬보세요!",
    reset: "다시 하기",
    next: "다음 문제",
    correct: "좋아요!",
    wrong: "거기가 아닙니다.",
    footer: "이제 친구와 함께 오목을 즐겨보세요!",
    quizCompleteTitle: "모든 퀴즈를 풀었습니다!",
    quizCompleteDesc: "이제 아주 기초적인 오목을 둘 준비가 되었습니다.",
    retryQuiz: "퀴즈 다시 풀어보기"
  },
  en: {
    title: "Simple Omok Guide",
    subtitle: "Learn the simplest version of Omok (Five in a Row) without complex rules.",
    basicsTitle: "Basic Rules",
    basics1: "1. Black and White take turns placing stones on the intersections.",
    basics2: "2. Black always moves first.",
    basics3: "3. The first player to get 5 stones in a row (horizontal, vertical, or diagonal) wins.",
    winConditionTitle: "Victory: Five in a Row",
    winConditionDesc: "If you connect 5 stones like the examples below, you win immediately.",
    tipsTitle: "Essential Defense",
    tipsDesc: "Blocking your opponent is as important as attacking. You must recognize these threats.",
    attackTitle: "Winning Strategies",
    attackDesc: "You can't win by just blocking. Learn step-by-step how to take the initiative.",
    tryItOut: "Make a move!",
    reset: "Reset",
    next: "Next Puzzle",
    correct: "Good!",
    wrong: "Not quite.",
    footer: "Now you are ready to play with friends!",
    quizCompleteTitle: "All Quizzes Completed!",
    quizCompleteDesc: "You are now ready to play basic Gomoku.",
    retryQuiz: "Retry Quizzes"
  }
};

// Helper to create board state easily
const createBoard = (coords: [number, number, Player][]): BoardState => {
  const board: BoardState = {};
  coords.forEach(([x, y, p]) => {
    board[`${x},${y}`] = p;
  });
  return board;
};

export const DEFENSE_SCENARIOS: Scenario[] = [
  {
    id: 'open-3',
    title: {
      ko: "열린 3 (Open 3)",
      en: "The Open Three"
    },
    description: {
      ko: "양쪽이 뚫린 3입니다. 한쪽을 막아도 상대가 반대쪽으로 늘리면 4가 됩니다. 끝까지 방어해야 합니다!",
      en: "Three stones with both ends open. If you block one side, they extend to the other. You must keep blocking!"
    },
    initialBoard: createBoard([
      [6, 7, 'black'],
      [7, 7, 'black'],
      [8, 7, 'black']
    ]),
    playerToMove: 'white',
    successMessage: {
      ko: "완벽합니다! 이것이 기본적인 연속 방어 패턴입니다.",
      en: "Perfect! This is the standard defense pattern."
    },
    failureMessage: {
      ko: "위험해요! 뚫린 곳을 막아야 합니다.",
      en: "Dangerous! You must block the open ends."
    },
    evaluateMove: (move, board) => {
        // Case 1: Initial State (3 stones)
        const stoneCount = Object.keys(board).length;
        
        // Step 1: Block the 3
        if (stoneCount === 3) {
            const correctMoves = [{x: 5, y: 7}, {x: 9, y: 7}];
            const isCorrect = correctMoves.some(m => m.x === move.x && m.y === move.y);
            
            if (isCorrect) {
                // Determine opponent response (extend to the other side)
                const opponentMove = move.x === 5 ? {x: 9, y: 7} : {x: 5, y: 7};
                const newBoard: BoardState = {
                    ...board,
                    [`${move.x},${move.y}`]: 'white',
                    [`${opponentMove.x},${opponentMove.y}`]: 'black'
                };
                return {
                    isCorrect: true,
                    isScenarioComplete: false,
                    newBoard: newBoard,
                    message: {
                        ko: "상대가 4를 만들었습니다! 한번 더 막아야 합니다.",
                        en: "Opponent made 4! Block one more time."
                    }
                };
            }
        }
        
        // Step 2: Block the 4
        if (stoneCount === 5) {
             // Current board has 3 initial + 1 user + 1 opponent = 5 stones.
             // Opponent has 4 in a row now (5,7 to 8,7 OR 6,7 to 9,7).
             // We need to block the outer ends: 4,7 or 10,7 depending on board state.
             
             // Find where the gap is
             const validNextMoves = [];
             if (!board['4,7']) validNextMoves.push({x: 4, y: 7});
             if (!board['10,7']) validNextMoves.push({x: 10, y: 7});
             
             const isCorrect = validNextMoves.some(m => m.x === move.x && m.y === move.y);
             if (isCorrect) {
                 return {
                     isCorrect: true,
                     isScenarioComplete: true,
                     newBoard: { ...board, [`${move.x},${move.y}`]: 'white' } as BoardState
                 };
             }
        }

        return { isCorrect: false, isScenarioComplete: false, newBoard: board };
    }
  },
  {
    id: 'four',
    title: {
      ko: "4 (Four)",
      en: "The Deadly Four"
    },
    description: {
      ko: "양쪽이 뚫린 4(Open 4)입니다. 이것을 허용하면 막아도 지게 됩니다. 왜 그런지 확인해보세요.",
      en: "This is an Open 4 (both ends open). If allowed, you lose even if you block. See why."
    },
    initialBoard: createBoard([
      [5, 5, 'white'],
      [6, 6, 'white'],
      [7, 7, 'white'],
      [8, 8, 'white'],
      [5, 3, 'black'] // Distraction
    ]),
    playerToMove: 'black',
    successMessage: {
      ko: "보셨나요? 양쪽이 뚫린 4가 만들어지면 이미 늦습니다. 절대 허용하면 안 됩니다.",
      en: "See that? Once an Open 4 is formed, it's too late. Never let this happen."
    },
    failureMessage: {
      ko: "4를 막아야 합니다!",
      en: "You must block the 4!"
    },
    evaluateMove: (move, board) => {
        // User (Black) must block White's 4.
        // White is at 5,5 to 8,8.
        // Valid blocks: 4,4 or 9,9.
        
        const validBlocks = [{x: 4, y: 4}, {x: 9, y: 9}];
        const isCorrect = validBlocks.some(m => m.x === move.x && m.y === move.y);
        
        if (isCorrect) {
            // User blocks one side, but White plays the other side to win (5 in a row)
            const opponentMove = (move.x === 4 && move.y === 4) ? {x: 9, y: 9} : {x: 4, y: 4};
            
            const newBoard: BoardState = {
                ...board,
                [`${move.x},${move.y}`]: 'black',
                [`${opponentMove.x},${opponentMove.y}`]: 'white'
            };
            
            return {
                isCorrect: true,
                isScenarioComplete: true,
                newBoard: newBoard
            };
        }
        
        return { isCorrect: false, isScenarioComplete: false, newBoard: board };
    }
  },
  {
    id: 'broken-3',
    title: {
      ko: "한 칸 띈 3 (Broken Three)",
      en: "The Broken Three"
    },
    description: {
      ko: "중간이 비어있지만, 이 역시 강력한 공격입니다. 사이를 끼워 막는 것이 가장 좋습니다.",
      en: "There is a gap, but this is still a strong attack. Blocking the gap is usually best."
    },
    initialBoard: createBoard([
      [5, 8, 'black'],
      [6, 8, 'black'],
      [8, 8, 'black'] // Gap at 7,8
    ]),
    playerToMove: 'white',
    successMessage: {
      ko: "좋아요. 상대의 흐름을 끊었습니다.",
      en: "Nice. You disrupted their flow."
    },
    failureMessage: {
      ko: "거기는 막는 곳이 아닙니다.",
      en: "That's not a blocking move."
    },
    evaluateMove: (move, board) => {
        // Simple one step block for Broken 3
        const validMoves = [{ x: 7, y: 8 }]; // Force the middle block for this tutorial lesson
        const isCorrect = validMoves.some(m => m.x === move.x && m.y === move.y);
        
        if (isCorrect) {
             return {
                isCorrect: true,
                isScenarioComplete: true,
                newBoard: { ...board, [`${move.x},${move.y}`]: 'white' } as BoardState
            };
        }
        return { isCorrect: false, isScenarioComplete: false, newBoard: board };
    }
  }
];

export const ATTACK_SCENARIOS: Scenario[] = [
  {
    id: 'block-and-attack',
    title: {
      ko: "1. 수비하며 공격하기 (공방일체)",
      en: "1. Defend while Attacking"
    },
    description: {
      ko: "가장 효율적인 수입니다. 상대의 3을 막으면서, 동시에 나의 3을 만들어보세요.",
      en: "Efficiency is key. Block your opponent's 3 AND create your own 3 with a single move."
    },
    initialBoard: createBoard([
      // White's Horizontal Open 3
      [6, 6, 'white'],
      [7, 6, 'white'],
      [8, 6, 'white'], // Threats at 5,6 and 9,6

      // Black's Setup (Vertical Open 2 needing connection)
      [5, 7, 'black'],
      [5, 8, 'black']
    ]),
    playerToMove: 'black',
    successMessage: {
      ko: "완벽합니다! 상대의 공격은 끊기고, 이제 당신의 차례입니다.",
      en: "Perfect! You stopped them and started your own attack."
    },
    failureMessage: {
      ko: "상대를 막긴 했지만, 나의 공격이 이어지지 않습니다. 더 좋은 자리가 있습니다.",
      en: "You blocked them, but didn't create a threat. Find a better spot."
    },
    evaluateMove: (move, board) => {
        // Goal: Place at 5,6.
        // 1. It blocks White's row (6,6 to 8,6)
        // 2. It connects with Black's column (5,7 to 5,8) to make a 3.
        
        if (move.x === 5 && move.y === 6) {
            // Opponent responds to Black's new threat (Block at 5,5 or 5,9)
            const newBoard: BoardState = {
                 ...board,
                 [`${move.x},${move.y}`]: 'black',
                 '5,5': 'white' // White blocks Black's vertical 3
             };
            return {
                isCorrect: true,
                isScenarioComplete: true,
                newBoard: newBoard,
                message: {
                    ko: "상대를 막으면서 3을 만들었습니다!",
                    en: "You blocked AND made a 3!"
                }
            };
        }

        // Just blocking without attacking (e.g., 9,6)
        if (move.x === 9 && move.y === 6) {
            return {
                isCorrect: false,
                isScenarioComplete: false,
                newBoard: board,
                message: {
                    ko: "수비는 되지만, 나의 공격 기회는 사라집니다.",
                    en: "That blocks, but creates no threat for you."
                }
            };
        }

        return { isCorrect: false, isScenarioComplete: false, newBoard: board };
    }
  },
  {
    id: 'four-three',
    title: {
      ko: "2. 4-3 (양수겸장)",
      en: "2. The 4-3 Double Threat"
    },
    description: {
      ko: "오목 최고의 기술입니다. 한 수로 '4'와 '열린 3'을 동시에 만들어보세요. 상대는 둘 중 하나밖에 못 막습니다.",
      en: "The best move in Gomoku. Create a '4' and an 'Open 3' at the same time. They can only block one."
    },
    initialBoard: createBoard([
      // Vertical almost 4 (needs one at 7,7)
      [7, 4, 'black'],
      [7, 5, 'black'],
      [7, 6, 'black'],
      
      // Horizontal open 2 (needs one at 7,7)
      [5, 7, 'black'],
      [6, 7, 'black'],
      
      // White distraction
      [2, 2, 'white'],
      [3, 2, 'white']
    ]),
    playerToMove: 'black',
    successMessage: {
      ko: "완벽한 승리입니다! 상대가 4를 막으면 3을 늘려서 이길 수 있습니다.",
      en: "Checkmate! If they block the 4, you extend the 3 to win."
    },
    failureMessage: {
      ko: "두 가지 공격이 동시에 만들어지는 곳을 찾아보세요.",
      en: "Find the spot that creates TWO threats at once."
    },
    evaluateMove: (move, board) => {
        // The intersection is 7,7
        if (move.x === 7 && move.y === 7) {
            // Opponent will desperately block the 4 (e.g., 7,8 or 7,3)
            const newBoard: BoardState = {
                ...board,
                [`${move.x},${move.y}`]: 'black',
                '7,8': 'white' // Block the vertical 4
            };
            return {
                isCorrect: true,
                isScenarioComplete: true,
                newBoard: newBoard
            };
        }
        return { isCorrect: false, isScenarioComplete: false, newBoard: board };
    }
  }
];
