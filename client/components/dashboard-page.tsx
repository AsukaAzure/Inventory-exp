"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, Activity, TrendingUp } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function DashboardPage() {
  const router = useRouter()
  const [counts, setCounts] = useState({
    sections: 0,
    items: 0,
    employees: 0,
    logs: 0
  })

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sectionsRes, itemsRes, employeesRes, logsRes] = await Promise.all([
          axios.get(`${baseUrl}/api/sections`),
          axios.get(`${baseUrl}/api/items`),
          axios.get(`${baseUrl}/api/employees`),
          axios.get(`${baseUrl}/api/logs`)
        ])

        setCounts({
          sections: sectionsRes.data.length || 0,
          items: itemsRes.data.length || 0,
          employees: employeesRes.data.length || 0,
          logs: logsRes.data.length || 0
        })
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err)
      }
      const shouldReload = sessionStorage.getItem("triggerReload")

      if (shouldReload) {
        sessionStorage.removeItem("triggerReload");
        window.location.reload()
      }
    }

    fetchData()
  }, [baseUrl])

  const handleLogout = () => {
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("user")
    localStorage.removeItem("currentPage")
    router.push("/loginpage")
  }

  return (
    <div className="w-full p-3 sm:p-6 relative">
      {/* Logout button in top right */}
      <div className="absolute top-4 right-6 z-10">
        <Button
          className="bg-red-500 hover:bg-red-700 text-white"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger className="text-white hover:bg-slate-700" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard Overview</h1>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Sections */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Sections</CardTitle>
            <Package className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{counts.sections}</div>
            <p className="text-xs text-slate-400">Active inventory sections</p>
          </CardContent>
        </Card>

        {/* Total Items */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Items</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{counts.items}</div>
            <p className="text-xs text-slate-400">Items across all sections</p>
          </CardContent>
        </Card>

        {/* Total Employees */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Employees</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{counts.employees}</div>
            <p className="text-xs text-slate-400">Active team members</p>
          </CardContent>
        </Card>

        {/* Total Logs */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Total Logs</CardTitle>
            <Activity className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{counts.logs}</div>
            <p className="text-xs text-slate-400">Activity records</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
