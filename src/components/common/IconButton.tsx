import { cva, type VariantProps } from "class-variance-authority";
import React, { DetailedHTMLProps } from "react";

const iconButton = cva(
  "w-18 h-18 inline-grid place-items-center rounded-full p-4 transition-all hover:opacity-85 hover:scale-110",
  {
    variants: {
      variant: {
        default: ["bg-gray-200 dark:bg-gray-800"],
        primary: ["bg-primary"],
        secondary: ["bg-white"],
      },
      size: {
        sm: ["w-10", "h-10", "py-2", "px-2"],
        medium: ["text-base", "py-2", "px-4"],
      },
    },
    compoundVariants: [{ variant: "primary", size: "medium" }],
    defaultVariants: {
      variant: "default",
      size: "medium",
    },
  },
);

type IconButtonProps = DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> &
  VariantProps<typeof iconButton> & {
    icon: JSX.Element;
    label: string;
  };

const IconButton = ({
  icon,
  variant,
  size,
  className,
  label,
  ...restProps
}: IconButtonProps) => {
  return (
    <button
      className={iconButton({ variant, size, className })}
      aria-label={label}
      {...restProps}
    >
      {icon}
    </button>
  );
};

export default IconButton;
