"use client"

// Imports
import React, { useCallback, useEffect, useState } from 'react';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import { Plus, Book, Redo2, Undo2, Bold, Italic, Strikethrough, Underline, Linkedin, Highlighter, Link as LinkIcon, Image as ImageIcon, Mic, Video, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Bell, Share2, Share, MessageSquare, Send, FileText, UserPlus, Link2, Code2, BarChart3, BookOpen, Minus, FileTextIcon, BarChart2, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Quote, Type, Subscript, Superscript, Table2, Youtube, Twitter, Instagram, Play, Pause, Facebook, Info, FileStack, Settings, UserRoundPlus, Eye, ChevronLeft, Archive, MoreVertical, House, Inbox } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { Underline as UnderlineEditor } from '@tiptap/extension-underline'
import { Code as CodeEditor } from '@tiptap/extension-code'
import { Blockquote as BlockquoteEditor } from '@tiptap/extension-blockquote'
import { OrderedList } from '@tiptap/extension-ordered-list'
import { BulletList } from '@tiptap/extension-bullet-list'
import { Subscript as SubscriptEditor } from '@tiptap/extension-subscript'
import { Superscript as SuperscriptEditor } from '@tiptap/extension-superscript'
import { Link as LinkEditor } from '@tiptap/extension-link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Image as ImageExtension } from '@tiptap/extension-image';
import { CodeBlock } from '@tiptap/extension-code-block';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
import Document from '@tiptap/extension-document'
import Gapcursor from '@tiptap/extension-gapcursor'
import Paragraph from '@tiptap/extension-paragraph'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { BubbleMenu } from '@tiptap/react'
import Text from '@tiptap/extension-text'
import ImageDialog from './imageDialog';
import AudioDialog from './audioDialog';
import LinkDialog from './linkDialog';
import VideoDialog from './videoDialog';
import { RawCommands } from '@tiptap/core';
import { Youtube as YoutubeExtension } from '@tiptap/extension-youtube';
import { NodeViewProps, NodeViewWrapper } from '@tiptap/react';
import { nodePasteRule, ReactNodeViewRenderer } from '@tiptap/react'
import { mergeAttributes, Node } from '@tiptap/core'
import { Tweet } from 'react-tweet'
import TweetComponent from './tweetEmbed';
import FacebookComponent from './facebookEmbed';
import InstagramComponent from './instagramEmbed';
import css from 'highlight.js/lib/languages/css'
import js from 'highlight.js/lib/languages/javascript'
import ts from 'highlight.js/lib/languages/typescript'
import html from 'highlight.js/lib/languages/xml'
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight';
// eslint-disable-next-line
import CodeBlockComponent from './CodeBlockComponent';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import SubscribeButtonComponent from './subscribeButton';
import SharePostButtonComponent from './sharePostButton';
import SharePublicationButtonComponent from './sharePublicationButton';
import CommentButtonComponent from './CommentButton';
import SendMessageButtonComponent from './sendMessageButton';
import ReferWriterButtonComponent from './referWriterButton';
import LinkToSurveyButtonComponent from './linkToSurveyButton';
import FormButtonComponent from './surveyForm';
import CharacterCount from '@tiptap/extension-character-count';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import Placeholder from '@tiptap/extension-placeholder';
import SettingsModal from './settingsModal';
import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import { AnimatePresence, MotionValue, motion, useMotionValue, useSpring, useTransform, } from "motion/react";
import { useRef } from "react";
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import ArticleHeadingDialog from './articleHeadingDialog';
import MinimizeMaximizeButton from '@/components/PostPage/minimize-maximize-button';
import ArticleHeading from '@/components/PostPage/articleHeading';
import ArticleDescription from '@/components/PostPage/articleDescription';
import ArticleCategory from '@/components/PostPage/articleCategory';
import ArticleSubcategory from '@/components/PostPage/articleSubcategory';
import ArticleImage from '@/components/PostPage/articleImage';
import ArticleAudio from '@/components/PostPage/articleAudio';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PanelLeft, SquareChartGantt, Smartphone, Tablet, Monitor, Mail } from 'lucide-react';





// create a lowlight instance
const lowlight = createLowlight(all)

// Highlight Colors For Highlighting Text
const highlightColors = [
    { name: 'None', value: 'none' },
    { name: 'Yellow', value: '#fef08a' },
    { name: 'Green', value: '#86efac' },
    { name: 'Blue', value: '#93c5fd' },
    { name: 'Pink', value: '#fda4af' },
    { name: 'Purple', value: '#d8b4fe' },
    { name: 'Orange', value: '#fdba74' },
];

// you can also register individual languages
lowlight.register('html', html)
lowlight.register('css', css)
lowlight.register('js', js)
lowlight.register('ts', ts)











