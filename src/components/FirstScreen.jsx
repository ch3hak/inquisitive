import { useNavigate } from "react-router-dom";
import logo from "../assets/LOGO.svg"


const FirstScreen = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login", { state: { isSignIn: true } });
  };

  const handleSignUp = () => {
    navigate("/login", { state: { isSignIn: false } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" 
         style={{ backgroundColor: "var(--color-background)" }}>
      
      <div className="flex flex-col items-center mb-16">
        <img 
            src={logo} 
            alt="Inquizitive Logo" 
            className="w-48 h-48 mb-8" 
        />

        <h1 
            className="text-4xl font-light tracking-wide text-white"
            style={{fontFamily: "var(--font-main)" }}
        >
          Inquizitive
        </h1>
      </div>

      <div className="w-full max-w-sm space-y-4">
        <button
          onClick={handleSignIn}
          className="w-full py-4 rounded-full text-lg font-medium text-main bg-accent transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "var(--color-join)" }}
        >
          Sign In
        </button>

        <button
          onClick={handleSignUp}
          className="w-full py-4  rounded-full text-lg font-medium text-main bg-accent transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "var(--color-create)" }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default FirstScreen;