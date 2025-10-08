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
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center space-y-16"
      style={{
        background: `
          radial-gradient(ellipse 90% 40% at center, rgba(6,0,123,0.6) 0%, rgba(25,16,35,1) 70%),
          radial-gradient(ellipse 50% 25% at 20% 50%, rgba(6,0,123,0.3) 0%, transparent 80%),
          radial-gradient(ellipse 50% 25% at 80% 50%, rgba(6,0,123,0.3) 0%, transparent 80%)
        `,
        backgroundSize: "cover",
      }}
    >
      <div className="space-y-8">
        <img
          src={logo}
          alt="Inquizitive Logo"
          className="w-48 h-48 mx-auto"
        />
        <h1
          className="text-6xl font-heading tracking-wide text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Inquizitive
        </h1>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={handleSignIn}
          className="px-20 py-4 rounded-full text-lg font-medium text-main bg-accent transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "var(--color-join)" }}
        >
          Sign In
        </button>

        <button
          onClick={handleSignUp}
          className="px-19 py-3.5 rounded-full text-lg font-medium text-main bg-accent transition-all duration-200 hover:opacity-90"
          style={{ backgroundColor: "var(--color-create)" }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default FirstScreen;