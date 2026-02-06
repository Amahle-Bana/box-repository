"use client"

// Imports
import React, { useCallback, useState } from 'react';
import { Editor, EditorContent, useEditor } from '@tiptap/react';
import { ChevronLeftIcon, Redo2, Undo2, Bold, Italic, Strikethrough, Underline, Highlighter, Link as LinkIcon, Image as ImageIcon, Mic, Video, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Bell, Share2, Share, MessageSquare, Send, FileText, UserPlus, Link2, Code2, BarChart3, BookOpen, Minus, FileTextIcon, BarChart2, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6, Quote, Type, Subscript, Superscript, Table2, Youtube, Twitter, Instagram, Menu, Info, FileStack, Settings, Eye, Facebook, ChevronUp } from 'lucide-react';
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
import { Link as LinkEditor } from '@tiptap/extension-link'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Image as ImageExtension } from '@tiptap/extension-image';
import { CodeBlock } from '@tiptap/extension-code-block';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import Dropcursor from '@tiptap/extension-dropcursor';
import Image from '@tiptap/extension-image';
import Gapcursor from '@tiptap/extension-gapcursor';
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import TableRow from '@tiptap/extension-table-row'
import { Youtube as YoutubeExtension } from '@tiptap/extension-youtube';
import useWindowSize from "@/hooks/useWindow";
import Placeholder from '@tiptap/extension-placeholder';
import FontFamily from '@tiptap/extension-font-family';
import TextStyle from '@tiptap/extension-text-style';
import CharacterCount from '@tiptap/extension-character-count';
import { RawCommands } from '@tiptap/core';
import { mergeAttributes, Node } from '@tiptap/core';
import { nodePasteRule, ReactNodeViewRenderer } from '@tiptap/react';
import TweetComponent from './tweetEmbed';
import FacebookComponent from './facebookEmbed';
import InstagramComponent from './instagramEmbed';
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
// load all languages with "all" or common languages with "common"
import { all, createLowlight } from 'lowlight';
import { useRouter } from "next/navigation";
import MobileLinkDialog from './MobileLinkDialog';
import MobileImageDialog from './MobileImageDialog';
import AudioDialog from './MobileAudioDialog';
import VideoDialog from './MobileVideoDialog';
import { BubbleMenu } from '@tiptap/react';
import { DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent } from '../ui/dropdown-menu';



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

// create a lowlight instance
const lowlight = createLowlight(all)

