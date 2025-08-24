import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-black group-[.toaster]:border-2 group-[.toaster]:border-black group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-[.toaster]:rounded-lg group-[.toaster]:font-bold",
          description: "group-[.toast]:text-black group-[.toast]:opacity-70",
          actionButton:
            "group-[.toast]:bg-yellow-400 group-[.toast]:text-black group-[.toast]:border-2 group-[.toast]:border-black group-[.toast]:font-bold group-[.toast]:hover:bg-yellow-300",
          cancelButton:
            "group-[.toast]:bg-pink-400 group-[.toast]:text-black group-[.toast]:border-2 group-[.toast]:border-black group-[.toast]:font-bold group-[.toast]:hover:bg-pink-300",
          success:
            "group-[.toaster]:bg-lime-100 group-[.toaster]:text-black group-[.toaster]:border-2 group-[.toaster]:border-black group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          error:
            "group-[.toaster]:bg-red-100 group-[.toaster]:text-red-700 group-[.toaster]:border-2 group-[.toaster]:border-red-500 group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          info:
            "group-[.toaster]:bg-cyan-100 group-[.toaster]:text-black group-[.toaster]:border-2 group-[.toaster]:border-black group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
          warning:
            "group-[.toaster]:bg-yellow-100 group-[.toaster]:text-black group-[.toaster]:border-2 group-[.toaster]:border-black group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }