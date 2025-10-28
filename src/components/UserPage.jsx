import React, { useState, useEffect } from "react";
import { auth, db } from "../utils/firebase";
import { collection, collectionGroup, query, where, getDocs, getDoc, doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import Header from "./Header";

const UserPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [quizCode, setQuizCode] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [createdQuizzes, setCreatedQuizzes] = useState([]);
  const [attemptedQuizzes, setAttemptedQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleJoinQuiz = () => {
    if (!quizCode.trim()) {
      alert("Enter a quiz code");
      return;
    }
    navigate(`/quiz/${quizCode.trim()}`);
  };

  const handleProfilePictureUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 500KB)
    if (file.size > 500 * 1024) {
      alert("Image too large! Please choose an image under 500KB.");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      
      try {
        // Save to Firestore instead of Firebase Auth
        await setDoc(doc(db, "users", auth.currentUser.uid), {
          profilePicture: base64String,
          email: auth.currentUser.email,
          displayName: auth.currentUser.displayName,
          updatedAt: new Date()
        }, { merge: true });

        setProfilePicture(base64String);
        setUploading(false);
      } catch (error) {
        console.error("Error updating profile picture:", error);
        alert("Failed to update profile picture");
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    const loadUserData = async () => {
      try {
        const uid = user.uid;

        // Load profile picture from Firestore
        const userDocSnap = await getDoc(doc(db, "users", uid));
        if (userDocSnap.exists() && userDocSnap.data().profilePicture) {
          setProfilePicture(userDocSnap.data().profilePicture);
        }

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white dm-sans-regular" style={{ background: '#191023' }}>
        Loading your dashboard…
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white" style={{ background: '#191023' }}>
      <Header/>
      
      <div className="flex flex-col items-center mt-8 px-6">
        {/* Profile Picture with Upload */}
        <div className="relative mb-8">
          <div className="w-56 h-56 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center border-4 border-gray-600">
            {profilePicture ? (
              <img
                src={profilePicture}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-6xl text-gray-400">👤</div>
            )}
          </div>
          
          {/* Upload Button */}
          <label 
            htmlFor="profile-upload" 
            className="absolute bottom-2 right-2 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110"
            style={{ 
              background: 'var(--color-create)',
              border: '3px solid #191023',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
            }}
          >
            {uploading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            )}
          </label>
          <input
            id="profile-upload"
            type="file"
            accept="image/*"
            onChange={handleProfilePictureUpload}
            className="hidden"
          />
        </div>

        <div className="w-full max-w-md space-y-3 mb-12 dm-sans-regular">
          <div className="flex justify-between items-baseline">
            <span className="italic text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Username</span>
            <span className="text-white text-right text-base">{user?.displayName || "User"}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="italic text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Name</span>
            <span className="text-white text-right text-base">{user?.displayName || "User"}</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="italic text-lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Email ID</span>
            <span className="text-white text-right text-sm break-all">{user?.email}</span>
          </div>
        </div>
      </div>
      <div className="w-full max-w-sm space-y-3">
          <div
            className="join-card rounded-3xl overflow-hidden transition-all duration-300 ease-out cursor-pointer relative"
            style={{ 
              background: showInput ? 'var(--color-join-highlight)' : (hoveredCard === 'join' ? 'var(--color-join-highlight)' : 'var(--color-join)'),
              height: showInput ? '160px' : '100px'
            }}
            onClick={() => !showInput && setShowInput(true)}
            onMouseEnter={() => setHoveredCard('join')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute right-0 top-0 opacity-25 pointer-events-none" style={{ transform: 'translateX(30%)', filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))' }}>
              <svg width="200" height="100" viewBox="0 0 222 111" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M221.497 0.5C221.432 14.8409 218.578 29.0338 213.089 42.2861C207.536 55.6926 199.397 67.8749 189.136 78.1357C178.875 88.3966 166.693 96.5357 153.286 102.089C139.88 107.642 125.511 110.5 111 110.5C96.4891 110.5 82.1202 107.642 68.7139 102.089C55.3074 96.5357 43.1251 88.3966 32.8643 78.1357C22.6034 67.8749 14.4643 55.6926 8.91113 42.2861C3.42188 29.0338 0.567816 14.8409 0.50293 0.5H221.497Z" fill="#37087E"/>
              </svg>
            </div>

            <div className="p-6 h-full flex flex-col justify-between relative z-10">
              <div className="flex justify-between items-center">
                <h2 className="text-4xl" style={{ fontFamily: 'Bodoni72, serif' }}>Join Quiz</h2>
                
                {!showInput && (
                  <button className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300" style={{
                    transform: hoveredCard === 'join' ? 'rotate(-90deg)' : 'rotate(0deg)',
                    filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
                  }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                )}
              </div>
              
              {showInput && (
                <div className="flex items-center gap-3" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                  <div className="flex-1 flex items-center gap-2 rounded-xl px-4 py-2" style={{ background: 'rgba(255, 255, 255, 0.15)', filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))' }}>
                    <span className="text-sm opacity-70">#</span>
                    <input
                      type="text"
                      placeholder="Enter Code"
                      value={quizCode}
                      onChange={e => setQuizCode(e.target.value)}
                      className="bg-transparent flex-1 outline-none text-white placeholder-white placeholder-opacity-50"
                      onKeyPress={(e) => e.key === 'Enter' && handleJoinQuiz()}
                      onClick={(e) => e.stopPropagation()}
                      autoFocus
                    />
                    <svg className="w-4 h-4 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinQuiz();
                    }}
                    className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-all"
                    style={{ filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))' }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" style={{ transform: 'rotate(-90deg)' }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div
            className="rounded-3xl overflow-hidden transition-all duration-300 ease-out cursor-pointer relative"
            style={{ 
              background: hoveredCard === 'create' ? 'var(--color-create-highlight)' : 'var(--color-create)',
              height: '100px'
            }}
            onClick={() => navigate("/create-quiz")}
            onMouseEnter={() => setHoveredCard('create')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-20 pointer-events-none" style={{ transform: 'translateY(-50%) translateX(20%)', filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))' }}>
              <svg width="110" height="75" viewBox="0 0 123 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="28.5166" cy="56.8437" rx="28.5166" ry="28.1562" fill="#789AFF"/>
                <ellipse cx="56.4951" cy="56.8437" rx="28.5166" ry="28.1562" fill="#789AFF"/>
                <ellipse cx="94.1584" cy="56.8437" rx="28.5166" ry="28.1562" fill="#789AFF"/>
                <ellipse cx="43.5819" cy="28.1562" rx="28.5166" ry="28.1562" fill="#789AFF"/>
                <ellipse cx="76.9409" cy="37.7187" rx="28.5166" ry="28.1562" fill="#789AFF"/>
              </svg>
            </div>

            <div className="p-6 h-full flex items-center justify-between relative z-10">
              <h2 className="text-4xl" style={{ fontFamily: 'Bodoni72, serif' }}>Create Quiz</h2>
              <button className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300" style={{
                transform: hoveredCard === 'create' ? 'rotate(-90deg)' : 'rotate(0deg)',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          <div
            className="rounded-3xl overflow-hidden transition-all duration-300 ease-out cursor-pointer relative"
            style={{ 
              background: hoveredCard === 'insights' ? 'var(--color-insights-blue)' : 'var(--color-insight)',
              height: '100px'
            }}
            onClick={() => navigate("/insights")}
            onMouseEnter={() => setHoveredCard('insights')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-15 pointer-events-none" style={{ filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5))' }}>
              <svg width="90" height="75" viewBox="0 0 109 91" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M92.5 0H23.5L0 36.5978H58.2639L39.5 68.7446H66.5L58.2639 91L109 54.4022H81.7568L98.5 25.7174H66.5L92.5 0Z" fill="#06034C"/>
              </svg>
            </div>

            <div className="p-6 h-full flex items-center justify-between relative z-10">
              <h2 className="text-4xl" style={{ fontFamily: 'Bodoni72, serif' }}>Get Insights</h2>
              <button className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-300" style={{
                transform: hoveredCard === 'insights' ? 'rotate(-90deg)' : 'rotate(0deg)',
                filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
    </div>
     
  );
};

export default UserPage;