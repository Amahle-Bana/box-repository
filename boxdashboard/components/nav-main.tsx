"use client"

import type { Icon as TablerIcon } from "@tabler/icons-react"
import type { LucideIcon } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  selectedDashboard,
  onDashboardChange,
}: {
  items: {
    title: string
    url: string
    icon?: TablerIcon | LucideIcon
    key: string
  }[]
  selectedDashboard?: string
  onDashboardChange?: (dashboard: string) => void
}) {
  const handleItemClick = (key: string) => {
    if (onDashboardChange) {
      onDashboardChange(key)
    }
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton 
                tooltip={item.title}
                onClick={() => handleItemClick(item.key)}
                className={selectedDashboard === item.key ? "bg-accent" : ""}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
