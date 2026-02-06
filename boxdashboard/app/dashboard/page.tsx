"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartBarInteractive } from "@/components/chart-bar-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, XCircle, Upload, Plus, Users, User } from "lucide-react"
import { IconBrandFacebook, IconBrandInstagram, IconBrandX, IconBrandThreads, IconBrandYoutube, IconBrandLinkedin, IconBrandTiktok } from "@tabler/icons-react"
import { ClipLoader } from "react-spinners"

export default function Page() {
    const router = useRouter()
    const [selectedDashboard, setSelectedDashboard] = useState("dashboard")

    // Party Registration State
    const [partyFormData, setPartyFormData] = useState({
        party_name: '',
        manifesto: '',
        party_leader: '',
        structure: '',
        logo: '',
        website: '',
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        tiktok: '',
        x: '',
        threads: ''
    })

    // Candidate Registration State
    const [candidateFormData, setCandidateFormData] = useState({
        candidate_name: '',
        manifesto: '',
        department: '',
        structure: '',
        profile_picture: '',
        website: '',
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        youtube: '',
        tiktok: '',
        x: '',
        threads: ''
    })

    // UI States
    const [isPartySubmitting, setIsPartySubmitting] = useState(false)
    const [isCandidateSubmitting, setIsCandidateSubmitting] = useState(false)
    const [partyMessage, setPartyMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [candidateMessage, setCandidateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

    // Edit Party/Candidate States
    const [parties, setParties] = useState([])
    const [candidates, setCandidates] = useState([])
    const [isLoadingParties, setIsLoadingParties] = useState(false)
    const [isLoadingCandidates, setIsLoadingCandidates] = useState(false)
    const [partiesError, setPartiesError] = useState<string | null>(null)
    const [candidatesError, setCandidatesError] = useState<string | null>(null)

    // Posts States
    const [posts, setPosts] = useState<any[]>([])
    const [isLoadingPosts, setIsLoadingPosts] = useState(false)
    const [postsError, setPostsError] = useState<string | null>(null)


    // Form handlers
    const handlePartyInputChange = (field: string, value: string) => {
        setPartyFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleCandidateInputChange = (field: string, value: string) => {
        setCandidateFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Image/Logo upload handlers
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'party' | 'candidate') => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const base64String = event.target?.result as string
                if (type === 'party') {
                    handlePartyInputChange('logo', base64String)
                } else {
                    handleCandidateInputChange('profile_picture', base64String)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    // Party registration submit
    const handlePartySubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!partyFormData.party_name.trim()) {
            setPartyMessage({ type: 'error', text: 'Party name is required' })
            return
        }

        setIsPartySubmitting(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/somaapp/register-party/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(partyFormData),
            })

            const result = await response.json()

            if (response.ok) {
                setPartyMessage({ type: 'success', text: 'Party registered successfully!' })
                // Reset form
                setPartyFormData({
                    party_name: '',
                    manifesto: '',
                    party_leader: '',
                    structure: '',
                    logo: '',
                    website: '',
                    facebook: '',
                    twitter: '',
                    instagram: '',
                    linkedin: '',
                    youtube: '',
                    tiktok: '',
                    x: '',
                    threads: ''
                })
            } else {
                setPartyMessage({ type: 'error', text: result.error || 'Failed to register party' })
            }
        } catch (error) {
            setPartyMessage({ type: 'error', text: 'Network error. Please try again.' })
        } finally {
            setIsPartySubmitting(false)
        }
    }

    // Candidate registration submit
    const handleCandidateSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!candidateFormData.candidate_name.trim()) {
            setCandidateMessage({ type: 'error', text: 'Candidate name is required' })
            return
        }

        setIsCandidateSubmitting(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/somaapp/register-candidate/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(candidateFormData),
            })

            const result = await response.json()

            if (response.ok) {
                setCandidateMessage({ type: 'success', text: 'Candidate registered successfully!' })
                // Reset form
                setCandidateFormData({
                    candidate_name: '',
                    manifesto: '',
                    department: '',
                    structure: '',
                    profile_picture: '',
                    website: '',
                    facebook: '',
                    twitter: '',
                    instagram: '',
                    linkedin: '',
                    youtube: '',
                    tiktok: '',
                    x: '',
                    threads: ''
                })
            } else {
                setCandidateMessage({ type: 'error', text: result.error || 'Failed to register candidate' })
            }
        } catch (error) {
            setCandidateMessage({ type: 'error', text: 'Network error. Please try again.' })
        } finally {
            setIsCandidateSubmitting(false)
        }
    }


    // Handle edit party navigation
    const handleEditParty = (partyId: number) => {
        router.push(`/dashboard/edit-party?id=${partyId}`)
    }

    // Handle edit candidate navigation
    const handleEditCandidate = (candidateId: number) => {
        router.push(`/dashboard/edit-candidate?id=${candidateId}`)
    }

    // Clear messages after 5 seconds
    useEffect(() => {
        if (partyMessage) {
            const timer = setTimeout(() => setPartyMessage(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [partyMessage])

    useEffect(() => {
        if (candidateMessage) {
            const timer = setTimeout(() => setCandidateMessage(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [candidateMessage])

    // Fetch parties data
    const fetchParties = async () => {
        setIsLoadingParties(true)
        setPartiesError(null)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/somaapp/get-all-parties/`)
            if (response.ok) {
                const result = await response.json()
                setParties(result.parties || [])
            } else {
                setPartiesError('Failed to fetch parties')
            }
        } catch (error) {
            setPartiesError('Network error while fetching parties')
        } finally {
            setIsLoadingParties(false)
        }
    }

    // Fetch candidates data
    const fetchCandidates = async () => {
        setIsLoadingCandidates(true)
        setCandidatesError(null)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/somaapp/get-all-candidates/`)
            if (response.ok) {
                const result = await response.json()
                setCandidates(result.candidates || [])
            } else {
                setCandidatesError('Failed to fetch candidates')
            }
        } catch (error) {
            setCandidatesError('Network error while fetching candidates')
        } finally {
            setIsLoadingCandidates(false)
        }
    }

    // Fetch posts data
    const fetchPosts = async () => {
        setIsLoadingPosts(true)
        setPostsError(null)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/somaapp/get-all-posts/`)
            if (response.ok) {
                const result = await response.json()
                setPosts(result.posts || [])
            } else {
                setPostsError('Failed to fetch posts')
            }
        } catch (error) {
            setPostsError('Network error while fetching posts')
        } finally {
            setIsLoadingPosts(false)
        }
    }

    // Fetch data when component mounts or when respective tabs are selected
    useEffect(() => {
        if (selectedDashboard === "Edit Party/Counciller") {
            fetchParties()
            fetchCandidates()
        } else if (selectedDashboard === "User Posts") {
            fetchPosts()
        }
    }, [selectedDashboard])


    // Dashboard Content
    const renderDashboardContent = () => {
        switch (selectedDashboard) {
            case "dashboard":
                return (
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards />
                        <div className="px-4 lg:px-6">
                            <ChartBarInteractive />
                        </div>
                    </div>
                )
            case "Party Registration":
                return (
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 font-comfortaa">
                        <div className="px-4 lg:px-6">

                            <Card className="w-full max-w-4xl mx-auto">
                                <CardHeader>
                                    <CardTitle>Party Registration Form</CardTitle>
                                    <CardDescription>
                                        Please fill in all the required information to register your political party.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handlePartySubmit} className="space-y-6">
                                        {/* Basic Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Basic Information</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="party_name">Party Name *</Label>
                                                    <Input
                                                        id="party_name"
                                                        type="text"
                                                        value={partyFormData.party_name}
                                                        onChange={(e) => handlePartyInputChange('party_name', e.target.value)}
                                                        placeholder="Enter party name"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="party_leader">Party Leader</Label>
                                                    <Input
                                                        id="party_leader"
                                                        type="text"
                                                        value={partyFormData.party_leader}
                                                        onChange={(e) => handlePartyInputChange('party_leader', e.target.value)}
                                                        placeholder="Enter party leader name"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="department">Structure</Label>
                                                    <Select
                                                        value={partyFormData.structure}
                                                        onValueChange={(value) => handlePartyInputChange('structure', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Structure" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ISRC">ISRC</SelectItem>
                                                            <SelectItem value="Alice SRC">Alice SRC</SelectItem>
                                                            <SelectItem value="East London SRC">East London SRC</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>


                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="manifesto">Party Manifesto</Label>
                                                <Textarea
                                                    id="manifesto"
                                                    value={partyFormData.manifesto}
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handlePartyInputChange('manifesto', e.target.value)}
                                                    placeholder="Describe your party's manifesto and policies..."
                                                    className="min-h-[120px]"
                                                />
                                            </div>

                                            {/* Logo Upload */}
                                            <div className="space-y-2">
                                                <Label>Party Logo</Label>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1">
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleLogoUpload(e, 'party')}
                                                            className="cursor-pointer"
                                                        />
                                                    </div>
                                                    {partyFormData.logo && (
                                                        <div className="w-16 h-16 border rounded-lg overflow-hidden">
                                                            <img
                                                                src={partyFormData.logo}
                                                                alt="Party logo preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Contact Information</h3>

                                            <div className="space-y-2">
                                                <Label htmlFor="website">Website</Label>
                                                <Input
                                                    id="website"
                                                    type="url"
                                                    value={partyFormData.website}
                                                    onChange={(e) => handlePartyInputChange('website', e.target.value)}
                                                    placeholder="https://yourparty.com"
                                                />
                                            </div>
                                        </div>

                                        {/* Social Media */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Social Media Links</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="facebook" className="flex items-center gap-2">
                                                        <IconBrandFacebook className="h-4 w-4" />
                                                        Facebook
                                                    </Label>
                                                    <Input
                                                        id="facebook"
                                                        type="url"
                                                        value={partyFormData.facebook}
                                                        onChange={(e) => handlePartyInputChange('facebook', e.target.value)}
                                                        placeholder="https://facebook.com/yourparty"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="twitter" className="flex items-center gap-2">
                                                        <IconBrandX className="h-4 w-4" />
                                                        X (Twitter)
                                                    </Label>
                                                    <Input
                                                        id="twitter"
                                                        type="url"
                                                        value={partyFormData.twitter}
                                                        onChange={(e) => handlePartyInputChange('twitter', e.target.value)}
                                                        placeholder="https://x.com/yourparty"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="instagram" className="flex items-center gap-2">
                                                        <IconBrandInstagram className="h-4 w-4" />
                                                        Instagram
                                                    </Label>
                                                    <Input
                                                        id="instagram"
                                                        type="url"
                                                        value={partyFormData.instagram}
                                                        onChange={(e) => handlePartyInputChange('instagram', e.target.value)}
                                                        placeholder="https://instagram.com/yourparty"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="youtube" className="flex items-center gap-2">
                                                        <IconBrandYoutube className="h-4 w-4" />
                                                        YouTube
                                                    </Label>
                                                    <Input
                                                        id="youtube"
                                                        type="url"
                                                        value={partyFormData.youtube}
                                                        onChange={(e) => handlePartyInputChange('youtube', e.target.value)}
                                                        placeholder="https://youtube.com/@yourparty"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="linkedin" className="flex items-center gap-2">
                                                        <IconBrandLinkedin className="h-4 w-4" />
                                                        LinkedIn
                                                    </Label>
                                                    <Input
                                                        id="linkedin"
                                                        type="url"
                                                        value={partyFormData.linkedin}
                                                        onChange={(e) => handlePartyInputChange('linkedin', e.target.value)}
                                                        placeholder="https://linkedin.com/company/yourparty"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="tiktok" className="flex items-center gap-2">
                                                        <IconBrandTiktok className="h-4 w-4" />
                                                        TikTok
                                                    </Label>
                                                    <Input
                                                        id="tiktok"
                                                        type="url"
                                                        value={partyFormData.tiktok}
                                                        onChange={(e) => handlePartyInputChange('tiktok', e.target.value)}
                                                        placeholder="https://tiktok.com/@yourparty"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message Display */}
                                        {partyMessage && (
                                            <div className={`p-4 rounded-md border ${partyMessage.type === 'success'
                                                ? 'bg-green-50 border-green-200 text-green-800'
                                                : 'bg-red-50 border-red-200 text-red-800'
                                                }`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        {partyMessage.type === 'success' ? (
                                                            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                                                        ) : (
                                                            <XCircle className="h-5 w-5 text-red-600 mr-2" />
                                                        )}
                                                        <span className="font-medium">{partyMessage.text}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setPartyMessage(null)}
                                                        className={`ml-4 p-1 rounded-full hover:bg-opacity-20 ${partyMessage.type === 'success' ? 'hover:bg-green-600' : 'hover:bg-red-600'
                                                            }`}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <div className="flex justify-end pt-4">
                                            <Button
                                                type="submit"
                                                disabled={isPartySubmitting}
                                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                            >
                                                {isPartySubmitting ? (
                                                    <ClipLoader color="white" size={20} />
                                                ) : (
                                                    'Register Party'
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )
            case "Counciller Registration":
                return (
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <div className="px-4 lg:px-6">

                            <Card className="w-full max-w-4xl mx-auto font-comfortaa">
                                <CardHeader>
                                    <CardTitle>Counciller Registration Form</CardTitle>
                                    <CardDescription>
                                        Please fill in all the required information to register as a counciller.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleCandidateSubmit} className="space-y-6">
                                        {/* Basic Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Basic Information</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="candidate_name">Counciller Name *</Label>
                                                    <Input
                                                        id="candidate_name"
                                                        type="text"
                                                        value={candidateFormData.candidate_name}
                                                        onChange={(e) => handleCandidateInputChange('candidate_name', e.target.value)}
                                                        placeholder="Enter your full name"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="department">Faculty/Department</Label>
                                                    <Select
                                                        value={candidateFormData.department}
                                                        onValueChange={(value) => handleCandidateInputChange('department', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Faculty/Department" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Faculty Of Law">Faculty Of Law</SelectItem>
                                                            <SelectItem value="Management & Commerce">Management & Commerce</SelectItem>
                                                            <SelectItem value="Health Sciences">Health Sciences</SelectItem>
                                                            <SelectItem value="Social Sciences & Humanities">Social Sciences & Humanities</SelectItem>
                                                            <SelectItem value="Education">Education</SelectItem>
                                                            <SelectItem value="Science & Agriculture">Science & Agriculture</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="structure">Structure</Label>
                                                    <Select
                                                        value={candidateFormData.structure}
                                                        onValueChange={(value) => handleCandidateInputChange('structure', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Structure" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="ISRC">ISRC</SelectItem>
                                                            <SelectItem value="Alice SRC">Alice SRC</SelectItem>
                                                            <SelectItem value="East London SRC">East London SRC</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="candidate_manifesto">Campaign Manifesto</Label>
                                                <Textarea
                                                    id="candidate_manifesto"
                                                    value={candidateFormData.manifesto}
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleCandidateInputChange('manifesto', e.target.value)}
                                                    placeholder="Describe your campaign manifesto and what you plan to achieve..."
                                                    className="min-h-[120px]"
                                                />
                                            </div>

                                            {/* Profile Picture Upload */}
                                            <div className="space-y-2">
                                                <Label>Profile Picture</Label>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-1">
                                                        <Input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => handleLogoUpload(e, 'candidate')}
                                                            className="cursor-pointer"
                                                        />
                                                    </div>
                                                    {candidateFormData.profile_picture && (
                                                        <div className="w-16 h-16 border rounded-lg overflow-hidden">
                                                            <img
                                                                src={candidateFormData.profile_picture}
                                                                alt="Profile picture preview"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Contact Information</h3>

                                            <div className="space-y-2">
                                                <Label htmlFor="candidate_website">Website</Label>
                                                <Input
                                                    id="candidate_website"
                                                    type="url"
                                                    value={candidateFormData.website}
                                                    onChange={(e) => handleCandidateInputChange('website', e.target.value)}
                                                    placeholder="https://yourwebsite.com"
                                                />
                                            </div>
                                        </div>

                                        {/* Social Media */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Social Media Links</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="candidate_facebook" className="flex items-center gap-2">
                                                        <IconBrandFacebook className="h-4 w-4" />
                                                        Facebook
                                                    </Label>
                                                    <Input
                                                        id="candidate_facebook"
                                                        type="url"
                                                        value={candidateFormData.facebook}
                                                        onChange={(e) => handleCandidateInputChange('facebook', e.target.value)}
                                                        placeholder="https://facebook.com/yourprofile"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="candidate_twitter" className="flex items-center gap-2">
                                                        <IconBrandX className="h-4 w-4" />
                                                        X (Twitter)
                                                    </Label>
                                                    <Input
                                                        id="candidate_twitter"
                                                        type="url"
                                                        value={candidateFormData.twitter}
                                                        onChange={(e) => handleCandidateInputChange('twitter', e.target.value)}
                                                        placeholder="https://x.com/yourprofile"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="candidate_instagram" className="flex items-center gap-2">
                                                        <IconBrandInstagram className="h-4 w-4" />
                                                        Instagram
                                                    </Label>
                                                    <Input
                                                        id="candidate_instagram"
                                                        type="url"
                                                        value={candidateFormData.instagram}
                                                        onChange={(e) => handleCandidateInputChange('instagram', e.target.value)}
                                                        placeholder="https://instagram.com/yourprofile"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="candidate_youtube" className="flex items-center gap-2">
                                                        <IconBrandYoutube className="h-4 w-4" />
                                                        YouTube
                                                    </Label>
                                                    <Input
                                                        id="candidate_youtube"
                                                        type="url"
                                                        value={candidateFormData.youtube}
                                                        onChange={(e) => handleCandidateInputChange('youtube', e.target.value)}
                                                        placeholder="https://youtube.com/@yourprofile"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="candidate_linkedin" className="flex items-center gap-2">
                                                        <IconBrandLinkedin className="h-4 w-4" />
                                                        LinkedIn
                                                    </Label>
                                                    <Input
                                                        id="candidate_linkedin"
                                                        type="url"
                                                        value={candidateFormData.linkedin}
                                                        onChange={(e) => handleCandidateInputChange('linkedin', e.target.value)}
                                                        placeholder="https://linkedin.com/in/yourprofile"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="candidate_tiktok" className="flex items-center gap-2">
                                                        <IconBrandTiktok className="h-4 w-4" />
                                                        TikTok
                                                    </Label>
                                                    <Input
                                                        id="candidate_tiktok"
                                                        type="url"
                                                        value={candidateFormData.tiktok}
                                                        onChange={(e) => handleCandidateInputChange('tiktok', e.target.value)}
                                                        placeholder="https://tiktok.com/@yourprofile"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message Display */}
                                        {candidateMessage && (
                                            <div className={`p-4 rounded-md border ${candidateMessage.type === 'success'
                                                ? 'bg-green-50 border-green-200 text-green-800'
                                                : 'bg-red-50 border-red-200 text-red-800'
                                                }`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        {candidateMessage.type === 'success' ? (
                                                            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                                                        ) : (
                                                            <XCircle className="h-5 w-5 text-red-600 mr-2" />
                                                        )}
                                                        <span className="font-medium">{candidateMessage.text}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setCandidateMessage(null)}
                                                        className={`ml-4 p-1 rounded-full hover:bg-opacity-20 ${candidateMessage.type === 'success' ? 'hover:bg-green-600' : 'hover:bg-red-600'
                                                            }`}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <div className="flex justify-end pt-4">
                                            <Button
                                                type="submit"
                                                disabled={isCandidateSubmitting}
                                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                            >
                                                {isCandidateSubmitting ? (
                                                    <ClipLoader color="white" size={20} />
                                                ) : (
                                                    'Register Candidate'
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )

            case "Edit Party/Counciller":
                return (
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 font-comfortaa">
                        <div className="px-4 lg:px-6">
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold mb-2">Edit Party/Candidates</h1>
                                <p className="text-muted-foreground">Manage and edit registered parties and candidates</p>
                            </div>

                            <Tabs defaultValue="parties" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="parties" className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Parties ({parties.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="candidates" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Candidates ({candidates.length})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="parties" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Registered Parties</CardTitle>
                                            <CardDescription>
                                                View and manage all registered political parties
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {isLoadingParties ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <ClipLoader color="#3b82f6" size={24} />
                                                    <span className="ml-2 text-muted-foreground">Loading parties...</span>
                                                </div>
                                            ) : partiesError ? (
                                                <div className="text-center py-8">
                                                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                                    <p className="text-red-600 mb-4">{partiesError}</p>
                                                    <Button onClick={fetchParties} variant="outline">
                                                        Try Again
                                                    </Button>
                                                </div>
                                            ) : parties.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                    <p className="text-muted-foreground">No parties registered yet</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {parties.map((party: any) => (
                                                        <Card key={party.id} className="border-l-4 border-l-blue-500">
                                                            <CardContent className="pt-4">
                                                                <div className="flex items-start gap-4">
                                                                    {party.logo && (
                                                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                                            <img
                                                                                src={party.logo}
                                                                                alt={`${party.party_name} logo`}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-start justify-between mb-2">
                                                                            <div>
                                                                                <h3 className="font-semibold text-lg">{party.party_name}</h3>
                                                                                {party.party_leader && (
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                        Leader: {party.party_leader}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <div className="text-2xl font-bold text-blue-600">{party.votes || 0}</div>
                                                                                <div className="text-sm text-muted-foreground">votes</div>
                                                                            </div>
                                                                        </div>

                                                                        {party.manifesto && (
                                                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                                                {party.manifesto}
                                                                            </p>
                                                                        )}

                                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                            <span>Supporters: {party.supporters_count || 0}</span>
                                                                            {party.website && (
                                                                                <a
                                                                                    href={party.website}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-blue-600 hover:underline"
                                                                                >
                                                                                    Website
                                                                                </a>
                                                                            )}
                                                                        </div>

                                                                        <div className="flex gap-2 mt-3">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleEditParty(party.id)}
                                                                            >
                                                                                Edit
                                                                            </Button>
                                            
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="candidates" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Registered Candidates</CardTitle>
                                            <CardDescription>
                                                View and manage all registered candidates
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            {isLoadingCandidates ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <ClipLoader color="#3b82f6" size={24} />
                                                    <span className="ml-2 text-muted-foreground">Loading candidates...</span>
                                                </div>
                                            ) : candidatesError ? (
                                                <div className="text-center py-8">
                                                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                                    <p className="text-red-600 mb-4">{candidatesError}</p>
                                                    <Button onClick={fetchCandidates} variant="outline">
                                                        Try Again
                                                    </Button>
                                                </div>
                                            ) : candidates.length === 0 ? (
                                                <div className="text-center py-8">
                                                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                                    <p className="text-muted-foreground">No candidates registered yet</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-4">
                                                    {candidates.map((candidate: any) => (
                                                        <Card key={candidate.id} className="border-l-4 border-l-green-500">
                                                            <CardContent className="pt-4">
                                                                <div className="flex items-start gap-4">
                                                                    {candidate.profile_picture && (
                                                                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                                                            <img
                                                                                src={candidate.profile_picture}
                                                                                alt={`${candidate.candidate_name} profile`}
                                                                                className="w-full h-full object-cover"
                                                                            />
                                                                        </div>
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-start justify-between mb-2">
                                                                            <div>
                                                                                <h3 className="font-semibold text-lg">{candidate.candidate_name}</h3>
                                                                                {candidate.department && (
                                                                                    <p className="text-sm text-muted-foreground">
                                                                                        Position: {candidate.department}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <div className="text-right">
                                                                                <div className="text-2xl font-bold text-green-600">{candidate.votes || 0}</div>
                                                                                <div className="text-sm text-muted-foreground">votes</div>
                                                                            </div>
                                                                        </div>

                                                                        {candidate.manifesto && (
                                                                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                                                                {candidate.manifesto}
                                                                            </p>
                                                                        )}

                                                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                                            <span>Supporters: {candidate.supporters_count || 0}</span>
                                                                            {candidate.website && (
                                                                                <a
                                                                                    href={candidate.website}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-blue-600 hover:underline"
                                                                                >
                                                                                    Website
                                                                                </a>
                                                                            )}
                                                                        </div>

                                                                        <div className="flex gap-2 mt-3">
                                                                            <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => handleEditCandidate(candidate.id)}
                                                                            >
                                                                                Edit
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                )
            case "User Posts":
                return (
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 font-comfortaa">
                        <div className="px-4 lg:px-6">
                            <h1 className="text-2xl font-bold mb-2">User Posts</h1>
                            <p className="text-muted-foreground">Manage and view all user posts</p>
                        </div>
                        <div>
                            {isLoadingPosts ? (
                                <div className="flex items-center justify-center py-8">
                                    <ClipLoader color="#3b82f6" size={24} />
                                    <span className="ml-2 text-muted-foreground">Loading posts...</span>
                                </div>
                            ) : postsError ? (
                                <div className="text-center py-8">
                                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                    <p className="text-red-600 mb-4">{postsError}</p>
                                    <Button onClick={fetchPosts} variant="outline">
                                        Try Again
                                    </Button>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-8">
                                    <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No posts found</p>
                                </div>
                            ) : (
                                <DataTable
                                    data={posts}
                                    onDelete={(postId) => {
                                        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId))
                                    }}
                                />
                            )}
                        </div>
                    </div>
                )
            default:
                return (
                    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                        <SectionCards />
                        <div className="px-4 lg:px-6">
                            <ChartBarInteractive />
                        </div>
                    </div>
                )
        }
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar
                variant="inset"
                selectedDashboard={selectedDashboard}
                onDashboardChange={setSelectedDashboard}
            />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        {/* Dashboard Content */}
                        {renderDashboardContent()}
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
