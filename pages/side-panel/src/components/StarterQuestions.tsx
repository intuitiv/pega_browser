import React from 'react';

interface StarterQuestionsProps {
  onQuestionClick: (question: string) => void;
  isDarkMode?: boolean;
}

const questions = ['What can you do?', 'Summarize the current page.', 'Find the contact information on this page.'];

export const StarterQuestions = ({ onQuestionClick, isDarkMode = false }: StarterQuestionsProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h3 className={`mb-4 text-center text-lg font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Try these
        </h3>
        <div className="space-y-2">
          {questions.map((question, index) => (
            <button
              key={index}
              onClick={() => onQuestionClick(question)}
              className={`w-full rounded-lg p-3 text-left text-sm ${
                isDarkMode
                  ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}>
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
