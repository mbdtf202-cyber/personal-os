import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-white/10 border-white/60 h-11 w-full min-w-0 rounded-full border bg-white/80 px-4 py-2 text-base shadow-inner shadow-white/50 transition-[transform,box-shadow,color] outline-none focus:-translate-y-0.5 focus:border-sky-300 focus:ring-2 focus:ring-sky-200 focus:ring-offset-0 dark:border-white/10 dark:bg-slate-900/60 dark:focus:ring-sky-400 md:text-sm",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
