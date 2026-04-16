"use client";

/**
 * AmbientScene — decorative background layer.
 * Sparkles, glowing bubbles, red strings, glass bottles, keys, letters.
 * All fixed-position, pointer-events-none, z-index 0.
 */
export default function AmbientScene() {
  return (
    <div aria-hidden="true">
      {/* ── Sparkle stars ── */}
      <span className="ambient-sparkle" style={{ "--dur": "2.8s", "--delay": "0s",   "--size": "12px", top: "8%",  left: "7%"  } as React.CSSProperties}>✦</span>
      <span className="ambient-sparkle" style={{ "--dur": "3.5s", "--delay": "0.6s", "--size": "8px",  top: "15%", left: "22%" } as React.CSSProperties}>✧</span>
      <span className="ambient-sparkle" style={{ "--dur": "4s",   "--delay": "1.2s", "--size": "16px", top: "5%",  left: "55%" } as React.CSSProperties}>✦</span>
      <span className="ambient-sparkle" style={{ "--dur": "2.5s", "--delay": "0.3s", "--size": "10px", top: "20%", left: "80%" } as React.CSSProperties}>✧</span>
      <span className="ambient-sparkle" style={{ "--dur": "3.8s", "--delay": "1.8s", "--size": "14px", top: "40%", left: "92%" } as React.CSSProperties}>✦</span>
      <span className="ambient-sparkle" style={{ "--dur": "3.2s", "--delay": "0.9s", "--size": "9px",  top: "60%", left: "4%"  } as React.CSSProperties}>✧</span>
      <span className="ambient-sparkle" style={{ "--dur": "4.2s", "--delay": "2.1s", "--size": "13px", top: "75%", left: "18%" } as React.CSSProperties}>✦</span>
      <span className="ambient-sparkle" style={{ "--dur": "2.9s", "--delay": "0.5s", "--size": "11px", top: "85%", left: "70%" } as React.CSSProperties}>✧</span>
      <span className="ambient-sparkle" style={{ "--dur": "3.6s", "--delay": "1.5s", "--size": "7px",  top: "90%", left: "88%" } as React.CSSProperties}>✦</span>
      <span className="ambient-sparkle" style={{ "--dur": "3.1s", "--delay": "2.4s", "--size": "15px", top: "50%", left: "48%" } as React.CSSProperties}>✧</span>

      {/* ── Glowing bubbles ── */}
      <div className="ambient-bubble" style={{ "--dur": "5s",   "--delay": "0s",   "--size": "22px", top: "12%", left: "14%" } as React.CSSProperties} />
      <div className="ambient-bubble" style={{ "--dur": "6.5s", "--delay": "1s",   "--size": "14px", top: "30%", left: "88%" } as React.CSSProperties} />
      <div className="ambient-bubble" style={{ "--dur": "4.8s", "--delay": "2s",   "--size": "32px", top: "55%", left: "6%"  } as React.CSSProperties} />
      <div className="ambient-bubble" style={{ "--dur": "7s",   "--delay": "0.5s", "--size": "18px", top: "70%", left: "78%" } as React.CSSProperties} />
      <div className="ambient-bubble" style={{ "--dur": "5.5s", "--delay": "1.8s", "--size": "10px", top: "82%", left: "42%" } as React.CSSProperties} />
      <div className="ambient-bubble" style={{ "--dur": "6s",   "--delay": "3s",   "--size": "26px", top: "22%", left: "62%" } as React.CSSProperties} />

      {/* ── Red strings ── */}
      <div className="ambient-string" style={{ top: "28%", left: "0",  width: "18%", animationDelay: "0s"   } as React.CSSProperties} />
      <div className="ambient-string" style={{ top: "62%", right: "0", width: "22%", animationDelay: "2s", left: "78%" } as React.CSSProperties} />
      <div className="ambient-string" style={{ top: "45%", left: "60%", width: "14%", animationDelay: "1s"  } as React.CSSProperties} />

      {/* ── Glass bottles ── */}
      <span className="ambient-bottle" style={{ "--dur": "7s",  "--delay": "0s",   "--size": "30px", top: "18%", left: "3%"  } as React.CSSProperties}>🫙</span>
      <span className="ambient-bottle" style={{ "--dur": "9s",  "--delay": "1.5s", "--size": "24px", top: "65%", left: "94%" } as React.CSSProperties}>🫙</span>
      <span className="ambient-bottle" style={{ "--dur": "8s",  "--delay": "3s",   "--size": "20px", top: "80%", left: "12%" } as React.CSSProperties}>🫙</span>

      {/* ── Keys ── */}
      <span className="ambient-key" style={{ "--dur": "8s",  "--delay": "0.5s", "--size": "24px", top: "35%", left: "2%"  } as React.CSSProperties}>🗝️</span>
      <span className="ambient-key" style={{ "--dur": "10s", "--delay": "2s",   "--size": "20px", top: "72%", left: "90%" } as React.CSSProperties}>🗝️</span>
      <span className="ambient-key" style={{ "--dur": "7s",  "--delay": "4s",   "--size": "18px", top: "10%", left: "96%" } as React.CSSProperties}>🗝️</span>

      {/* ── Letters / envelopes ── */}
      <span className="ambient-letter" style={{ "--dur": "9s",  "--delay": "1s",   "--size": "22px", top: "48%", left: "96%" } as React.CSSProperties}>✉️</span>
      <span className="ambient-letter" style={{ "--dur": "11s", "--delay": "0s",   "--size": "18px", top: "88%", left: "55%" } as React.CSSProperties}>✉️</span>
      <span className="ambient-letter" style={{ "--dur": "8s",  "--delay": "2.5s", "--size": "20px", top: "5%",  left: "38%" } as React.CSSProperties}>✉️</span>
    </div>
  );
}
