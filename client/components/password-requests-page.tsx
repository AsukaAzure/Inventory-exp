"use client"

import { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface RequestEntry {
  id: string
  username: string
  email: string
  status: string
  createdAt: string
}

interface RequestFromAPI {
  _id: string;
  user?: { username: string };
  email: string;
  status: string;
  createdAt: string;
}

export function PasswordRequestsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
  const [requests, setRequests] = useState<RequestEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState<string>("")

  const token = typeof window !== "undefined" ? sessionStorage.getItem("token") : null

  const fetchRequests = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const response = await axios.get(`${baseUrl}/api/auth/password-change-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const items = response.data.map((request: RequestFromAPI) => ({
        id: String(request._id),
        username: request.user?.username || "Unknown",
        email: request.email,
        status: request.status,
        createdAt: new Date(request.createdAt).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      }))
      setRequests(items)
    } catch (err) {
      console.error("Failed to load password requests:", err)
      setError("Unable to fetch password requests. Make sure you are logged in as an admin.")
    } finally {
      setLoading(false)
    }
  }, [baseUrl, token])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleRequestAction = async (requestId: string, action: "approve" | "reject") => {
    setActionLoading(requestId)
    setError("")

    try {
      await axios.post(
        `${baseUrl}/api/auth/password-change-requests/${requestId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setRequests((current) => current.filter((request) => request.id !== requestId))
    } catch (err) {
      console.error(`Failed to ${action} request:`, err)
      setError(`Unable to ${action} this request.`)
    } finally {
      setActionLoading("")
    }
  }

  return (
    <div className="w-full p-3 sm:p-6">
      <div className="flex items-center gap-4 mb-6">
        <SidebarTrigger className="text-white hover:bg-slate-700" />
        <h1 className="text-xl sm:text-3xl font-bold text-white">Password Requests</h1>
      </div>

      <Card className="w-full bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Pending password approvals</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {loading ? (
            <p className="text-slate-400 p-4">Loading requests...</p>
          ) : error ? (
            <p className="text-red-400 p-4">{error}</p>
          ) : requests.length === 0 ? (
            <p className="text-slate-400 p-4">No pending password requests.</p>
          ) : (
            <div className="space-y-4 p-4">
              {requests.map((request) => (
                <div key={request.id} className="rounded-xl border border-slate-700 bg-slate-900 p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-white font-semibold">{request.username}</p>
                      <p className="text-slate-400 text-sm">{request.email}</p>
                      <p className="text-slate-400 text-sm">Requested: {request.createdAt}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3 sm:mt-0">
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        disabled={actionLoading === request.id}
                        onClick={() => handleRequestAction(request.id, "approve")}
                      >
                        {actionLoading === request.id ? "Processing..." : "Approve"}
                      </Button>
                      <Button
                        variant="secondary"
                        className="bg-red-600 hover:bg-red-700"
                        disabled={actionLoading === request.id}
                        onClick={() => handleRequestAction(request.id, "reject")}
                      >
                        {actionLoading === request.id ? "Processing..." : "Reject"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
