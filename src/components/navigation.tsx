"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Home, List, Plus } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-white drop-shadow-lg">Omah Mimie</span>
            </Link>
          </div>
          
          <nav className="flex items-center space-x-2">
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  pathname === "/" 
                    ? "bg-white text-purple-600 shadow-lg" 
                    : "text-white hover:bg-white/20 hover:text-white border-white/30"
                }`}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Input Data</span>
                <span className="sm:hidden">Input</span>
              </Button>
            </Link>
            <Link href="/properties">
              <Button
                variant={pathname === "/properties" ? "default" : "ghost"}
                className={`flex items-center gap-2 transition-all duration-300 ${
                  pathname === "/properties" 
                    ? "bg-white text-purple-600 shadow-lg" 
                    : "text-white hover:bg-white/20 hover:text-white border-white/30"
                }`}
              >
                <List className="h-4 w-4" />
                <span className="hidden sm:inline">Daftar Properti</span>
                <span className="sm:hidden">Daftar</span>
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}