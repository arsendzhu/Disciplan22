type TreeCanvasProps = {
  level: number;
  variant?: "orchard" | "blossom" | "aviary" | "moonlit";
};

export function TreeCanvas({ level, variant = "orchard" }: TreeCanvasProps) {
  const canopy = level >= 11 ? 78 : level >= 7 ? 62 : level >= 4 ? 48 : 34;
  const trunk = level >= 11 ? 26 : level >= 7 ? 20 : level >= 4 ? 16 : 12;

  return (
    <svg className="h-[300px] w-full max-w-[360px]" viewBox="0 0 300 300">
      <defs>
        <linearGradient id="tree-canopy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(126,200,164,0.96)" />
          <stop offset="100%" stopColor="rgba(232,201,122,0.65)" />
        </linearGradient>
      </defs>
      <path d={`M ${150 - trunk / 2} 260 h ${trunk} V 140 h -${trunk} Z`} fill="rgba(201,139,106,0.9)" />
      <circle cx="150" cy="118" fill="url(#tree-canopy)" r={canopy} />
      <circle cx="108" cy="146" fill="rgba(126,200,164,0.82)" r={canopy * 0.72} />
      <circle cx="198" cy="150" fill="rgba(126,200,164,0.80)" r={canopy * 0.64} />
      {variant === "orchard" ? (
        <>
          <circle cx="116" cy="110" fill="rgba(232,201,122,0.92)" r="10" />
          <circle cx="182" cy="130" fill="rgba(232,201,122,0.92)" r="9" />
        </>
      ) : null}
      {variant === "blossom" ? (
        <>
          <circle cx="120" cy="108" fill="rgba(242,237,228,0.95)" r="8" />
          <circle cx="178" cy="126" fill="rgba(212,83,126,0.9)" r="8" />
          <circle cx="154" cy="94" fill="rgba(212,83,126,0.74)" r="7" />
        </>
      ) : null}
      {variant === "aviary" ? (
        <>
          <path d="M 188 94 q 14 -8 22 6 q -10 4 -22 -6" fill="rgba(242,237,228,0.92)" />
          <path d="M 92 132 q 12 -6 18 5 q -9 4 -18 -5" fill="rgba(139,167,212,0.92)" />
        </>
      ) : null}
      {variant === "moonlit" ? (
        <>
          <circle cx="222" cy="76" fill="rgba(242,237,228,0.9)" r="16" />
          <circle cx="230" cy="68" fill="rgba(15,14,12,0.9)" r="12" />
        </>
      ) : null}
      {level >= 11 ? <circle cx="210" cy="90" fill="rgba(242,237,228,0.88)" r="12" /> : null}
    </svg>
  );
}
