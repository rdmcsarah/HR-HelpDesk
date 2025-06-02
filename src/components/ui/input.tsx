import * as React from "react"
import { type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon
  iconPosition?: "left" | "right"
  iconClassName?: string
  wrapperClassName?: string
}

function Input({
  className,
  type,
  icon: Icon,
  iconPosition = "left",
  iconClassName,
  wrapperClassName,
  ...props
}: InputProps) {
  return (
    <div className={cn(
      "relative flex items-center",
      wrapperClassName
    )}>
      {Icon && iconPosition === "left" && (
        <Icon
          className={cn(
            "text-muted-foreground absolute left-3 size-4 pointer-events-none",
            iconClassName
          )}
        />
      )}
      <input

      type={type}
            data-slot="input"
            className={cn(
              "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
              "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",

              iconPosition === "left" && "pl-10",
          iconPosition === "right" && "pr-10",
              className
            )}
            {...props}
      
       
  
      />
      {Icon && iconPosition === "right" && (
        <Icon
          className={cn(
            "text-muted-foreground absolute right-3 size-4 pointer-events-none",
            iconClassName
          )}
        />
      )}
    </div>
  )
}

export { Input }
