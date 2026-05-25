import { useState } from 'react';

export function useLecture() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchLectureData = async (fileName) => {
    setIsLoading(true);
    try {
      const response = await fetch(`./data/${fileName}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    fetchLectureData,
  };
}
