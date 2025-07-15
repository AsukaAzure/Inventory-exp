"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, UserPlus } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { AddEmployeeModal } from "@/components/add-employee-modal"
import { useRole } from "@/context/RoleContext"

interface Employee {
  id: string
  username: string
  email: string
  role: string
}

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { role } = useRole()

  useEffect(() => {
    console.log(role)
    const fetchEmployees = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/auth/users")
        const data = await res.json()
        const formatted = data.map((u: any) => ({
          id: u._id,
          username: u.username,
          email: u.email,
          role: u.role
        }))
        setEmployees(formatted)
      } catch (err) {
        console.error("Failed to fetch users:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const handleAddEmployee = (username: string, email: string, password: string) => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      username,
      email,
      role
    }
    setEmployees([...employees, newEmployee])
    setIsAddModalOpen(false)
  }

  const handleDeleteEmployee = async (id: string) => {
    const employee = employees.find((emp) => emp.id === id)
    if (!employee) return

    if (confirm(`Are you sure you want to delete employee "${employee.username}"?`)) {
      try {
        const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
          method: "DELETE"
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || "Failed to delete")
        }
        setEmployees(employees.filter((emp) => emp.id !== id))
      } catch (err: any) {
        console.error(err)
        alert("Error deleting user: " + err.message)
      }
    }
  }

  return (
    <div className="w-full p-3 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-white hover:bg-slate-700" />
          <h1 className="text-xl sm:text-3xl font-bold text-white">Employee Management</h1>
        </div>
        {role !== "user" && (
          <Button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <UserPlus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Add Employee</span>
          </Button>
        )}
      </div>

      {loading ? (
        <p className="text-slate-400">Loading employees...</p>
      ) : (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {employees.map((employee) => (
            <Card key={employee.id} className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg text-white truncate">{employee.username}</CardTitle>
                <p className="text-slate-400 text-sm truncate">{employee.email}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-xs sm:text-sm">Role: {employee.role}</span>
                  {role !== "user" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEmployee(employee.id)}
                      className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-slate-700 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {role !== "user" && (
        <AddEmployeeModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddEmployee}
        />
      )}
    </div>
  )
}
