import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { nodePasteRule, ReactNodeViewRenderer } from '@tiptap/react'
import { mergeAttributes, Node } from '@tiptap/core'
import { Tweet } from 'react-tweet'

export default function TweetComponent ({ node }: NodeViewProps) {
    const url = node.attrs.url
    const tweetIdRegex = /\/status\/(\d+)/g
    const id = tweetIdRegex.exec(url)?.[1]
  
    return (
      <NodeViewWrapper className='twitter-react-component flex justify-center items-center my-4'>
        <div className="max-w-[550px] w-full">
          <Tweet id={id || ''} />
        </div>
      </NodeViewWrapper>
    )
  }