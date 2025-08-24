import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 border-2 border-solid transform active:translate-y-1 hover:-translate-y-1 hover:shadow-lg",
  {
    variants: {
      variant: {
        default: "bg-yellow-400 text-black border-black hover:bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        secondary: "bg-pink-400 text-black border-black hover:bg-pink-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        outline: "bg-white text-black border-black hover:bg-gray-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50 border-none shadow-none hover:shadow-none hover:translate-y-0 active:translate-y-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }