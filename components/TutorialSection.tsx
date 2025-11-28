import React from 'react';

interface TutorialSectionProps {
  title: string;
  children: React.ReactNode;
  alternate?: boolean;
}

export const TutorialSection: React.FC<TutorialSectionProps> = ({ title, children, alternate = false }) => {
  return (
    <section className={`py-12 px-4 md:px-8 ${alternate ? 'bg-white' : 'bg-stone-50'}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-stone-800 mb-8 text-center border-b-2 border-amber-400 inline-block pb-2 px-4">
          {title}
        </h2>
        <div className="space-y-6 text-lg text-stone-700 leading-relaxed">
          {children}
        </div>
      </div>
    </section>
  );
};