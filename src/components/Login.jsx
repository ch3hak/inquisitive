import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile 
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { addUser } from "../utils/userSlice";
import { checkValidData } from "../utils/validate";
import Header from "./Header";
import {FiMail, FiLock, FiUser} from "react-icons/fi";

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

  const getDetailedPasswordError = (pwd) => {
    const errors = [];
    
    if (pwd.length < 8) {
      errors.push("at least 8 characters");
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push("one uppercase letter");
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push("one lowercase letter");
    }
    if (!/[0-9]/.test(pwd)) {
      errors.push("one number");
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      errors.push("one special character (!@#$%^&*)");
    }
    
    if (errors.length > 0) {
      return `Password must contain ${errors.join(", ")}`;
    }
    return null;
  };

  const handleButtonClick = () => {
    const message = checkValidData(email.current.value, password.current.value);
    
    if (message && !isSignInForm && message.toLowerCase().includes("password")) {
      const detailedError = getDetailedPasswordError(password.current.value);
      setErrorMessage(detailedError || message);
      return;
    }
    
    setErrorMessage(message);
    
    if (message) return;

    if (!isSignInForm) {

      const nameValue = name.current.value.trim();

      console.log(" Name Input Value:", nameValue);
      console.log(" Email:", email.current.value);
      
      if (!nameValue || nameValue.trim() === "") {
        setErrorMessage("Please enter your name");
        return;
      }


      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("User created:", user.uid);
          updateProfile(user, {
            displayName: nameValue,
            photoURL: "default-avatar"
          })
            .then(async() => {
              await user.reload();
              const updatedUser = auth.currentUser;



              // const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: updatedUser.uid,
                  email: updatedUser.email,
                  displayName: nameValue,
                  photoURL: updatedUser.photoURL
                })
              );
              console.log("Dispatched to Redux", nameValue);
              navigate("/home");
            })
            .catch((error) => {
              console.error(" Profile update error:", error);
              setErrorMessage(error.message);
            });
        })
        .catch((error) => {
          console.log("Firebase error:", error);
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
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: `
          radial-gradient(ellipse 90% 40% at center, rgba(6,0,123,0.6) 0%, rgba(25,16,35,1) 70%),
          radial-gradient(ellipse 50% 25% at 20% 50%, rgba(6,0,123,0.3) 0%, transparent 80%),
          radial-gradient(ellipse 50% 25% at 80% 50%, rgba(6,0,123,0.3) 0%, transparent 80%)
        `,
        backgroundSize: "cover",
      }}
    >
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-6">
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-full max-w-md p-9"
        >
          <h1 className="text-3xl font-bold mb-2 pb-15 text-white text-center">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </h1>

          {!isSignInForm && (
            <>
              <div className="relative mb-5">
                <FiUser className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white text-xl" />
                <input
                  ref={name}
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-14 pr-5 py-3 bg-transparent text-white rounded-full border-2 border-white border-opacity-40 focus:border-opacity-70 focus:outline-none transition-all placeholder-gray-400"
                />
              </div>
            </>
          )}

          <div className="relative mb-4">
            <FiMail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white text-xl" />
            <input
              ref={email}
              type="text"
              placeholder="Email Address"
              className="w-full pl-14 pr-5 py-3 bg-transparent text-white rounded-full border-2 border-white border-opacity-40 focus:border-opacity-70 focus:outline-none transition-all placeholder-gray-400"
            />
          </div>

          <div className="relative mb-7">
            <FiLock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white text-xl" />
            <input
              ref={password}
              type="password"
              placeholder="Password"
              className="w-full pl-14 pr-5 py-3 bg-transparent text-white rounded-full border-2 border-white border-opacity-40 focus:border-opacity-70 focus:outline-none transition-all placeholder-gray-400"
            />
          </div>
          
          {/* <p className="text-gray-300 text-xs mb-7 px-2">
              Password must contain: at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character
          </p> */}

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <button
            onClick={handleButtonClick}
            className="w-full mt-2 py-3 rounded-full text-lg font-medium text-main bg-accent transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "var(--color-join)" }}
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>

          <p className="mt-6 text-gray-400 cursor-pointer" onClick={toggleSignInForm}>
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