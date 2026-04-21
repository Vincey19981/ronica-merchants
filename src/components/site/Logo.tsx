import { Link } from "react-router-dom";

export const Logo = ({ light = false }: { light?: boolean }) => {
  return (
    <Link to="/" className="group inline-flex flex-col leading-none">
      <span
        className={`font-display text-lg font-extrabold tracking-tight sm:text-xl ${
          light ? "text-white" : "text-primary"
        }`}
        style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
      >
        RONICA <span className="text-accent">MERCHANTS</span>
      </span>
      <span className="mt-1 h-[3px] w-12 rounded-full bg-accent transition-all group-hover:w-16" />
    </Link>
  );
};