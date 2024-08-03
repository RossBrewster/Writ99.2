import React, { useState, useEffect } from 'react';

interface TypedTextProps {
  isAboutUsVisible: boolean;
  isLogoAnimationComplete: boolean;
  isDarkMode: boolean;
  aboutUsContent: string;
}

export const TypedText: React.FC<TypedTextProps> = ({
  isAboutUsVisible,
  isLogoAnimationComplete,
  isDarkMode,
  aboutUsContent,
}) => {
  const [typedText, setTypedText] = useState<string>('');
  const [isBackspacing, setIsBackspacing] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<
    'initial' | 'backspace' | 'aboutUsTitle' | 'aboutUsContent'
  >('initial');

  useEffect(() => {
    if (!isLogoAnimationComplete) {
      setTypedText('');
      return;
    }

    if (isAboutUsVisible && currentPhase === 'initial') {
      setIsBackspacing(true);
      setCurrentPhase('backspace');
    }

    const h1TypingSpeed = 100; // Slower speed for H1 elements
    const pTypingSpeed = 1; // Much faster speed for paragraph content
    const backspaceSpeed = 50; // Slightly slower backspace speed

    let timeout: NodeJS.Timeout;

    if (currentPhase === 'initial' && typedText.length < 'Writ 99'.length) {
      timeout = setTimeout(() => {
        setTypedText('Writ 99'.slice(0, typedText.length + 1));
      }, h1TypingSpeed);
    } else if (isBackspacing) {
      if (typedText.length > 0) {
        timeout = setTimeout(() => {
          setTypedText(typedText.slice(0, -1));
        }, backspaceSpeed);
      } else {
        setIsBackspacing(false);
        setCurrentPhase('aboutUsTitle');
      }
    } else if (
      currentPhase === 'aboutUsTitle' &&
      typedText.length < 'About Us'.length
    ) {
      timeout = setTimeout(() => {
        setTypedText('About Us'.slice(0, typedText.length + 1));
      }, h1TypingSpeed);
    } else if (currentPhase === 'aboutUsTitle' && typedText === 'About Us') {
      setCurrentPhase('aboutUsContent');
      setTypedText('About Us\n');
    } else if (
      currentPhase === 'aboutUsContent' &&
      typedText.length < aboutUsContent.length + 'About Us\n'.length
    ) {
      timeout = setTimeout(() => {
        setTypedText(
          (prev) => prev + aboutUsContent[prev.length - 'About Us\n'.length]
        );
      }, pTypingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [
    isLogoAnimationComplete,
    isAboutUsVisible,
    typedText,
    currentPhase,
    aboutUsContent,
    isBackspacing,
  ]);

  return (
    <div className="text-center">
      <h1 className="text-[96px] font-bold font-['Saira',_sans-serif] mb-4">
        {typedText.split('\n')[0]}
        {(currentPhase === 'initial' ||
          currentPhase === 'backspace' ||
          currentPhase === 'aboutUsTitle') && (
          <span
            className={`border-r-2 ${
              isDarkMode ? 'border-white' : 'border-black'
            } animate-blink`}
          />
        )}
      </h1>
      {currentPhase === 'aboutUsContent' && (
        <p className="text-xl font-normal font-[sans-serif] text-left whitespace-pre-line leading-relaxed mt-4">
          {typedText.split('\n').slice(1).join('\n')}
          <span
            className={`border-r-2 ${
              isDarkMode ? 'border-white' : 'border-black'
            } animate-blink`}
          />
        </p>
      )}
    </div>
  );
};