"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { CreateSectionModal } from "@/components/create-section-modal"
import { SectionDetail } from "@/components/section-detail"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface Section {
  id: string
  name: string
  description: string
  itemCount: number
  createdAt: string
}

export default function SectionsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL

  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState<Section | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/sections`)
        const mappedSections: Section[] = response.data.map((section: any) => ({
          id: String(section._id),
          name: section.sectionname,
          description: section.desc,
          itemCount: section.items,
          createdAt: section.createdAt,
        }))
        setSections(mappedSections)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching sections:", err)
        setError("Failed to load sections")
        setLoading(false)
      }
    }

    fetchSections()
  }, [])

  const totalItems = sections.reduce((sum, section) => sum + section.itemCount, 0)

  const handleCreateSection = async (name: string, description: string) => {
  try {
    // 1️⃣ Create section
    const response = await axios.post(`${baseUrl}/api/sections`, {
      sectionname: name,
      desc: description,
    })

    const newSection = response.data

    const formatted: Section = {
      id: String(newSection._id),
      name: newSection.sectionname,
      description: newSection.desc,
      itemCount: newSection.items || 0,
      createdAt: newSection.createdAt,
    }

    setSections([formatted, ...sections])
    setIsCreateModalOpen(false)

    // 2️⃣ Log the activity
    const userString = sessionStorage.getItem("user")
    let username = "unknown"
    if (userString) {
      try {
        const user = JSON.parse(userString)
        username = user.username || "unknown"
      } catch (err) {
        console.error("Failed to parse user from sessionStorage:", err)
      }
    }

    await axios.post(`${baseUrl}/api/logs/create`, {
      username,
      activity: `created ${name} section`,
      count: 0,
      createdBy: username,
      updatedBy: null
    })

  } catch (err) {
    console.error("Error creating section:", err)
    alert("Failed to create section. Please try again.")
  }
}


  const handleDeleteSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId))
    setSelectedSection(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-xl">Loading sections...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (selectedSection) {
    return (
      <SectionDetail
        section={selectedSection}
        onBack={() => setSelectedSection(null)}
        onDeleteSection={handleDeleteSection}
        onUpdateSection={(updatedSection) => {
          setSections(sections.map((s) => (s.id === updatedSection.id ? updatedSection : s)))
          setSelectedSection(updatedSection)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
  <div className="flex items-center gap-4">
    <SidebarTrigger className="text-white hover:bg-slate-700" />
    <h1 className="text-xl sm:text-3xl font-bold text-white">Inventory Dashboard</h1>
  </div>
  <Button
    onClick={() => setIsCreateModalOpen(true)}
    className="bg-blue-600 hover:bg-blue-700"
  >
    Create New Section
  </Button>
</div>


        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Total Sections</CardDescription>
              <CardTitle className="text-4xl font-bold">{sections.length}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Total Items</CardDescription>
              <CardTitle className="text-4xl font-bold">{totalItems}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardDescription className="text-slate-400">Recent Updates</CardDescription>
              <CardTitle className="text-4xl font-bold">Active</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Sections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...sections]
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .slice(0, 3)
              .map((section) => (
                <Card
                  key={section.id}
                  className="bg-slate-800 border-slate-700 cursor-pointer hover:bg-slate-750 transition-colors"
                  onClick={() => setSelectedSection(section)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{section.name}</CardTitle>
                    <CardDescription className="text-slate-400">{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{section.itemCount} items</span>
                      <Button
                        variant="link"
                        className="text-blue-400 hover:text-blue-300 p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedSection(section)
                        }}
                      >
                        View details →
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* All Sections */}
        <div>
          <h2 className="text-2xl font-bold mb-4">All Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sections.map((section) => (
              <Card
                key={section.id}
                className="bg-slate-800 border-slate-700 cursor-pointer hover:bg-slate-750 transition-colors"
                onClick={() => setSelectedSection(section)}
              >
                <CardHeader>
                  <CardTitle className="text-lg">{section.name}</CardTitle>
                  <CardDescription className="text-slate-400 text-sm">{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">{section.itemCount} items</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <CreateSectionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateSection}
        />
      </div>
    </div>
  )
}