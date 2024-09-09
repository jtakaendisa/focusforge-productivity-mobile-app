import { useEffect, useState } from 'react';

const useMountAnimation = (animationDuration: number = 2100) => {
  const [playAnimations, setPlayAnimations] = useState(true);

  useEffect(() => {
    if (playAnimations) {
      const timeout = setTimeout(() => {
        setPlayAnimations(false);
      }, animationDuration);

      return () => clearTimeout(timeout);
    }
  }, [playAnimations, animationDuration]);

  return playAnimations;
};

export default useMountAnimation;
