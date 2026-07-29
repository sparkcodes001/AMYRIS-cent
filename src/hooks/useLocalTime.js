import { useState, useEffect } from "react";

export default function useLocalTime(timeZone) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const formatted = new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone,
      }).format(new Date());
      setTime(formatted);
    };

    update();
    const interval = setInterval(update, 1000 * 30);
    return () => clearInterval(interval);
  }, [timeZone]);

  return time;
}
