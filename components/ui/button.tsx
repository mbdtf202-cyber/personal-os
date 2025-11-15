import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-sky-200 focus-visible:ring-offset-2 dark:focus-visible:ring-sky-400 focus-visible:ring-offset-transparent",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 text-white shadow-[0_20px_40px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(79,70,229,0.45)]",
        destructive:
          "bg-rose-500 text-white shadow-[0_20px_40px_rgba(244,63,94,0.2)] hover:-translate-y-0.5 hover:shadow-[0_24px_48px_rgba(244,63,94,0.3)] dark:bg-rose-500/80",
        outline:
          "border border-white/60 bg-white/80 text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.08)] hover:-translate-y-0.5 hover:border-sky-200 hover:text-slate-900 hover:shadow-[0_18px_40px_rgba(79,70,229,0.18)] dark:border-white/10 dark:bg-white/10 dark:text-slate-200",
        secondary:
          "bg-secondary text-secondary-foreground shadow-[0_16px_40px_rgba(16,185,129,0.2)] hover:-translate-y-0.5 hover:shadow-[0_20px_45px_rgba(16,185,129,0.28)]",
        ghost:
          "text-slate-600 hover:bg-white/70 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-white/10",
        link: "text-sky-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "size-11",
        "icon-sm": "size-9",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
