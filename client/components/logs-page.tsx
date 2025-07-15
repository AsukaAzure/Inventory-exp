"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface LogEntry {
  id: string
  username: string
  activity: string
  time: string
}

export function LogsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/logs`)
        const mappedLogs: LogEntry[] = response.data.map((log: any) => ({
          id: String(log._id),
          username: log.username,
          activity: log.activity,
          time: new Date(log.createdAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).replace(",", "")
        }))
        setLogs(mappedLogs)
      } catch (err) {
        console.error("Error fetching logs:", err)
        setError("Failed to load activity logs.")
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [baseUrl])

  return (
    <div className="w-full p-3 sm:p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger className="text-white hover:bg-slate-700" />
        <h1 className="text-xl sm:text-3xl font-bold text-white">Activity Logs</h1>
      </div>

      <Card className="w-full bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">

          {loading ? (
            <p className="text-slate-400 p-4">Loading logs...</p>
          ) : error ? (
            <p className="text-red-400 p-4">{error}</p>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="block sm:hidden">
                {logs.map((log) => (
                  <div key={log.id} className="border-b border-slate-700 p-4 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-white font-medium text-sm">{log.username}</span>
                      <span className="text-slate-400 text-xs">{log.time.split(" ")[1]}</span>
                    </div>
                    <p className="text-slate-300 text-sm mb-1">{log.activity}</p>
                    <p className="text-slate-400 text-xs">{log.time.split(" ")[0]}</p>
                  </div>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Username</TableHead>
                      <TableHead className="text-slate-300">Activity</TableHead>
                      <TableHead className="text-slate-300">Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.id} className="border-slate-700 hover:bg-slate-750">
                        <TableCell className="text-white font-medium">{log.username}</TableCell>
                        <TableCell className="text-slate-300">{log.activity}</TableCell>
                        <TableCell className="text-slate-400">{log.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
