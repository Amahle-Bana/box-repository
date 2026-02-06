import { z } from "zod"
import { schema as postSchema } from "@/components/data-table"

export interface Party {
  id: number
  party_name: string
  manifesto?: string
  party_leader?: string
  structure?: string
  logo?: string
  website?: string
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  youtube?: string
  tiktok?: string
  x?: string
  threads?: string
  votes?: number
  supporters_count?: number
}

export interface Candidate {
  id: number
  candidate_name: string
  manifesto?: string
  department?: string
  structure?: string
  profile_picture?: string
  website?: string
  facebook?: string
  twitter?: string
  instagram?: string
  linkedin?: string
  youtube?: string
  tiktok?: string
  x?: string
  threads?: string
  votes?: number
  supporters_count?: number
}

export type Post = z.infer<typeof postSchema>

