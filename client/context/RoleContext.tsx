"use client"

import { createContext, useContext, useState, useEffect } from "react"

type RoleContextType = {
  role: string
  setRole: (role: string) => void
  loading: boolean
}

const RoleContext = createContext<RoleContextType>({
  role: "user",
  setRole: () => {},
  loading: true,
})

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState("user")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userString = sessionStorage.getItem("user")
    if (userString) {
      try {
        const user = JSON.parse(userString)
        if (user && user.role) {
          setRoleState(user.role)
        }
      } catch (err) {
        console.error("Failed to parse user from sessionStorage:", err)
      }
    }
    setLoading(false)
  }, [])

  const setRole = (newRole: string) => {
    setRoleState(newRole)
  }

  return (
    <RoleContext.Provider value={{ role, setRole, loading }}>
      {!loading && children}
    </RoleContext.Provider>
  )
}

export const useRole = () => useContext(RoleContext)
