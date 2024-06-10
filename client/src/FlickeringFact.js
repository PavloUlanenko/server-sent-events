import { useState, useEffect } from 'react';

export default function FlickeringFact({ fact, handleFactCompleted, isLast }) {
  const [displayResponse, setDisplayResponse] = useState('');
  const [completedTyping, setCompletedTyping] = useState(false);

  useEffect(() => {
    setCompletedTyping(false);
  
    let i = 0;
    const stringResponse = fact;
  
    const intervalId = setInterval(() => {
      setDisplayResponse(stringResponse.slice(0, i));
  
      i++;
  
      if (i > stringResponse.length) {
        clearInterval(intervalId);
        setCompletedTyping(true);
        handleFactCompleted();
      }
    }, 20);
  
    return () => clearInterval(intervalId);
  }, [fact]);

  return <p className='flickering'>{displayResponse}{completedTyping && isLast ? <span className='cursor'>|</span> : ''}</p>;
}