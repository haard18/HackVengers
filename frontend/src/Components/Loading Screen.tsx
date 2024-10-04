import React, { useEffect, useState } from 'react';
import './LoadingScreen.css'; // Import the CSS file

interface LoadingScreenProps {
  sentence1: string;
  sentence2: string;
  sentence3: string;
  sentence4: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  sentence1,
  sentence2,
  sentence3,
  sentence4,
}) => {
  const sentences = [sentence1, sentence2, sentence3, sentence4];
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);

  useEffect(() => {
    const intervalDuration = 1000; // Change sentence every 1 second
    const totalDuration = 4000; // Total duration for the loading screen
    const totalSentences = sentences.length;

    const interval = setInterval(() => {
      setCurrentSentenceIndex((prevIndex) => {
        if (prevIndex < totalSentences - 1) {
          return prevIndex + 1;
        }
        return prevIndex; // Keep the last sentence
      });
    }, intervalDuration);

    // Stop the interval after 4 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setCurrentSentenceIndex(totalSentences - 1); // Show the last sentence
    }, totalDuration);

    // Clear the interval and timeout when the component unmounts
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [sentences.length]);

  return (
    <div className="loading-screen w-full">
      <div className="loader">
        <div className="progress-bar" />
      </div>
      <div className="text-center">
        {sentences.map((sentence, index) => (
          <p
            key={index}
            className={`loading-text ${index === currentSentenceIndex ? 'fade-in' : 'fade-out'}`}
            style={{ '--index': index } as React.CSSProperties}
          >
            {sentence}
          </p>
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;
