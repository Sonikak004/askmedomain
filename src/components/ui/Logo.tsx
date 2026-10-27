import React from "react";
import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
  className?: string;
  asLink?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  showTagline = false,
  className = "",
  asLink = true,
}) => {
  const sizeClasses = {
    sm: "text-xl tracking-tight",
    md: "text-2xl tracking-tight",
    lg: "text-3xl md:text-4xl tracking-tight",
    xl: "text-4xl md:text-5xl lg:text-6xl tracking-tighter",
  };

  const content = (
    <div className={`inline-flex flex-col ${className}`}>
      <div className={`font-black flex items-center leading-none ${sizeClasses[size]} select-none`}>
        <span className="text-[#0052FF] font-extrabold">ask</span>
        <span className="text-[#FF5500] font-black">me</span>
        <span className="text-[#0052FF] font-extrabold">domain</span>
      </div>
      {showTagline && (
        <span className="text-xs sm:text-sm text-slate-500 font-medium tracking-wide mt-1.5 text-center">
          Find. Register. Grow.
        </span>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-block transition-transform hover:opacity-95 focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};
