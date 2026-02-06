"use client"

import { Copy, ChevronUp, FileStack, UserRoundPlus, Undo2, Redo2, Bold, Italic, Strikethrough, Underline, Link, Mic, Video, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Code, ChevronDown, Type, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Quote, Bell, Share2, Share, MessageSquare, Send, FileText, UserPlus, Link2, Code2, BarChart3, BookOpen, Minus, BarChart2, FunctionSquare, FileTextIcon, Info, Settings, Smartphone, Monitor, Mail, Eye, Highlighter, Minimize2, Maximize2, ArrowLeft, PanelLeft, Tablet, Subscript, Superscript, SquareChartGantt, Check, ClockIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import { useState, useRef } from 'react';
import { useEditor, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Link as LinkExtension } from '@tiptap/extension-link'
import { Image as ImageExtension } from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { Underline as UnderlineExtension } from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import RichTextEditor from '@/components/PostPage/LargeRichTextEditor';
import { useScreenSize } from '@/hooks/useScreenSize';
import MobileRichTextEditor from '@/components/PostPage/MobileRichTextEditor';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import MinimizeMaximizeButton from '@/components/PostPage/minimize-maximize-button';
import ArticleHeading from '@/components/PostPage/articleHeading';
import ArticleDescription from '@/components/PostPage/articleDescription';
import ArticleCategory from '@/components/PostPage/articleCategory';
import ArticleSubcategory from '@/components/PostPage/articleSubcategory';
import ArticleImage from '@/components/PostPage/articleImage';
import ArticleAudio from '@/components/PostPage/articleAudio';
import CharacterCount from '@tiptap/extension-character-count';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MediumRichTextEditor from '@/components/PostPage/MediumRichTextEditor';

// Post Page
export default function PostPage() {

    // State Variables
    const screenSize = useScreenSize();
    const [styleOpen, setStyleOpen] = useState(false);
    const [buttonsOpen, setButtonsOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [heading, setHeading] = useState("");
    const [description, setDescription] = useState("");
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [subcategorySearch, setSubcategorySearch] = useState("");
    const [subcategoryInputFocused, setSubcategoryInputFocused] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categorySearch, setCategorySearch] = useState("");
    const [allCategories, setAllCategories] = useState([
        "Family", "Health", "Relationships", "Sexuality", "Home", "Food", "Pets", "Mental Health", "Productivity", "Mindfulness", "Business", "Marketing", "Leadership", "Work", "Artificial Intelligence",
        "Blockchain", "Data Science", "Gadgets", "Makers", "Security", "Technology", "Design", "Project Management", "Programming", "Dev Ops", "Operating Systems", "Writing", "Art", "Gaming", "Humor",
        "Movies", "Music", "News", "Photography", "Podcasts", "Television", "Economics", "Education", "Equality", "Finance", "Law", "Transportation", "Politics", "Race", "Science", "Mathematics", "Drugs",
        "Philosophy", "Religion", "Spirituality", "Cultural Studies", "Fashion", "Beauty", "Language", "Sports", "Cities", "Nature", "Travel"
    ]);
    const [categoryInputFocused, setCategoryInputFocused] = useState(false);
    const categoryInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isHeadingCopied, setIsHeadingCopied] = useState(false);
    const [isDescriptionCopied, setIsDescriptionCopied] = useState(false);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioPreview, setAudioPreview] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioInputRef = useRef<HTMLInputElement | null>(null);


    // Sample mapping of categories to subcategories (customize as needed)
    const categoryToSubcategories: Record<string, string[]> = {
        "Family": ["Adoption", "Children", "Elder Care", "Fatherhood", "Motherhood", "Parenting", "Pregnancy", "Seniors"],
        "Health": ["Aging", "Coronavirus", "Covid-19", "Death And Dying", "Disease", "Fitness", "Healthcare", "Mental Health", "Nutrition", "Sleep", "Trans Healthcare", "Vaccines", "Weight Loss", "Womens Health"],
        "Relationships": ["Dating", "Divorce", "Friendship", "Love", "Marriage", "Polymary"],
        "Sexuality": ["BDSM", "Erotica", "Kink", "Sex", "Sexual Health"],
        "Home": ["Architecture", "Home Improvement", "Homeownership", "Interior Design", "Rental Property", "Vacation Rental"],
        "Food": ["Cooking", "Desserts", "Drinks", "Gluten-Free", "Healthy", "Meat", "Pasta", "Pizza", "Salad", "Sandwiches", "Seafood", "Sides", "Soups", "Vegan", "Vegetarian"],
        "Pets": ["Cats", "Dogs", "Fish", "Horses", "Other Pets", "Reptiles", "Small Pets", "Wildlife"],
        "Mental Health": ["Anxiety", "Couseling", "Grief", "Life Lessons", "Self-Awareness", "Bipolar", "Depression", "Eating Disorders", "Grief", "LGBTQ+", "Mental Health", "PTSD", "Self-Help", "Stress", "Suicide", "Trauma"],
        "Productivity": ["Career Advice", "Coaching", "Goal Setting", "Morning Routines", "Pomodoro Technique", "Time Management", "To-Do Lists", "Workflow", "Time Management", "Work Life Balance"],
        "Mindfulness": ["Mediation", "Journaling", "Mediation", "Transcendental Mediation", "Yoga"],
        "Business": ["Business", "Freelancing", "Small Business", "Startups", "Venture Capital"],
        "Marketing": ["Advertising", "Branding", "Content Marketing", "Content Strategy", "Digital Marketing", "SEO", "Social Media", "Storytelling For Business"],
        "Leadership": ["Employee Engagement", "Leadership Development", "Management", "Meetings", "Org Charts", "Thought Leadership"],
        "Work": ["Company Retreats", "Digital Nomads", "Distributed Teams", "Future Of Work", "Work From Home", "Remote Work"],
        "Artificial Intelligence": ["ChatGPT", "Conversational AI", "Deep Learning", "Large Language Models", "Machine Learning", "NLP", "Voice Assistants"],
        "Blockchain": ["Bitcoin", "Decentralized Finance", "Cryptocurrency", "Ethereum", "NFTs", "Smart Contracts", "Web3"],
        "Data Science": ["Data Analysis", "Data Visualization", "Data Engineering", "Data Mining", "Data Modeling", "Database Design", "Tools", "Libraries", "Frameworks", "Projects", "Tutorials", "SQL"],
        "Gadgets": ["eBook", "Internet Of Things", "Tablets", "Smart Home", "Smartphones", "Wearables", "Laptops", "Computers", "VR Glasses", "AR Glasses", "TVs"],
        "Makers": ["3D Printing", "Arduino", "DIY", "Raspberry Pi", "Robotics"],
        "Security": ["Cybersecurity", "Data Security", "Encryption", "Infosec", "Passwords", "Privacy"],
        "Technology": ["Amazon", "Apple", "Google", "Mastodon", "Medium", "Meta", "Microsoft", "Tiktok", "Twitter"],
        "Design": ["Accessibility", "Designs Systems", "Design Thinking", "Graphic Design", "Icon Design", "Inclusive Design", "Product Design", "Typography", "UX Design", "UI Design"],
        "Project Management": ["Agile", "Kanban", "Scrum", "Waterfall", "Innovation", "Kanban", "Lean Startup", "MVP", "Product", "Strategy", "Project Planning", "Project Execution", "Project Monitoring", "Project Evaluation", "Project Closure"],
        "Programming": ["Android Development", "Coding", "Flutter", "Frontend Engineering", "iOS Development", "Mobile Development", "Software Engineering", "Web Development", "Angular", "CSS", "HTML", "JavaScript", "Python", "React", "React Native", "Ruby", "Rust", "Swift", "TypeScript", "Vue", "Webpack", "WordPress", "Xamarin", "Yarn", "Zapier"],
        "Dev Ops": ["AWS", "Databricks", "Docker", "Kubernetes", "Terraform"],
        "Operating Systems": ["Android", "iOS", "Linux", "MacOS", "Windows"],
        "Writing": ["30 Day Challenge", "Book Reviews", "Books", "Creative Nonfiction", "Diary", "Fiction", "Haiku", "Hello World", "Memior", "Nonfiction", "Personal Essay", "Poetry", "Screenwriting", "Short Stories", "This Happened", "Writing Prompts", "Writing Tips"],
        "Art": ["Comics", "Contemporary Art", "Drawing", "Fine Art", "Graphic Design", "Illustration", "Painting", "Photography", "Sculpture", "Typography", "Generative Art", "Illustration", "Painting", "Portraits", "Street Art"],
        "Game Design": ["Game Design", "Game Development", "Indie Game", "Metaverse", "Nintendo", "Playstation", "Videogames", "Virtual Reality", "Xbox"],
        "Philosophy": ["Atheism", "Epistemology", "Ethics", "Existentialism", "Feminism", "Freud", "Gandhi", "Hegel", "Hume", "Kant", "Marx", "Nietzsche", "Plato", "Postmodernism", "Psychoanalysis", "Religion", "Socrates", "Stoicism", "Wittgenstein"],
        "Religion": ["Buddhism", "Christianity", "Hinduism", "Islam", "Judaism", "Latter-Day Saints", "Mormonism", "Orthodox Christianity", "Protestantism", "Sikhism", "Spirituality", "Zoroastrianism"],
        "Spirituality": ["Astrology", "Energy Healing", "Horoscopes", "Mysticism", "New Age", "Occult", "Parapsychology", "Psychology", "Reiki", "Tarot", "Voodoo"],
        "Cultural Studies": ["Ancient History", "Anthropology", "Cultural Heritage", "Digital Life", "History", "Museums", "Sociology", "Tradition"],
        "Fashion": ["Accessories", "Clothing", "Design", "Jewelry", "Shoes", "Style", "Trends", "Luxury Fashion"],
        "Language": ["Chinese", "English", "French", "German", "Italian", "Japanese", "Korean", "Portuguese", "Russian", "Spanish", "Turkish", "Vietnamese", "Arabic", "Hebrew", "Hindi", "Indonesian", "Malay", "Thai", "Turkish", "Urdu", "Dutch", "Polish", "Portuguese", "Romanian", "Serbian", "Slovak", "Slovenian", "Swedish", "Thai", "Turkish", "Ukrainian", "Vietnamese", "Arabic", "Hebrew", "Hindi", "Indonesian", "Malay", "Thai", "Turkish", "Urdu", "Dutch", "Polish", "Portuguese", "Romanian", "Serbian", "Slovak", "Slovenian", "Swedish", "Thai", "Turkish", "Ukrainian", "Vietnamese", "Arabic", "Hebrew", "Hindi", "Indonesian", "Malay", "Thai", "Turkish", "Urdu", "Dutch"],
        "Sports": ["Football(soccer)", "Gridiron Football", "Hockey", "Rugby", "Tennis", "Basketball", "Baseball", "Cricket", "Golf", "Soccer", "Volleyball", "Water Polo", "Wrestling", "Boxing", "MMA", "Mixed Martial Arts", "Wrestling", "Boxing", "MMA"],
        "Cities": ["Amsterdam", "Athens", "Berlin", "Buenos Aires", "Cairo", "Cape Town", "Dubai", "Edinburgh", "Florence", "Geneva", "Hong Kong", "Istanbul", "Jerusalem", "Kuala Lumpur", "Lisbon", "London", "Los Angeles", "Madrid", "Melbourne", "Mexico City", "Milan", "Montreal", "Moscow", "Munich", "New York", "Oslo", "Paris", "Prague", "Rome", "San Francisco", "Sao Paulo", "Seoul", "Shanghai", "Singapore", "Stockholm", "Sydney", "Tokyo", "Toronto", "Vienna", "Warsaw", "Wellington", "Zurich"],
        "Beauty": ["Beauty", "Tips", "Products", "News", "Reviews", "Tutorials", "How-To", "Tips", "Products", "Trends", "News", "Reviews", "Tutorials", "How-To"],
        "Nature": ["Birding", "Camping", "Climate Change", "Conservation", "Ecology", "Environment", "Extinction", "Global Warming", "Green Living", "Pollution", "Recycling", "Sustainability", "Wildlife", "Hiking"],
        "Travel": ["Tourism", "Travel Tips", "Travel Writing", "Vacation", "Vanlife"]
    };

    // Compute available subcategories based on selected categories
    const availableSubcategories = selectedCategories
        .flatMap((cat) => categoryToSubcategories[cat] || [])
        .filter((sub, idx, arr) => arr.indexOf(sub) === idx); // unique

    const filteredSubcategories = availableSubcategories.filter(
        (sub) =>
            sub.toLowerCase().includes(subcategorySearch.toLowerCase()) &&
            !selectedSubcategories.includes(sub)
    );

    // Filtered Categories
    const filteredCategories = allCategories.filter(
        (cat) =>
            cat.toLowerCase().includes(categorySearch.toLowerCase()) &&
            !selectedCategories.includes(cat)
    );


    // Post Page
    return (
        // Main Container
        <div className="flex h-screen  overflow-y-auto">
            {screenSize.isSmall ? (
                <MobileRichTextEditor />
            ) : screenSize.isMedium ? (
                <MediumRichTextEditor />
            ) : (
                <RichTextEditor />
            )}
        </div>
    );
}

