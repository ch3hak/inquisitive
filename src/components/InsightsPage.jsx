import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const InsightsPage = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    {
      id: "joined",
      title: "Joined Quizzes",
      route: "/joined-quizzes",
      bgColor: "bg-primary",
      decorativeShape: "circle"
    },
    {
      id: "created",
      title: "Created Quizzes",
      route: "/created-quizzes",
      bgColor: "bg-accent",
      decorativeShape: "cloud"
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col relative overflow-hidden">
      <Header />

      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(6, 3, 76, 0.4) 0%, transparent 70%)",
          filter: "blur(100px)"
        }}
      />

      <div className="flex-1 flex flex-col items-center px-4 py-8 relative z-10">
        <h1 className="text-6xl text-main my-8 font-normal text-center pb-15"
          style={{ fontFamily: "var(--font-heading)" }}>
          Insights
        </h1>

        <div className="flex flex-col gap-6 w-full max-w-[500px]">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`${card.bgColor} rounded-[20px] px-8 py-12 flex justify-between items-center cursor-pointer transition-transform duration-300 ease-out relative overflow-hidden`}
              style={{
                transform: hoveredCard === card.id ? "scale(1.05)" : "scale(1)"
              }}
              onClick={() => navigate(card.route)}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {card.decorativeShape === "circle" && (
                <div className="absolute -top-[50px] -right-[50px] w-[250px] h-[250px] rounded-full pointer-events-none"
                  style={{ background: "rgba(255, 255, 255, 0.08)" }}
                />
              )}
              
              {card.decorativeShape === "cloud" && (
                <div className="absolute top-[20%] right-[10%] w-[280px] h-[140px] rounded-[100px] pointer-events-none"
                  style={{ background: "rgba(255, 255, 255, 0.08)" }}>
                  <div className="absolute -top-[30px] left-[60px] w-[120px] h-[120px] rounded-full"
                    style={{ background: "rgba(255, 255, 255, 0.08)" }}
                  />
                  <div className="absolute -top-[40px] right-[50px] w-[140px] h-[140px] rounded-full"
                    style={{ background: "rgba(255, 255, 255, 0.08)" }}
                  />
                </div>
              )}

              <h2 className="text-3xl text-main m-0 font-normal relative z-10"
                style={{ fontFamily: "var(--font-heading)" }}>
                {card.title}
              </h2>

              <div className="w-[65px] h-[65px] rounded-full border-[2.5px] border-white flex items-center justify-center flex-shrink-0 relative z-10">
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="transition-transform duration-300 ease-out"
                  style={{
                    transform: hoveredCard === card.id ? "rotate(-45deg)" : "rotate(0deg)"
                  }}
                >
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;