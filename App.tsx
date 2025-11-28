
import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import { Language } from './types';
import { TEXT_CONTENT, DEFENSE_SCENARIOS, ATTACK_SCENARIOS } from './constants';
import OmokBoard from './components/OmokBoard';
import { TutorialSection } from './components/TutorialSection';
import InteractiveQuiz from './components/InteractiveQuiz';

function App() {
  const [language, setLanguage] = useState<Language>('en');
  const content = TEXT_CONTENT[language];

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ko' ? 'en' : 'ko');
  };

  return (
    <div className="min-h-screen bg-stone-100">
      {/* Header / Nav */}
      <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-amber-400 font-bold text-xs">
                5
            </div>
            <span className="font-bold text-xl text-stone-900 tracking-tight">SimpleOmok</span>
          </div>
          
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors border border-stone-300"
          >
            <Globe size={16} />
            <span className="text-sm font-medium uppercase">{language === 'ko' ? 'English' : '한국어'}</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-stone-900 mb-6 leading-tight tracking-tight">
            {content.title}
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto font-light">
            {content.subtitle}
          </p>
        </div>

        {/* Basics */}
        <TutorialSection title={content.basicsTitle} alternate>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 order-2 md:order-1">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 shadow-sm">
                    <p className="font-medium text-lg">{content.basics1}</p>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 shadow-sm">
                    <p className="font-medium text-lg">{content.basics2}</p>
                </div>
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 shadow-sm">
                    <p className="font-medium text-lg">{content.basics3}</p>
                </div>
            </div>
            <div className="flex justify-center order-1 md:order-2">
                 {/* Small demo board showing turns */}
                 <div className="flex flex-col items-center">
                    <OmokBoard 
                        boardState={{
                            '7,7': 'black',
                            '7,8': 'white',
                            '8,7': 'black',
                            '6,6': 'white',
                            '6,8': 'black'
                        }}
                        readOnly
                        highlightedCells={[{x:7, y:7}, {x:7, y:8}, {x:8, y:7}]}
                        className="w-64 h-64 md:w-80 md:h-80 shadow-lg"
                    />
                    <p className="text-center text-sm text-stone-500 mt-4 font-medium">
                        {language === 'ko' ? '교차점에 돌을 놓습니다.' : 'Stones are placed on intersections.'}
                    </p>
                 </div>
            </div>
          </div>
        </TutorialSection>

        {/* Winning Condition */}
        <TutorialSection title={content.winConditionTitle}>
            <div className="text-center mb-10">
                <p className="text-xl">{content.winConditionDesc}</p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-10">
                <div className="flex flex-col items-center gap-4">
                    <OmokBoard 
                        boardSize={9}
                        boardState={{
                            '2,4': 'black', '3,4': 'black', '4,4': 'black', '5,4': 'black', '6,4': 'black'
                        }}
                        readOnly
                        highlightedCells={[{x:2,y:4}, {x:6,y:4}]}
                        className="w-40 h-40 md:w-48 md:h-48"
                    />
                    <span className="font-semibold text-stone-600">{language === 'ko' ? '가로 (Horizontal)' : 'Horizontal'}</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <OmokBoard 
                        boardSize={9}
                        boardState={{
                            '4,2': 'white', '4,3': 'white', '4,4': 'white', '4,5': 'white', '4,6': 'white'
                        }}
                        readOnly
                        highlightedCells={[{x:4,y:2}, {x:4,y:6}]}
                        className="w-40 h-40 md:w-48 md:h-48"
                    />
                    <span className="font-semibold text-stone-600">{language === 'ko' ? '세로 (Vertical)' : 'Vertical'}</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                    <OmokBoard 
                        boardSize={9}
                        boardState={{
                            '2,2': 'black', '3,3': 'black', '4,4': 'black', '5,5': 'black', '6,6': 'black'
                        }}
                        readOnly
                        highlightedCells={[{x:2,y:2}, {x:6,y:6}]}
                        className="w-40 h-40 md:w-48 md:h-48"
                    />
                    <span className="font-semibold text-stone-600">{language === 'ko' ? '대각선 (Diagonal)' : 'Diagonal'}</span>
                </div>
            </div>
        </TutorialSection>

        {/* Defensive Strategies */}
        <TutorialSection title={content.tipsTitle} alternate>
            <div className="max-w-3xl mx-auto text-center mb-12">
                <p>{content.tipsDesc}</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
                <InteractiveQuiz key="defense-quiz" scenarios={DEFENSE_SCENARIOS} language={language} />
            </div>
        </TutorialSection>
        
        {/* Attack Strategies */}
        <TutorialSection title={content.attackTitle}>
            <div className="max-w-3xl mx-auto text-center mb-12">
                <p>{content.attackDesc}</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
                <InteractiveQuiz key="attack-quiz" scenarios={ATTACK_SCENARIOS} language={language} />
            </div>
        </TutorialSection>

      </main>

      <footer className="bg-stone-900 text-stone-300 py-12 text-center">
        <div className="max-w-4xl mx-auto px-6">
            <h3 className="text-2xl font-bold text-white mb-4">SimpleOmok</h3>
            <p className="mb-8">{content.footer}</p>
            <p className="text-sm text-stone-500">
                Designed for beginners. No complex Renju rules. Just Connect 5.
            </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
