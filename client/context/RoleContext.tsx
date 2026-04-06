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

const getRoleFromSession = () => {
  const userString = sessionStorage.getItem("user")
  if (!userString) return "user"

  try {
    const user = JSON.parse(userString)
    if (user && user.role) return user.role
  } catch (err) {
    console.error("Failed to parse user from sessionStorage:", err)
  }

  return "user"
}

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRoleState] = useState(() => {
    if (typeof window === "undefined") return "user"
    return getRoleFromSession()
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const updateRole = () => {
      setRoleState(getRoleFromSession())
      setLoading(false)
    }

    updateRole()

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "user") {
        updateRole()
      }
    }

    const handleUserUpdated = () => {
      updateRole()
    }

    window.addEventListener("storage", handleStorage)
    window.addEventListener("userUpdated", handleUserUpdated)

    return () => {
      window.removeEventListener("storage", handleStorage)
      window.removeEventListener("userUpdated", handleUserUpdated)
    }
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
