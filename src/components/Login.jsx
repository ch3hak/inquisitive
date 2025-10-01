import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile 
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { addUser } from "../utils/userSlice";
import { checkValidData } from "../utils/validate";
import Header from "./Header";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [isSignInForm, setIsSignInForm] = useState(
    location.state?.isSignIn !== undefined ? location.state.isSignIn : true
  );
  const [errorMessage, setErrorMessage] = useState(null);
  
  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  useEffect(() => {
    if (location.state?.isSignIn !== undefined) {
      setIsSignInForm(location.state.isSignIn);
    }
  }, [location.state]);

  const handleButtonClick = () => {
    const message = checkValidData(email.current.value, password.current.value);
    setErrorMessage(message);
    
    if (message) return;

    if (!isSignInForm) {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
            photoURL: "https://example.com/jane-q-user/profile.jpg"
          })
            .then(() => {
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                  photoURL: photoURL,
                })
              );
              navigate("/home");
            })
            .catch((error) => {
              setErrorMessage(error.message);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    } else {
      // Sign In
      signInWithEmailAndPassword(auth, email.current.value, password.current.value)
        .then((userCredential) => {
          const user = userCredential.user;
          dispatch(
            addUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            })
          );
          navigate("/home");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  const toggleSignInForm = () => {
    setIsSignInForm(!isSignInForm);
  };

  return (
    <div style={{ backgroundColor: '#191023' }} className="min-h-screen">
      <Header />
      
      <div className="flex items-center justify-center px-6 py-12">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-md bg-black bg-opacity-70 p-8 rounded-lg"
        >
          <h1 className="text-3xl font-bold mb-6 text-white">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </h1>

          {!isSignInForm && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="w-full p-4 mb-4 bg-gray-700 text-white rounded"
            />
          )}

          <input
            ref={email}
            type="text"
            placeholder="Email Address"
            className="w-full p-4 mb-4 bg-gray-700 text-white rounded"
          />

          <input
            ref={password}
            type="password"
            placeholder="Password"
            className="w-full p-4 mb-4 bg-gray-700 text-white rounded"
          />

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <button
            onClick={handleButtonClick}
            className="w-full py-3 rounded text-white font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#5A84FF' }}
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>

          <p className="mt-4 text-gray-400 cursor-pointer" onClick={toggleSignInForm}>
            {isSignInForm
              ? "New? Sign Up."
              : "Coming back? Sign In."}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;