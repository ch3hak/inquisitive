import React, { useState, useEffect } from "react";
import { auth, db } from "../utils/firebase";
import { collection, collectionGroup, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./Header";

const UserPage = () => {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const loadUserData = async () => {
      try {
        const uid = user.uid;

        const createdQuizSnap = await getDocs(query(collection(db, "quizzes"), where("createdBy", "==", uid)));
        const createdQuizList = createdQuizSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCreatedQuizzes(createdQuizList);

        const attemptedSnap = await getDocs(query(collectionGroup(db, "responses"), where("uid", "==", uid)));
        const attemptedList = [];
        for (let respDoc of attemptedSnap.docs) {
          const quizId = respDoc.ref.parent.parent.id;
          const quizMeta = await getDoc(doc(db, "quizzes", quizId));
          attemptedList.push({
            quizId,
            quizTitle: quizMeta.exists() ? quizMeta.data().title : "Deleted Quiz",
            score: respDoc.data().score
          });
        }
        setAttemptedQuizzes(attemptedList);
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user, navigate]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "2em" }}>Loading your dashboard…</p>;

  console.log("Redux User:", user);
  console.log("Auth User:", auth.currentUser);


  return (
    <div style={{ maxWidth: 800, margin: "2em auto", padding: "1em" }}>
      <Header/>
      <h1>Welcome, {user?.displayName || user?.email}</h1>
      {user?.photoURL && (
        <img
          src={user.photoURL}
          alt="User Avatar"
          style={{ width: 80, height: 80, borderRadius: "50%", marginTop: "1em" }}
        />
      )}
      <p style={{ marginTop: "1em" }}><strong>Email:</strong> {user?.email}</p>

      <section style={{ marginTop: "2em" }}>
        <h2>Your Created Quizzes</h2>
        {createdQuizzes.length === 0 ? (
          <p>You haven't created any quizzes yet.</p>
        ) : (
          <ul>
            {createdQuizzes.map(q => (
              <li key={q.id}>
                <button onClick={() => navigate(`/quiz/${q.quizCode}`)} style={{ cursor: "pointer", border: "none", background: "none", color: "blue", textDecoration: "underline" }}>
                  {q.title}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: "2em" }}>
        <h2>Your Quiz Attempts</h2>
        {attemptedQuizzes.length === 0 ? (
          <p>You haven’t attempted any quizzes yet.</p>
        ) : (
          <ul>
            {attemptedQuizzes.map(({ quizId, quizTitle, score }) => (
              <li key={quizId}>
                {quizTitle} — Score: {score}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default UserPage;
