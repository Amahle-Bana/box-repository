"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, XCircle, Upload, ArrowLeft } from "lucide-react"
import { IconBrandFacebook, IconBrandInstagram, IconBrandX, IconBrandThreads, IconBrandYoutube, IconBrandLinkedin, IconBrandTiktok } from "@tabler/icons-react"
import { ClipLoader } from "react-spinners"

export default function EditPartyPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const partyId = searchParams.get('id')

    // Party Edit State
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

    // UI States
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
    const [party, setParty] = useState<any>(null)

    // Form handlers
    const handleInputChange = (field: string, value: string) => {
        setPartyFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Image upload handler
    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                const base64String = event.target?.result as string
                handleInputChange('logo', base64String)
            }
            reader.readAsDataURL(file)
        }
    }

    // Fetch party data
    const fetchParty = async () => {
        if (!partyId) return

        setIsLoading(true)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/somaapp/get-all-parties/`)
            if (response.ok) {
                const result = await response.json()
                const foundParty = result.parties.find((p: any) => p.id === parseInt(partyId))
                if (foundParty) {
                    setParty(foundParty)
                    setPartyFormData({
                        party_name: foundParty.party_name || '',
                        manifesto: foundParty.manifesto || '',
                        party_leader: foundParty.party_leader || '',
                        structure: foundParty.structure || '',
                        logo: foundParty.logo || '',
                        website: foundParty.website || '',
                        facebook: foundParty.facebook || '',
                        twitter: foundParty.twitter || '',
                        instagram: foundParty.instagram || '',
                        linkedin: foundParty.linkedin || '',
                        youtube: foundParty.youtube || '',
                        tiktok: foundParty.tiktok || '',
                        x: foundParty.x || '',
                        threads: foundParty.threads || ''
                    })
                } else {
                    setMessage({ type: 'error', text: 'Party not found' })
                }
            } else {
                setMessage({ type: 'error', text: 'Failed to fetch party data' })
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'Network error while fetching party data' })
        } finally {
            setIsLoading(false)
        }
    }

    // Party update submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!partyFormData.party_name.trim()) {
            setMessage({ type: 'error', text: 'Party name is required' })
            return
        }

        if (!partyId) {
            setMessage({ type: 'error', text: 'Party ID is missing' })
            return
        }

        setIsSubmitting(true)

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/somaapp/update-party/${partyId}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(partyFormData),
            })

            const result = await response.json()

            if (response.ok) {
                setMessage({ type: 'success', text: 'Party updated successfully!' })
                // Refresh party data
                await fetchParty()
            } else {
                setMessage({ type: 'error', text: result.error || 'Failed to update party' })
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

    // Fetch party data on component mount
    useEffect(() => {
        fetchParty()
    }, [partyId])

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
                                    <span className="ml-2 text-muted-foreground">Loading party data...</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        )
    }

    if (!party && !isLoading) {
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
                                    <p className="text-red-600 mb-4">Party not found</p>
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
                                    <h1 className="text-2xl font-bold">Edit Party</h1>
                                    <p className="text-muted-foreground">Update party information and details</p>
                                </div>
                            </div>

                            <Card className="w-full max-w-4xl mx-auto">
                                <CardHeader>
                                    <CardTitle>Party Information</CardTitle>
                                    <CardDescription>
                                        Edit the party details below. All changes will be saved to the database.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                                        onChange={(e) => handleInputChange('party_name', e.target.value)}
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
                                                        onChange={(e) => handleInputChange('party_leader', e.target.value)}
                                                        placeholder="Enter party leader name"
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="structure">Structure</Label>
                                                    <Select
                                                        value={partyFormData.structure}
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
                                                <Label htmlFor="manifesto">Party Manifesto</Label>
                                                <Textarea
                                                    id="manifesto"
                                                    value={partyFormData.manifesto}
                                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('manifesto', e.target.value)}
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
                                                            onChange={handleLogoUpload}
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
                                                    onChange={(e) => handleInputChange('website', e.target.value)}
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
                                                        onChange={(e) => handleInputChange('facebook', e.target.value)}
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
                                                        onChange={(e) => handleInputChange('twitter', e.target.value)}
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
                                                        onChange={(e) => handleInputChange('instagram', e.target.value)}
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
                                                        onChange={(e) => handleInputChange('youtube', e.target.value)}
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
                                                        onChange={(e) => handleInputChange('linkedin', e.target.value)}
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
                                                        onChange={(e) => handleInputChange('tiktok', e.target.value)}
                                                        placeholder="https://tiktok.com/@yourparty"
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
                                                    'Update Party'
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
