import { signOut } from "firebase/auth"; 
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/LOGO.svg";
import { FiPower, FiUser } from "react-icons/fi";

const Header = () => {
  const navigate = useNavigate();
  const user = useSelector(store => store.user);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate("/")
    })
    .catch((error) => {
      navigate("/error");
    });
  }
  return (
    <div className="sticky top-0 z-50 bg-transparent flex items-center justify-between pt-6 px-6 pb-4" style={{
      background: 'linear-gradient(to bottom, rgba(25, 16, 35, 1) 0%, rgba(25, 16, 35, 0.95) 50%, rgba(25, 16, 35, 0) 100%)',
      backdropFilter: 'blur(12px)'
    }}>      
      <img 
        src={logo}
        alt="Quiz App Logo"
        className="h-8 cursor-pointer"
        onClick={() => navigate("/home")}
      />

{user && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/user")}
            title={user.displayName || user.email || "Profile"}
            aria-label="Open profile"
            className="p-2 focus:outline-none focus:ring-2 focus:ring-white/25 rounded"
          >
            <FiUser className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={handleSignOut}
            title="Sign out"
            aria-label="Sign out"
            className="w-5 h-5 flex items-center justify-center rounded-full bg-transparent hover:bg-white/10 transition"
          >
            <FiPower className="w-10 h-10 text-white" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Header