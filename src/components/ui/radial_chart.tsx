"use client"

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import { ChartContainer, ChartConfig } from "./Chart"

export const description = "Radial charts for documents and messages"

const createChartData = (value: number, fill: string) => [
  { value: Math.max(value, 1), fill, actualValue: value }
]

const createChartConfig = (label: string, color: string): ChartConfig => ({
  value: { label },
  custom: { label, color },
})

export function DocumentsChart({ count }: { count: number }) {
  const chartData = createChartData(count, "#519DE9")
  const chartConfig = createChartConfig("Dokumenter", "hsl(var(--chart-1))")

  return (
    <div className="w-full h-full">
      <RadialChartComponent
        data={chartData}
        config={chartConfig}
        label="Dokumenter"
      />
    </div>
  )
}

export function MessagesChart({ count }: { count: number }) {
  const chartData = createChartData(count, "#519DE9")
  const chartConfig = createChartConfig("Beskeder", "hsl(var(--chart-2))")

  return (
    <div className="w-full h-full">
      <RadialChartComponent
        data={chartData}
        config={chartConfig}
        label="Beskeder"
      />
    </div>
  )
}

export function NotesChart({ count }: { count: number }) {
  const chartData = createChartData(count, "#519DE9")
  const chartConfig = createChartConfig("Noter", "hsl(var(--chart-3))")

  return (
    <div className="w-full h-full">
      <RadialChartComponent
        data={chartData}
        config={chartConfig}
        label="Noter"
      />
    </div>
  )
}

function RadialChartComponent({ data, config, label }: { data: any[], config: ChartConfig, label: string }) {
  const isZero = data[0].actualValue === 0;

  return (
    <ChartContainer
      config={config}
      className="mx-auto aspect-square h-full w-full"
    >
      <RadialBarChart
        data={data}
        startAngle={90}
        endAngle={-280}
        innerRadius={80}
        outerRadius={110}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar 
          dataKey="value" 
          background={{ fill: "rgb(250,250,252)" }}
          cornerRadius={10} 
          className={isZero ? "opacity-30" : ""}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-4xl font-bold"
                    >
                      {data[0].actualValue.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      {label}
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}