// Youtube Embed Pop Up
const YoutubeDialog = ({ editor, open, onOpenChange }: { editor: Editor | null, open: boolean, onOpenChange: (open: boolean) => void }) => {
    const [url, setUrl] = useState('');

    React.useEffect(() => {
        if (open && editor) {
            const previousUrl = editor.getAttributes('youtube').src;
            setUrl(previousUrl || '');
        }
    }, [open, editor]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editor) return;

        if (url === '') {
            onOpenChange(false);
            return;
        }

        try {
            const urlWithProtocol = url.startsWith('http://') || url.startsWith('https://')
                ? url
                : `https://${url}`;

            editor
                .chain()
                .focus()
                .setYoutubeVideo({
                    src: urlWithProtocol,
                    width: 320,
                    height: 240,
                })
                .run();
            onOpenChange(false);
        } catch (e) {
            alert((e as Error).message);
        }
    };

    const handleClear = (e: React.FormEvent) => {
        e.preventDefault();
        setUrl('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Add Youtube Embed</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <Input
                            placeholder="Enter Youtube URL"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit" variant="outline" onClick={handleClear}>
                            Clear
                        </Button>
                        <Button type="submit">
                            Insert Video
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Mobile Rich Text Editor
const MobileRichTextEditor = ({ editor }: { editor: Editor | null }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [linkDialogOpen, setLinkDialogOpen] = useState(false);
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [buttonsOpen, setButtonsOpen] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);
    const [youtubeEmbedDialogOpen, setYoutubeEmbedDialogOpen] = useState(false);
    const [highlightOpen, setHighlightOpen] = useState(false);
    const [options, setOptions] = useState(false);
    const [audioDialogOpen, setAudioDialogOpen] = useState(false);
    const [videoDialogOpen, setVideoDialogOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [height, setHeight] = useState(480);

    const { width } = useWindowSize();

    // router
    const router = useRouter();

    const setLink = useCallback(() => {
        if (!editor) return;
        setLinkDialogOpen(true);
    }, [editor]);

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

    // Re-add helper functions if removed
    const sentenceCounter = (text: string) => {
        return text.split(/[\.\!\?]+(?:\s|$)/).filter((sentence: string) => sentence.trim().length > 0).length;
    }

    const readingTime = (text: string) => {
        const words = text.split(/\s+/).filter((word: string) => word.trim().length > 0).length;
        const minutes = words / 200;
        return Math.ceil(minutes);
    }

    return (

        <>
            <div className="p-2 border-b border-gray-300">
                {/* Basic Formatting Toolbar */}
                <div className="flex items-center justify-around gap-1 overflow-x-auto">
                    <div className="flex items-center gap-1 border-r border-primary pr-2">
                        <button className="p-1.5 rounded-[8px] hover:bg-blue-50 hover:text-blue-500">
                            <Undo2
                                onClick={() => editor.chain().focus().undo().run()}
                                className={`${width <= 360 ? 'w-3 h-3' : 'w-4 h-4'} ${!editor.can().undo() ? '' : 'text-blue-500'}`}
                            />
                        </button>
                        <button className="p-1.5 rounded-[8px] hover:bg-blue-50 hover:text-blue-500">
                            <Redo2
                                onClick={() => editor.chain().focus().redo().run()}
                                className={`${width <= 360 ? 'w-3 h-3' : 'w-4 h-4'}  ${!editor.can().redo() ? '' : 'text-blue-500'}`}
                            />
                        </button>
                    </div>

                    <div className="flex flex-row items-center gap-1">
                        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-1.5 rounded-[8px] ${editor.isActive('bold') ? 'is-active bg-blue-50 text-blue-500' : ' '}`}>
                            <Bold className={`${width <= 360 ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        </button>
                        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-1.5 rounded-[8px] ${editor.isActive('italic') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                            <Italic className={`${width <= 360 ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        </button>
                        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-1.5 rounded-[8px]  ${editor.isActive('strike') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                            <Strikethrough className={`${width <= 360 ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        </button>
                        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-1.5 rounded-[8px] ${editor.isActive('underline') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                            <Underline className={`${width <= 360 ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        </button>
                        <DropdownMenu open={highlightOpen} onOpenChange={setHighlightOpen}>
                            <DropdownMenuTrigger className={`p-1.5 rounded-[8px] ${editor.isActive('highlight') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                <Highlighter className={`${width <= 360 ? 'w-3 h-3' : 'w-4 h-4'}`} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40">
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
                                        className="flex items-center gap-2"
                                    >
                                        {color.value !== 'none' && (
                                            <div
                                                className={`w-4 h-4 rounded-full ${editor.isActive('highlight') ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                                                style={{ backgroundColor: color.value }}
                                            />
                                        )}
                                        {color.name}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Writing Dotted List, Numbered List Buttons */}
                        <div className="flex items-center gap-2 border-r border-primary pr-2">
                            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-1.5 rounded-[8px] ${editor.isActive('bulletList') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                <List className={`${width <= 360 ? 'w-3 h-3' : 'w-4 h-4'}`} />
                            </button>
                            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-1.5 rounded-[8px] ${editor.isActive('orderedList') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                <ListOrdered className={`${width <= 360 ? 'w-3 h-3' : 'w-4 h-4'}`} />
                            </button>
                        </div>
                    </div>



                    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                        <DropdownMenuTrigger className="p-1.5 rounded-sm hover:bg-gray-500/30">
                            <Menu className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-[200px]">
                            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`hover:bg-blue-50 hover:text-blue-500 font-playfair-display ${editor.isActive('heading', { level: 1 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                <Heading1 className="w-4 h-4 mr-2" />
                                Heading 1
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`hover:bg-blue-50 hover:text-blue-500 font-playfair-display ${editor.isActive('heading', { level: 2 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                <Heading2 className="w-4 h-4 mr-2" />
                                Heading 2
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`hover:bg-blue-50 hover:text-blue-500 font-playfair-display ${editor.isActive('heading', { level: 3 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                <Heading3 className="w-4 h-4 mr-2" />
                                Heading 3
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} className={`hover:bg-blue-50 hover:text-blue-500 font-playfair-display ${editor.isActive('heading', { level: 4 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                <Heading4 className="w-4 h-4 mr-2" />
                                Heading 4
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()} className={`hover:bg-blue-50 hover:text-blue-500 font-playfair-display ${editor.isActive('heading', { level: 5 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                <Heading5 className="w-4 h-4 mr-2" />
                                Heading 5
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()} className={`hover:bg-blue-50 hover:text-blue-500 font-playfair-display ${editor.isActive('heading', { level: 6 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
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
                            <DropdownMenuItem onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`hover:bg-blue-50 hover:text-blue-500 font-playfair-display ${editor.isActive('blockquote') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                                <Quote className="w-4 h-4 mr-2" />
                                Blockquote
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <div className="h-[30px] flex flex-row align-center justify-between">
                    <div className="border-r border-gray-500 pr-2">
                        <button onClick={setLink} className={`p-1.5 rounded-[8px] ${editor.isActive('link') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                            <LinkIcon className={`${width <= 360 ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        </button>
                        <button onClick={setImage} className={`p-2 rounded-[8px] hover:bg-blue-50 hover:text-blue-500 ${editor.isActive('image') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                            <ImageIcon className={`${width <= 360 ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        </button>
                        <button onClick={setAudio} className={`p-1.5 rounded-[8px]  ${editor.isActive('strike') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                            <Mic className={`${width <= 360 ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        </button>
                        <button onClick={setVideo} className={`p-2 rounded-[8px] ${editor.isActive('video') ? 'is-active bg-blue-50 text-blue-500' : ''}`}>
                            <Video className={`${width <= 360 ? 'w-3 h-3' : 'w-4 h-4'}`} />
                        </button>
                    </div>

                    {/* Buttons Dropdown */}
                    <DropdownMenu open={buttonsOpen} onOpenChange={setButtonsOpen}>
                        <DropdownMenuTrigger className=" w-[90px] font-playfair-display p-1 rounded-md bg-background text-primary text-center w-40 flex items-center justify-center gap-1 hover:bg-blue-50 hover:text-blue-500">
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

                    {/* More Dropdown */}
                    <DropdownMenu open={moreOpen} onOpenChange={setMoreOpen}>
                        <DropdownMenuTrigger className=" font-playfair-display p-1 w-[70px] rounded-md bg-background text-primary text-center w-40 flex items-center justify-center gap-1 hover:bg-blue-50 hover:text-blue-500">
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

                    {editor && <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                        <div className="bubble-menu gap-1">
                            <button
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('bold') ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                            >
                                <Bold className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('italic') ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                            >
                                <Italic className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleStrike().run()}
                                className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('strike') ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                            >
                                <Strikethrough className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                                className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('underline') ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                            >
                                <Underline className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().setParagraph().run()}
                                className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('paragraph') ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                            >
                                <Type className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                                className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('heading', { level: 1 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                            >
                                <Heading1 className="w-3 h-3" />
                            </button>
                            <button
                                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('heading', { level: 2 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                            >
                                <Heading2 className="w-3 h-3" />
                            </button>
                            <button
                                onClick={setLink}
                                // onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                                className={`hover:bg-blue-50 hover:text-blue-500 rounded-sm ${editor.isActive('heading', { level: 2 }) ? 'is-active bg-blue-50 text-blue-500' : ''}`}
                            >
                                <LinkIcon className="w-3 h-3" />
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
                </div>
            </div>
            <MobileLinkDialog
                editor={editor}
                open={linkDialogOpen}
                onOpenChange={setLinkDialogOpen}
            />
            <MobileImageDialog
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
            <YoutubeDialog
                editor={editor}
                open={youtubeEmbedDialogOpen}
                onOpenChange={setYoutubeEmbedDialogOpen}
            />

            {/* Mobile Footer Section */}
            <div className="fixed bottom-0 left-0 right-0 p-1 h-16 border-t border-gray-300 flex justify-around items-center bg-background">

                <ChevronLeftIcon className="h-5 w-5" onClick={() => router.back()} />

                <div className="flex gap-2">
                    <DropdownMenu open={options} onOpenChange={setOptions}>
                        <DropdownMenuTrigger className=" rounded-md bg-background text-primary text-center w-40 flex items-center justify-center gap-1 font-playfair-display">
                            Post Info
                            <ChevronUp className={`w-4 h-4 transition-transform duration-200 ${options ? 'rotate-180' : ''}`} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-50 font-playfair-display p-5">
                            <div className="grid gap-2">
                                <div className="flex justify-between">
                                    <span>Characters:</span>
                                    <span>{editor?.storage.characterCount.characters() ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Words:</span>
                                    <span>{editor?.storage.characterCount.words() ?? 0}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sentences:</span>
                                    <span>{sentenceCounter(editor?.getText() ?? '')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Reading Time:</span>
                                    <span>{readingTime(editor?.getText() ?? '')} min</span>
                                </div>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <button className="px-3 py-2 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 font-playfair-display" onClick={() => router.push('/post/articleDetails')}>
                    Continue
                </button>
            </div>
        </>
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
            <MobileRichTextEditor editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
} 