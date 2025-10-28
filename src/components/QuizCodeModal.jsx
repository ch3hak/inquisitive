import React, { useState } from 'react';

const QuizCodeModal = ({ quizCode, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(quizCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: 'rgba(0, 0, 0, 0.8)' }}
      onClick={onClose}
    >
      <div 
        className="rounded-3xl p-8 max-w-md w-full mx-4 relative"
        style={{ background: 'var(--color-background)', border: '2px solid var(--color-create)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
        >
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <div className="text-center text-white">
          <h2 className="text-3xl mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
            Quiz Created!
          </h2>
          <p className="text-sm opacity-60 mb-8 dm-sans-italic">
            Share this code with your participants
          </p>

          <div 
            className="rounded-2xl p-6 mb-6 relative"
            style={{ background: 'var(--color-create)' }}
          >
            <p className="text-xs opacity-60 mb-2 dm-sans-italic">Quiz Code</p>
            <p className="text-4xl tracking-wider font-mono mb-4">
              {quizCode}
            </p>
            
            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-xl transition-all dm-sans-regular"
              style={{ 
                background: copied ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              }}
            >
              {copied ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 6L9 17l-5-5"/>
                  </svg>
                  Copied!
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  Copy Code
                </span>
              )}
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 rounded-full transition-all"
            style={{ 
              background: 'var(--color-create)',
              fontFamily: 'var(--font-heading)',
              fontSize: '1.125rem'
            }}
          >
            View Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCodeModal;