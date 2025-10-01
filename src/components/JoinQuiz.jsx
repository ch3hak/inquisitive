import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

const JoinQuiz = () => {
  const navigate = useNavigate();
  const [quizCode, setQuizCode] = useState("");
  return (
    <div>JoinQuiz
      <p onClick={ () => navigate("/create-quiz")}>Create a quiz instead.</p>
      <div>
        <input
        type="text"
          placeholder="Enter Quiz Code"
          value={quizCode}
          onChange={e => setQuizCode(e.target.value)}
        />
    
        <button
          type="button"
          onClick={() => {
            if (!quizCode.trim()) return alert("Enter a quiz code");
            navigate(`/quiz/${quizCode.trim()}`);
          }}
        >
          Join
        </button>
  </div>
      
    </div>
  )
}

export default JoinQuiz;