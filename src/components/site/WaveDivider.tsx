export const WaveDivider = ({ flip = false, fill = "hsl(var(--surface))" }: { flip?: boolean; fill?: string }) => (
  <div aria-hidden className="leading-[0]" style={{ transform: flip ? "rotate(180deg)" : undefined }}>
    <svg
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className="block h-[60px] w-full md:h-[80px]"
    >
      <path
        d="M0,40 C240,80 480,0 720,32 C960,64 1200,16 1440,40 L1440,80 L0,80 Z"
        fill={fill}
      />
    </svg>
  </div>
);