import { cn } from "../../utils";
import { SVGProps } from "react";

const BaseSvg = ({
  className,
  children,
  ...restProps
}: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-full h-full dark:fill-white", className)}
      {...restProps}
    >
      {children}
    </svg>
  );
};

export default BaseSvg;
