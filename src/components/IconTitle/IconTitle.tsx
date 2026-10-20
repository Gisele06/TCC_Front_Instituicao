import type { ReactNode } from "react";
import "./IconTitle.css";

interface IconTitleProps {
  icon: string;
  children: ReactNode;
  className?: string;
}

export default function IconTitle({ icon, children, className = "" }: IconTitleProps) {
  return (
    <span className={`bloom-icon-title ${className}`.trim()}>
      <img src={icon} alt="" aria-hidden="true" />
      <span>{children}</span>
    </span>
  );
}
