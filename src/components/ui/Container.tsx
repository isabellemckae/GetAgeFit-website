import { HTMLAttributes } from "react";

export function Container({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`mx-auto w-full max-w-content px-6 md:px-10 ${className}`}
      {...props}
    />
  );
}
