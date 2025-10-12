import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { db, auth, timestamp } from '../utils/firebase';
import { generateQuizCode } from '../utils/quizCode';
import Header from './Header';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(null);
  const [hoveredQuestionIndex, setHoveredQuestionIndex] = useState(null);

  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correct, setCorrect] = useState(0);

  const handleAddQuestion = () => {
    setEditingQuestion(questions.length);
    setQuestionText("");
    setOptions(["", ""]);
    setCorrect(0);
    setCurrentQuestionIndex(questions.length);
  };

  const handleSaveQuestion = () => {
    if (!questionText.trim()) {
      alert("Please enter a question.");
      return;
    }
    if (options.some(opt => !opt.trim())) {
      alert("Please fill out all options.");
      return;
    }

    const questionData = {
      question: questionText,
      options: options.filter(opt => opt.trim()),
      correct
    };

    if (editingQuestion !== null && editingQuestion < questions.length) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestion] = questionData;
      setQuestions(updatedQuestions);
    } else {
      setQuestions([...questions, questionData]);
    }

    setEditingQuestion(null);
    setCurrentQuestionIndex(null);
    setQuestionText("");
    setOptions(["", "", ""]);
    setCorrect(0);
  };

  const handleQuestionClick = (index) => {
    setEditingQuestion(index);
    setCurrentQuestionIndex(index);
    const q = questions[index];
    setQuestionText(q.question);
    setOptions([...q.options, "", ""].slice(0, Math.max(q.options.length, 2)));
    setCorrect(q.correct);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (options.length < 6) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const updatedOptions = options.filter((_, i) => i !== index);
      setOptions(updatedOptions);
      if (correct >= updatedOptions.length) {
        setCorrect(0);
      }
    }
  };

  const handleNavigateQuestion = (direction) => {
    if (questions.length <= 1) return;
    
    let newIndex = currentQuestionIndex + direction;
    if (newIndex < 0) newIndex = questions.length - 1;
    if (newIndex >= questions.length) newIndex = 0;
    
    handleQuestionClick(newIndex);
  };

  const onSaveQuiz = async () => {
    if (!title.trim() || questions.length === 0) {
      alert("Add a title and at least one question.");
      return;
    }

    try {
      const quizCode = await generateQuizCode(8);
      const quizData = {
        title,
        quizCode,
        createdBy: auth.currentUser.uid,
        createdName: auth.currentUser.displayName,
        createdAt: timestamp(),
      };

      const quizRef = await addDoc(collection(db, 'quizzes'), quizData);
      
      await Promise.all(
        questions.map((q, idx) => {
          const questionRef = doc(db, 'quizzes', quizRef.id, 'questions', `question${idx+1}`);
          return setDoc(questionRef, {
            description: q.question,
            options: q.options,
            correctOption: q.correct,
            createdAt: timestamp(),
          });
        })
      );

      alert(`Quiz created! Code = ${quizCode}`);
      navigate(`/quiz/${quizCode}`);
    } catch(err) {
      console.error(err);
      alert("Error saving quiz: " + err.message);
    }
  };

  if (currentQuestionIndex !== null) {
    return (
      <div className="min-h-screen text-white" style={{ background: 'var(--color-background)', fontFamily: 'var(--font-main)' }}>
        <Header />
        
        <div className="max-w-md mx-auto px-4 py-8">
          {/* <div className="flex justify-start mb-8">
            <button
              onClick={() => {
                setCurrentQuestionIndex(null);
                setEditingQuestion(null);
              }}
              className="px-6 py-2 rounded-full text-sm transition-all"
              style={{ 
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.15)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            >
              Create Quiz
            </button>
          </div> */}

          <div className="space-y-6">
            <div className="rounded-3xl p-6 transition-all" style={{ background: 'var(--color-create)' }}>
              <h2 className="text-3xl mb-4 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
                Q{currentQuestionIndex + 1}.
              </h2>
              <input
                type="text"
                placeholder="Enter question..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                className="w-full bg-transparent text-white text-center text-lg outline-none placeholder-white placeholder-opacity-60"
                style={{ border: 'none', fontFamily: 'var(--font-main)' }}
              />
            </div>

            <div className="space-y-3">
              {options.map((opt, index) => (
                <div
                  key={index}
                  className="rounded-3xl p-4 flex items-center gap-3 transition-all"
                  style={{ background: 'rgba(90, 132, 255, 0.3)' }}
                >
                  <input
                    type="radio"
                    name="correctOption"
                    checked={correct === index}
                    onChange={() => setCorrect(index)}
                    className="w-5 h-5 cursor-pointer"
                    style={{ accentColor: 'var(--color-create)' }}
                  />
                  <input
                    type="text"
                    placeholder="Enter option"
                    value={opt}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 bg-transparent text-white outline-none placeholder-white placeholder-opacity-60"
                    style={{ fontFamily: 'var(--font-main)' }}
                  />
                  {options.length > 2 && (
                    <button
                      onClick={() => removeOption(index)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}

              {options.length < 6 && (
                <button
                  onClick={addOption}
                  className="w-full rounded-3xl p-4 transition-all flex items-center justify-center"
                  style={{ background: 'rgba(90, 132, 255, 0.2)' }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(90, 132, 255, 0.3)'}
                  onMouseLeave={(e) => e.target.style.background = 'rgba(90, 132, 255, 0.2)'}
                >
                  <span className="text-2xl">+</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => handleNavigateQuestion(-1)}
                disabled={questions.length <= 1}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>

              <button
                onClick={() => {
                  handleSaveQuestion();
                  setCurrentQuestionIndex(null);
                  setEditingQuestion(null);
                }}
                className="rounded-full px-3 py-3 transition-all flex items-center justify-center gap-2"
                style={{ background: 'transparent' }}
              >
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span className="w-2 h-2 rounded-full bg-white"></span>
                <span className="w-2 h-2 rounded-full bg-white"></span>
              </button>

              <button
                onClick={() => handleNavigateQuestion(1)}
                disabled={questions.length <= 1}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all disabled:opacity-30"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: 'var(--color-background)', fontFamily: 'var(--font-main)' }}>
      <Header />
      
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-12">
          {title && (
            <p className="text-sm mb-2 opacity-60" style={{ fontStyle: 'italic' }}>
              By: {auth.currentUser?.displayName}
            </p>
          )}
          <input
            type="text"
            placeholder="Enter Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-transparent text-white text-center outline-none placeholder-white placeholder-opacity-40 text-4xl mb-6"
            style={{ fontFamily: 'var(--font-heading)', border: 'none' }}
          />
        </div>

        <div className="space-y-3 mb-4">
          {questions.map((q, index) => (
            <div
              key={index}
              className="rounded-3xl overflow-hidden transition-all cursor-pointer"
              style={{ 
                background: 'var(--color-create)',
                height: hoveredQuestionIndex === index ? '100px' : '70px'
              }}
              onMouseEnter={() => setHoveredQuestionIndex(index)}
              onMouseLeave={() => setHoveredQuestionIndex(null)}
            >
              <div className="h-full p-4 flex items-center justify-between gap-3">
                {hoveredQuestionIndex === index && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteQuestion(index);
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.2)',
                      animation: 'fadeIn 0.3s ease-out'
                    }}
                    onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                    onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14"/>
                    </svg>
                  </button>
                )}
                
                <div className="flex-1" onClick={() => handleQuestionClick(index)}>
                  <h3 className="text-2xl" style={{ fontFamily: 'var(--font-heading)' }}>
                    Q{index + 1}.
                  </h3>
                  {hoveredQuestionIndex === index && (
                    <p className="text-sm mt-1 opacity-90 truncate" style={{ animation: 'fadeIn 0.3s ease-out', fontFamily: 'var(--font-main)' }}>
                      {q.question}
                    </p>
                  )}
                </div>
                
                <button
                  onClick={() => handleQuestionClick(index)}
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '2px solid white'
                  }}
                >
                  <svg 
                    className="w-6 h-6 transition-transform duration-300" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2"
                    style={{ transform: hoveredQuestionIndex === index ? 'rotate(-90deg)' : 'rotate(0deg)' }}
                  >
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddQuestion}
          className="w-full rounded-3xl p-6 mb-4 transition-all flex items-center justify-center"
          style={{ background: 'rgba(90, 132, 255, 0.3)' }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(90, 132, 255, 0.4)'}
          onMouseLeave={(e) => e.target.style.background = 'rgba(90, 132, 255, 0.3)'}
        >
          <span className="text-4xl">+</span>
        </button>

        <button
          onClick={onSaveQuiz}
          className="w-full rounded-3xl p-6 transition-all"
          style={{ background: 'var(--color-create)' }}
          onMouseEnter={(e) => e.target.style.background = '#4a74ef'}
          onMouseLeave={(e) => e.target.style.background = 'var(--color-create)'}
        >
          <span className="text-xl" style={{ fontFamily: 'var(--font-heading)' }}>
            Finish Quiz
          </span>
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};

export default CreateQuiz;