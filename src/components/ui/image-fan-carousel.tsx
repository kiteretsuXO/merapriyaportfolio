"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const images = [
  "https://cdn.21st.dev/assets/mirror/bf/bfc82fd647c38dffaf3692024acb366ee99ca95b1338490cfec2c2340d3674a1.jpg",
  "https://cdn.21st.dev/assets/mirror/d6/d64315e93e25068a473e2afaf4651506238618b8589384249fc1ebfce90308cb.jpg",
  "https://cdn.21st.dev/assets/mirror/72/72043d7a404d9d51139f262eea3c282cba95f83c19e8d89c62fc7def551b7f28.jpg",
  "https://cdn.21st.dev/assets/mirror/44/441003ea453f17deb37d9a2353c175aee9e7f0d324b22cc6e5913cbe991266ba.jpg",
  "https://cdn.21st.dev/assets/mirror/0a/0a83a37ee79d76f68a994d707180a02601cb5300151e330b66f5baaebd26ae04.jpg",
  "https://cdn.21st.dev/assets/mirror/27/2728292f8798de2cf1178713570c0a3bb43ffe1bbccea828546ad2dbb5131e85.jpg",
  "https://cdn.21st.dev/assets/mirror/54/54cdd60a4acf0408c150c4076c6133f4969ffd37fe10d8e1fd8ec11c28384f56.jpg",
  "https://cdn.21st.dev/assets/mirror/7e/7e8c47a6830f821879eb755b513688d36329270ccd084655aa7a01f682bcbcf7.jpg",
  "https://cdn.21st.dev/assets/mirror/37/377d530717b131e081629c4e9adf6719393929166ffd8addc623ec0e56b9261c.jpg",
  "https://cdn.21st.dev/assets/mirror/d4/d4a88876ee811f5919081652440246ff6f8c9485142a4ea0da601b2797798eca.jpg",
];

const AUTOPLAY_INTERVAL_MS = 2400;

const springTransition = { type: "spring", stiffness: 60, damping: 16, mass: 0.7 } as const;

const RADIUS_MIN = 120;
const RADIUS_MAX = 320;
const RADIUS_WIDTH_RATIO = 0.55;
const PERSPECTIVE_MULTIPLIER = 2.4;
const RING_TILT_DEG = 38;

const CROSSFADE_DURATION_S = 0.45;
const CROSSFADE_EASE = [0.22, 1, 0.36, 1] as const;

const THUMB_SIZE_CLASSES = "w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24";
const CENTER_SIZE_CLASSES = "w-44 h-44 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80";
const BUTTON_SIZE_CLASSES = "w-9 h-9 sm:w-10 sm:h-10";

const ImageLoader: React.FC = () => (
  <div className="absolute inset-0 flex items-center justify-center bg-black/5 dark:bg-white/5">
    <div className="w-1/4 aspect-square rounded-full border-2 border-black/15 dark:border-white/20 border-t-black/50 dark:border-t-white/60 animate-spin" />
  </div>
);

