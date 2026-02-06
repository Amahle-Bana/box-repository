"use client"

import * as React from "react"
import {
  IconCamera,
  IconEdit,
  IconFileAi,
  IconFileDescription,
  IconFileText,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEffect } from "react"
import { ChartColumnBig, UsersRound, UserRound } from "lucide-react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: ChartColumnBig,
      key: "dashboard",
    },
    {
      title: "Party Registration",
      url: "#",
      icon: UsersRound,
      key: "Party Registration",
    },
    {
      title: "Counciller Registration",
      url: "#",
      icon: UserRound,
      key: "Counciller Registration",
    },
    {
      title: "Edit Party/Counciller",
      url: "#",
      icon: IconEdit,
      key: "Edit Party/Counciller",
    },
    {
      title: "User Posts",
      url: "#",
      icon: IconFileText,
      key: "User Posts",
    },

  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],

}

export function AppSidebar({ 
  selectedDashboard, 
  onDashboardChange, 
  ...props 
}: React.ComponentProps<typeof Sidebar> & {
  selectedDashboard?: string
  onDashboardChange?: (dashboard: string) => void
}) {

  useEffect(() => {
  }, []);
  
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <div className=" items-center">

              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain 
          items={data.navMain} 
          selectedDashboard={selectedDashboard}
          onDashboardChange={onDashboardChange}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
