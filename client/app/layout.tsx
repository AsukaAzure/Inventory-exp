import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Inventory Dashboard",
  description: "Educational materials inventory management system",
}
import { RoleProvider } from "@/context/RoleContext"


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <RoleProvider>
          {children}
        </RoleProvider>
      </body>
    </html>
  )
}
