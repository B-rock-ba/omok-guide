
import React, { useState, useEffect } from 'react';
import { Scenario, Language, Coordinate, Player } from '../types';
import { TEXT_CONTENT } from '../constants';
import OmokBoard from './OmokBoard';
import { CheckCircle, XCircle, RotateCcw, ChevronRight, HelpCircle, Trophy } from 'lucide-react';

interface InteractiveQuizProps {
  scenarios: Scenario[];
  language: Language;
}

const InteractiveQuiz: React.FC<InteractiveQuizProps> = ({ scenarios, language }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [board, setBoard] = useState(scenarios[0].initialBoard);
  const [status, setStatus] = useState<'playing' | 'success' | 'failure'>('playing');
  const [lastMove, setLastMove] = useState<Coordinate | null>(null);
  const [customMessage, setCustomMessage] = useState<string | null>(null);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const currentScenario = scenarios[currentIndex];
  const content = TEXT_CONTENT[language];

  useEffect(() => {
    resetScenario();
  }, [currentIndex, scenarios]);

  const resetScenario = () => {
    setBoard(currentScenario.initialBoard);
    setStatus('playing');
    setLastMove(null);
    setCustomMessage(null);
  };

  const resetAll = () => {
    setCurrentIndex(0);
    setIsQuizComplete(false);
  };

  const handleMove = (coord: Coordinate) => {
    if (status !== 'playing') return;

    // Run the specific logic for this scenario
    const result = currentScenario.evaluateMove(coord, board);

    if (!result.isCorrect) {
        setStatus('failure');
        return;
    }

    // Apply board updates (includes opponent move if any)
    setBoard(result.newBoard);
    setLastMove(coord);

    // Check if custom message exists for this step (e.g. "Opponent made 4!")
    if (result.message) {
        setCustomMessage(result.message[language]);
    } else {
        setCustomMessage(null);
    }

    if (result.isScenarioComplete) {
        setStatus('success');
    }
  };

  const nextScenario = () => {
    if (currentIndex < scenarios.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsQuizComplete(true);
    }
  };

  if (isQuizComplete) {
      return (
        <div className="flex flex-col items-center gap-6 p-10 bg-white rounded-2xl shadow-sm border border-stone-200 text-center max-w-2xl mx-auto animate-in fade-in duration-500">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center text-amber-500 mb-2">
                <Trophy size={40} />
            </div>
            <h3 className="text-3xl font-bold text-stone-900">{content.quizCompleteTitle}</h3>
            <p className="text-xl text-stone-600">{content.quizCompleteDesc}</p>
            <button 
                onClick={resetAll}
                className="mt-6 px-8 py-3 bg-stone-900 text-white font-medium rounded-full hover:bg-stone-800 transition-colors flex items-center gap-2"
            >
                <RotateCcw size={18} />
                {content.retryQuiz}
            </button>
        </div>
      );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-6 bg-white rounded-2xl shadow-sm border border-stone-200 transition-all duration-300">
        <div className="text-center max-w-2xl">
            <div className="flex items-center justify-center gap-2 mb-2 text-amber-600 font-semibold uppercase tracking-wider text-sm">
                <HelpCircle size={16} />
                <span>Puzzle {currentIndex + 1} / {scenarios.length}</span>
            </div>
            <h3 className="text-2xl font-bold text-stone-900 mb-3">{currentScenario.title[language]}</h3>
            <p className="text-stone-600 min-h-[3rem]">{customMessage || currentScenario.description[language]}</p>
            
            {status === 'playing' && (
                <div className="mt-4 inline-block px-4 py-1 bg-amber-100 text-amber-900 rounded-full text-sm font-medium animate-pulse">
                    {content.tryItOut} ({currentScenario.playerToMove === 'black' ? (language === 'ko' ? '흑 차례' : 'Black\'s Turn') : (language === 'ko' ? '백 차례' : 'White\'s Turn')})
                </div>
            )}
        </div>

        <OmokBoard 
            boardState={board}
            interactive={status === 'playing'}
            onCellClick={handleMove}
            lastMove={lastMove}
            boardSize={15}
        />

        <div className="h-24 flex flex-col items-center justify-center w-full">
            {status === 'success' && (
                <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 text-green-600 font-bold text-xl">
                        <CheckCircle className="w-6 h-6" />
                        {content.correct}
                    </div>
                    <p className="text-green-700">{currentScenario.successMessage[language]}</p>
                    <button 
                        onClick={nextScenario}
                        className="mt-2 flex items-center gap-2 px-6 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-700 transition-colors"
                    >
                        {content.next} <ChevronRight size={18} />
                    </button>
                </div>
            )}

            {status === 'failure' && (
                <div className="flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-2 text-red-600 font-bold text-xl">
                        <XCircle className="w-6 h-6" />
                        {content.wrong}
                    </div>
                    <p className="text-red-700">{currentScenario.failureMessage[language]}</p>
                    <button 
                        onClick={resetScenario}
                        className="mt-2 flex items-center gap-2 px-6 py-2 bg-stone-200 text-stone-800 rounded-full hover:bg-stone-300 transition-colors"
                    >
                        <RotateCcw size={18} />
                        {content.reset}
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default InteractiveQuiz;
