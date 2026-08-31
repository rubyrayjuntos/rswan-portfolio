import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Blueprint({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("blueprint", className)} {...props}>
      {children}
      <i className="corner tl" aria-hidden />
      <i className="corner tr" aria-hidden />
      <i className="corner bl" aria-hidden />
      <i className="corner br" aria-hidden />
    </div>
  );
}
