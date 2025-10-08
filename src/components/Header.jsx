import { signOut } from "firebase/auth"; 
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../assets/LOGO.svg"

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
    <div className="flex items-center justify-between pt-6 px-6">      
      <img 
        src={logo}
        alt="Quiz App Logo"
        className="h-8 cursor-pointer"
        onClick={() => navigate("/home")}
      />

      {user && (
        <div className="flex items-center gap-4">
          <img 
            alt="User Icon" 
            src={user?.photoURL || "https://via.placeholder.com/40"} 
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => navigate("/user")}
          />

          <button onClick={handleSignOut}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default Header