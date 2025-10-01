import React from 'react'
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <Header />
      <div>
        <button onClick={ () => navigate("/create-quiz")}>Create a Quiz</button>
        <button onClick={ () => navigate("/join-quiz")}>Join a Quiz</button>
      </div>
    </div>
  )
}

export default Home;