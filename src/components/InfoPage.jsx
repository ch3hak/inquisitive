import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/LOGO.svg";

const InfoPage = ({ onClose }) => {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState(null);

  const features = [
    {
      id: 1,
      title: "Quiz Creation & Hosting",
      description: "Create quizzes with intuitive question building. Add multiple-choice questions, set correct answers, and control response acceptance in real-time. Configure quiz timing, schedule start times, and manage your entire quiz library from a centralized dashboard. Edit quizzes anytime, track participation metrics, and delete quizzes with ease.",
      color: 'var(--color-create)' 
    },
    {
      id: 2,
      title: "Real-Time Response Management",
      description: "Start and stop accepting responses instantly. Control when participants can attempt your quiz with scheduling capabilities. Monitor live participation as responses come in and make dynamic adjustments to your quizzes on the fly.",
      color: 'var(--color-join)'
    },
    {
      id: 3,
      title: "Comprehensive Quiz Analytics",
      description: "Gain deep insights into quiz performance with detailed metrics showing total attempts, response rates, and participant engagement.",
      color: 'var(--color-insight)'
    },
    {
      id: 4,
      title: "Interactive Quiz Participation",
      description: "Join and attempt quizzes created by the community. Submit answers and instantly receive your score with transparent answer comparisons showing exactly which questions you got right or wrong. Build your quiz history and track your progress over time.",
      color: 'var(--color-join)'
    },
    {
      id: 5,
      title: "Automated Scoring & Instant Feedback",
      description: "Get immediate results after quiz submission with automatic grading. Compare your answers side-by-side with correct options and understand your performance instantly.",
      color: 'var(--color-insight)'
    },
    {
      id: 6,
      title: "Quiz History & Progress Tracking",
      description: "Maintain a complete record of every quiz you've created and joined. Review past attempts, track improvement over time, and build a personalized learning and engagement portfolio within the platform.",
      color: 'var(--color-create)'
    }
  ];

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleSignIn = () => navigate("/login", { state: { isSignIn: true } });
  const handleSignUp = () => navigate("/login", { state: { isSignIn: false } });

  return (
    <div className="relative h-full w-full overflow-y-auto bg-[#191023]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[20%] left-[15%] w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(88, 28, 135, 0.4) 0%, transparent 70%)",
            filter: "blur(120px)"
          }}
        />
        <div className="absolute bottom-[25%] right-[20%] w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(79, 70, 229, 0.35) 0%, transparent 70%)",
            filter: "blur(120px)"
          }}
        />
      </div>

      
      
      <div className="hidden md:block absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 1512 856" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <g filter="url(#filter0_f_226_797)">
            <ellipse cx="197.91" cy="408.107" rx="464.046" ry="197.824" transform="rotate(8.82858 197.91 408.107)" fill="#37087E"/>
          </g>
          <g filter="url(#filter1_f_226_797)">
            <ellipse cx="735.534" cy="432.381" rx="384.5" ry="150.006" transform="rotate(-7.35199 735.534 432.381)" fill="#5A84FF"/>
          </g>
          <g filter="url(#filter2_f_226_797)">
            <ellipse cx="1217.53" cy="447.314" rx="384.5" ry="160.189" transform="rotate(22.4556 1217.53 447.314)" fill="#06007B"/>
          </g>
          <defs>
            <filter id="filter0_f_226_797" x="-461.66" y="0" width="1319.14" height="816.214" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_226_797"/>
            </filter>
            <filter id="filter1_f_226_797" x="153.704" y="75.6405" width="1163.66" height="713.48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_226_797"/>
            </filter>
            <filter id="filter2_f_226_797" x="656.899" y="38.7808" width="1121.27" height="817.068" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix"/>
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
              <feGaussianBlur stdDeviation="100" result="effect1_foregroundBlur_226_797"/>
            </filter>
          </defs>
        </svg>
      </div>


      <div className="absolute top-6 right-6 flex gap-3 z-20">
        <button
          onClick={handleSignIn}
          className="cursor-pointer px-6 py-2 rounded-full text-sm font-medium text-white border border-white/30 hover:bg-white/10 transition-all"
          style={{
            fontFamily: "var(--font-main)",
            backgroundColor: "var(--color-join)" 
          }}
        >
          Log In
        </button>
        <button
          onClick={handleSignUp}
          className="cursor-pointer px-6 py-2 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
          style={{
            backgroundColor: "var(--color-join-highlight)", 
            fontFamily: "var(--font-main)"
          }}
        >
          Sign Up
        </button>
      </div>

      <div className="absolute top-6 left-6 z-20">
        <img 
          src={logo}
          alt="Quiz App Logo"
          className="h-8 cursor-pointer"
          onClick={() => navigate("/home")}
        />
      </div>

      <div className="relative px-4 lg:px-12 pt-24 z-10">
        <div className="flex flex-col items-center mb-8 max-w-[1400px] mx-auto">
          <button
            onClick={onClose}
            className="flex items-center text-white/90 hover:text-white transition-all group"
          >
            <span className="text-base dm-sans-regular" style={{ fontFamily: 'DM Sans, sans-serif', fontWeight: 300 }}>
              Back to them Doodles
            </span>
            <div className="w-8 h-8 rounded-full flex items-center justify-center rotate-[90deg] ml-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" stroke="#F2F2F2" strokeWidth="1.5"/>
                <path d="M12 16l-4-4 4-4M8 12h8" stroke="#F2F2F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
        </div>

        <div className="hidden md:grid md:grid-cols-3 gap-6 max-w-[1400px] mx-auto pb-8">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="rounded-[10px] p-4"
              style={{
                background: feature.color,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}
            >
              <h3 className="text-white text-xl mb-4 text-left" style={{ fontFamily: 'var(--font-heading)' }}>
                {feature.title}
              </h3>
              <p className="text-white text-sm mt-12 leading-relaxe text-left" style={{ fontFamily: 'var(--font-main)'}}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="md:hidden flex flex-col gap-1 max-w-md mx-auto pb-16">
          {features.map((feature) => (
            <div
              key={feature.id}
              onClick={() => toggleCard(feature.id)}
              className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
              style={{
                background: feature.color
              }}
            >
              <div className="flex items-center justify-between p-5">
                <h3 className="text-white text-xl flex-1 text-left" style={{ fontFamily: 'var(--font-heading)'}}>
                  {feature.title}
                </h3>
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300"
                  style={{
                    transform: expandedCard === feature.id ? 'rotate(-90deg)' : 'rotate(0deg)'
                  }}
                >
                  <svg 
                      className="w-6 h-6 rounded-full border transition-transform duration-300" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      style={{ 
                        border: '2px solid white'
                      }}
                    >
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                </div>
              </div>
              <div 
                className="overflow-hidden transition-all duration-300"
                style={{
                  maxHeight: expandedCard === feature.id ? '600px' : '0px'
                }}
              >
                <p className="text-white text-sm leading-relaxed mt-3 px-5 pb-5 text-left" style={{ fontFamily: 'var(--font-main)' }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
