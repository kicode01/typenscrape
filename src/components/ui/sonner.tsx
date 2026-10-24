import { useTheme } from "next-themes"
import { Toaster as Sonner, toast } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="top-center"
      expand={true}
      toastOptions={{
        classNames: {
          toast:
            "group toast neo-card px-4 py-3 font-runde flex items-center gap-3",
          description: "text-theme-icon font-bold text-xs mt-1",
          actionButton:
            "btn-neo px-3 py-1 text-xs",
          cancelButton:
            "btn-neo-sm px-3 py-1 text-xs opacity-80",
        },
      }}
      {...props}
    />
  )
}

export { Toaster, toast }