export const Carousel360: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(220);
  const [loadedThumbs, setLoadedThumbs] = useState<boolean[]>(() => images.map(() => false));

  const numImages = images.length;
  const angleStep = 360 / numImages;

  const steps = Math.round(rotation / angleStep);
  const centerIndex = ((-steps % numImages) + numImages) % numImages;
  const centerImage = images[centerIndex];

  const [prevCenterIndex, setPrevCenterIndex] = useState(centerIndex);
  const [centerLoaded, setCenterLoaded] = useState(false);
  if (centerIndex !== prevCenterIndex) {
    setPrevCenterIndex(centerIndex);
    setCenterLoaded(false);
  }

  useEffect(() => {
    const updateRadius = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.offsetWidth;
      setRadius(Math.max(RADIUS_MIN, Math.min(RADIUS_MAX, width * RADIUS_WIDTH_RATIO)));
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => prev + angleStep);
    }, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [angleStep]);

  const rotateCarousel = useCallback(
    (direction: "left" | "right") => {
      setRotation((prev) => prev + (direction === "left" ? -angleStep : angleStep));
    },
    [angleStep],
  );

  const markThumbLoaded = useCallback((index: number) => {
    setLoadedThumbs((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = true;
      return next;
    });
  }, []);

  const glass =
    "absolute inset-0 rounded-full bg-gradient-to-b from-white/70 to-white/20 dark:from-white/20 dark:to-white/5 backdrop-blur-lg backdrop-saturate-150 border border-white/40 dark:border-white/15 [box-shadow:inset_0_1px_1px_rgba(255,255,255,0.6),inset_0_-1px_2px_rgba(0,0,0,0.06)] dark:[box-shadow:inset_0_1px_1px_rgba(255,255,255,0.12),inset_0_-1px_2px_rgba(0,0,0,0.3)] transition-all duration-200 group-hover:from-white/80 group-hover:to-white/25 dark:group-hover:from-white/25 dark:group-hover:to-white/5";

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none py-6 sm:py-10">
      <div
        ref={containerRef}
        className="relative w-[92%] max-w-[600px] aspect-[5/3] flex items-center justify-center"
      >
        <div className="relative w-full h-full" style={{ perspective: radius * PERSPECTIVE_MULTIPLIER }}>
          {images.map((item, index) => {
            const targetAngle = rotation + angleStep * index;
            return (
              <motion.div
                key={item}
                className="absolute inset-0 flex items-center justify-center"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: targetAngle }}
                transition={springTransition}
              >
                <motion.div
                  className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-[0_6px_20px_rgba(0,0,0,0.15)]"
                  style={{ transformStyle: "preserve-3d" }}
                  animate={{ rotateY: -targetAngle, rotateX: RING_TILT_DEG, z: radius }}
                  transition={springTransition}
                >
                  {!loadedThumbs[index] && <ImageLoader />}
                  <img
                    src={item}
                    alt={`Carousel item ${index + 1}`}
                    width={96}
                    height={96}
                    onLoad={() => markThumbLoaded(index)}
                    className={`object-cover ${THUMB_SIZE_CLASSES} transition-opacity duration-300 ${
                      loadedThumbs[index] ? "opacity-90" : "opacity-0"
                    }`}
                  />
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={centerIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: CROSSFADE_DURATION_S, ease: CROSSFADE_EASE }}
              className="relative rounded-2xl overflow-hidden shadow-[0_10px_35px_rgba(0,0,0,0.18)]"
            >
              {!centerLoaded && <ImageLoader />}
              <img
                src={centerImage}
                alt="Featured"
                width={320}
                height={320}
                loading="lazy"
                onLoad={() => setCenterLoaded(true)}
                className={`object-cover ${CENTER_SIZE_CLASSES} transition-opacity duration-300 ${
                  centerLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-3 mt-6 sm:mt-8 z-30">
        <button
          type="button"
          aria-label="Previous image"
          onClick={() => rotateCarousel("left")}
          className={`group relative flex items-center justify-center ${BUTTON_SIZE_CLASSES} rounded-full overflow-hidden shadow-sm shadow-black/10 dark:shadow-black/30 transition-transform duration-200 active:scale-90 cursor-pointer`}
        >
          <span className={glass} />
          <ArrowLeft className="relative z-10 h-3.5 w-3.5 text-black/60 dark:text-white/80 group-hover:text-black/80 dark:group-hover:text-white transition-colors duration-200" />
        </button>

        <button
          type="button"
          aria-label="Next image"
          onClick={() => rotateCarousel("right")}
          className={`group relative flex items-center justify-center ${BUTTON_SIZE_CLASSES} rounded-full overflow-hidden shadow-sm shadow-black/10 dark:shadow-black/30 transition-transform duration-200 active:scale-90 cursor-pointer`}
        >
          <span className={glass} />
          <ArrowRight className="relative z-10 h-3.5 w-3.5 text-black/60 dark:text-white/80 group-hover:text-black/80 dark:group-hover:text-white transition-colors duration-200" />
        </button>
      </div>
    </div>
  );
};

export default Carousel360;
