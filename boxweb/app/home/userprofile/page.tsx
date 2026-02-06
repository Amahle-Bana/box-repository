'use client';

import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Settings, Info, MoreHorizontal } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail } from 'lucide-react';
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Carousel, Card } from '@/components/ui/apple-cards-carousel';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Compass, UserCircleIcon, Search, LayoutDashboard } from 'lucide-react';
import { ClockIcon } from '@heroicons/react/24/outline';
import { Dialog7, DialogContent7, DialogHeader7, DialogTitle7, DialogDescription7 } from '@/components/PodcastsPage/dialog7';
import { NotificationsDialog } from "@/components/PodcastsPage/notificationsDialog";
import { SearchQueryDialog } from "@/components/PodcastsPage/searchQueryDialog";
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import useWindowSize from '@/hooks/useWindow';
import { UserSidebar } from '@/components/HomePage/userSidebar';
import PublicationDetailsSheet from '@/components/PodcastsPage/PublicationDetailsSheet';
import { useAppSelector } from "@/redux/hooks";
import { IconBrandFacebook, IconBrandInstagram, IconBrandLinkedin, IconBrandThreads, IconBrandTiktok, IconBrandX, IconBrandYoutube, IconWorld } from '@tabler/icons-react';

const categories = [
    'All',
    'Technology',
    'Business',
    'Science',
    'Health',
    'Arts',
    'Sports',
    'Politics',
    'Education',
    'Entertainment',
    'Food',
    'Travel',
    'Fashion',
    'Finance',
    'Lifestyle',
    'World News',
    'Culture',
    'Innovation',
    'Career'
];

const searchCategories = [
    "All",
    "Polical Parties",
    "Leaders",
]

const notificationCategories = [
    "All"
]


