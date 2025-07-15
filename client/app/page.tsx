"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardPage } from "@/components/dashboard-page"
import { EmployeesPage } from "@/components/employees-page"
import { LogsPage } from "@/components/logs-page"
import SectionsPage from "@/components/sections-page"

export default function InventoryDashboard() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem("currentPage") || "dashboard"
  })

  useEffect(() => {
    const token = sessionStorage.getItem("token")
    if (!token) {
      router.push("/loginpage")
    }
  }, [router])

  const handleNavigate = (page: string) => {
    setCurrentPage(page)
    localStorage.setItem("currentPage", page)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />
      case "sections":
        return <SectionsPage />
      case "employees":
        return <EmployeesPage />
      case "logs":
        return <LogsPage />
      default:
        return <DashboardPage />
    }
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full bg-slate-900">
        <AppSidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <SidebarInset className="flex-1 w-full">
          <div className="w-full min-h-screen bg-slate-900">{renderCurrentPage()}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
