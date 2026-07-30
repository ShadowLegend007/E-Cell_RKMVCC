import { useEffect, useState } from 'react';

const GoldenGlitters = () => {
  const [glitters, setGlitters] = useState<{ id: number; x: number; y: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate random glitters
    const newGlitters = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // vw
      y: Math.random() * 100, // vh
      size: Math.random() * 2 + 1, // 1px to 3px
      delay: Math.random() * 5, // 0 to 5s
      duration: Math.random() * 3 + 2, // 2 to 5s
    }));
    setGlitters(newGlitters);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {glitters.map((glitter) => (
        <div
          key={glitter.id}
          className="absolute rounded-full bg-primary"
          style={{
            left: `${glitter.x}vw`,
            top: `${glitter.y}vh`,
            width: `${glitter.size}px`,
            height: `${glitter.size}px`,
            opacity: 0,
            boxShadow: '0 0 8px 2px rgba(212, 175, 55, 0.8)',
            animation: `glitter-twinkle ${glitter.duration}s ease-in-out ${glitter.delay}s infinite alternate, glitter-float ${glitter.duration * 2}s linear ${glitter.delay}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
};

export default GoldenGlitters;
