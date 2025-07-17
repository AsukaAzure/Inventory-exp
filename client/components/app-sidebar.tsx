"use client"

import { Users, FileText, Package, Home, X } from "lucide-react"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  currentPage: string
  onNavigate: (page: string) => void
}

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    id: "dashboard",
  },
  {
    title: "Sections",
    icon: Package,
    id: "sections",
  },
  {
    title: "Employees",
    icon: Users,
    id: "employees",
  },
  {
    title: "Logs",
    icon: FileText,
    id: "logs",
  },
]

export function AppSidebar({ currentPage, onNavigate }: AppSidebarProps) {
  const { setOpen, setOpenMobile, isMobile } = useSidebar()

  const handleNavigate = (page: string) => {
    onNavigate(page)
    // Close sidebar after navigation on all devices
    if (isMobile) {
      setOpenMobile(false)
    } else {
      setOpen(false)
    }
  }

  const handleClose = () => {
    if (isMobile) {
      setOpenMobile(false)
    } else {
      setOpen(false)
    }
  }

  const router = useRouter();
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("currentPage");
    router.push("/loginpage");
  };

  return (
    <Sidebar className="bg-slate-800 border-slate-700">
      <SidebarHeader className="p-4 flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold text-white">Inventory System</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="text-slate-400 hover:text-white hover:bg-slate-700"
        >
          <X className="h-4 w-4" />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleNavigate(item.id)}
                    isActive={currentPage === item.id}
                    className="text-slate-300 hover:text-white hover:bg-slate-700 data-[active=true]:bg-blue-600 data-[active=true]:text-white"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <Button
            className="bg-red-500 rounded-none hover:bg-red-700 text-white"
            onClick={handleLogout}
          >
            Log Out
          </Button>
    </Sidebar>
  )
}
