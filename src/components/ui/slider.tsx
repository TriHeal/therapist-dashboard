"use client"

import { Slider as SliderPrimitive } from "@base-ui/react/slider"

import { cn } from "@/lib/utils"

// Base UI slider. Given `name`, Slider.Root renders a hidden input, so the value is
// submitted natively via FormData (no client controller needed). Indicator/Thumb position
// themselves with logical inline styles, so this is RTL-safe. Renders `children` (e.g. a
// label + value row) above the track, mirroring the Progress wrapper.
function Slider({ className, children, ...props }: SliderPrimitive.Root.Props) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn("w-full space-y-2", className)}
      {...props}
    >
      {children}
      <SliderPrimitive.Control className="flex w-full touch-none items-center py-1 select-none">
        <SliderPrimitive.Track className="h-1.5 w-full rounded-full bg-muted select-none">
          <SliderPrimitive.Indicator className="rounded-full bg-primary select-none" />
          <SliderPrimitive.Thumb className="size-4 rounded-full bg-primary shadow-sm outline-2 outline-background transition-transform outline-solid focus-visible:ring-3 focus-visible:ring-ring/50 select-none" />
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

function SliderValue({ className, ...props }: SliderPrimitive.Value.Props) {
  return (
    <SliderPrimitive.Value
      data-slot="slider-value"
      className={cn("text-sm font-medium tabular-nums text-foreground", className)}
      {...props}
    />
  )
}

export { Slider, SliderValue }
