import { useEffect } from "react";
import { ScrollTrigger } from "../lib/gsapConfig";

export default function useScrollRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();

    // Fires once every requested web font has finished loading —
    // fixes any layout shift caused by fallback-font → real-font swap
    if (document.fonts?.ready) {
      document.fonts.ready.then(refresh);
    }

    // Fires once all images/media have finished loading
    window.addEventListener("load", refresh);

    // Final safety net for anything that settles slightly late
    const timeout = setTimeout(refresh, 1500);

    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(timeout);
    };
  }, []);
}
