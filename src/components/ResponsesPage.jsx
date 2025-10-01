import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../utils/firebase";

const ResponsesPage = () => {
  const { code } = useParams();
  const [quizId,    setQuizId]    = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState("");

  useEffect(() => {
    const loadResponses = async () => {
      setLoading(true);
      try {
        const colRef = collection(db, "quizzes");
        const snap   = await getDocs(query(colRef, where("quizCode","==",code)));
        if (snap.empty) throw new Error("Quiz not found");
        const quizDoc = snap.docs[0];
        setQuizId(quizDoc.id);
        setQuizTitle(quizDoc.data().title);

        const respSnap = await getDocs(collection(db,"quizzes",quizDoc.id,"responses"));
        setResponses(
          respSnap.docs.map(d => ({ id:d.id, ...d.data() }))
        );
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadResponses();
  }, [code]);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p style={{color:'red'}}>{error}</p>;

  return (
    <div style={{ maxWidth:600, margin:"2em auto", padding:"1em" }}>
      <h1>Responses for “{quizTitle}”</h1>
      <Link to={`/quiz/${code}`}>← Back to Quiz</Link>

      <table style={{ width:"100%", marginTop:"1em", borderCollapse:"collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom:"1px solid #ccc", padding:"0.5em" }}>User</th>
            <th style={{ borderBottom:"1px solid #ccc", padding:"0.5em" }}>Score</th>
            <th style={{ borderBottom:"1px solid #ccc", padding:"0.5em" }}>Taken At</th>
          </tr>
        </thead>
        <tbody>
          {responses.map(r => (
            <tr key={r.id}>
              <td style={{ padding:"0.5em", borderBottom:"1px solid #eee" }}>
                {r.user || r.id}
              </td>
              <td style={{ padding:"0.5em", borderBottom:"1px solid #eee" }}>
                {r.score}
              </td>
              <td style={{ padding:"0.5em", borderBottom:"1px solid #eee" }}>
                {r.takenAt?.toDate().toLocaleString() || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResponsesPage;