export default function PodcastsPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const categoriesScrollRef = useRef<HTMLDivElement>(null);
    const articlesScrollRefAll1 = useRef<HTMLDivElement>(null);
    const articlesScrollRefAll2 = useRef<HTMLDivElement>(null);
    const articlesScrollRefSubscribe1 = useRef<HTMLDivElement>(null);
    const articlesScrollRefSubscribe2 = useRef<HTMLDivElement>(null);
    const articlesScrollRefMedia1 = useRef<HTMLDivElement>(null);
    const articlesScrollRefMedia2 = useRef<HTMLDivElement>(null);
    const articlesScrollRefSaved1 = useRef<HTMLDivElement>(null);
    const articlesScrollRefSaved2 = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState("all");
    const [mounted, setMounted] = useState(false);
    const { setTheme } = useTheme();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    // Search Query useState()
    const [searchQueryModal, setSearchQueryModal] = useState(false);
    const [activeSearchCategory, setActiveSearchCategory] = useState("All");

    // Notifications useState()
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [activeNotificationCategory, setActiveNotificationCategory] = useState("All");

    // isUserSidebarOpen useState()
    const [isUserSidebarOpen, setIsUserSidebarOpen] = useState(false);

    // Router
    const router = useRouter();

    // Get user data from Redux
    const { isAuthenticated } = useAuth();

    // useWindowSize
    const { width } = useWindowSize();

    const searchCategoriesScrollRef = useRef<HTMLDivElement>(null);
    const notificationCategoriesScrollRef = useRef<HTMLDivElement>(null);

    const currentUser = useAppSelector((state) => state.user);

    useEffect(() => {
        setMounted(true);
    }, []);

    // scroll function
    const scroll = (direction: 'left' | 'right', ref: React.RefObject<HTMLDivElement | null> = scrollContainerRef) => {
        if (ref.current) {
            const scrollAmount = 200;
            const newScrollLeft = ref.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            ref.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const scrollCategories = (direction: 'left' | 'right') => {
        if (categoriesScrollRef.current) {
            const scrollAmount = 200;
            const newScrollLeft = categoriesScrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            categoriesScrollRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const scrollArticles = (direction: 'left' | 'right') => {
        if (articlesScrollRefAll1.current) {
            const scrollAmount = 200;
            const newScrollLeft = articlesScrollRefAll1.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
            articlesScrollRefAll1.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    const handleMouseDown = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
        e.preventDefault();
        setIsScrolling(true);
        if (ref.current) {
            ref.current.style.cursor = 'grabbing';
        }
    };

    const handleMouseMove = (e: React.MouseEvent, ref: React.RefObject<HTMLDivElement | null>) => {
        if (ref.current && isScrolling) {
            const movement = e.movementX * 2;
            ref.current.scrollLeft -= movement;
        }
    };

    const handleMouseUp = () => {
        setIsScrolling(false);
        if (articlesScrollRefAll1.current) {
            articlesScrollRefAll1.current.style.cursor = 'grab';
        }
    };

    const handleMouseLeave = () => {
        setIsScrolling(false);
        if (articlesScrollRefAll1.current) {
            articlesScrollRefAll1.current.style.cursor = 'grab';
        }
    };

    // Theme support
    const { theme } = useTheme();

    return (
        <div className="flex flex-col min-h-screen font-comfortaa">


            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-background">
                <div className="flex items-center justify-between px-6 py-4 bg-background">

                    {/* Left - SOMA (Company Logo) */}
                    {typeof window !== 'undefined' && window.innerWidth > 639 ?
                        <div>
                            <img
                                src={
                                    theme === "dark"
                                        ? "/icons8-light-box-800.png"
                                        : "/icons8-box-800.png"
                                }
                                alt="CampusPoll logo"
                                className="w-10 h-10 object-contain"
                            />
                        </div>
                        :
                        <UserCircleIcon
                            className="h-6 w-6 text-primary cursor-pointer"
                            onClick={() => setIsUserSidebarOpen(true)}
                        />
                    }

                    {/* Middle - Search Bar */}
                    {typeof window !== 'undefined' && window.innerWidth >= 500 ? (
                        <div className="flex-1 max-w-xl mx-2 bg-background">
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search..."
                                    className="pl-10 w-full placeholder:hidden md:placeholder:block"
                                    onClick={() => { typeof window !== 'undefined' && window.innerWidth < 600 ? router.push("/home/search") : setSearchQueryModal(true) }}
                                />
                            </div>
                        </div>
                    ) : (
                        <Link href="/home/search" className="ml-auto mr-2">
                            <Search className="h-4 w-4 text-primary" />
                        </Link>
                    )}


                    {/* Right - Buttons */}
                    <div className="flex items-center gap-2">



                        {/* Bell Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-200 rounded-sm cursor-pointer"
                            onClick={() => typeof window !== 'undefined' && window.innerWidth >= 768 ? setNotificationsModal(true) : router.push("/home/notifications")}
                        >
                            <Bell className="h-6 w-6" />
                        </Button>

                        {/* Theme Toggle */}
                        {mounted && (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="icon" className="cursor-pointer">
                                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 cursor-pointer" />
                                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 cursor-pointer" />
                                        <span className="sr-only">Toggle theme</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-background">
                                    <DropdownMenuItem onClick={() => setTheme("light")}>
                                        Light
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                                        Dark
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => setTheme("system")}>
                                        System
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
            </header>

            {/* Categories Bar */}





            {/* Main Content */}
            <main className="flex-1 p-6 mt-[8rem] bg-background">

                <>
                    {/* Left Section - 20% */}
                    <section className=" hidden xl:block w-[18%] bg-background p-4 fixed h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">


                    </section>

                    {/* Middle Section - 50% */}
                    <section className="rounded-lg m-2 w-full xl:w-[50%] xl:ml-[20%] bg-background p-2 sm:p-6 md:p-8 xl:p-10 overflow-y-auto">
                        {/* Profile Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex flex-col w-full h-full">
                                <div className="flex flex-row align-center justify-between">
                                    <div className="flex flex-col">
                                        <h1 className="text-3xl font-bold">{currentUser.fullName}</h1>
                                        <p className="text-gray-500 text-md">@{currentUser.username}</p>
                                    </div>

                                    <div className="relative">
                                        <div className="relative w-24 h-24 rounded-full overflow-hidden border border-blue-500">

                                            {currentUser.profilePicture === null ?
                                                <div className="flex flex-row bg-blue-50 dark:bg-blue-900/20 text-blue-500 items-center justify-center text-5xl font-bold h-[100%] w-full">{currentUser.username.charAt(0).toUpperCase()}</div>
                                                :
                                                <Image
                                                    src={currentUser.profilePicture}
                                                    alt={`${currentUser.fullName}'s Profile picture`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            }
                                        </div>
                                        {/* <Button onClick={() => setProfilePictureModal(true)} className="absolute -top-1 -right-0 bg-secondary rounded-full shadow-md hover:bg-secondary cursor-pointer">
                                            <Plus className="h-4 w-4 text-white" />
                                        </Button> */}
                                    </div>
                                </div>

                                {/* Bio Section */}
                                <div className="flex w-full h-full pr-2 py-2">
                                    <p className="text-gray-500 text-sm">{`${currentUser.bio ?? ' '}`}</p>
                                </div>



                                {/* Social Media Links */}
                                <div className="flex flex-row align-center justify-start w-full h-full pr-2 gap-2">
                                    {currentUser.userFacebook && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-blue-50"
                                            onClick={() => currentUser.userFacebook && window.open(currentUser.userFacebook, '_blank')}
                                        >
                                            <IconBrandFacebook className="h-4 w-4 text-blue-600" />
                                        </Button>
                                    )}
                                    {currentUser.userInstagram && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-pink-50"
                                            onClick={() => currentUser.userInstagram && window.open(`https://instagram.com/${currentUser.userInstagram}`, '_blank')}
                                        >
                                            <IconBrandInstagram className="h-4 w-4 text-pink-600" />
                                        </Button>
                                    )}
                                    {currentUser.userXTwitter && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-black/5"
                                            onClick={() => currentUser.userXTwitter && window.open(`https://x.com/${currentUser.userXTwitter}`, '_blank')}
                                        >
                                            <IconBrandX className="h-4 w-4 text-black" />
                                        </Button>
                                    )}
                                    {currentUser.userThreads && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-black/5"
                                            onClick={() => currentUser.userThreads && window.open(`https://threads.net/@${currentUser.userThreads}`, '_blank')}
                                        >
                                            <IconBrandThreads className="h-4 w-4 text-black" />
                                        </Button>
                                    )}
                                    {currentUser.userYouTube && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-red-50"
                                            onClick={() => currentUser.userYouTube && window.open(currentUser.userYouTube, '_blank')}
                                        >
                                            <IconBrandYoutube className="h-4 w-4 text-red-600" />
                                        </Button>
                                    )}
                                    {currentUser.userLinkedIn && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-blue-50"
                                            onClick={() => currentUser.userLinkedIn && window.open(currentUser.userLinkedIn, '_blank')}
                                        >
                                            <IconBrandLinkedin className="h-4 w-4 text-blue-700" />
                                        </Button>
                                    )}
                                    {currentUser.userTikTok && (
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="h-8 w-8 hover:bg-black/5"
                                            onClick={() => currentUser.userTikTok && window.open(`https://tiktok.com/@${currentUser.userTikTok}`, '_blank')}
                                        >
                                            <IconBrandTiktok className="h-4 w-4 text-black" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 mb-6">
                            <Button
                                onClick={() => router.push("/home/add")}
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/90 cursor-pointer">
                                <Plus className="w-4 h-4" />
                                New Post
                            </Button>
                            <Link href="/home/userprofile/edit-profile">
                                <Button variant="outline" className="cursor-pointer">
                                    Edit Profile
                                </Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="cursor-pointer">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Share Profile</DropdownMenuItem>
                                    <DropdownMenuItem>Report</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        {/* Tabs Section */}
                        <Tabs defaultValue="activity" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="activity" className="data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground data-[state=active]:bg-primary dark:data-[state=active]:bg-primary">Activity</TabsTrigger>
                                <TabsTrigger value="events" className="data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground data-[state=active]:bg-primary dark:data-[state=active]:bg-primary">Events</TabsTrigger>

                            </TabsList>
                            <TabsContent value="activity" className="mt-4">
                                <div className="space-y-4">
                                    <p>Recent activity will be displayed here</p>
                                </div>
                            </TabsContent>
                            <TabsContent value="events" className="mt-4">
                                <div className="space-y-4">
                                    <p>User events will be displayed here</p>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </section>


                    {/* Right Section - 30% */}
                    <section className="hidden xl:block w-[26%] bg-background p-4 fixed right-4 h-[calc(100vh-8rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">


                    </section>
                </>


                {/* Modals and Sidebar */}
                <SearchQueryDialog
                    searchQueryModal={searchQueryModal}
                    setSearchQueryModal={setSearchQueryModal}
                    searchCategories={searchCategories}
                    activeSearchCategory={activeSearchCategory}
                    setActiveSearchCategory={setActiveSearchCategory}
                />

                <NotificationsDialog
                    notificationsModal={notificationsModal}
                    setNotificationsModal={setNotificationsModal}
                    notificationCategories={notificationCategories}
                    activeNotificationCategory={activeNotificationCategory}
                    setActiveNotificationCategory={setActiveNotificationCategory}
                />

                <UserSidebar
                    isOpen={isUserSidebarOpen}
                    onClose={() => setIsUserSidebarOpen(false)}
                />
            </main>
        </div>
    )
}