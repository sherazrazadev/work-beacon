import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] active:bg-[#d44f20]",
        secondary:
          "border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] hover:bg-[var(--surface-muted)] active:bg-[color-mix(in_oklab,var(--fg)_8%,var(--surface))]",
        ghost:
          "text-[var(--fg)] hover:bg-[var(--surface-muted)] active:bg-[color-mix(in_oklab,var(--fg)_8%,transparent)]",
        link: "text-[var(--accent)] underline-offset-4 hover:underline active:text-[var(--accent-hover)]",
      },
      size: {
        default: "h-10 min-h-10 px-4 py-2",
        sm: "h-8 min-h-8 rounded-md px-3 text-xs",
        lg: "h-11 min-h-11 rounded-md px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
