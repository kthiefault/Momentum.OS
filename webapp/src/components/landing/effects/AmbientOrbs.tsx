interface AmbientOrbsProps {
  variant?: "ember" | "ice" | "dual";
  className?: string;
}

const AmbientOrbs = ({ variant = "dual", className = "" }: AmbientOrbsProps) => {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {(variant === "ember" || variant === "dual") ? (
        <div
          className="absolute -top-32 -left-24 h-[40rem] w-[40rem] rounded-full opacity-40 animate-drift"
          style={{
            background:
              "radial-gradient(circle at center, hsl(221 79% 48% / 0.55), hsl(214 85% 40% / 0.25) 40%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
      ) : null}
      {(variant === "ice" || variant === "dual") ? (
        <div
          className="absolute -bottom-40 -right-32 h-[44rem] w-[44rem] rounded-full opacity-30 animate-drift-slow"
          style={{
            background:
              "radial-gradient(circle at center, hsl(192 90% 70% / 0.45), hsl(210 90% 55% / 0.2) 40%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
      ) : null}
    </div>
  );
};

export default AmbientOrbs;
