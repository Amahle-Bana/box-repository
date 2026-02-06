"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react"
import { IconBrandFacebook, IconBrandInstagram, IconBrandX, IconBrandThreads, IconBrandYoutube, IconBrandLinkedin, IconBrandTiktok } from "@tabler/icons-react"
import { ClipLoader } from "react-spinners"

export default function EditCandidatePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const candidateId = searchParams.get('id')

    // Candidate Edit State
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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [candidate, setCandidate] = useState<any>(null)

    // Form handlers
    const handleInputChange = (field: string, value: string) => {
        setCandidateFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Image upload handler
    const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const base64String = event.target?.result as string
                handleInputChange('profile_picture', base64String)
            }
            reader.readAsDataURL(file)
        }
    }

    // Fetch candidate data
    const fetchCandidate = async () => {
        if (!candidateId) return

        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/somaapp/get-all-candidates/`)
            if (response.ok) {
                const result = await response.json()
                const foundCandidate = result.candidates.find((c: any) => c.id === parseInt(candidateId))
                if (foundCandidate) {
                    setCandidate(foundCandidate)
                    setCandidateFormData({
                        candidate_name: foundCandidate.candidate_name || '',
                        manifesto: foundCandidate.manifesto || '',
                        department: foundCandidate.department || '',
                        structure: foundCandidate.structure || '',
                        profile_picture: foundCandidate.profile_picture || '',
                        website: foundCandidate.website || '',
                        facebook: foundCandidate.facebook || '',
                        twitter: foundCandidate.twitter || '',
                        instagram: foundCandidate.instagram || '',
                        linkedin: foundCandidate.linkedin || '',
                        youtube: foundCandidate.youtube || '',
                        tiktok: foundCandidate.tiktok || '',
                        x: foundCandidate.x || '',
                        threads: foundCandidate.threads || ''
                    })
                } else {
                    setMessage({ type: 'error', text: 'Candidate not found' })
                }
            } else {
                setMessage({ type: 'error', text: 'Failed to fetch candidate data' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error while fetching candidate data' })
        } finally {
            setIsLoading(false)
        }
    }

    // Candidate update submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!candidateFormData.candidate_name.trim()) {
            setMessage({ type: 'error', text: 'Candidate name is required' })
            return
        }

        if (!candidateId) {
            setMessage({ type: 'error', text: 'Candidate ID is missing' })
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/somaapp/update-candidate/${candidateId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(candidateFormData),
            })

            const result = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Candidate updated successfully!' })
                // Refresh candidate data
                await fetchCandidate()
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to update candidate' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error. Please try again.' })
        } finally {
            setIsSubmitting(false)
        }
    }

    // Clear messages after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 5000)
            return () => clearTimeout(timer)
        }
    }, [message])

    // Fetch candidate data on component mount
    useEffect(() => {
        fetchCandidate()
    }, [candidateId])

    if (isLoading) {
        return (
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                                <div className="flex items-center justify-center py-8">
                                    <ClipLoader color="#3b82f6" size={24} />
                                    <span className="ml-2 text-muted-foreground">Loading candidate data...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    if (!candidate && !isLoading) {
        return (
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar />
                <SidebarInset>
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                                <div className="text-center py-8">
                                    <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                                    <p className="text-red-600 mb-4">Candidate not found</p>
                                    <Button onClick={() => router.back()} variant="outline">
                                        Go Back
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
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
            <AppSidebar />
            <SidebarInset>
                <SiteHeader />
                <div className="flex flex-1 flex-col font-comfortaa">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.back()}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>
                                <div>
                                    <h1 className="text-2xl font-bold">Edit Candidate</h1>
                                    <p className="text-muted-foreground">Update candidate information and details</p>
                                </div>
                            </div>

                            <Card className="w-full max-w-4xl mx-auto">
                                <CardHeader>
                                    <CardTitle>Candidate Information</CardTitle>
                                    <CardDescription>
                                        Edit the candidate details below. All changes will be saved to the database.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Basic Information */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold">Basic Information</h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="candidate_name">Candidate Name *</Label>
                                                    <Input
                                                        id="candidate_name"
                                                        type="text"
                                                        value={candidateFormData.candidate_name}
                                                        onChange={(e) => handleInputChange('candidate_name', e.target.value)}
                                                        placeholder="Enter your full name"
                                                        required
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="department">Faculty/Department</Label>
                                                    <Select
                                                        value={candidateFormData.department}
                                                        onValueChange={(value) => handleInputChange('department', value)}
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
                                                        onValueChange={(value) => handleInputChange('structure', value)}
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
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('manifesto', e.target.value)}
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
                                                            onChange={handleProfilePictureUpload}
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
                                                    onChange={(e) => handleInputChange('website', e.target.value)}
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
                                                        onChange={(e) => handleInputChange('facebook', e.target.value)}
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
                                                        onChange={(e) => handleInputChange('twitter', e.target.value)}
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
                                                        onChange={(e) => handleInputChange('instagram', e.target.value)}
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
                                                        onChange={(e) => handleInputChange('youtube', e.target.value)}
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
                                                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
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
                                                        onChange={(e) => handleInputChange('tiktok', e.target.value)}
                                                        placeholder="https://tiktok.com/@yourprofile"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message Display */}
                                        {message && (
                                            <div className={`p-4 rounded-md border ${message.type === 'success'
                                                ? 'bg-green-50 border-green-200 text-green-800'
                                                : 'bg-red-50 border-red-200 text-red-800'
                                                }`}>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        {message.type === 'success' ? (
                                                            <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                                                        ) : (
                                                            <XCircle className="h-5 w-5 text-red-600 mr-2" />
                                                        )}
                                                        <span className="font-medium">{message.text}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => setMessage(null)}
                                                        className={`ml-4 p-1 rounded-full hover:bg-opacity-20 ${message.type === 'success' ? 'hover:bg-green-600' : 'hover:bg-red-600'
                                                            }`}
                                                    >
                                                        <XCircle className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        <div className="flex justify-end gap-4 pt-4">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => router.back()}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                            >
                                                {isSubmitting ? (
                                                    <ClipLoader color="white" size={20} />
                                                ) : (
                                                    'Update Candidate'
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
