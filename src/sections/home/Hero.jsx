import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../lib/gsapConfig";
import { PiArrowRightLight } from "react-icons/pi";
import Button from "../../components/ui/Button";
import HeroFeatureBar from "../../components/ui/HeroFeatureBar";
import HeroProgressRail from "../../components/ui/HeroProgressRail";

const FRAME_COUNT = 121;

const getFrameSrc = (index) => {
  const num = String(index + 1).padStart(4, "0");
  return `/frames/frame_${num}.jpg`;
};

function drawFrame(canvas, images, rawIndex) {
  if (!canvas) return;
  const index = Math.min(Math.max(Math.round(rawIndex), 0), images.length - 1);
  const img = images[index];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const ctx = canvas.getContext("2d");
  const w = window.innerWidth;
  const h = window.innerHeight;

  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const canvasRatio = w / h;

  let drawW, drawH, drawX, drawY;
  if (canvasRatio > imgRatio) {
    drawW = w;
    drawH = w / imgRatio;
  } else {
    drawH = h;
    drawW = h * imgRatio;
  }
  drawX = (w - drawW) / 2;
  drawY = (h - drawH) / 2;

  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(img, drawX, drawY, drawW, drawH);
}

export default function Hero({ onReady }) {
  const heroRef = useRef(null);
  const canvasRef = useRef(null);

  const eyebrowRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const descRef = useRef(null);
  const ctaRef = useRef(null);
  const featureBarRef = useRef(null);
  const railContainerRef = useRef(null);
  const railDotRef = useRef(null);

  const imagesRef = useRef([]);
  const frameObjRef = useRef({ value: 0 });

  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const images = [];
    let count = 0;
    let cancelled = false;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFrameSrc(i);

      img.onload = () => {
        if (cancelled) return;
        count++;
        setLoadProgress(Math.round((count / FRAME_COUNT) * 100));
        if (count === 1) drawFrame(canvasRef.current, images, 0);
        if (count === FRAME_COUNT) setLoaded(true);
      };

      img.onerror = () => {
        console.error(`Failed to load frame: ${img.src}`);
        count++;
        if (count === FRAME_COUNT) setLoaded(true);
      };

      images.push(img);
    }

    imagesRef.current = images;
    return () => {
      cancelled = true;
    };
  }, []);

  useGSAP(
    () => {
      if (!loaded) return;

      drawFrame(canvasRef.current, imagesRef.current, 0);

      gsap.set(eyebrowRef.current, { opacity: 0, y: 16 });
      gsap.set(line1Ref.current, { yPercent: 100 });
      gsap.set(line2Ref.current, { yPercent: 100 });
      gsap.set(descRef.current, { opacity: 0, y: 16 });
      gsap.set(ctaRef.current, { opacity: 0, y: 16 });
      gsap.set(featureBarRef.current, { opacity: 0, y: 24 });
      gsap.set(railContainerRef.current, { opacity: 0 });

      const frameObj = frameObjRef.current;
      frameObj.value = 0;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=300%",
          scrub: 0.5,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        frameObj,
        {
          value: FRAME_COUNT - 1,
          ease: "none",
          duration: 100,
          onUpdate: () => {
            drawFrame(canvasRef.current, imagesRef.current, frameObj.value);
            const progress = frameObj.value / (FRAME_COUNT - 1);
            if (railDotRef.current) {
              railDotRef.current.style.top = `${progress * 100}%`;
            }
          },
        },
        0,
      );

      tl.to(railContainerRef.current, { opacity: 1, duration: 8 }, 3);
      tl.to(
        eyebrowRef.current,
        { opacity: 1, y: 0, ease: "power2.out", duration: 12 },
        4,
      );
      tl.to(
        line1Ref.current,
        { yPercent: 0, ease: "power3.out", duration: 18 },
        12,
      );
      tl.to(
        line2Ref.current,
        { yPercent: 0, ease: "power3.out", duration: 18 },
        24,
      );
      tl.to(
        descRef.current,
        { opacity: 1, y: 0, ease: "power2.out", duration: 14 },
        38,
      );
      tl.to(
        ctaRef.current,
        { opacity: 1, y: 0, ease: "power2.out", duration: 12 },
        50,
      );
      tl.to(
        featureBarRef.current,
        { opacity: 1, y: 0, ease: "power2.out", duration: 16 },
        62,
      );

      const handleResize = () =>
        drawFrame(
          canvasRef.current,
          imagesRef.current,
          Math.round(frameObj.value),
        );

      window.addEventListener("resize", handleResize);

      // ─── THE ACTUAL FIX ───
      // Hero's pin-spacer now exists in the DOM (ScrollTrigger inserts it
      // synchronously above, during timeline creation). It is now 100%
      // safe for anything below Hero to measure the page and build its
      // own ScrollTrigger — nothing will be stale, because nothing built
      // anything before this layout was finalized.
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        onReady?.();
      });

      return () => window.removeEventListener("resize", handleResize);
    },
    { scope: heroRef, dependencies: [loaded] },
  );

  return (
    <>
      {!loaded && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-amyris-black">
          <p className="font-display text-3xl tracking-[0.3em] text-amyris-cream">
            AMYRIS
          </p>
          <div className="mt-6 h-[1px] w-48 overflow-hidden bg-amyris-cream/20">
            <div
              className="h-full bg-amyris-gold transition-all duration-300 ease-out"
              style={{ width: `${loadProgress}%` }}
            />
          </div>
          <p className="mt-3 font-sans text-[10px] tracking-[0.3em] text-amyris-cream/40">
            {loadProgress}%
          </p>
        </div>
      )}

      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden bg-amyris-black"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" /> */}

        <HeroProgressRail containerRef={railContainerRef} dotRef={railDotRef} />

        <div className="relative z-10 grid h-full w-full grid-rows-[auto_minmax(0,1fr)_auto]">
          <div className="h-20 md:h-24" />

          <div className="flex min-h-0 items-center px-6 sm:px-10 md:px-14 lg:px-20">
            <div className="max-w-2xl text-left">
              <p
                ref={eyebrowRef}
                className="mb-[clamp(0.75rem,2vmin,1.25rem)] font-sans text-[clamp(0.65rem,1.4vmin,0.8rem)] font-medium uppercase tracking-[0.35em] text-amyris-gold-light"
              >
                Beyond Scent. Beyond Time.
              </p>

              <h1 className="font-display font-medium text-amyris-cream leading-[1.05] text-[clamp(2rem,7vmin,5.5rem)]">
                <span className="block overflow-hidden">
                  <span ref={line1Ref} className="block">
                    Where Light
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span ref={line2Ref} className="block">
                    <em className="font-serif italic text-amyris-gold-light">
                      becomes
                    </em>{" "}
                    Fragrance
                  </span>
                </span>
              </h1>

              <p
                ref={descRef}
                className="mt-[clamp(0.75rem,2vmin,1.5rem)] max-w-md font-sans leading-relaxed text-amyris-cream/70 text-[clamp(0.8rem,1.8vmin,1.125rem)]"
              >
                A collection of rare essences, crafted with precision, inspired
                by elegance.
              </p>

              <Button
                ref={ctaRef}
                className="mt-[clamp(1rem,3vmin,2.5rem)] px-5 py-3 text-[9px] tracking-[0.2em] sm:px-7 sm:py-3.5 sm:text-[10px] sm:tracking-[0.25em] md:px-9 md:py-4 md:text-[11px] md:tracking-[0.3em]"
              >
                {/* Short label on the smallest screens, full label from sm up —
      guarantees it can never overflow/wrap regardless of device width */}
                <span className="sm:hidden"> Discover The Collection</span>
                <span className="hidden sm:inline">
                  Discover The Collection
                </span>
                <PiArrowRightLight
                  size={14}
                  className="shrink-0 transition-transform duration-500 group-hover:translate-x-1 sm:hidden"
                />
                <PiArrowRightLight
                  size={16}
                  className="hidden shrink-0 transition-transform duration-500 group-hover:translate-x-1 sm:block"
                />
              </Button>
            </div>
          </div>

          <div className="px-4 pb-5 sm:px-6 sm:pb-7 md:px-10 md:pb-10">
            <HeroFeatureBar innerRef={featureBarRef} />
          </div>
        </div>
      </section>
    </>
  );
}
