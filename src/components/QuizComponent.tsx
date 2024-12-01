'use client';

import { useState, useMemo } from 'react';
import questions from '@/data/questions.json';

export default function QuizComponent() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [numQuestions, setNumQuestions] = useState<number>(10);
  const [quizStarted, setQuizStarted] = useState(false);

  // Randomly select questions when quiz starts
  const selectedQuestions = useMemo(() => {
    if (!quizStarted) return [];
    return [...questions.questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, numQuestions);
  }, [quizStarted, numQuestions]);

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    Object.entries(selectedAnswers).forEach(([questionId, answerId]) => {
      const question = selectedQuestions.find(q => q.id === questionId);
      if (question && question.correctAnswer === answerId) {
        correct++;
      }
    });
    return correct;
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
  };

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <h1 className="text-2xl font-bold text-center mb-6 text-white">
              Configure Your Quiz
            </h1>
            <div className="mb-6">
              <label className="block text-gray-200 mb-2">
                Number of Questions (max {questions.questions.length}):
              </label>
              <input
                type="number"
                min="1"
                max={questions.questions.length}
                value={numQuestions}
                onChange={(e) => setNumQuestions(Math.min(
                  Math.max(1, parseInt(e.target.value) || 1),
                  questions.questions.length
                ))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <button
              onClick={startQuiz}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-white">Test Results</h1>
          <div className="bg-gray-800 shadow rounded-lg p-6">
            <p className="text-xl text-center text-gray-200 mb-6">
              You scored {score} out of {selectedQuestions.length}
            </p>
            
            <div className="space-y-8 mb-8">
              {selectedQuestions.map((question, index) => {
                const isCorrect = selectedAnswers[question.id] === question.correctAnswer;
                const selectedChoice = question.choices.find(c => c.id === selectedAnswers[question.id]);
                const correctChoice = question.choices.find(c => c.id === question.correctAnswer);

                return (
                  <div key={question.id} className={`p-4 rounded-lg border ${
                    isCorrect ? 'border-green-600 bg-gray-800/50' : 'border-red-600 bg-gray-800/50'
                  }`}>
                    <p className="text-lg text-white mb-4">
                      {index + 1}. {question.text}
                    </p>
                    
                    <div className="space-y-2 ml-4">
                      <p className="text-gray-300">
                        Your answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                          {selectedChoice?.text}
                        </span>
                      </p>
                      
                      {!isCorrect && (
                        <p className="text-gray-300">
                          Correct answer: <span className="text-green-400">{correctChoice?.text}</span>
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setQuizStarted(false)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
              >
                New Quiz
              </button>
              <button
                onClick={startQuiz}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
              >
                Retry Same Questions
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800 shadow rounded-lg p-6">
          <div className="mb-4">
            <span className="text-sm text-gray-400">
              Question {currentQuestionIndex + 1} of {selectedQuestions.length}
            </span>
          </div>
          <h2 className="text-xl font-semibold mb-4 text-white">{currentQuestion.text}</h2>
          <div className="space-y-4">
            {currentQuestion.choices.map((choice) => (
              <label
                key={choice.id}
                className="flex items-center p-4 border border-gray-700 rounded-lg hover:bg-gray-700 cursor-pointer bg-gray-800 text-gray-200"
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={choice.id}
                  checked={selectedAnswers[currentQuestion.id] === choice.id}
                  onChange={() => handleAnswerSelect(currentQuestion.id, choice.id)}
                  className="mr-3"
                />
                <span>{choice.text}</span>
              </label>
            ))}
          </div>
          <button
            onClick={handleNext}
            disabled={!selectedAnswers[currentQuestion.id]}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {currentQuestionIndex === selectedQuestions.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
