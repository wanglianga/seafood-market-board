import { useMemo } from "react";

interface Bubble {
  id: number;
  size: number;
  left: string;
  duration: string;
  delay: string;
}

function generateBubbles(): Bubble[] {
  const count = 8 + Math.floor(Math.random() * 5);
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    size: 8 + Math.random() * 32,
    left: `${Math.random() * 100}%`,
    duration: `${4 + Math.random() * 6}s`,
    delay: `${Math.random() * 6}s`,
  }));
}

export default function BgDecoration() {
  const bubbles = useMemo(generateBubbles, []);

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {bubbles.map((b) => (
          <div
            key={b.id}
            className="bubble"
            style={{
              width: b.size,
              height: b.size,
              left: b.left,
              ["--duration" as string]: b.duration,
              ["--delay" as string]: b.delay,
            }}
          />
        ))}
      </div>

      <div className="wave-decoration">
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className="w-full h-full animate-wave opacity-20"
        >
          <path
            d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,40 1440,60 L1440,120 L0,120 Z"
            fill="rgba(10,37,64,0.6)"
          />
          <path
            d="M0,80 C240,40 480,100 720,70 C960,40 1200,100 1440,80 L1440,120 L0,120 Z"
            fill="rgba(15,52,96,0.4)"
          />
        </svg>
      </div>
    </>
  );
}