// Shared configuration for our preview editors
const previewEditorOptions = {
    editable: false,
    extensions: [
        StarterKit.configure({
            heading: {
                levels: [1, 2, 3, 4, 5, 6],
            },
            bulletList: {
                HTMLAttributes: {
                    class: 'list-disc ml-2',
                },
            },
            orderedList: {
                HTMLAttributes: {
                    class: 'list-decimal ml-2',
                },
            },
            blockquote: {
                HTMLAttributes: {
                    class: 'blockquote border-l-4 border-secondary pl-4 py-2 my-4 bg-secondary/10 dark:bg-secondary/50 ',
                },
            },
            horizontalRule: {
                HTMLAttributes: {
                    class: 'border-t border-gray-300 my-4',
                },
            },
        }),
        Placeholder.configure({
            placeholder: 'Start Writing Here...',
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        UnderlineEditor.configure({
            HTMLAttributes: {
                class: 'underline',
            },
        }),
        Table.configure({
            resizable: true,
        }),
        TableRow,
        TableHeader,
        TableCell,
        TextStyle,
        FontFamily,
        Highlight.configure({
            multicolor: true,
            HTMLAttributes: {
                class: 'highlight',
            },
        }),
        SubscriptEditor.configure({
            HTMLAttributes: {
                class: 'subscript',
            },
        }),
        SuperscriptEditor.configure({
            HTMLAttributes: {
                class: 'superscript',
            },
        }),
        ImageExtension.configure({
            HTMLAttributes: {
                class: 'max-w-full rounded-lg shadow-md',
            },
            allowBase64: true,
            inline: false,
        }),
        YoutubeExtension.configure({
            controls: true,
            nocookie: true,
            allowFullscreen: true,
            ccLanguage: 'en',
            origin: 'https://www.youtube.com',
            HTMLAttributes: {
                class: 'my-4 rounded-lg shadow-md w-full h-60',
            },
        }),
        CharacterCount.configure({
            limit: 100000,
        }),
        Node.create({
            name: 'audio',
            group: 'block',
            atom: true,
            addAttributes() {
                return {
                    src: {
                        default: null,
                    },
                    title: {
                        default: null,
                    },
                }
            },
            parseHTML() {
                return [
                    {
                        tag: 'audio[src]',
                    },
                ]
            },
            renderHTML({ HTMLAttributes }) {
                return ['div', { class: 'audio-container' }, ['audio', { controls: true, ...HTMLAttributes }]]
            },
            addCommands() {
                return {
                    setAudio: (options: any) => ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        })
                    },
                } as Partial<RawCommands>
            },
        }),
        LinkEditor.configure({
            openOnClick: true,
            autolink: true,
            defaultProtocol: 'https',
            protocols: ['http', 'https'],
            HTMLAttributes: {
                class: 'text-blue-600 underline hover:text-blue-800',
                target: '_blank',
                rel: 'noopener noreferrer',
            },
            isAllowedUri: (url, ctx) => {
                try {
                    const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)
                    if (!ctx.defaultValidate(parsedUrl.href)) {
                        return false
                    }
                    const disallowedProtocols = ['ftp', 'file', 'mailto']
                    const protocol = parsedUrl.protocol.replace(':', '')
                    if (disallowedProtocols.includes(protocol)) {
                        return false
                    }
                    const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))
                    if (!allowedProtocols.includes(protocol)) {
                        return false
                    }
                    const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
                    const domain = parsedUrl.hostname
                    if (disallowedDomains.includes(domain)) {
                        return false
                    }
                    return true
                } catch {
                    return false
                }
            },
            shouldAutoLink: url => {
                try {
                    const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)
                    const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
                    const domain = parsedUrl.hostname
                    return !disallowedDomains.includes(domain)
                } catch {
                    return false
                }
            },
        }),
        Node.create({
            name: 'video',
            group: 'block',
            atom: true,
            addAttributes() {
                return {
                    src: {
                        default: null,
                    },
                    title: {
                        default: null,
                    },
                }
            },
            parseHTML() {
                return [
                    {
                        tag: 'video[src]',
                    },
                ]
            },
            renderHTML({ HTMLAttributes }) {
                return ['div', { class: 'video-container' }, ['video', { controls: true, ...HTMLAttributes }]]
            },
            addCommands() {
                return {
                    setVideo: (options: any) => ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options,
                        })
                    },
                } as Partial<RawCommands>
            },
        }),
        Node.create({
            name: 'twitter',
            group: 'block',
            atom: true,
            draggable: true,

            addPasteRules() {
                const twitterUrl = /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/g

                return [
                    nodePasteRule({
                        find: twitterUrl,
                        type: this.type,
                        getAttributes: (match) => {
                            console.log('Paste match:', match);
                            return { url: match[0] }
                        }
                    })
                ]
            },

            addAttributes() {
                return {
                    url: {
                        default: null
                    }
                }
            },

            parseHTML() {
                return [
                    {
                        tag: 'twitter'
                    }
                ]
            },

            renderHTML({ HTMLAttributes }) {
                return ['twitter', mergeAttributes(HTMLAttributes, { class: "w-full" })]
            },

            addCommands() {
                return {
                    insertTwitter: (options: { url: string }) => ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options
                        })
                    }
                } as Partial<RawCommands>
            },

            addNodeView() {
                return ReactNodeViewRenderer(TweetComponent)
            }
        }),
        Node.create({
            name: 'facebook',
            group: 'block',
            atom: true,
            draggable: true,

            addPasteRules() {
                const facebookUrl = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.com)\/[^/]+\/posts\/\d+/g

                return [
                    nodePasteRule({
                        find: facebookUrl,
                        type: this.type,
                        getAttributes: (match) => {
                            return { url: match[0] }
                        }
                    })
                ]
            },

            addAttributes() {
                return {
                    url: {
                        default: null
                    }
                }
            },

            parseHTML() {
                return [
                    {
                        tag: 'facebook'
                    }
                ]
            },

            renderHTML({ HTMLAttributes }) {
                return ['facebook', mergeAttributes(HTMLAttributes)]
            },

            addCommands() {
                return {
                    insertFacebook: (options: { url: string }) => ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options
                        })
                    }
                } as Partial<RawCommands>
            },

            addNodeView() {
                return ReactNodeViewRenderer(FacebookComponent)
            }
        }),
        Node.create({
            name: 'instagram',
            group: 'block',
            atom: true,
            draggable: true,

            addPasteRules() {
                const instagramUrl = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/[^/]+\/?/g

                return [
                    nodePasteRule({
                        find: instagramUrl,
                        type: this.type,
                        getAttributes: (match) => {
                            return { url: match[0] }
                        }
                    })
                ]
            },

            addAttributes() {
                return {
                    url: {
                        default: null
                    }
                }
            },

            parseHTML() {
                return [
                    {
                        tag: 'instagram'
                    }
                ]
            },

            renderHTML({ HTMLAttributes }) {
                return ['instagram', mergeAttributes(HTMLAttributes)]
            },

            addCommands() {
                return {
                    insertInstagram: (options: { url: string }) => ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                            attrs: options
                        })
                    }
                } as Partial<RawCommands>
            },

            addNodeView() {
                return ReactNodeViewRenderer(InstagramComponent)
            }
        }),
        CodeBlockLowlight
            .extend({
                addNodeView() {
                    return ReactNodeViewRenderer(CodeBlockComponent as any)
                },
            })
            .configure({ lowlight }),
        Node.create({
            name: 'subscribe',
            group: 'block',
            atom: true,
            draggable: false,
            parseHTML() {
                return [
                    {
                        tag: 'subscribe',
                    },
                ];
            },
            renderHTML({ HTMLAttributes }) {
                return ['subscribe', mergeAttributes(HTMLAttributes), ['br']];
            },
            addCommands() {
                return {
                    insertSubscribe: () => ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                        });
                    },
                } as Partial<RawCommands>;
            },
            addNodeView() {
                return ReactNodeViewRenderer(SubscribeButtonComponent);
            },
        }),
        Node.create({
            name: 'share-post',
            group: 'block',
            atom: true,
            draggable: false,
            parseHTML() {
                return [
                    {
                        tag: 'share-post',
                    },
                ];
            },
            renderHTML({ HTMLAttributes }) {
                return ['share-post', mergeAttributes(HTMLAttributes), ['br']];
            },
            addCommands() {
                return {
                    insertSharePost: () => ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                        });
                    },
                } as Partial<RawCommands>;
            },
            addNodeView() {
                return ReactNodeViewRenderer(SharePostButtonComponent);
            },
        }),
        Node.create({
            name: 'share-publication',
            group: 'block',
            atom: true,
            draggable: false,
            parseHTML() {
                return [
                    {
                        tag: 'share-publication',
                    },
                ];
            },
            renderHTML({ HTMLAttributes }) {
                return ['share-publication', mergeAttributes(HTMLAttributes), ['br']];
            },
            addCommands() {
                return {
                    insertSharePublication: () => ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                        });
                    },
                } as Partial<RawCommands>;
            },
            addNodeView() {
                return ReactNodeViewRenderer(SharePublicationButtonComponent);
            },
        }),
        Node.create({
            name: 'comment',
            group: 'block',
            atom: true,
            draggable: false,
            parseHTML() {
                return [
                    {
                        tag: 'comment',
                    },
                ];
            },
            renderHTML({ HTMLAttributes }) {
                return ['comment', mergeAttributes(HTMLAttributes), ['br']];
            },
            addCommands() {
                return {
                    insertComment: () => ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                        });
                    },
                } as Partial<RawCommands>;
            },
            addNodeView() {
                return ReactNodeViewRenderer(CommentButtonComponent);
            },
        }),
        Node.create({
            name: 'send-message',
            group: 'block',
            atom: true,
            draggable: false,
            parseHTML() {
                return [
                    {
                        tag: 'send-message',
                    },
                ];
            },
            renderHTML({ HTMLAttributes }) {
                return ['send-message', mergeAttributes(HTMLAttributes), ['br']];
            },
            addCommands() {
                return {
                    insertSendMessage: () => ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                        });
                    },
                } as Partial<RawCommands>;
            },
            addNodeView() {
                return ReactNodeViewRenderer(SendMessageButtonComponent);
            },
        }),
        Node.create({
            name: 'form',
            group: 'block',
            atom: true,
            draggable: false,
            parseHTML() {
                return [
                    {
                        tag: 'form',
                    },
                ];
            },
            renderHTML({ HTMLAttributes }) {
                return ['form', mergeAttributes(HTMLAttributes), ['br']];
            },
            addCommands() {
                return {
                    insertForm: () => ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                        });
                    },
                } as Partial<RawCommands>;
            },
            addNodeView() {
                return ReactNodeViewRenderer(FormButtonComponent);
            },
        }),
        Node.create({
            name: 'refer-writer',
            group: 'block',
            atom: true,
            draggable: false,
            parseHTML() {
                return [
                    {
                        tag: 'refer-writer',
                    },
                ];
            },
            renderHTML({ HTMLAttributes }) {
                return ['refer-writer', mergeAttributes(HTMLAttributes), ['br']];
            },
            addCommands() {
                return {
                    insertReferWriter: () => ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                        });
                    },
                } as Partial<RawCommands>;
            },
            addNodeView() {
                return ReactNodeViewRenderer(ReferWriterButtonComponent);
            },
        }),
        Node.create({
            name: 'link-to-survey',
            group: 'block',
            atom: true,
            draggable: false,
            parseHTML() {
                return [
                    {
                        tag: 'link-to-survey',
                    },
                ];
            },
            renderHTML({ HTMLAttributes }) {
                return ['link-to-survey', mergeAttributes(HTMLAttributes), ['br']];
            },
            addCommands() {
                return {
                    insertLinkToSurvey: () => ({ commands }: { commands: any }) => {
                        return commands.insertContent({
                            type: this.name,
                        });
                    },
                } as Partial<RawCommands>;
            },
            addNodeView() {
                return ReactNodeViewRenderer(LinkToSurveyButtonComponent);
            },
        }),
    ],
    editorProps: {
        attributes: {
            class: "text-xs font-playfair-display p-2 [&_p]:mb-2 [&_audio]:w-full [&_audio]:h-[30px] [&_audio]:mb-2 [&_img]:mb-2 [&_img]:h-40 [&_img]:mx-auto [&_img]:block [&_video]:rounded-lg  [&_video]:mb-2 [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-md [&_h3]:font-bold [&_h4]:text-sm [&_h4]:font-bold [&_h5]:text-xs [&_h5]:font-bold [&_h6]:text-xs [&_h6]:font-bold [&_twitter]:w-full"
        },
    },
};





