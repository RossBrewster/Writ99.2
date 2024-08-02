import React, { useRef, useEffect, useMemo } from 'react';

export const AnimatedLogo: React.FC = () => {
  const logoRef = useRef<SVGSVGElement>(null);

  const wPaths = useMemo(
    () => [
      [10, 10, 30, 90],
      [30, 90, 50, 10],
      [50, 10, 70, 90],
      [70, 90, 90, 10],
    ],
    []
  );
  const hamburgerPaths = useMemo(
    () => [
      [10, 22, 90, 22],
      [10, 41, 90, 41],
      [10, 60, 90, 60],
      [10, 79, 90, 79],
    ],
    []
  );

  const colors = ['#EA4335', '#34A853', '#FBBC05', '#4285F4']; // Google colors: Red, Green, Yellow, Blue

  const easeInOutBack = (t: number): number => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  };

  const animatePath = (
    element: SVGPathElement,
    startPath: number[],
    endPath: number[],
    duration: number,
    delay: number
  ): Promise<void> => {
    return new Promise((resolve) => {
      const startTime = performance.now();
      setTimeout(() => {
        function animate(time: number) {
          const progress = Math.min((time - startTime) / duration, 1);
          if (progress < 1) {
            const easedProgress = easeInOutBack(progress);
            const currentPath = startPath.map(
              (start, i) => start + (endPath[i] - start) * easedProgress
            );
            element.setAttribute('d', `M${currentPath.join(' ')}`);
            requestAnimationFrame(animate);
          } else {
            element.setAttribute('d', `M${endPath.join(' ')}`);
            resolve();
          }
        }
        requestAnimationFrame(animate);
      }, delay);
    });
  };

  const animateLogo = () => {
    if (!logoRef.current) return;
    const paths = logoRef.current.querySelectorAll('path');
    const startPaths = hamburgerPaths;
    const endPaths = wPaths;

    const animations = Array.from(paths).map((path, index) =>
      animatePath(path, startPaths[index], endPaths[index], 800, index * 50)
    );

    Promise.all(animations);
  };

  useEffect(() => {
    // Start the animation after a short delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      animateLogo();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-[200px] h-[200px] mx-auto">
      <svg
        ref={logoRef}
        className="w-full h-full"
        viewBox="-10 -10 120 120"
        preserveAspectRatio="xMidYMid meet"
      >
        {colors.map((color, index) => (
          <path
            key={index}
            d={`M${hamburgerPaths[index].join(' ')}`}
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
            stroke={color}
          />
        ))}
      </svg>
    </div>
  );
};