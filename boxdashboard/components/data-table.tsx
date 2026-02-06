"use client"

import * as React from "react"
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core"
import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconGripVertical,
  IconLayoutColumns,
  IconLoader,
  IconPlus,
  IconTrendingUp,
} from "@tabler/icons-react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"
import { useState } from "react"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const schema = z.object({
  id: z.number(),
  user: z.object({
    id: z.number(),
    username: z.string(),
    profile_picture: z.string().nullable(),
  }).optional(),
  username: z.string().optional(),
  profile_picture: z.string().nullable().optional(),
  content: z.string().optional(),
  images: z.array(z.string()).optional().default([]),
  videos: z.array(z.string()).optional().default([]),
  is_anonymous: z.boolean().optional(),
  user_data: z.object({
    username: z.string(),
    email: z.string(),
    fullName: z.string(),
    profilePicture: z.string().nullable(),
  }).nullable().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  upvotes: z.number().optional(),
  downvotes: z.number().optional(),
  comments: z.array(z.any()).optional().default([]),
})

// Create a separate component for the drag handle
function DragHandle({ id }: { id: number }) {
  const { attributes, listeners } = useSortable({
    id,
  })

  return (
    <Button
      {...attributes}
      {...listeners}
      variant="ghost"
      size="icon"
      className="text-muted-foreground size-7 hover:bg-transparent"
    >
      <IconGripVertical className="text-muted-foreground size-3" />
      <span className="sr-only">Drag to reorder</span>
    </Button>
  )
}



