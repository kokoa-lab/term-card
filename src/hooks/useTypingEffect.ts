import { useState, useEffect, useCallback } from "react";

export function useTypingEffect(text: string, speed = 8, trigger = 0) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);

  const reset = useCallback(() => {
    setDisplayed("");
    setIsDone(false);
  }, []);

  useEffect(() => {
    if (!text) {
      setDisplayed("");
      setIsDone(true);
      return;
    }

    setDisplayed("");
    setIsDone(false);
    let i = 0;

    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsDone(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, trigger]);

  return { displayed, isDone, reset };
}
