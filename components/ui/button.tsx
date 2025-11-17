import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--color-primary)] text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0",
        destructive:
          "bg-[var(--color-danger)] text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0",
        outline:
          "border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm hover:-translate-y-0.5 hover:border-[var(--color-primary)] hover:bg-[var(--bg-tertiary)] hover:shadow-md active:translate-y-0",
        secondary:
          "bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm hover:-translate-y-0.5 hover:bg-[var(--bg-secondary)] hover:shadow-md active:translate-y-0",
        ghost:
          "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]",
        link: "text-[var(--color-primary)] underline-offset-4 hover:underline",
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