// Rich Text Editor
const RichTextEditor = ({ editor }: { editor: Editor | null }) => {
    const [styleOpen, setStyleOpen] = useState(false);
    const [buttonsOpen, setButtonsOpen] = useState(false);
    const [fontsOpen, setFontsOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [embedsOpen, setEmbedsOpen] = useState(false);
    const [highlightOpen, setHighlightOpen] = useState(false);
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [audioDialogOpen, setAudioDialogOpen] = useState(false);
    const [videoDialogOpen, setVideoDialogOpen] = useState(false);
    const [youtubeDialogOpen, setYoutubeDialogOpen] = useState(false);
    const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [isEditable, setIsEditable] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [height, setHeight] = useState(480);
    const [width, setWidth] = useState(640);

    // State for Article Input Section (mirroring page.tsx)
    const [isMinimized, setIsMinimized] = useState(false);
    const [heading, setHeading] = useState("");
    const [isHeadingCopied, setIsHeadingCopied] = useState(false);
    const [description, setDescription] = useState("");
    const [isDescriptionCopied, setIsDescriptionCopied] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categorySearch, setCategorySearch] = useState("");
    const [allCategories, setAllCategories] = useState([
        "Family", "Health", "Relationships", "Sexuality", "Home", "Food", "Pets", "Mental Health", "Productivity", "Mindfulness", "Business", "Marketing", "Leadership", "Work", "Artificial Intelligence",
        "Blockchain", "Data Science", "Gadgets", "Makers", "Security", "Technology", "Design", "Project Management", "Programming", "Dev Ops", "Operating Systems", "Writing", "Art", "Gaming", "Humor",
        "Movies", "Music", "News", "Photography", "Podcasts", "Television", "Economics", "Education", "Equality", "Finance", "Law", "Transportation", "Politics", "Race", "Science", "Mathematics", "Drugs",
        "Philosophy", "Religion", "Spirituality", "Cultural Studies", "Fashion", "Beauty", "Language", "Sports", "Cities", "Nature", "Travel"
    ]);
    const [categoryInputFocused, setCategoryInputFocused] = useState(false);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [subcategorySearch, setSubcategorySearch] = useState("");
    const [subcategoryInputFocused, setSubcategoryInputFocused] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioPreview, setAudioPreview] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [showPreview, setShowPreview] = useState(false);

    // Category to Subcategories mapping (from page.tsx)
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

    const mobilePreviewEditor = useEditor(previewEditorOptions);
    const tabletPreviewEditor = useEditor(previewEditorOptions);
    const desktopPreviewEditor = useEditor(previewEditorOptions);
    const emailPreviewEditor = useEditor(previewEditorOptions);

    useEffect(() => {
        if (!editor || !mobilePreviewEditor || !tabletPreviewEditor || !desktopPreviewEditor || !emailPreviewEditor) {
            return;
        }

        const previewEditors = [mobilePreviewEditor, tabletPreviewEditor, desktopPreviewEditor, emailPreviewEditor];

        const handleUpdate = () => {
            const json = editor.getJSON();
            previewEditors.forEach(previewEd => {
                if (previewEd && JSON.stringify(previewEd.getJSON()) !== JSON.stringify(json)) {
                    previewEd.commands.setContent(json, false);
                }
            });
        };

        handleUpdate(); // Initial sync
        editor.on('transaction', handleUpdate);

        return () => {
            editor.off('transaction', handleUpdate);
        };
    }, [editor, mobilePreviewEditor, tabletPreviewEditor, desktopPreviewEditor, emailPreviewEditor]);

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

    // Sentence counter function
    const sentenceCounter = (text: string) => {
        return text.split(/[\.\!\?]+(?:\s|$)/).filter((sentence: string) => sentence.trim().length > 0).length;
    }

    // Reading Time Function
    const readingTime = (text: string) => {
        const words = text.split(/\s+/).filter((word: string) => word.trim().length > 0).length;
        const minutes = words / 200;
        return Math.ceil(minutes);
    }

    // Audio Time Function
    const audioTime = (text: string) => {
        const words = text.split(/\s+/).filter((word: string) => word.trim().length > 0).length;
        const minutes = words / 200 * 1.4;
        return Math.ceil(minutes);
    }


    // Set Link Callback
    const setLink = useCallback(() => {
        if (!editor) return;
        setLinkDialogOpen(true);
    }, [editor]);

    // Set Image Callback
    const setImage = useCallback(() => {
        if (!editor) return;
        setImageDialogOpen(true);
    }, [editor]);

    // Set Audio Callback
    const setAudio = useCallback(() => {
        if (!editor) return;
        setAudioDialogOpen(true);
    }, [editor]);

    // Set Video Callback
    const setVideo = useCallback(() => {
        if (!editor) return;
        setVideoDialogOpen(true);
    }, [editor]);

    // If Editor is not loaded, return null
    if (!editor) {
        return null;
    }

    const addYoutubeVideo = () => {
        const url = prompt('Enter YouTube URL');

        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
                width: Math.max(320, width) || 640,
                height: Math.max(180, height) || 480,
            });

            // Add a new paragraph near the inserted video
            editor.chain().focus().createParagraphNear().run();
        }
    }

    useEffect(() => {
        if (editor) {
            editor.setEditable(isEditable)
        }
    }, [isEditable, editor]);



    // Rich Text Menu Bar
    return (
        <div className="flex flex-row w-full h-screen relative">

            {/* Left Section */}
            <div className="h-full flex flex-col flex-1" style={{ marginRight: '50vw' }}>

                <div className="w-full flex align-center justify-start z-50">
                    {/* Minimize Maximize Button */}
                    <MinimizeMaximizeButton
                        isMinimized={isMinimized}
                        onToggle={() => setIsMinimized(!isMinimized)}
                    />
                </div>


                {/* Writing Section */}
                {!isMinimized && (
                    <div className="flex-1 flex flex-col pt-5 h-[300px]">

                        {/* Article Input Section */}
                        <div className={`p-5 relative `}>

                            {/* Article Input Section */}
                            <div className={`flex flex-col md:flex-row gap-6 transition-all duration-300`}>

                                {/* Left side - Heading, Description, Category, Subcategories */}
                                <div className="flex-1 space-y-4">

                                    {/* Article Heading Input */}
                                    <ArticleHeading
                                        heading={heading}
                                        setHeading={setHeading}
                                        isHeadingCopied={isHeadingCopied}
                                        setIsHeadingCopied={setIsHeadingCopied}
                                    />

                                    {/* Article Description Input */}
                                    <ArticleDescription
                                        description={description}
                                        setDescription={setDescription}
                                        isDescriptionCopied={isDescriptionCopied}
                                        setIsDescriptionCopied={setIsDescriptionCopied}
                                    />

                                    {/* Article Category Input */}
                                    <ArticleCategory
                                        selectedCategories={selectedCategories}
                                        setSelectedCategories={setSelectedCategories}
                                        categorySearch={categorySearch}
                                        setCategorySearch={setCategorySearch}
                                        categoryInputFocused={categoryInputFocused}
                                        setCategoryInputFocused={setCategoryInputFocused}
                                        filteredCategories={filteredCategories}
                                        allCategories={allCategories}
                                    />

                                    {/* Subcategories Input */}
                                    <ArticleSubcategory
                                        selectedSubcategories={selectedSubcategories}
                                        setSelectedSubcategories={setSelectedSubcategories}
                                        subcategorySearch={subcategorySearch}
                                        setSubcategorySearch={setSubcategorySearch}
                                        subcategoryInputFocused={subcategoryInputFocused}
                                        setSubcategoryInputFocused={setSubcategoryInputFocused}
                                        filteredSubcategories={filteredSubcategories}
                                        selectedCategories={selectedCategories}
                                    />
                                </div>

                                {/* Right side - Image Upload */}
                                <div className="w-full md:w-1/3">
                                    <ArticleImage
                                        imagePreview={imagePreview}
                                        setImagePreview={setImagePreview}
                                    />

                                    <ArticleAudio
                                        audioFile={audioFile}
                                        setAudioFile={setAudioFile}
                                        audioPreview={audioPreview}
                                        setAudioPreview={setAudioPreview}
                                        audioDuration={audioDuration}
                                        setAudioDuration={setAudioDuration}
                                        currentTime={currentTime}
                                        setCurrentTime={setCurrentTime}
                                        isPlaying={isPlaying}
                                        setIsPlaying={setIsPlaying}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex flex-col flex-1 h-full">


                    <ArticleHeadingDialog
                        open={isDialogOpen}
                        onOpenChange={setIsDialogOpen}
                        setAudioFile={() => { }}
                        setAudioPreview={() => { }}
                        setAudioDuration={() => { }}
                        setCurrentTime={() => { }}
                        setIsPlaying={() => { }}
                    />

                    {/* Editor Menu Bar */}
                    <div className="p-2 pt-10">
                        {/* Writing Toolbar */}
                        <div className="flex items-center justify-center gap-1 overflow-x-auto bg-gray-100 p-3 rounded-sm">

                            {/* Writing Undo & Redo Buttons */}
                            <div className="flex items-center gap-2 border-r border-gray-500 pr-2 mr-2">
                                <button className="p-2 rounded-sm bg-gray-300 hover:bg-blue-50 hover:text-blue-500">
                                    <Undo2
                                        onClick={() => editor.chain().focus().undo().run()}
                                        className={`w-4 h-4 ${!editor.can().undo() ? '' : 'text-blue-500'}`}
                                    />
                                </button>
                                <button className="p-2 rounded-sm bg-gray-300 hover:bg-blue-50 hover:text-blue-500">
                                    <Redo2
                                        onClick={() => editor.chain().focus().redo().run()}
                                        className={`w-4 h-4 ${!editor.can().redo() ? '' : 'text-blue-500'}`}
                                    />
                                </button>
                            </div>

                            {/* Writing Bold, Italic, Strikethrough, Underline Buttons */}
                            <div className="flex items-center gap-2 border-r border-gray-500 pr-2 mr-2">
                                <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('bold') ? 'is-active bg-blue-50' : ''}`}>
                                    <Bold className={`w-4 h-4 ${editor.isActive('bold') ? 'is-active text-blue-400' : ''}`} />
                                </button>
                                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('italic') ? 'is-active bg-blue-50' : ''}`}>
                                    <Italic className={`w-4 h-4  ${editor.isActive('italic') ? 'is-active text-blue-400' : ''}`} />
                                </button>
                                <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('strike') ? 'is-active bg-blue-50' : ''}`}>
                                    <Strikethrough className={`w-4 h-4 ${editor.isActive('strike') ? 'is-active text-blue-400' : ''}`} />
                                </button>
                                <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('underline') ? 'is-active bg-blue-50' : ''}`}>
                                    <Underline className={`w-4 h-4 ${editor.isActive('underline') ? 'is-active text-blue-400' : ''}`} />
                                </button>
                                <DropdownMenu open={highlightOpen} onOpenChange={setHighlightOpen}>
                                    <DropdownMenuTrigger className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('highlight') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Highlighter className="w-4 h-4" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-40 bg-gray-300 ">
                                        {highlightColors.map((color) => (
                                            <DropdownMenuItem
                                                key={color.value}
                                                onClick={() => {
                                                    if (color.value === 'none') {
                                                        editor.chain().focus().unsetHighlight().run();
                                                    } else {
                                                        editor.chain().focus().toggleHighlight({ color: color.value }).run();
                                                    }
                                                }}
                                                className="flex items-center gap-2 font-playfair-display hover:bg-blue-50 bg-gray-300"
                                            >
                                                {color.value !== 'none' && (
                                                    <div
                                                        className="w-4 h-4 rounded-full hover:bg-gray-300 "
                                                        style={{ backgroundColor: color.value }}
                                                    />
                                                )}
                                                {color.name}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Writing Link, Image, Mic, Video Buttons */}
                            <div className="flex items-center gap-2 border-r border-gray-500 pr-2 mr-2">
                                <button onClick={setLink} className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('link') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                    <LinkIcon className="w-4 h-4" />
                                </button>
                                <button onClick={setImage} className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('image') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                    <ImageIcon className="w-4 h-4" />
                                </button>
                                <button onClick={setAudio} className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('audio') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                    <Mic className="w-4 h-4" />
                                </button>
                                <button onClick={setVideo} className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('video') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                    <Video className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Writing Align Left, Center, Right Buttons */}
                            <div className="flex items-center gap-2 border-r border-gray-500 pr-2 mr-2">
                                <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('textAlign', { align: 'left' }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                    <AlignLeft className="w-4 h-4" />
                                </button>
                                <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('textAlign', { align: 'center' }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                    <AlignCenter className="w-4 h-4" />
                                </button>
                                <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('textAlign', { align: 'right' }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                    <AlignRight className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Writing Dotted List, Numbered List Buttons */}
                            <div className="flex items-center gap-2">
                                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('bulletList') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                    <List className="w-4 h-4" />
                                </button>
                                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded-sm hover:bg-blue-50 hover:text-blue-500 bg-gray-300 ${editor.isActive('orderedList') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                    <ListOrdered className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Style & Buttons Dropdown */}
                        <div className="mt-4 flex items-center justify-center gap-2 pb-5 border-b border-gray-300">

                            {/* Style Dropdown */}
                            <DropdownMenu open={styleOpen} onOpenChange={setStyleOpen}>
                                <DropdownMenuTrigger className="p-1 rounded-md bg-background text-primary text-center w-40 flex items-center justify-center gap-1 font-playfair-display hover:bg-blue-50 hover:text-blue-500">
                                    Style
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${styleOpen ? 'rotate-180' : ''}`} />
                                </DropdownMenuTrigger>

                                {/* Style Dropdown Content */}
                                <DropdownMenuContent className="w-40 font-playfair-display">
                                    <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('paragraph') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Type className="w-4 h-4 mr-2" />
                                        Normal text
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('heading', { level: 1 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Heading1 className="w-4 h-4 mr-2" />
                                        Heading 1
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('heading', { level: 2 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Heading2 className="w-4 h-4 mr-2" />
                                        Heading 2
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('heading', { level: 3 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Heading3 className="w-4 h-4 mr-2" />
                                        Heading 3
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('heading', { level: 4 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Heading4 className="w-4 h-4 mr-2" />
                                        Heading 4
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('heading', { level: 5 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Heading5 className="w-4 h-4 mr-2" />
                                        Heading 5
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('heading', { level: 6 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Heading6 className="w-4 h-4 mr-2" />
                                        Heading 6
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleSubscript().run()} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('subscript') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Subscript className="w-4 h-4 mr-2" />
                                        Subscript
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleSuperscript().run()} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('superscript') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Superscript className="w-4 h-4 mr-2" />
                                        Superscript
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('blockquote') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Quote className="w-4 h-4 mr-2" />
                                        Blockquote
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Buttons Dropdown */}
                            <DropdownMenu open={buttonsOpen} onOpenChange={setButtonsOpen}>
                                <DropdownMenuTrigger className="font-playfair-display p-1 rounded-md bg-background text-primary text-center w-40 flex items-center justify-center gap-1 hover:bg-blue-50 hover:text-blue-500">
                                    Buttons
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${buttonsOpen ? 'rotate-180' : ''}`} />
                                </DropdownMenuTrigger>

                                {/* Buttons Dropdown Content */}
                                <DropdownMenuContent className="w-40 font-playfair-display">
                                    <DropdownMenuItem onClick={() => {
                                        editor.commands.insertContent({ type: 'subscribe' });
                                        editor.chain().focus().createParagraphNear().run();
                                    }} className="hover:bg-blue-50 hover:text-blue-500">
                                        <Bell className="w-4 h-4 mr-2" />
                                        Subscribe
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        editor.commands.insertContent({ type: 'share-post' });
                                        editor.chain().focus().createParagraphNear().run();
                                    }} className="hover:bg-blue-50 hover:text-blue-500">
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share Post
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        editor.commands.insertContent({ type: 'share-publication' });
                                        editor.chain().focus().createParagraphNear().run();
                                    }} className="hover:bg-blue-50 hover:text-blue-500">
                                        <Share className="w-4 h-4 mr-2" />
                                        Share Publication
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        editor.commands.insertContent({ type: 'comment' });
                                        editor.chain().focus().createParagraphNear().run();
                                    }} className="hover:bg-blue-50 hover:text-blue-500">
                                        <MessageSquare className="w-4 h-4 mr-2" />
                                        Leave A Comment
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            editor.commands.insertContent({ type: 'send-message' });
                                            editor.chain().focus().createParagraphNear().run();
                                        }} className="hover:bg-blue-50 hover:text-blue-500">
                                        <Send className="w-4 h-4 mr-2" />
                                        Send Message
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            editor.commands.insertContent({ type: 'form' });
                                            editor.chain().focus().createParagraphNear().run();
                                        }} className="hover:bg-blue-50 hover:text-blue-500">
                                        <FileText className="w-4 h-4 mr-2" />
                                        Form
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            editor.commands.insertContent({ type: 'refer-writer' });
                                            editor.chain().focus().createParagraphNear().run();
                                        }} className="hover:bg-blue-50 hover:text-blue-500">
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Refer Writer
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            editor.commands.insertContent({ type: 'link-to-survey' });
                                            editor.chain().focus().createParagraphNear().run();
                                        }} className="hover:bg-blue-50 hover:text-blue-500">
                                        <Link2 className="w-4 h-4 mr-2" />
                                        Link To Survey
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* Embeds Dropdown */}
                            <DropdownMenu open={embedsOpen} onOpenChange={setEmbedsOpen}>
                                <DropdownMenuTrigger className="font-playfair-display p-1 rounded-md bg-background text-primary text-center w-40 flex items-center justify-center gap-1 hover:bg-blue-50 hover:text-blue-500">
                                    Embeds
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${embedsOpen ? 'rotate-180' : ''}`} />
                                </DropdownMenuTrigger>

                                {/* Embeds Dropdown Content */}
                                <DropdownMenuContent className="w-40 font-playfair-display">
                                    <DropdownMenuItem onClick={addYoutubeVideo} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('youtube') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Youtube className="w-4 h-4 mr-2" />
                                        Youtube
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        const url = prompt('Enter Twitter/X URL');
                                        if (url) {
                                            editor.commands.insertContent({
                                                type: 'twitter',
                                                attrs: { url }
                                            });
                                            editor.chain().focus().createParagraphNear().run();
                                        }
                                    }} className="hover:bg-blue-50 hover:text-blue-500">
                                        <Twitter className="w-4 h-4 mr-2" />
                                        Twitter
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        const url = prompt('Enter Facebook post URL');
                                        if (url) {
                                            editor.commands.insertContent({
                                                type: 'facebook',
                                                attrs: { url }
                                            });
                                            editor.chain().focus().createParagraphNear().run();
                                        }
                                    }} className="hover:bg-blue-50 hover:text-blue-500">
                                        <Facebook className="w-4 h-4 mr-2" />
                                        Facebook
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        const url = prompt('Enter Instagram post URL');
                                        if (url) {
                                            editor.commands.insertContent({
                                                type: 'instagram',
                                                attrs: { url }
                                            });
                                            editor.chain().focus().createParagraphNear().run();
                                        }
                                    }} className="hover:bg-blue-50 hover:text-blue-500">
                                        <Instagram className="w-4 h-4 mr-2" />
                                        Instagram
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            {/* More Dropdown */}
                            <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
                                <DropdownMenuTrigger className="font-playfair-display p-1 rounded-md bg-background text-primary text-center w-40 flex items-center justify-center gap-1 hover:bg-blue-50 hover:text-blue-500">
                                    More
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${moreOpen ? 'rotate-180' : ''}`} />
                                </DropdownMenuTrigger>

                                {/* More Dropdown Content */}
                                <DropdownMenuContent className="w-40 font-playfair-display">
                                    <DropdownMenuItem onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('codeBlock') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Code2 className="w-4 h-4 mr-2" />
                                        Code Block
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('table') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Table2 className="w-4 h-4 mr-2" />
                                        Tables
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-gray-500 hover:bg-blue-50 hover:text-blue-500">
                                        <BarChart3 className="w-4 h-4 mr-2" />
                                        Financial Charts
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-gray-500 hover:bg-blue-50 hover:text-blue-500">
                                        <BookOpen className="w-4 h-4 mr-2" />
                                        Poetry
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editor.chain().focus().setHorizontalRule().run()} className={`hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('horizontalRule') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                        <Minus className="w-4 h-4 mr-2" />
                                        Divider
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-gray-500 hover:bg-blue-50 hover:text-blue-500">
                                        <FileTextIcon className="w-4 h-4 mr-2" />
                                        Footnote
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-gray-500 hover:bg-blue-50 hover:text-blue-500">
                                        <BarChart2 className="w-4 h-4 mr-2" />
                                        Poll
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>


                        {/* Editor Content (fills available space) */}
                        <div className="flex-1 overflow-auto w-full pb-20 font-playfair-display">
                            {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                                <div className="bubble-menu gap-1">
                                    <button
                                        onClick={() => editor.chain().focus().toggleBold().run()}
                                        className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm px-2 ${editor.isActive('bold') ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                                    >
                                        <Bold className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleItalic().run()}
                                        className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('italic') ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                                    >
                                        <Italic className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleStrike().run()}
                                        className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('strike') ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                                    >
                                        <Strikethrough className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                                        className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('underline') ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                                    >
                                        <Underline className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().setParagraph().run()}
                                        className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('paragraph') ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                                    >
                                        <Type className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                        className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('heading', { level: 1 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                                    >
                                        <Heading1 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                        className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('heading', { level: 2 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                                    >
                                        <Heading2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={setLink}
                                        // onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                        className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('heading', { level: 2 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                        className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('heading', { level: 2 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                                    >
                                        <img
                                            src="/sparkles2.png"
                                            alt="Sparkles"
                                            className="w-5 h-5 cursor-pointer rounded-sm hover:bg-muted"
                                            onClick={() => setIsDialogOpen(true)}
                                        />
                                    </button>
                                </div>
                            </BubbleMenu>}
                            <EditorContent editor={editor} />
                        </div>

                        {/* Fixed Footer Section */}
                        <div className="fixed bottom-0 left-0 right-0 p-2 border-t border-gray-300 flex justify-between items-center bg-background z-50 ">

                            <div className="flex gap-2 p-2 px-4 rounded-lg bg-gray-100">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-300 hover:bg-blue-50 group">
                                                <Info className="w-4 h-6 group-hover:text-blue-500" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="h-full w-74 h-70 bg-background border border-secondary mb-4 ml-3 font-playfair-display">
                                            <h3 className="text-2xl font-semibold mb-3 text-secondary">Post Info</h3>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-secondary text-lg">Characters</span>
                                                    <span className="text-secondary text-lg">
                                                        {editor?.storage.characterCount.characters() ?? 0}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-secondary text-lg">Words</span>
                                                    <span className="text-secondary text-lg">
                                                        {editor?.storage.characterCount.words() ?? 0}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-secondary text-lg">Sentences</span>
                                                    <span className="text-secondary text-lg">
                                                        {sentenceCounter(editor?.getText() ?? '')}
                                                    </span>
                                                </div>
                                                <div className="border-t border-secondary my-2"></div>
                                                <div className="flex justify-between">
                                                    <span className="text-secondary text-lg">Reading time</span>
                                                    <span className="text-secondary text-lg">
                                                        {readingTime(editor?.getText() ?? '')} min
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-secondary text-lg">Audio time</span>
                                                    <span className="text-secondary text-lg">{audioTime(editor?.getText() ?? '')} min</span>
                                                </div>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-300 hover:bg-blue-50 group">
                                                <FileStack className="w-4 h-6 group-hover:text-blue-500" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="w-30 p-2 bg-background border border-secondary mb-5 font-playfair-display">
                                            <p className="text-base text-secondary text-center">Draft History (Coming soon)</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-300 hover:bg-blue-50 group" onClick={() => setSettingsModalOpen(true)}>
                                                <Settings className="w-4 h-6 group-hover:text-blue-500" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="w-30 p-2 bg-background border border-secondary mb-5 font-playfair-display">
                                            <p className="text-base text-secondary text-center">Settings</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-300 hover:bg-blue-50 group">
                                                <UserRoundPlus className="w-4 h-6 group-hover:text-blue-500" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="w-30 p-2 bg-background border border-secondary mb-5 hover:bg-blue-50 group">
                                            <p className="text-base text-secondary text-center group-hover:bg-blue-500">Add Collaborator</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <button
                                                className="block lg:block md:block sm:block xl:hidden flex items-center gap-2 px-4 py-2 rounded-md bg-gray-300 hover:bg-blue-50 group"
                                            >
                                                <Eye className="w-4 h-6 group-hover:text-blue-500" />
                                            </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="w-30 p-2 bg-background border border-secondary mb-5 font-playfair-display">
                                            <p className="text-lg text-secondary text-center">Preview</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600">
                                            Send To Everyone
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="w-30 p-2 bg-background border border-secondary mb-5 font-playfair-display">
                                        <p className="text-secondary text-center">Publish and share with all subscribers</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>

                        {/* Dialogs */}
                        <LinkDialog
                            editor={editor}
                            open={linkDialogOpen}
                            onOpenChange={setLinkDialogOpen}
                        />
                        <ImageDialog
                            editor={editor}
                            open={imageDialogOpen}
                            onOpenChange={setImageDialogOpen}
                        />
                        <AudioDialog
                            editor={editor}
                            open={audioDialogOpen}
                            onOpenChange={setAudioDialogOpen}
                        />
                        <VideoDialog
                            editor={editor}
                            open={videoDialogOpen}
                            onOpenChange={setVideoDialogOpen}
                        />
                        <SettingsModal
                            open={settingsModalOpen}
                            onOpenChange={setSettingsModalOpen}
                        />
                    </div>
                </div>
            </div>


            {/* Right Section */}
            <div className="fixed top-0 right-0 h-screen flex flex-col justify-center items-center border-l border-gray-100 z-40 bg-white dark:bg-gray-900" style={{ width: '50vw' }}>

                {/* Prototyping Section */}
                <div className="h-full flex flex-col overflow-hidden">

                    {/* Main Content */}
                    <div className="p-5">
                        <button
                            onClick={() => setShowPreview(false)}
                            className="p-2 rounded-md hover:bg-gray-500/30 xl:hidden"
                        >
                            <PanelLeft className="w-4 h-4" />
                        </button>
                        <div className="flex justify-center items-center mb-1">
                            <h1 className="text-xl font-bold text-center">Articles Previews</h1>
                        </div>
                        <p className="text-gray-500 text-center text-sm text-balance">This is a preview of the Article, this helps you as a creator to see how your articles will look like to your consumers before publishing it.</p>
                    </div>

                    <Tabs defaultValue="timeline" className="flex-1 w-full h-full flex flex-col">
                        <TabsList className="w-[70%] mx-auto flex flex-row gap-3 justify-start mb-2 rounded-lg bg-background shadow-lg bg-card">
                            <TabsTrigger
                                value="timeline"
                                className="cursor-pointer py-2 flex-1 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50"
                            >
                                <div className="flex items-center justify-center gap-2 w-full h-full">
                                    <SquareChartGantt className="w-5 h-5" />
                                    <span className="hidden md:block font-playfair-display">Timeline</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="mobile"
                                className="cursor-pointer py-2 flex-1 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50"
                            >
                                <div className="flex items-center justify-center gap-2 w-full h-full">
                                    <Smartphone className="w-5 h-5" />
                                    <span className="hidden md:block font-playfair-display">Mobile</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="tablet"
                                className="cursor-pointer py-2 flex-1 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Tablet className="w-5 h-5" />
                                    <span className="hidden md:block font-playfair-display">Tablet</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger
                                value="desktop"
                                className="cursor-pointer py-2 flex-1 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-600 data-[state=active]:bg-blue-50 dark:data-[state=active]:bg-blue-50"
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <Monitor className="w-5 h-5" />
                                    <span className="hidden md:block font-playfair-display">Desktop</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="timeline" className=" flex-1 p-5 overflow-y-auto">
                            <div className="space-y-4">
                                <div className="bg-background rounded-md p-2 shadow-primary/20 shadow-lg hover:shadow-xl transition-shadow cursor-pointer w-3/5 mx-auto">
                                    <div className="flex justify-between gap-2">
                                        {/* Left Content */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                {/* Publisher Info */}
                                                <div className="flex items-center gap-1 mb-1">
                                                    <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden">
                                                        {/* Publisher Icon */}
                                                        <img
                                                            src={"https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop"}
                                                            alt="Tech Daily"
                                                            width={20}
                                                            height={20}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-playfair-display text-primary">
                                                        Tech Daily
                                                    </span>
                                                </div>
                                                {/* Article Title & Subtitle */}
                                                <h3 className="text-base font-playfair-display font-bold text-primary mb-0.5 line-clamp-2">
                                                    {heading || "Your Article Title Here"}
                                                </h3>
                                                <p className="text-xs font-playfair-display text-muted-foreground mb-1 line-clamp-2">
                                                    {description || "Your article subtitle or description will appear here."}
                                                </p>
                                            </div>
                                            {/* Author & Read Time */}
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <span className="truncate max-w-[7ch] sm:max-w-[20ch] font-playfair-display">Sarah Johnson</span>
                                                <div className="flex items-center gap-0.5">
                                                    {/* Clock Icon */}
                                                    <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                                                    <span className="font-playfair-display">{readingTime(editor?.getText() ?? '')} min read</span>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Right Content - Image & Category */}
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] text-muted-foreground font-playfair-display">
                                                March 15, 2024
                                            </span>
                                            <div className="w-16 h-16 rounded-md overflow-hidden">
                                                <img
                                                    src={imagePreview || "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop"}
                                                    alt="The Future of Artificial Intelligence in Healthcare And Its Dangerous Side Effects"
                                                    width={64}
                                                    height={64}
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="mt-5 font-playfair-display truncate max-w-[8ch] sm:max-w-[16ch] text-[10px] font-medium text-blue-600 hover:text-blue-700 bg-muted hover:bg-muted/90 px-1.5 py-0.5 rounded-full">
                                                {selectedCategories[0] || "selectedCategories"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="mobile" className=" flex-1 p-5 over">

                            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2rem] h-[600px] w-[300px]">
                                <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                                <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                                <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                                <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                                <div className="rounded-[1.5rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800 flex flex-col">

                                    {/* Emulator Heading  */}
                                    <div className="flex items-center justify-between w-full px-2 py-2 bg-white dark:bg-gray-900" style={{ minHeight: 18 }}>
                                        {/* Back Button */}
                                        <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                                        </button>
                                        <div className="flex items-center gap-2">
                                            {/* Play Button */}
                                            <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <Play className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                                            </button>
                                            {/* Archive Button */}
                                            <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <Archive className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                                            </button>
                                            {/* Options Button */}
                                            <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <MoreVertical className="w-5 h-5 text-gray-700 dark:text-gray-200" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                                        <div className="px-2 pt-1 pb-1">
                                            <div className="flex flex-row items-center justify-between">
                                                <p className="text-xs text-gray-500 mb-1 font-playfair-display mr-2">By Sarah Johnson</p>
                                                <Button className="h-4 w-10 text-[8px] border border-blue-500 rounded-sm bg-secondary hover:bg-secondary font-playfair-display">Follow</Button>
                                            </div>
                                            <h1 className="text-sm font-playfair-display font-bold text-gray-900 dark:text-white mb-1">{heading || "Your Article Title Here"}</h1>
                                            <h2 className="text-xs text-gray-500 line-clamp-3 font-playfair-display">{description || "Your article subtitle or description will appear here."}</h2>
                                            <span className="text-[10px] text-gray-500 font-playfair-display">March 15, 2024</span>
                                        </div>

                                        <div className="flex align-center justify-between w-full px-2 pb-2 border-b border-gray-100">

                                            {/* Left: Publication Name and Date */}
                                            <div className="flex flex-row items-center">
                                                <div className="w-8 h-8 rounded-full border border-gray-300 overflow-hidden mr-2">
                                                    <img
                                                        src={"https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop"}
                                                        alt="Publication"
                                                        className="object-cover w-full h-full rounded-full"
                                                    />
                                                </div>
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className="text-xs text-primary font-playfair-display">Tech Daily</span>
                                                </div>
                                            </div>

                                            {/* Right: Publication Picture */}
                                            <div className="flex flex-row items-center gap-2">
                                                <Button className="h-6 w-15 text-[10px] bg-secondary hover:bg-secondary font-playfair-display">
                                                    Subscribe
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="text-xs font-playfair-display [&_p]:mb-2 [&_audio]:w-full [&_audio]:h-[30px] [&_audio]:mb-2 [&_img]:mb-2 [&_img]:h-40 [&_img]:mx-auto [&_img]:block [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-md [&_h3]:font-bold [&_h4]:text-sm [&_h4]:font-bold [&_h5]:text-xs [&_h5]:font-bold [&_h6]:text-xs [&_h6]:font-bold [&_twitter]:w-full [&_subscribe]:block">
                                            <EditorContent editor={mobilePreviewEditor} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </TabsContent>
                        <TabsContent value="tablet" className="flex-1 p-5">

                            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[1.5rem] h-[350px] max-w-[260px] md:h-[500px] md:max-w-[380px]">
                                <div className="h-[32px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                                <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                                <div className="h-[46px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                                <div className="h-[64px] w-[3px] bg-gray-800 dark:bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                                <div className="rounded-[1rem] overflow-hidden h-[322px] md:h-[472px] bg-white dark:bg-gray-800 flex">

                                    {/* Sidebar */}
                                    <div className="w-8 bg-background flex flex-col h-full">

                                        {/* Top Section */}
                                        <div className="h-10 w-full flex-shrink-0">
                                        </div>

                                        {/* Middle Section - Centered */}
                                        <div className="flex-1 flex flex-col items-center justify-center space-y-1">

                                            {/* Home Icon */}
                                            <button className="p-2 rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                                <House className="w-2 h-2" />
                                            </button>

                                            {/* Search Icon */}
                                            <button className="p-2 rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                                <Inbox className="w-2 h-2" />
                                            </button>

                                            {/* Library Icon */}
                                            <button className="p-2 rounded-[8px] bg-secondary ">
                                                <Plus className="w-2 h-2 text-white" />
                                            </button>

                                            {/* Library Icon */}
                                            <button className="p-2 rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                                <Book className="w-2 h-2" />
                                            </button>

                                            {/* Notifications Icon */}
                                            <button className="p-2 rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                                <Mic className="w-2 h-2" />
                                            </button>
                                        </div>

                                        {/* Bottom Section */}
                                        <div className="flex-shrink-0">
                                            {/* Profile Icon */}
                                            <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                                <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
                                                    <img
                                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex-1 flex flex-col">

                                        {/* Emulator Heading  */}
                                        <div className="flex items-center justify-between w-full px-2 bg-white dark:bg-gray-900" style={{ minHeight: 18 }}>
                                            {/* Back Button */}
                                            <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <ChevronLeft className="w-3 h-3 text-gray-700 dark:text-gray-200" />
                                            </button>
                                            <div className="flex items-center gap-2">
                                                {/* Play Button */}
                                                <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <Play className="w-3 h-3 text-gray-700 dark:text-gray-200" />
                                                </button>
                                                {/* Archive Button */}
                                                <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <Archive className="w-3 h-3 text-gray-700 dark:text-gray-200" />
                                                </button>
                                                {/* Options Button */}
                                                <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <MoreVertical className="w-3 h-3 text-gray-700 dark:text-gray-200" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 overflow-y-auto scrollbar-hide">
                                            <div className="px-2 pt-1 pb-1">
                                                <div className="flex flex-row items-center justify-between">
                                                    <p className="text-[8px] text-gray-500 font-playfair-display mr-2">By Sarah Johnson</p>
                                                    <Button className="h-4 w-10 text-[8px] border border-blue-500 rounded-sm bg-secondary hover:bg-secondary font-playfair-display">Follow</Button>
                                                </div>
                                                <h1 className="text-xs font-playfair-display font-bold text-gray-900 dark:text-white mb-1">{heading || "Your Article Title Here"}</h1>
                                                <h2 className="text-[8px] text-gray-500 line-clamp-3 font-playfair-display">{description || "Your article subtitle or description will appear here."}</h2>
                                            </div>

                                            <div className="flex align-center justify-between w-full px-2 pb-2 border-b border-gray-100">

                                                {/* Left: Publication Name and Date */}
                                                <div className="flex flex-row items-center">
                                                    <div className="w-5 h-5 rounded-full border border-gray-300 overflow-hidden mr-2">
                                                        <img
                                                            src={"https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop"}
                                                            alt="Publication"
                                                            className="object-cover w-full h-full rounded-full"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="text-[8px]  text-primary font-playfair-display font-bold">Tech Daily</span>
                                                    </div>
                                                </div>

                                                {/* Right: Publication Picture */}
                                                <div className="flex flex-row items-center gap-2">
                                                    <Button className="h-5 w-13 text-[8px] bg-secondary hover:bg-secondary font-playfair-display">
                                                        Subscribe
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="text-xs font-playfair-display [&_p]:text-[8px] [&_p]:mb-2 [&_audio]:w-full [&_audio]:h-[30px] [&_audio]:mb-2 [&_img]:mb-2 [&_img]:h-40 [&_img]:mx-auto [&_img]:block [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-md [&_h3]:font-bold [&_h4]:text-sm [&_h4]:font-bold [&_h5]:text-xs [&_h5]:font-bold [&_h6]:text-xs [&_h6]:font-bold [&_twitter]:w-full">
                                                <EditorContent editor={tabletPreviewEditor} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </TabsContent>
                        <TabsContent value="desktop" className=" flex-1 p-5 ml-10">

                            <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[8px] rounded-t-xl h-[172px] max-w-[301px] md:h-[294px] md:max-w-[512px]">
                                <div className="rounded-lg overflow-hidden h-[156px] md:h-[278px] bg-white dark:bg-gray-800 flex flex-row">

                                    {/* Sidebar (copied from tablet) */}
                                    <div className="w-8 bg-background flex flex-col h-full">
                                        {/* Top Section */}
                                        <div className="h-10 w-full flex-shrink-0"></div>
                                        {/* Middle Section - Centered */}
                                        <div className="flex-1 flex flex-col items-center justify-center space-y-1">
                                            {/* Home Icon */}
                                            <button className="p-2 rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                                <House className="w-2 h-2" />
                                            </button>
                                            {/* Search Icon */}
                                            <button className="p-2 rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                                <Inbox className="w-2 h-2" />
                                            </button>
                                            {/* Library Icon */}
                                            <button className="p-2 rounded-[8px] bg-secondary ">
                                                <Plus className="w-2 h-2 text-white" />
                                            </button>
                                            {/* Library Icon */}
                                            <button className="p-2 rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                                <Book className="w-2 h-2" />
                                            </button>
                                            {/* Notifications Icon */}
                                            <button className="p-2 rounded-[8px] hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                                <Mic className="w-2 h-2" />
                                            </button>
                                        </div>
                                        {/* Bottom Section */}
                                        <div className="flex-shrink-0">
                                            {/* Profile Icon */}
                                            <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
                                                <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 overflow-hidden">
                                                    <img
                                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                                                        alt="Profile"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Main Content */}
                                    <div className="flex-1 flex flex-col">

                                        {/* Emulator Heading  */}
                                        <div className="flex items-center justify-between w-full px-2 bg-white dark:bg-gray-900" style={{ minHeight: 18 }}>
                                            {/* Back Button */}
                                            <button className="p-1 rounded-[8px] hover:bg-gray-100 dark:hover:bg-gray-800">
                                                <ChevronLeft className="w-2 h-2 text-gray-700 dark:text-gray-200" />
                                            </button>
                                            <div className="flex items-center gap-2">
                                                {/* Play Button */}
                                                <button className="p-1 rounded-[8px] hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <Play className="w-2 h-2 text-gray-700 dark:text-gray-200" />
                                                </button>
                                                {/* Archive Button */}
                                                <button className="p-1 rounded-[8px] hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <Archive className="w-2 h-2 text-gray-700 dark:text-gray-200" />
                                                </button>
                                                {/* Options Button */}
                                                <button className="p-1 rounded-[8px] hover:bg-gray-100 dark:hover:bg-gray-800">
                                                    <MoreVertical className="w-2 h-2 text-gray-700 dark:text-gray-200" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex-1 flex-col items-center justify-center overflow-y-auto scrollbar-hide">
                                            <div className="px-2 flex flex-col align-center justify-around w-full">
                                                <div className="flex flex-row items-center justify-between">
                                                    <p className="text-[8px] text-gray-500 font-playfair-display mr-2">By Sarah Johnson</p>
                                                    <Button className="h-4 w-6 text-[6px] border border-blue-500 rounded-sm bg-secondary hover:bg-secondary font-playfair-display">Follow</Button>
                                                </div>
                                                <h1 className="text-xs font-playfair-display font-bold text-gray-900 dark:text-white mb-1">{heading || "Your Article Title Here"}</h1>
                                                <h2 className="text-[6px] text-gray-500 line-clamp-3 font-playfair-display">{description || "Your article subtitle or description will appear here."}</h2>
                                            </div>

                                            <div className="flex align-center justify-between w-full px-2 pb-1 border-b border-gray-100">

                                                {/* Left: Publication Name and Date */}
                                                <div className="flex flex-row items-center">
                                                    <div className="w-5 h-5 rounded-full border border-gray-300 overflow-hidden mr-2">
                                                        <img
                                                            src={"https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop"}
                                                            alt="Publication"
                                                            className="object-cover w-full h-full rounded-full"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-center justify-center">
                                                        <span className="text-[8px]  text-primary font-playfair-display font-bold">Tech Daily</span>
                                                    </div>
                                                </div>

                                                {/* Right: Publication Picture */}
                                                <div className="flex flex-row items-center gap-2">
                                                    <Button className="h-4 w-10 text-[6px] bg-secondary hover:bg-secondary font-playfair-display">
                                                        Subscribe
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="ml-[20%] w-[60%] font-playfair-display text-[8px] [&_p]:mb-2 [&_p]:text-[8px] [&_audio]:w-full [&_audio]:h-[30px] [&_audio]:mb-2 [&_img]:mb-2 [&_img]:h-40 [&_img]:mx-auto [&_img]:block [&_h1]:text-[8px] [&_h1]:font-bold [&_h2]:text-[8px] [&_h2]:font-bold [&_h3]:text-[8px] [&_h3]:font-bold [&_h4]:text-[8px] [&_h4]:font-bold [&_h5]:text-[8px] [&_h5]:font-bold [&_h6]:text-[8px] [&_h6]:font-bold [&_twitter]:w-full">
                                                <EditorContent editor={desktopPreviewEditor} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative mx-auto bg-gray-900 dark:bg-gray-700 rounded-b-xl rounded-t-sm h-[17px] max-w-[351px] md:h-[21px] md:max-w-[557px]">
                                <div className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-xl w-[56px] h-[5px] md:w-[96px] md:h-[8px] bg-gray-800"></div>
                            </div>

                        </TabsContent>
                        
                    </Tabs>
                </div>
            </div>
        </div>
    );
}


export default () => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc ml-2',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal ml-2',
                    },
                },
                blockquote: {
                    HTMLAttributes: {
                        class: 'blockquote border-l-4 border-secondary pl-4 py-2 my-4 bg-secondary/10 dark:bg-secondary/50 ',
                    },
                },
                horizontalRule: {
                    HTMLAttributes: {
                        class: 'border-t border-gray-300 my-4',
                    },
                },
            }),
            Placeholder.configure({
                // Use a placeholder:
                placeholder: 'Start Writing Here...',
                // Use different placeholders depending on the node type:
                // placeholder: ({ node }) => {
                //   if (node.type.name === 'heading') {
                //     return 'What's the title?'
                //   }

                //   return 'Can you add some further context?'
                // },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            UnderlineEditor.configure({
                HTMLAttributes: {
                    class: 'underline',
                },
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextStyle,
            FontFamily,
            Highlight.configure({
                multicolor: true,
                HTMLAttributes: {
                    class: 'highlight',
                },
            }),
            SubscriptEditor.configure({
                HTMLAttributes: {
                    class: 'subscript',
                },
            }),
            SuperscriptEditor.configure({
                HTMLAttributes: {
                    class: 'superscript',
                },
            }),
            ImageExtension.configure({
                HTMLAttributes: {
                    class: 'max-w-full rounded-lg shadow-md',
                },
                allowBase64: true,
                inline: false,
            }),
            YoutubeExtension.configure({
                controls: true,
                nocookie: true,
                allowFullscreen: true,
                ccLanguage: 'en',
                origin: 'https://www.youtube.com',
                HTMLAttributes: {
                    class: 'my-4 rounded-lg shadow-md w-full h-60',
                },
            }),
            // Character Count Extension
            CharacterCount.configure({
                limit: 100000,
            }),
            // Audio Custom Extension
            Node.create({
                name: 'audio',
                group: 'block',
                atom: true,
                addAttributes() {
                    return {
                        src: {
                            default: null,
                        },
                        title: {
                            default: null,
                        },
                    }
                },
                parseHTML() {
                    return [
                        {
                            tag: 'audio[src]',
                        },
                    ]
                },
                renderHTML({ HTMLAttributes }) {
                    return ['div', { class: 'audio-container' }, ['audio', { controls: true, ...HTMLAttributes }]]
                },
                addCommands() {
                    return {
                        setAudio: (options: any) => ({ commands }: { commands: any }) => {
                            return commands.insertContent({
                                type: this.name,
                                attrs: options,
                            })
                        },
                    } as Partial<RawCommands>
                },
            }),
            LinkEditor.configure({
                openOnClick: true,
                autolink: true,
                defaultProtocol: 'https',
                protocols: ['http', 'https'],
                HTMLAttributes: {
                    class: 'text-blue-600 underline hover:text-blue-800',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
                isAllowedUri: (url, ctx) => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`${ctx.defaultProtocol}://${url}`)

                        // use default validation
                        if (!ctx.defaultValidate(parsedUrl.href)) {
                            return false
                        }

                        // disallowed protocols
                        const disallowedProtocols = ['ftp', 'file', 'mailto']
                        const protocol = parsedUrl.protocol.replace(':', '')

                        if (disallowedProtocols.includes(protocol)) {
                            return false
                        }

                        // only allow protocols specified in ctx.protocols
                        const allowedProtocols = ctx.protocols.map(p => (typeof p === 'string' ? p : p.scheme))

                        if (!allowedProtocols.includes(protocol)) {
                            return false
                        }

                        // disallowed domains
                        const disallowedDomains = ['example-phishing.com', 'malicious-site.net']
                        const domain = parsedUrl.hostname

                        if (disallowedDomains.includes(domain)) {
                            return false
                        }

                        // all checks have passed
                        return true
                    } catch {
                        return false
                    }
                },
                shouldAutoLink: url => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(':') ? new URL(url) : new URL(`https://${url}`)

                        // only auto-link if the domain is not in the disallowed list
                        const disallowedDomains = ['example-no-autolink.com', 'another-no-autolink.com']
                        const domain = parsedUrl.hostname

                        return !disallowedDomains.includes(domain)
                    } catch {
                        return false
                    }
                },
            }),
            // Video Custom Extension
            Node.create({
                name: 'video',
                group: 'block',
                atom: true,
                addAttributes() {
                    return {
                        src: {
                            default: null,
                        },
                        title: {
                            default: null,
                        },
                    }
                },
                parseHTML() {
                    return [
                        {
                            tag: 'video[src]',
                        },
                    ]
                },
                renderHTML({ HTMLAttributes }) {
                    return ['div', { class: 'video-container' }, ['video', { controls: true, ...HTMLAttributes }]]
                },
                addCommands() {
                    return {
                        setVideo: (options: any) => ({ commands }: { commands: any }) => {
                            return commands.insertContent({
                                type: this.name,
                                attrs: options,
                            })
                        },
                    } as Partial<RawCommands>
                },
            }),
            // Tweet Custom Extension
            Node.create({
                name: 'twitter',
                group: 'block',
                atom: true,
                draggable: true,

                addPasteRules() {
                    const twitterUrl = /(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/[^/]+\/status\/(\d+)/g

                    return [
                        nodePasteRule({
                            find: twitterUrl,
                            type: this.type,
                            getAttributes: (match) => {
                                console.log('Paste match:', match);
                                return { url: match[0] }
                            }
                        })
                    ]
                },

                addAttributes() {
                    return {
                        url: {
                            default: null
                        }
                    }
                },

                parseHTML() {
                    return [
                        {
                            tag: 'twitter'
                        }
                    ]
                },

                renderHTML({ HTMLAttributes }) {
                    return ['twitter', mergeAttributes(HTMLAttributes, { class: "w-full" })]
                },

                addCommands() {
                    return {
                        insertTwitter: (options: { url: string }) => ({ commands }: { commands: any }) => {
                            return commands.insertContent({
                                type: this.name,
                                attrs: options
                            })
                        }
                    } as Partial<RawCommands>
                },

                addNodeView() {
                    return ReactNodeViewRenderer(TweetComponent)
                }
            }),
            // Facebook Custom Extension
            Node.create({
                name: 'facebook',
                group: 'block',
                atom: true,
                draggable: true,

                addPasteRules() {
                    const facebookUrl = /(?:https?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.com)\/[^/]+\/posts\/\d+/g

                    return [
                        nodePasteRule({
                            find: facebookUrl,
                            type: this.type,
                            getAttributes: (match) => {
                                return { url: match[0] }
                            }
                        })
                    ]
                },

                addAttributes() {
                    return {
                        url: {
                            default: null
                        }
                    }
                },

                parseHTML() {
                    return [
                        {
                            tag: 'facebook'
                        }
                    ]
                },

                renderHTML({ HTMLAttributes }) {
                    return ['facebook', mergeAttributes(HTMLAttributes)]
                },

                addCommands() {
                    return {
                        insertFacebook: (options: { url: string }) => ({ commands }: { commands: any }) => {
                            return commands.insertContent({
                                type: this.name,
                                attrs: options
                            })
                        }
                    } as Partial<RawCommands>
                },

                addNodeView() {
                    return ReactNodeViewRenderer(FacebookComponent)
                }
            }),
            // Instagram Custom Extension
            Node.create({
                name: 'instagram',
                group: 'block',
                atom: true,
                draggable: true,

                addPasteRules() {
                    const instagramUrl = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?:p|reel)\/[^/]+\/?/g

                    return [
                        nodePasteRule({
                            find: instagramUrl,
                            type: this.type,
                            getAttributes: (match) => {
                                return { url: match[0] }
                            }
                        })
                    ]
                },

                addAttributes() {
                    return {
                        url: {
                            default: null
                        }
                    }
                },

                parseHTML() {
                    return [
                        {
                            tag: 'instagram'
                        }
                    ]
                },

                renderHTML({ HTMLAttributes }) {
                    return ['instagram', mergeAttributes(HTMLAttributes)]
                },

                addCommands() {
                    return {
                        insertInstagram: (options: { url: string }) => ({ commands }: { commands: any }) => {
                            return commands.insertContent({
                                type: this.name,
                                attrs: options
                            })
                        }
                    } as Partial<RawCommands>
                },

                addNodeView() {
                    return ReactNodeViewRenderer(InstagramComponent)
                }
            }),
            // Code Block Custom Extension
            CodeBlockLowlight
                .extend({
                    addNodeView() {
                        return ReactNodeViewRenderer(CodeBlockComponent as any)
                    },
                })
                .configure({ lowlight }),
            // Custom Subscribe Button Extension
            Node.create({
                name: 'subscribe',
                group: 'block',
                atom: true,
                draggable: false,
                parseHTML() {
                    return [
                        {
                            tag: 'subscribe',
                        },
                    ];
                },
                renderHTML({ HTMLAttributes }) {
                    return ['subscribe', mergeAttributes(HTMLAttributes, { class: 'flex justify-center' }), [
                        'button',
                        { class: 'bg-secondary hover:secondary text-white font-bold py-2 px-4 rounded-lg my-2 inline-block item-center' },
                        'Subscribe'
                    ]];
                },
                addCommands() {
                    return {
                        insertSubscribe: () => ({ commands }: { commands: any }) => {
                            return commands.insertContent({
                                type: this.name,
                            });
                        },
                    } as Partial<RawCommands>;
                },
                addNodeView() {
                    return ReactNodeViewRenderer(SubscribeButtonComponent);
                },
            }),
            // Custom Share Post Button Extension
            Node.create({
                name: 'share-post',
                group: 'block',
                atom: true,
                draggable: false,
                parseHTML() {
                    return [
                        {
                            tag: 'share-post',
                        },
                    ];
                },
                renderHTML({ HTMLAttributes }) {
                    return ['share-post', mergeAttributes(HTMLAttributes, { class: 'flex justify-center' }), [
                        'button',
                        { class: 'bg-secondary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg my-2 inline-block' },
                        'Share Post'
                    ]];
                },
                addCommands() {
                    return {
                        insertSharePost: () => ({ commands }: { commands: any }) => {
                            return commands.insertContent({
                                type: this.name,
                            });
                        },
                    } as Partial<RawCommands>;
                },
                addNodeView() {
                    return ReactNodeViewRenderer(SharePostButtonComponent);
                },
            }),
            // Custom Share Publication Button Extension
            Node.create({
                name: 'share-publication',
                group: 'block',
                atom: true,
                draggable: false,
                parseHTML() {
                    return [
                        {
                            tag: 'share-publication',
                        },
                    ];
                },
                renderHTML({ HTMLAttributes }) {
                    return ['share-publication', mergeAttributes(HTMLAttributes, { class: 'flex justify-center' }), [
                        'button',
                        { class: 'bg-secondary hover:secondary text-white font-bold py-2 px-4 rounded-lg my-2 inline-block' },
                        'Share Publication'
                    ]];
                },
                addCommands() {
                    return {
                        insertSharePublication: () => ({ commands }: { commands: any }) => {
                            return commands.insertContent({
                                type: this.name,
                            });
                        },
                    } as Partial<RawCommands>;
                },
                addNodeView() {
                    return ReactNodeViewRenderer(SharePublicationButtonComponent);
                },
            }),
            // Custom Comment Button Extension
            Node.create({
                name: 'comment',
                group: 'block',
                atom: true,
                draggable: false,
                parseHTML() {
                    return [
                        {
                            tag: 'comment',
                        },
                    ];
                },
                renderHTML({ HTMLAttributes }) {
                    return ['comment', mergeAttributes(HTMLAttributes, { class: 'flex justify-center' }), [
                        'button',
                        { class: 'bg-secondary hover:secondary text-white font-bold py-2 px-4 rounded-lg my-2 inline-block' },
                        'Leave A Comment'
                    ]];
                },
                addCommands() {
                    return {
                        insertComment: () => ({ commands }: { commands: any }) => {
                            return commands.insertContent({
                                type: this.name,
                            });
                        },
                    } as Partial<RawCommands>;
                },
                addNodeView() {
                    return ReactNodeViewRenderer(CommentButtonComponent);
                },
            }),
            // Custom Send Message Button Extension
            Node.create({
                name: 'send-message',
                group: 'block',
                atom: true,
                draggable: false,
                parseHTML() {
                    return [
                        {
                            tag: 'send-message',
                        },
                    ];
                },
                renderHTML({ HTMLAttributes }) {
                    return ['send-message', mergeAttributes(HTMLAttributes, { class: 'flex justify-center' }), [
                        'button',
                        { class: 'bg-secondary hover:secondary text-white font-bold py-2 px-4 rounded-lg my-2 inline-block' },
                        'Send Message'
                    ]];
                },
                addCommands() {
                    return {
                        insertSendMessage: () => ({ commands }: { commands: any }) => {
                            return commands.insertContent({
                                type: this.name,
                            });
                        },
                    } as Partial<RawCommands>;
                },
                addNodeView() {
                    return ReactNodeViewRenderer(SendMessageButtonComponent);
                },
            }),
            // Custom Form Button Extension
            Node.create({
                name: 'form',
                group: 'block',
                atom: true,
                draggable: false,
                parseHTML() {
                    return [
                        {
                            tag: 'form',
                        },
                    ];
                },
                renderHTML({ HTMLAttributes }) {
                    return ['form', mergeAttributes(HTMLAttributes, { class: 'flex justify-center' }), [
                        'button',
                        { class: 'bg-secondary hover:secondary text-white font-bold py-2 px-4 rounded-lg my-2 inline-block' },
                        'Form'
                    ]];
                },
                addCommands() {
                    return {
                        insertForm: () => ({ commands }: { commands: any }) => {
                            return commands.insertContent({
                                type: this.name,
                            });
                        },
                    } as Partial<RawCommands>;
                },
                addNodeView() {
                    return ReactNodeViewRenderer(FormButtonComponent);
                },
            }),
            // Custom Refer Writer Button Extension
            Node.create({
                name: 'refer-writer',
                group: 'block',
                atom: true,
                draggable: false,
                parseHTML() {
                    return [
                        {
                            tag: 'refer-writer',
                        },
                    ];
                },
                renderHTML({ HTMLAttributes }) {
                    return ['refer-writer', mergeAttributes(HTMLAttributes, { class: 'flex justify-center' }), [
                        'button',
                        { class: 'bg-secondary hover:secondary text-white font-bold py-2 px-4 rounded-lg my-2 inline-block' },
                        'Refer Writer'
                    ]];
                },
                addCommands() {
                    return {
                        insertReferWriter: () => ({ commands }: { commands: any }) => {
                            return commands.insertContent({
                                type: this.name,
                            });
                        },
                    } as Partial<RawCommands>;
                },
                addNodeView() {
                    return ReactNodeViewRenderer(ReferWriterButtonComponent);
                },
            }),
            // Custom Link To Survey Button Extension
            Node.create({
                name: 'link-to-survey',
                group: 'block',
                atom: true,
                draggable: false,
                parseHTML() {
                    return [
                        {
                            tag: 'link-to-survey',
                        },
                    ];
                },
                renderHTML({ HTMLAttributes }) {
                    return ['link-to-survey', mergeAttributes(HTMLAttributes, { class: 'flex justify-center' }), [
                        'button',
                        { class: 'bg-secondary hover:bg-secondary text-white font-bold py-2 px-4 rounded-lg my-2 inline-block' },
                        'Link To Survey'
                    ]];
                },
                addCommands() {
                    return {
                        insertLinkToSurvey: () => ({ commands }: { commands: any }) => {
                            return commands.insertContent({
                                type: this.name,
                            });
                        },
                    } as Partial<RawCommands>;
                },
                addNodeView() {
                    return ReactNodeViewRenderer(LinkToSurveyButtonComponent);
                },
            }),
        ],
        editorProps: {
            attributes: {
                class: 'focus:outline-none p-5 prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto max-w-[800px] w-full [&_audio]:w-full [&_audio]:my-4 [&_audio]:rounded-lg [&_audio]:shadow-md [&_audio]:bg-gray-50 [&_audio]:dark:bg-gray-800 [&_audio]:p-2 [&_audio]:border [&_audio]:border-gray-200 [&_audio]:dark:border-gray-700 [&_audio_container]:my-4 [&_audio_container]:w-full [&_audio_container]:flex [&_audio_container]:justify-center [&_video]:w-full [&_video]:my-4 [&_video]:rounded-lg [&_video]:shadow-md [&_video]:bg-gray-50 [&_video]:dark:bg-gray-800 [&_video]:border [&_video]:border-gray-200 [&_video]:dark:border-gray-700 [&_video_container]:my-4 [&_video_container]:w-full [&_video_container]:flex [&_video_container]:justify-center',
            },
        },
        autofocus: true,
        content: ``,
    })

    if (!editor) {
        return null;
    }

    return (
        <div className="w-full h-screen">
            <RichTextEditor editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
