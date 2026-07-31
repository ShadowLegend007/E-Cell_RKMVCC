import React, { useEffect, useState } from 'react';
import logo from '../assets/Logo.png';

interface PreloaderProps {
  isReady: boolean;
}

const Preloader: React.FC<PreloaderProps> = ({ isReady }) => {
  const [shouldRender, setShouldRender] = useState(true);
  const [opacity, setOpacity] = useState(100);

  useEffect(() => {
    if (isReady) {
      setOpacity(0);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 500); // 500ms fade out duration
      return () => clearTimeout(timer);
    }
  }, [isReady]);

  if (!shouldRender) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fdfdfd] transition-opacity duration-500 ease-in-out pointer-events-none"
      style={{ opacity: opacity / 100 }}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated outer ring */}
        <div className="absolute inset-0 -m-8 border-4 border-t-primary border-r-transparent border-b-primary/30 border-l-transparent rounded-full animate-spin duration-1000"></div>
        <div className="absolute inset-0 -m-4 border-4 border-t-transparent border-r-primary/60 border-b-transparent border-l-primary/10 rounded-full animate-[spin_1.5s_linear_reverse]"></div>
        
        {/* Logo */}
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden flex items-center justify-center p-2 z-10 animate-pulse">
          <img 
            src={logo} 
            alt="Loading..." 
            className="w-full h-full object-contain drop-shadow-md"
          />
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-xl md:text-2xl font-bold tracking-[0.2em] text-black font-serif uppercase">E-Cell</h2>
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-primary to-transparent my-2" />
      </div>
    </div>
  );
};

export default Preloader;
