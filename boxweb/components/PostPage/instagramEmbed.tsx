import { NodeViewProps, NodeViewWrapper } from '@tiptap/react'
import { InstagramEmbed } from 'react-social-media-embed'

export default function InstagramComponent({ node }: NodeViewProps) {
    const url = node.attrs.url
  
    return (
      <NodeViewWrapper className='instagram-react-component flex justify-center items-center my-4'>
        <div className="max-w-[550px] w-full">
          <InstagramEmbed url={url} width={550} />
        </div>
      </NodeViewWrapper>
    )
} 