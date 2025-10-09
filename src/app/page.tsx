import React from 'react'
import { Slider } from "@/components/ui/slider"

export default function Dashboard() {
  return (
    <div>
      <h1>this is dashboard</h1>
      <div className="flex flex-col gap-6 w-350 max-w-md">
      <Slider
          className="max-w-md" color="foreground" defaultValue={0.2}
          label="Temperature" maxValue={15} minValue={5}
          showSteps={true} size="md" step={1}
          />
          </div>
    </div>
  );
}
