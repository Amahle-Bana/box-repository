import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"
import { useEffect, useState } from "react"

import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface UserStats {
    total_users: number
    growth_percentage: number
    growth_direction: 'up' | 'down'
    current_month_users: number
    previous_month_users: number
}

interface PartyStats {
    total_parties: number
    growth_percentage: number
    growth_direction: 'up' | 'down'
}

interface CandidateStats {
    total_candidates: number
    growth_percentage: number
    growth_direction: 'up' | 'down'
}

export function SectionCards() {
    const [userStats, setUserStats] = useState<UserStats>({
        total_users: 0,
        growth_percentage: 0,
        growth_direction: 'up',
        current_month_users: 0,
        previous_month_users: 0
    })
    const [partyStats, setPartyStats] = useState<PartyStats>({
        total_parties: 0,
        growth_percentage: 0,
        growth_direction: 'up'
    })
    const [candidateStats, setCandidateStats] = useState<CandidateStats>({
        total_candidates: 0,
        growth_percentage: 0,
        growth_direction: 'up'
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Function to fetch user statistics from backend
    const fetchUserStats = async () => {
        let response: Response | undefined = undefined
        try {
            setLoading(true)
            setError(null)

            response = await fetch('http://localhost:8000/somaapp/get-user-stats/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication if needed
            })

            if (!response.ok) {
                await response.text()
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
            }

            const data = await response.json()
            // console.log('API response data:', data)

            if (data.message === 'User statistics fetched successfully') {
                setUserStats({
                    total_users: data.total_users,
                    growth_percentage: data.growth_percentage,
                    growth_direction: data.growth_direction,
                    current_month_users: data.current_month_users,
                    previous_month_users: data.previous_month_users
                })
            } else {
                throw new Error('Failed to fetch user statistics')
            }
        } catch (err) {
            console.error('Error fetching user statistics:', err)
            if (response) {
                // console.error('Response status:', response.status)
                // console.error('Response statusText:', response.statusText)
            }
            setError(err instanceof Error ? err.message : 'Unknown error occurred')
            // Set fallback data on error
            setUserStats({
                total_users: 1250,
                growth_percentage: 12.5,
                growth_direction: 'up',
                current_month_users: 0,
                previous_month_users: 0
            })
        } finally {
            setLoading(false)
        }
    }

    // Function to fetch party statistics from backend
    const fetchPartyStats = async () => {
        let response: Response | undefined = undefined
        try {
            response = await fetch('http://localhost:8000/somaapp/get-party-stats/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) {
                await response.text()
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
            }

            const data = await response.json()
            // console.log('Party API response data:', data)

            if (data.message === 'Party statistics fetched successfully') {
                setPartyStats({
                    total_parties: data.total_parties,
                    growth_percentage: data.growth_percentage,
                    growth_direction: data.growth_direction
                })
            } else {
                throw new Error('Failed to fetch party statistics')
            }
        } catch (err) {
            console.error('Error fetching party statistics:', err)
            if (response) {
                // console.error('Response status:', response.status)
                // console.error('Response statusText:', response.statusText)
            }
            // Set fallback data on error
            setPartyStats({
                total_parties: 45,
                growth_percentage: 12.5,
                growth_direction: 'up'
            })
        }
    }

    // Function to fetch candidate statistics from backend
    const fetchCandidateStats = async () => {
        let response: Response | undefined = undefined
        try {
            response = await fetch('http://localhost:8000/somaapp/get-candidate-stats/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            })

            if (!response.ok) {
                await response.text()
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
            }

            const data = await response.json()
            // console.log('Candidate API response data:', data)

            if (data.message === 'Candidate statistics fetched successfully') {
                setCandidateStats({
                    total_candidates: data.total_candidates,
                    growth_percentage: data.growth_percentage,
                    growth_direction: data.growth_direction
                })
            } else {
                throw new Error('Failed to fetch candidate statistics')
            }
        } catch (err) {
            console.error('Error fetching candidate statistics:', err)
            if (response) {
                // console.error('Response status:', response.status)
                // console.error('Response statusText:', response.statusText)
            }
            // Set fallback data on error
            setCandidateStats({
                total_candidates: 23,
                growth_percentage: 4.5,
                growth_direction: 'up'
            })
        }
    }

    // Fetch all statistics on component mount
    useEffect(() => {
        const fetchAllStats = async () => {
            setLoading(true)
            try {
                await Promise.all([
                    fetchUserStats(),
                    fetchPartyStats(),
                    fetchCandidateStats()
                ])
            } catch (error) {
                // console.error('Error fetching statistics:', error)
            } finally {
                setLoading(false)
            }
        }
        
        fetchAllStats()
    }, [])

    // Format number with commas
    const formatNumber = (num: number): string => {
        return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
    }
    return (
        <div className="*:data-[slot=card]:from-primary/5 font-comfortaa *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            
            {/* Total Registered Users */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Registered Users</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {loading ? "Loading..." : error ? "Error" : formatNumber(userStats.total_users)}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {loading ? "Loading..." : error ? "Error loading data" : (
                            userStats.growth_direction === 'up'
                                ? `${userStats.current_month_users} new users this month`
                                : `${userStats.previous_month_users} new users this month`
                        )} {userStats.growth_direction === 'up' ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
                    </div>
                    {error && (
                        <div className="text-muted-foreground text-xs">
                            <span className="text-red-500">Error: {error}</span>
                            <button
                                onClick={fetchUserStats}
                                className="ml-2 text-blue-500 hover:text-blue-700 underline"
                            >
                                Retry
                            </button>
                        </div>
                    )}
                </CardFooter>
            </Card>

            {/* Growth Rate This Month */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Growth Rate This Month</CardDescription>
                    <CardTitle className="flex flex-row align-center  text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {userStats.growth_direction === 'up' ? <IconTrendingUp className="size-10" /> : <IconTrendingDown />}
                        {userStats.growth_direction === 'up' ? '+' : ''}{userStats.growth_percentage.toFixed(1)}%
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {loading ? "Loading..." : error ? "Error loading data" : (
                            userStats.growth_direction === 'up'
                                ? `Trending up this month`
                                : `Trending down this month`
                        )} {userStats.growth_direction === 'up' ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
                    </div>
                </CardFooter>
            </Card>

            {/* Total Parties */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Parties</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {loading ? "Loading..." : formatNumber(partyStats.total_parties)}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {loading ? "Loading..." : (
                            partyStats.growth_direction === 'up'
                                ? `Trending up this month`
                                : `Trending down this month`
                        )} {partyStats.growth_direction === 'up' ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
                    </div>
                </CardFooter>
            </Card>

            {/* Total Candidates */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Candidates</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {loading ? "Loading..." : formatNumber(candidateStats.total_candidates)}
                    </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {loading ? "Loading..." : (
                            candidateStats.growth_direction === 'up'
                                ? `Trending up this month`
                                : `Trending down this month`
                        )} {candidateStats.growth_direction === 'up' ? <IconTrendingUp className="size-4" /> : <IconTrendingDown className="size-4" />}
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
