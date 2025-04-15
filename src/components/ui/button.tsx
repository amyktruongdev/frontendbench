import { cn } from "../../lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> { }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2 text-white font-medium shadow hover:bg-gray-800 transition-all",
          className
        )}
        {...props}
      />
    )
  }
)

Button.displayName = "Button"
