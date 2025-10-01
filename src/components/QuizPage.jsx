import React, { useState, useEffect } from "react";
import { auth, timestamp, db } from "../utils/firebase";
import { useParams, useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

const QuizPage = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [quizMeta,  setQuizMeta]  = useState(null);
  const [quizId, setQuizId] = useState("");
  const [questions,setQuestions]  = useState([]);
  const [answers,  setAnswers]    = useState({});
  const [loading,  setLoading]    = useState(true);
  const [error,    setError]      = useState("");
  const [editMode,      setEditMode]      = useState(false);
  const [titleEdit,     setTitleEdit]     = useState("");
  const [questionsEdit, setQuestionsEdit] = useState([]);

  useEffect(() => {
    const loadByCode = async () => {
      setLoading(true);
      try {
        const colRef = collection(db, "quizzes");
        const snap  = await getDocs(query(colRef, where("quizCode","==",code)));

        if (snap.empty) {
          throw new Error("Quiz not found");
        }

        const quizDoc = snap.docs[0];
        setQuizMeta(quizDoc.data());
        setQuizId(quizDoc.id);

        const currentUid = auth.currentUser?.uid;
        const isOwner = Boolean(
          quizMeta &&
          currentUid &&
          quizMeta.createdBy === currentUid
        );

        const qsSnap = await getDocs(collection(db, "quizzes", quizDoc.id, "questions"));
        const qs = qsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        setQuestions(qs);

        const init = {};
        qs.forEach((_, idx) => { init[idx] = null; });
        setAnswers(init);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadByCode();
  }, [code]);

  const handleEdit = () => {
    setTitleEdit(quizMeta.title);
    setQuestionsEdit(questions.map(q => ({ ...q })));
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    await updateDoc(doc(db,"quizzes",quizId), { title: titleEdit });

    await Promise.all(questionsEdit.map(q =>
      updateDoc(doc(db,"quizzes",quizId,"questions",q.id), {
        description:   q.description,
        options:       q.options,
        correctOption: q.correctOption
      })
    ));
    
    setEditMode(false);
    setQuizMeta(meta => ({ ...meta, title: titleEdit }));
    setQuestions(questionsEdit);
  };
  
  const handleDelete = async () => {
    if (window.confirm("Delete this quiz permanently?")) {
      await deleteDoc(doc(db, "quizzes", quizId));
      navigate("/home");
    }
  };

  const handleViewResponses = () => {
    navigate(`/quiz/${code}/responses`);
  };
  
  const pickAnswer = (qIdx, optIdx) =>
    setAnswers(a => ({ ...a, [qIdx]: optIdx }));

  const submitQuiz = async () => {
    let s = 0;
    questions.forEach((q, idx) => {
      if (answers[idx] === q.correctOption) s++;
    });
    if (auth.currentUser && quizId) {
      await setDoc(
        doc(db, "quizzes", quizId, "responses", auth.currentUser.uid),
          {
            uid: auth.currentUser.uid,
            answers,
            score:    s,
            takenAt:  timestamp(),
            user:     auth.currentUser.displayName || auth.currentUser.email,
          }
      );
    }
    
        navigate(`/quiz/${code}/score`, {
          state: { score: s, total: questions.length }
        });
  };
  
  if (loading) return <p>Loading quiz…</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const isOwner = quizMeta.createdBy === auth.currentUser?.uid;
  const allAnswered = questions.length > 0 && Object.values(answers).every(v => v !== null);

  return (
    <div style={{ maxWidth: 600, margin: "2em auto", padding: "1em" }}>
        {editMode ? (
          <>
          <h2>Edit Quiz</h2>
          <input
            value={titleEdit}
            onChange={e => setTitleEdit(e.target.value)}
            style={{ width:"100%", fontSize:"1.2em", marginBottom: "1em" }}
          />

          {questionsEdit.map((q,idx) => (
            <div key={q.id} style={{ marginBottom: "1em" }}>
              <input
                value={q.description}
                onChange={e => {
                  const copy=[...questionsEdit];
                  copy[idx].description = e.target.value;
                  setQuestionsEdit(copy);
                }}
                style={{ width:"100%", marginBottom:"0.5em" }}
              />
              {q.options.map((opt,i) => (
                <div key={i} style={{display:"flex",alignItems:"center"}}>
                  <input
                    type="radio"
                    checked={q.correctOption === i}
                    onChange={()=> {
                      const copy=[...questionsEdit];
                      copy[idx].correctOption = i;
                      setQuestionsEdit(copy);
                    }}
                  />
                  <input
                    value={opt}
                    onChange={e=> {
                      const copy=[...questionsEdit];
                      copy[idx].options[i] = e.target.value;
                      setQuestionsEdit(copy);
                    }}
                    style={{ flex:1, marginLeft:"0.5em" }}
                  />
                </div>
              ))}
            </div>
          ))}

          <button onClick={handleSaveEdit} style={{ marginRight:8 }}>Save</button>
          <button onClick={()=>setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h1 style={{ borderBottom: "1px solid #ddd", paddingBottom: "0.5em" }}>
            {quizMeta.title || "Untitled"}
          </h1>

          {isOwner && (
            <div style={{ marginBottom: "1em", textAlign: "right" }}>
              <button onClick={handleEdit} style={{ marginRight: 8 }}>
                Edit Quiz
              </button>
              <button onClick={handleViewResponses} style={{ marginRight: 8 }}>
                View Responses
              </button>
              <button onClick={handleDelete} style={{ color: "red" }}>
                Delete Quiz
              </button>
            </div>
          )}

          {questions.map((q, idx) => (
            <div key={q.id} style={{ marginBottom: "1.5em" }}>
              <p><strong>Q{idx + 1}:</strong> {q.description}</p>
              {q.options.map((opt, i) => (
                <label key={i} style={{ display: "block", margin: "0.25em 0" }}>
                  <input
                    type="radio"
                    name={`q${idx}`}
                    checked={answers[idx] === i}
                    onChange={() => pickAnswer(idx, i)}
                    style={{ marginRight: "0.5em" }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <button
            onClick={submitQuiz}
            disabled={!allAnswered}
            style={{ marginTop: "1em" }}
          >
            Submit Answers
          </button>
        </>
      )}
    </div>
  );
};

export default QuizPage;
