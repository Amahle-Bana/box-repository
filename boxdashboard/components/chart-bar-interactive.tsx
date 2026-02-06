"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useEffect, useState } from "react"

export const description = "An interactive bar chart"

// Chart data will be populated from API
const chartData: { date: string; impressions: number }[] = []

const chartConfig = {
    views: {
        label: "Page Views",
    },
    impressions: {
        label: "Impressions",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig

export function ChartBarInteractive() {

    // Impression tracking state
    const [impressionStats, setImpressionStats] = useState<{
        total_impressions: number;
        today_impressions: number;
        daily_impressions: any[];
        loading: boolean;
        error: string | null;
    }>({
        total_impressions: 0,
        today_impressions: 0,
        daily_impressions: [],
        loading: false,
        error: null
    })

    // Chart data state
    const [chartData, setChartData] = useState<{ date: string; impressions: number }[]>([])

    // Function to fetch impression statistics
    const fetchImpressionStats = async () => {
        try {
            setImpressionStats(prev => ({ ...prev, loading: true, error: null }))

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/somaapp/get-impressions-stats/`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            // Process daily impressions data for chart
            const processedChartData = (data.daily_impressions || []).map((item: any) => ({
                date: item.date,
                impressions: item.impressions || 0
            }))

            setImpressionStats({
                total_impressions: data.total_impressions || 0,
                today_impressions: data.today_impressions || 0,
                daily_impressions: data.daily_impressions || [],
                loading: false,
                error: null
            })

            // Update chart data
            setChartData(processedChartData)

            // Log the data for debugging
            console.log('--------------------Total impressions:', data.total_impressions);
            console.log('--------------------Today impressions:', data.today_impressions);
            console.log('--------------------Daily breakdown:', data.daily_impressions);
            console.log('--------------------Processed chart data:', processedChartData);

        } catch (error) {
            console.error('Error fetching impression stats:', error)
            setImpressionStats(prev => ({
                ...prev,
                loading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch impression statistics'
            }))
        }
    }
    const total = React.useMemo(
        () => ({
            impressions: chartData.reduce((acc, curr) => acc + curr.impressions, 0),
        }),
        [chartData]
    )

    // useEffect to fetch impression stats
    useEffect(() => {
        fetchImpressionStats()
    }, [])

    return (
        <Card className="py-0">
            <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
                <div className="flex flex-1 flex-col font-comfortaa justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
                    <CardTitle>App Impressions</CardTitle>
                    <CardDescription>
                        Showing total impressions over time
                    </CardDescription>
                </div>
                <div className="flex">
                    <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left sm:px-8 sm:py-6">
                        <span className="text-muted-foreground text-xs">
                            Total Impressions
                        </span>
                        <span className="text-lg leading-none font-bold sm:text-3xl">
                            {total.impressions.toLocaleString()}
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="px-2 sm:p-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    className="w-[150px]"
                                    nameKey="views"
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}
                                />
                            }
                        />
                        <Bar dataKey="impressions" fill={`primary`} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
