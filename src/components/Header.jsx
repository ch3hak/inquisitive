import { signOut } from "firebase/auth"; 
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
    <div style={{ display: "flex", justifyContent: "space-between", padding: "1em", alignItems: "center", borderBottom: "1px solid #ddd" }}>
      
      <img 
        src="/logo.png"
        alt="Quiz App Logo"
        style={{ height: "40px", cursor: "pointer" }}
        onClick={() => navigate("/home")}
      />

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "1em" }}>
          <img 
            alt="User Icon" 
            src={user?.photoURL || "https://via.placeholder.com/40"} 
            style={{ width: 40, height: 40, borderRadius: "50%" }} 
            onClick={() => navigate("/user")}
          />

          <button onClick={handleSignOut} style={{ padding: "0.5em 1em" }}>
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}

export default Header