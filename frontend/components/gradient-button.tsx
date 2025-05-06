import { type ButtonHTMLAttributes, forwardRef } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  size?: "default" | "sm" | "lg" | "icon"
}

export const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, asChild = false, size = "default", ...props }, ref) => {
    const Comp = asChild ? Slot : "button"

    return (
      <Button
        className={cn(
          "relative overflow-hidden bg-gradient-to-r from-violet-600 via-fuchsia-600 to-cyan-600 text-white hover:from-violet-500 hover:via-fuchsia-500 hover:to-cyan-500 transition-all duration-300",
          className,
        )}
        size={size}
        ref={ref}
        asChild
        {...props}
      >
        <Comp className="flex items-center justify-center">{props.children}</Comp>
      </Button>
    )
  },
)

GradientButton.displayName = "GradientButton"