function DraggableRow({ row }: { row: Row<z.infer<typeof schema>> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function DataTable({
  data: initialData,
  onDelete,
}: {
  data: z.infer<typeof schema>[]
  onDelete?: (postId: number) => void
}) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const [deletingPostId, setDeletingPostId] = useState<number | null>(null)
  const sortableId = React.useId()
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  )

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  )

  const columns: ColumnDef<z.infer<typeof schema>>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "username",
      header: "User",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
            {user.profile_picture && (
              <img
                src={user.profile_picture}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <div className="font-medium">{user.username}</div>
              {user.is_anonymous && (
                <Badge variant="outline" className="text-xs">
                  Anonymous
                </Badge>
              )}
            </div>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "content",
      header: "Content",
      cell: ({ row }) => {
        return <TableCellViewer item={row.original} />
      },
      enableHiding: false,
    },
    {
      id: "media",
      header: "Media",
      cell: ({ row }) => {
        const { images, videos } = row.original;
        const imagesArray = Array.isArray(images) ? images : [];
        const videosArray = Array.isArray(videos) ? videos : [];
        const totalMedia = imagesArray.length + videosArray.length;
        return (
          <div className="flex gap-1">
            {imagesArray.length > 0 && (
              <Badge variant="outline" className="text-xs">
                📷 {imagesArray.length}
              </Badge>
            )}
            {videosArray.length > 0 && (
              <Badge variant="outline" className="text-xs">
                🎥 {videosArray.length}
              </Badge>
            )}
            {totalMedia === 0 && <span className="text-muted-foreground text-sm">None</span>}
          </div>
        );
      },
    },
    {
      id: "engagement",
      header: "Engagement",
      cell: ({ row }) => {
        const { upvotes, downvotes, comments } = row.original;
        return (
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs text-green-600">
              👍 {upvotes}
            </Badge>
            <Badge variant="outline" className="text-xs text-red-600">
              👎 {downvotes}
            </Badge>
            <Badge variant="outline" className="text-xs">
              💬 {Array.isArray(comments) ? comments.length : 0}
            </Badge>
          </div>
        );
      },
    },
    {
      accessorKey: "created_at",
      header: "Created",
      cell: ({ row }) => {
        const date = new Date(row.original.created_at || new Date());
        return <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()} {date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const postId = row.original.id
        const isDeleting = deletingPostId === postId

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
                size="icon"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <IconLoader className="animate-spin" />
                ) : (
                  <IconDotsVertical />
                )}
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                variant="destructive"
                onClick={() => {
                  console.log('Delete button clicked for post ID:', postId)
                  handleDeletePost(postId)
                }}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  async function handleDeletePost(postId: number) {
    console.log('=== Starting delete post process ===')
    console.log('Post ID to delete:', postId)

    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      console.log('User cancelled delete operation')
      return
    }

    setDeletingPostId(postId)
    console.log('Set deleting state for post:', postId)

    try {
      // Get JWT token from localStorage (stored as 'jwt_token')
      const token = localStorage.getItem('jwt_token')

      console.log('Delete post - Token found:', !!token)
      console.log('Delete post - Token value (first 20 chars):', token ? token.substring(0, 20) + '...' : 'null')
      console.log('Delete post - Post ID:', postId)

      if (!token) {
        console.error('Delete post - No JWT token found in localStorage')
        console.log('Available localStorage keys:', Object.keys(localStorage))
        toast.error('Authentication required. Please log in again.')
        return
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/somaapp/delete-post/${postId}/`
      console.log('Delete post - API URL:', apiUrl)

      const response = await fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      console.log('Delete post - Response status:', response.status)
      console.log('Delete post - Response ok:', response.ok)

      if (response.ok) {
        const result = await response.json()
        console.log('Delete post - Success response:', result)
        toast.success('Post deleted successfully')

              // Remove the post from the local state
        setData(prevData => prevData.filter(post => post.id !== postId))

        // Call the onDelete callback if provided
        if (onDelete) {
          onDelete(postId)
        }
      } else {
        let errorResult
        try {
          errorResult = await response.json()
          console.log('Delete post - Error response:', errorResult)
        } catch (e) {
          console.log('Delete post - Could not parse error response as JSON')
          errorResult = { error: `HTTP ${response.status}: ${response.statusText}` }
        }
        console.error('Delete post failed with status:', response.status, 'Response:', errorResult)
        toast.error(errorResult.error || 'Failed to delete post')
      }
    } catch (error) {
      console.error('Network error during delete post:', error)
      toast.error('Network error. Please try again.')
    } finally {
      console.log('Delete post process completed for post ID:', postId)
      setDeletingPostId(null)
    }
  }

  // Debug functions for testing (can be called from browser console)
  React.useEffect(() => {
    // @ts-ignore
    window.testDeleteAPI = async (postId: number) => {
      console.log('=== Testing Delete API ===')
      const token = localStorage.getItem('jwt_token')
      console.log('Token found:', !!token)

      if (!token) {
        console.error('No JWT token found')
        return
      }

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/somaapp/delete-post/${postId}/`
      console.log('API URL:', apiUrl)

      try {
        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        console.log('Response status:', response.status)
        const result = await response.json()
        console.log('Response:', result)
      } catch (error) {
        console.error('Test API error:', error)
      }
    }

    // @ts-ignore
    window.checkAuthStatus = () => {
      console.log('=== Checking Authentication Status ===')
      const token = localStorage.getItem('jwt_token')
      console.log('JWT Token exists:', !!token)
      console.log('Token (first 20 chars):', token ? token.substring(0, 20) + '...' : 'null')
      console.log('All localStorage keys:', Object.keys(localStorage))
    }

    // @ts-ignore
    window.testGetPosts = async () => {
      console.log('=== Testing Get Posts API ===')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/somaapp/get-all-posts/`)
      console.log('Response status:', response.status)
      const result = await response.json()
      console.log('Response:', result)
    }
  }, [])

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <Label htmlFor="view-selector" className="sr-only">
          View
        </Label>
        <Select defaultValue="outline">
          <SelectTrigger
            className="flex w-fit @4xl/main:hidden"
            size="sm"
            id="view-selector"
          >
            <SelectValue placeholder="Select a view" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
        <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
          <TabsTrigger value="outline">Posts</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconLayoutColumns />
                <span className="hidden lg:inline">Customize Columns</span>
                <span className="lg:hidden">Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" &&
                    column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <IconChevronsLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <IconChevronLeft />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <IconChevronRight />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <IconChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  )
}

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()

  // Safe defaults for potentially undefined values
  const content = item.content || "";
  const username = item.username || "Unknown User";
  const isAnonymous = item.is_anonymous || false;
  const profilePicture = item.profile_picture || null;
  const createdAt = item.created_at || new Date().toISOString();
  const userData = item.user_data || null;
  const upvotes = item.upvotes || 0;
  const downvotes = item.downvotes || 0;
  const images = Array.isArray(item.images) ? item.images : [];
  const videos = Array.isArray(item.videos) ? item.videos : [];
  const comments = Array.isArray(item.comments) ? item.comments : [];
  const updatedAt = item.updated_at || createdAt;

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {content.length > 50 ? content.substring(0, 50) + "..." : content}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>Post Details</DrawerTitle>
          <DrawerDescription>
            Posted by {isAnonymous ? "Anonymous" : username} on {new Date(createdAt).toLocaleDateString()}
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {profilePicture && (
              <img
                src={profilePicture}
                alt={username}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div>
              <div className="font-medium">{isAnonymous ? "Anonymous User" : username}</div>
              <div className="text-sm text-muted-foreground">
                {userData?.fullName && !isAnonymous ? userData.fullName : ""}
              </div>
            </div>
          </div>

          {/* Post Content */}
          <div className="space-y-2">
            <Label>Content</Label>
            <div className="p-3 bg-muted rounded-lg whitespace-pre-wrap">
              {content}
            </div>
          </div>

          {/* Media */}
          {(images.length > 0 || videos.length > 0) && (
            <div className="space-y-2">
              <Label>Media</Label>
              <div className="grid grid-cols-2 gap-2">
                {images.map((image, index) => (
                  <div key={`image-${index}`} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">📷 Image {index + 1}</span>
                  </div>
                ))}
                {videos.map((video, index) => (
                  <div key={`video-${index}`} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">🎥 Video {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Engagement Stats */}
          <div className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">👍 {upvotes}</div>
              <div className="text-sm text-muted-foreground">Upvotes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">👎 {downvotes}</div>
              <div className="text-sm text-muted-foreground">Downvotes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">💬 {comments.length}</div>
              <div className="text-sm text-muted-foreground">Comments</div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <Label>Created</Label>
              <div>{new Date(createdAt).toLocaleString()}</div>
            </div>
            <div>
              <Label>Last Updated</Label>
              <div>{new Date(updatedAt).toLocaleString()}</div>
            </div>
          </div>
        </div>
        <DrawerFooter>
          <Button variant="outline">Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
