import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
}

export default function Spinner({ className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]",
        className
      )}
      role="status"
    >
      <span className="sr-only">Cargando...</span>
    </div>
  )
}