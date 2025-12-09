import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LOGO.svg";
import InfoPage from "./InfoPage";


const FirstScreen = () => {
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showInfo, setShowInfo] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile && !showInfo) {
      const interval = setInterval(() => {
        setCurrentScreen((prev) => (prev + 1) % 3);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isMobile, showInfo]);

  const handleSignIn = () => {
    navigate("/login", { state: { isSignIn: true } });
  };

  const handleSignUp = () => {
    navigate("/login", { state: { isSignIn: false } });
  };

  const handlePrevious = () => {
    setCurrentScreen((prev) => (prev - 1 + 3) % 3);
  };

  const handleNext = () => {
    setCurrentScreen((prev) => (prev + 1) % 3);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleNext();
    }
    if (touchEndX.current - touchStartX.current > 50) {
      handlePrevious();
    }
  };

  const MobileShape1 = () => (
    <svg className="mt-10" width="100%" height="100%" viewBox="0 0 412 670" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <path d="M-18.0001 670C-18.0001 642.946 -12.2061 152.168 -0.949019 127.174C10.308 102.18 26.8078 79.4691 47.6081 60.3392C68.4085 41.2093 93.102 26.0346 120.279 15.6816C147.456 5.32859 176.584 -2.21543e-05 206 -1.95827e-05C235.416 -1.70111e-05 264.544 5.3286 291.721 15.6816C318.898 26.0347 343.592 41.2093 364.392 60.3392C385.192 79.4691 401.692 102.18 412.949 127.174C424.206 152.168 430 642.946 430 670L-18.0001 670Z" fill="#29055F"/>
    </svg>
  );

  const MobileShape2 = () => (
    <svg className="mt-10" width="100%" height="100%" viewBox="0 0 412 645" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <path d="M-18.0001 645C-18.0001 622.388 -12.2061 212.186 -0.949026 191.295C10.308 170.404 26.8078 151.422 47.6081 135.433C68.4085 119.444 93.102 106.76 120.279 98.1071C147.456 89.4538 176.584 85 206 85C235.416 85 264.544 89.4538 291.721 98.1071C318.898 106.76 343.592 119.444 364.392 135.433C385.192 151.422 401.692 170.404 412.949 191.295C424.206 212.186 430 622.388 430 645L-18.0001 645Z" fill="#789AFF"/>
      <ellipse cx="242.817" cy="149.43" rx="112.974" ry="111.546" fill="#789AFF"/>
      <ellipse cx="110.659" cy="111.546" rx="112.974" ry="111.546" fill="#789AFF"/>
      <ellipse cx="311.026" cy="225.197" rx="112.974" ry="111.546" fill="#789AFF"/>
      <ellipse cx="161.816" cy="225.197" rx="112.974" ry="111.546" fill="#789AFF"/>
      <ellipse cx="50.9736" cy="225.197" rx="112.974" ry="111.546" fill="#789AFF"/>
    </svg>
  );

  const MobileShape3 = () => (
    <svg className="mt-10" width="100%" height="100%" viewBox="0 0 412 618" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
      <path d="M-18 618C-18 598.134 -29.2571 277.354 -18 259C-6.74298 240.646 127.2 283.048 148 269C168.8 254.952 277.323 177.911 304.5 170.309C331.677 162.706 176.584 126 206 126C235.416 126 264.544 129.913 291.721 137.516C318.898 145.118 333.7 185.952 354.5 200C375.3 214.048 401.692 201.033 412.949 219.388C424.206 237.742 430 598.134 430 618L-18 618Z" fill="#06007B"/>
      <path d="M466.217 3.6795e-05L-6.0491 8.5L-21.5009 193L68.9998 193L-16.5 257L331.715 418.995L200 574.501L568 339.402L416.537 339.402L546.5 190.098L368.591 190.098L466.217 3.6795e-05Z" fill="#06007B"/>
    </svg>
  );

  const DesktopShape1 = () => (
    <svg width="100%" height="100%" viewBox="0 0 1512 718" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <path d="M0.501953 737.5C0.569092 640.822 20.106 545.098 58.0069 455.775C95.9733 366.299 151.622 284.996 221.776 216.513C291.93 148.029 375.217 93.7042 466.879 56.6405C558.541 19.5767 656.785 0.499925 756 0.499934C855.215 0.499943 953.459 19.5769 1045.12 56.6406C1136.78 93.7044 1220.07 148.029 1290.22 216.513C1360.38 284.996 1416.03 366.299 1453.99 455.775C1491.89 545.098 1511.43 640.822 1511.5 737.5L0.501953 737.5Z" fill="#37087E" stroke="black"/>
    </svg>
  );

  const DesktopShape2 = () => (
    <svg width="100%" height="100%" viewBox="0 0 1499 771" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <ellipse cx="348.389" cy="694.464" rx="348.389" ry="343.987" fill="#789AFF"/>
      <ellipse cx="690.208" cy="694.464" rx="348.389" ry="343.987" fill="#789AFF"/>
      <ellipse cx="1150.34" cy="694.464" rx="348.389" ry="343.987" fill="#789AFF"/>
      <ellipse cx="532.448" cy="343.987" rx="348.389" ry="343.987" fill="#789AFF"/>
      <ellipse cx="940" cy="460.813" rx="348.389" ry="343.987" fill="#789AFF"/>
    </svg>    
  );

  const DesktopShape3 = () => (
    <svg width="100%" height="100%" viewBox="0 0 1512 695" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <path d="M898.169 0L441.663 0C439.831 0 438.145 1.00269 437.27 2.61312L282.516 287.469C280.706 290.8 283.118 294.856 286.909 294.856L667.611 294.856C671.317 294.856 673.735 298.747 672.094 302.07L551.316 546.637C549.674 549.96 552.093 553.851 555.799 553.851L725.355 553.851C728.62 553.851 731.009 556.929 730.199 560.091L680.046 755.865C678.794 760.751 684.742 764.206 688.367 760.699L1012.62 446.892C1015.85 443.767 1013.64 438.299 1009.14 438.299H843.841C840.135 438.299 837.717 434.408 839.358 431.085L946.362 214.41C948.003 211.087 945.585 207.196 941.879 207.196L742.654 207.196C738.385 207.196 736.079 202.19 738.854 198.946L901.969 8.25006C904.744 5.00568 902.438 0 898.169 0Z" fill="#06007B"/>
      <path d="M345.168 120.284L-87.752 109.079C-89.6306 109.031 -91.3778 110.039 -92.2749 111.691L-246.987 396.469C-248.797 399.8 -246.385 403.856 -242.593 403.856L135.917 403.856C140.08 403.856 142.42 408.646 139.861 411.929L-4.33246 596.926C-6.89175 600.21 -4.552 605 -0.38887 605H248.14C251.636 605 254.053 608.497 252.817 611.767L79.4369 1070.58C77.9117 1074.62 81.8717 1078.56 85.9014 1077.02L629.626 868.909C631.118 868.338 632.247 867.088 632.665 865.547L710.79 577.308C711.652 574.129 709.258 571 705.964 571L529.508 571C525.811 571 523.393 567.127 525.016 563.805L642.484 323.391C644.107 320.069 641.689 316.196 637.992 316.196H251.084C247.252 316.196 244.845 312.062 246.735 308.729L349.388 127.75C351.25 124.466 348.942 120.382 345.168 120.284Z" fill="#06007B"/>
      <path d="M-48.5 429H107L-24.5 593.5V630.5H228.5L160.5 789H-48.5V429Z" fill="#06007B" stroke="#06007B"/>
      <path d="M1236.23 458.5L1326 172H1517.5L1545 765L1127 789.5L1389 458.5H1236.23Z" fill="#06007B"/>
      <path d="M781 186.5L937 14.5H1252L1142.5 124H1320.66L1210.05 482.5L1351.21 474L1164 716H760.5L1049 427.5H863L975 186.5H781Z" fill="#06007B"/>
    </svg>
  );

  const Face1 = () => (
    <svg width="348" height="326" viewBox="0 0 348 326" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-xs mx-auto">
      <circle cx="65" cy="65" r="65" fill="#F2F2F2"/>
      <ellipse cx="283.5" cy="65" rx="64.5" ry="65" fill="#F2F2F2"/>
      <ellipse cx="283.5" cy="65" rx="55.5" ry="56" fill="#37087E"/>
      <circle cx="65" cy="65" r="56" fill="#37087E"/>
      <rect x="82" y="194" width="183" height="87" rx="43.5" fill="#191023"/>
      <circle cx="236.5" cy="286.5" r="39.5" fill="#191023"/>
    </svg>
  );

  const Face2 = () => (
    <svg width="397" height="265" viewBox="0 0 397 265" fill="none" xmlns="http://www.w3.org/2000/svg" className={`${isMobile ? 'mt-18' : 'mt-10'} w-full h-auto max-w-sm mx-auto`}>
      <path d="M387 76.5C392.523 76.5 397.067 72.0036 396.348 66.5279C394.164 49.9189 386.569 34.3818 374.594 22.4063C360.247 8.0598 340.789 1.53178e-06 320.5 0C300.211 -1.53178e-06 280.753 8.05979 266.406 22.4063C254.431 34.3818 246.836 49.9189 244.652 66.5279C243.933 72.0036 248.477 76.5 254 76.5L320.5 76.5H387Z" fill="#F2F2F2"/>
      <path d="M378 76.5C378 66.5544 373.996 57.0161 366.87 49.9835C359.744 42.9509 350.078 39 340 39C329.922 39 320.256 42.9509 313.13 49.9835C306.004 57.0161 302 66.5544 302 76.5L340 76.5H378Z" fill="#5A84FF"/>
      <path d="M143 76.5C148.523 76.5 153.067 72.0036 152.348 66.5279C150.164 49.9189 142.569 34.3818 130.594 22.4063C116.247 8.0598 96.7891 1.53178e-06 76.5 0C56.2109 -1.53178e-06 36.7529 8.05979 22.4063 22.4063C10.4309 34.3818 2.83581 49.9189 0.652439 66.5279C-0.0673849 72.0036 4.47715 76.5 10 76.5L76.5 76.5H143Z" fill="#F2F2F2"/>
      <mask id="path-4-inside-1_226_577" fill="white">
      <path d="M79 144.5C73.4772 144.5 68.9568 148.986 69.4145 154.489C71.7676 182.79 84.062 209.475 104.294 229.706C126.892 252.304 157.541 265 189.5 265C221.459 265 252.108 252.305 274.706 229.706C294.938 209.475 307.232 182.79 309.586 154.489C310.043 148.986 305.523 144.5 300 144.5L189.5 144.5L79 144.5Z"/>
      </mask>
      <path d="M79 144.5C73.4772 144.5 68.9568 148.986 69.4145 154.489C71.7676 182.79 84.062 209.475 104.294 229.706C126.892 252.304 157.541 265 189.5 265C221.459 265 252.108 252.305 274.706 229.706C294.938 209.475 307.232 182.79 309.586 154.489C310.043 148.986 305.523 144.5 300 144.5L189.5 144.5L79 144.5Z" fill="#789AFF" stroke="#F2F2F2" strokeWidth="20" mask="url(#path-4-inside-1_226_577)"/>
      <path d="M129 76.5C129 66.5544 124.996 57.0161 117.87 49.9835C110.744 42.9509 101.078 39 91 39C80.9218 39 71.2563 42.9509 64.1299 49.9835C57.0036 57.0161 53 66.5544 53 76.5L91 76.5H129Z" fill="#5A84FF"/>
    </svg>
  );

  const Face3 = () => (
    <svg width="372" height="296" viewBox="0 0 372 296" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-sm mx-auto">
      <rect x="94.4729" y="277.104" width="179.489" height="18.8936" rx="9.44681" fill="#F2F2F2"/>
      <mask id="path-2-inside-1_226_625" fill="white">
      <path d="M10 74.7875C4.47718 74.7875 -0.068872 79.2848 0.667364 84.7583C2.84011 100.912 10.2507 116.016 21.9047 127.67C35.93 141.695 54.9524 149.575 74.7872 149.575C94.622 149.575 113.644 141.695 127.67 127.67C139.324 116.016 146.734 100.912 148.907 84.7583C149.643 79.2848 145.097 74.7875 139.574 74.7875L74.7872 74.7875L10 74.7875Z"/>
      </mask>
      <path d="M10 74.7875C4.47718 74.7875 -0.068872 79.2848 0.667364 84.7583C2.84011 100.912 10.2507 116.016 21.9047 127.67C35.93 141.695 54.9524 149.575 74.7872 149.575C94.622 149.575 113.644 141.695 127.67 127.67C139.324 116.016 146.734 100.912 148.907 84.7583C149.643 79.2848 145.097 74.7875 139.574 74.7875L74.7872 74.7875L10 74.7875Z" stroke="white" strokeWidth="10" mask="url(#path-2-inside-1_226_625)"/>
      <mask id="path-3-inside-2_226_625" fill="white">
      <path d="M232 74.7875C226.477 74.7875 221.931 79.2848 222.667 84.7583C224.84 100.912 232.25 116.016 243.904 127.67C257.93 141.695 276.952 149.575 296.787 149.575C316.622 149.575 335.644 141.695 349.67 127.67C361.324 116.016 368.734 100.912 370.907 84.7583C371.643 79.2848 367.097 74.7875 361.574 74.7875L296.787 74.7875L232 74.7875Z"/>
      </mask>
      <path d="M232 74.7875C226.477 74.7875 221.931 79.2848 222.667 84.7583C224.84 100.912 232.25 116.016 243.904 127.67C257.93 141.695 276.952 149.575 296.787 149.575C316.622 149.575 335.644 141.695 349.67 127.67C361.324 116.016 368.734 100.912 370.907 84.7583C371.643 79.2848 367.097 74.7875 361.574 74.7875L296.787 74.7875L232 74.7875Z" stroke="white" strokeWidth="10" mask="url(#path-3-inside-2_226_625)"/>
    </svg>
  );

  const screens = [
    {
      MobileShape: MobileShape1,
      DesktopShape: DesktopShape1,
      Face: Face1,
      title: "Feeling Bored?",
      subtitle: "Try taking a Quiz on",
      loginColor: "var(--color-join)",
      signupColor: "var(--color-join-highlight)"
    },
    {
      MobileShape: MobileShape2,
      DesktopShape: DesktopShape2,
      Face: Face2,
      title: "Feeling Creative?",
      subtitle: "Try making a Quiz on",
      loginColor: "var(--color-create)",
      signupColor: "var(--color-create-highlight)"
    },
    {
      MobileShape: MobileShape3,
      DesktopShape: DesktopShape3,
      Face: Face3,
      title: "Feeling Introspective?",
      subtitle: "Try insights with Quiz on",
      loginColor: "var(--color-insight)",
      signupColor: "var(--color-insights-blue)"
    },
  ];

  const currentData = screens[currentScreen];
  const CurrentShape = isMobile ? currentData.MobileShape : currentData.DesktopShape;
  const CurrentFace = currentData.Face;

  return (
    <div 
      className="h-screen w-full flex items-center justify-center bg-[#191023] relative overflow-hidden"
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchMove={isMobile ? handleTouchMove : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >

      {!isMobile && !showInfo && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-8 z-20 w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-all"
            aria-label="Previous"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="cursor-pointer absolute right-8 z-20 w-14 h-14 rounded-full border-2 border-white/30 flex items-center justify-center hover:bg-white/10 transition-all"
            aria-label="Next"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </>
      )}

      {!showInfo && (
        <>
          <div className="absolute top-6 right-6 flex gap-3 z-20">
            <button
              onClick={handleSignIn}
              className="cursor-pointer px-6 py-2 rounded-full text-sm font-medium text-white border border-white/30 hover:bg-white/10 transition-all"
              style={{ fontFamily: "var(--font-main)", 
              backgroundColor: currentData.loginColor,
            
            }}
            >
              Log In
            </button>
            <button
              onClick={handleSignUp}
              className="cursor-pointer px-6 py-2 rounded-full text-sm font-medium text-white transition-all hover:opacity-90"
              style={{
                backgroundColor: currentData.signupColor,
                fontFamily: "var(--font-main)",
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
        </>
      )}

      <div className="mt-15 absolute inset-0 w-full h-full">
        <CurrentShape />
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-6 pb-20">
        <div className={`${isMobile ? 'mt-50' : 'mt-35'} mb-8 md:mb-12`}>
          <CurrentFace />
        </div>

        <div className="text-center space-y-3">
          <p
            className="text-white text-base md:text-xl"
            style={{ fontFamily: "var(--font-main)" }}
          >
            {currentData.title} {currentData.subtitle}
          </p>
          <h1
            className="text-4xl md:text-6xl lg:text-7xl text-white tracking-wide"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Inquizitive
          </h1>
          <button
            onClick={() => setShowInfo(true)}
            className="cursor-pointer mt-4 text-white/70 hover:text-white transition-all flex items-center gap-2 mx-auto text-sm md:text-base"
            style={{ fontFamily: "var(--font-main)" }}
          >
            Learn more about us
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 8 12 16" />
              <polyline points="8 12 12 16 16 12" />
            </svg>
          </button>
        </div>

        {isMobile && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2">
            {[0, 1, 2].map((index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all ${
                  currentScreen === index ? "w-8 bg-white" : "w-1 bg-white/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div 
        className={`fixed inset-0 h-screen w-screen bg-[#191023] transition-transform duration-700 ease-in-out z-50 ${
          showInfo ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <InfoPage onClose={() => setShowInfo(false)} />
      </div>
    </div>
  );
};

export default FirstScreen;