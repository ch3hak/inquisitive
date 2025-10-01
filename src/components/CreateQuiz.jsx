import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionForm from './QuestionForm';
import { collection, doc, setDoc, addDoc } from "firebase/firestore"; 
import { db, auth, timestamp } from '../utils/firebase';
import { generateQuizCode } from '../utils/quizCode';

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  const onAddBtnClick = (questionData) => {
    setQuestions([...questions, questionData]); 
    setShowForm(false); 
  };

  const onSaveQuiz = async () => {
    if (!title.trim() || questions.length === 0) {
      return alert("Add a title and at least one question.");
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
    } 
    catch(err) {
      console.error(err);
      alert("Error saving quiz: " + err.message);
    }
  }

  return (
    <div>
      <p onClick={ () => navigate("/join-quiz")}>Join a quiz instead</p>
        <input
          type="text"
          placeholder="Quiz Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      <button onClick={onSaveQuiz}>Create Quiz</button>

      {title && <h2>Quiz Title: {title}</h2>}

      {/* {showForm && <QuestionForm onSave={onAddBtnClick} />} */}
      {showForm
        ? <QuestionForm onSave={onAddBtnClick} />
        : <button onClick={() => setShowForm(true)}>
            Add a Question
          </button>
      }

      {questions.map((q, index) => (
        <div key={index}>
          <p><strong>Q{index + 1}:</strong> {q.question}</p>
          <ul>
            {q.options.map((opt, i) => (
              <li key={i}>{opt}</li>
            ))}
          </ul>
        </div>
      ))}

      {/* <button onClick={() => setShowForm(true)}>Add a Question</button> */}

    </div>
  )
}

export default CreateQuiz;