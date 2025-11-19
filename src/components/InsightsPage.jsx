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
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute -left-10 lg:left-0 top-0 lg:top-10">
          <svg width="350" height="500" viewBox="0 0 261 376" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="lg:hidden">
            <g filter="url(#filter0_f_502_54)">
              <ellipse cx="57.782" cy="187.682" rx="112" ry="75" transform="rotate(33.0969 57.782 187.682)" fill="#29055F"/>
            </g>
            <defs>
              <filter id="filter0_f_502_54" x="-144.62" y="0" width="404.805" height="375.364" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_502_54"/>
              </filter>
            </defs>
          </svg>
          <svg width="600" height="700" viewBox="0 0 400 550" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden lg:block">
            <g filter="url(#filter0_f_desktop_1)">
              <ellipse cx="150" cy="275" rx="200" ry="140" transform="rotate(33 150 275)" fill="var(--color-join-highlight)" />
            </g>
            <defs>
              <filter id="filter0_f_desktop_1" x="-200" y="0" width="700" height="550" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="60" result="effect1_foregroundBlur"/>
              </filter>
            </defs>
          </svg>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -top-10 lg:top-5">
          <svg width="500" height="450" viewBox="0 0 392 356" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="lg:hidden">
            <g filter="url(#filter0_f_502_55)">
              <ellipse cx="188.817" cy="177.553" rx="112" ry="63.671" transform="rotate(-28.7201 188.817 177.553)" fill="var(--color-create)"/>
            </g>
            <defs>
              <filter id="filter0_f_502_55" x="-14.0865" y="0" width="405.808" height="355.106" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="50" result="effect1_foregroundBlur_502_55"/>
              </filter>
            </defs>
          </svg>

          <svg
            width="1600"
            height="1200"
            viewBox="0 0 1600 1200"
            fill="none"
            className="hidden lg:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ zIndex: 0 }}
          >
            <ellipse
              cx="800"
              cy="600"
              rx="250"
              ry="350"
              fill="var(--color-create)"
              fillOpacity="0.92"
              filter="url(#hugeBlur)"
            />
            <defs>
              <filter id="hugeBlur" x="0" y="0" width="1600" height="1200" filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="140" />
              </filter>
            </defs>
          </svg>

        </div>

        <div className="absolute -right-10 lg:right-0 top-0 lg:top-10">
          <svg width="350" height="480" viewBox="0 0 280 361" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="lg:hidden">
            <g filter="url(#filter0_ddf_502_57)">
              <ellipse cx="200.674" cy="180.426" rx="112" ry="63.671" transform="rotate(32.2254 200.674 180.426)" fill="#06007B"/>
            </g>
            <defs>
              <filter id="filter0_ddf_502_57" x="0" y="0" width="401.349" height="360.851" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_502_57"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset dy="4"/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="out"/>
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                <feBlend mode="normal" in2="effect1_dropShadow_502_57" result="effect2_dropShadow_502_57"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_502_57" result="shape"/>
                <feGaussianBlur stdDeviation="50" result="effect3_foregroundBlur_502_57"/>
              </filter>
            </defs>
          </svg>

          <svg width="600" height="700" viewBox="0 0 400 550" fill="none" xmlns="http://www.w3.org/2000/svg" className="hidden lg:block">
            <g filter="url(#filter0_f_desktop_3)">
              <ellipse cx="280" cy="250" rx="200" ry="120" transform="rotate(30 250 275)" fill="var(--color-insights-blue)"/>
            </g>
            <defs>
              <filter id="filter0_f_desktop_3" x="-100" y="0" width="700" height="550" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                <feGaussianBlur stdDeviation="65" result="effect1_foregroundBlur"/>
              </filter>
            </defs>
          </svg>
        </div>
      </div>
      <Header />
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
                    transform: hoveredCard === card.id ? "rotate(-90deg)" : "rotate(0deg)"
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