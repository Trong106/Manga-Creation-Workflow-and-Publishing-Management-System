"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { User, UserRole } from "@/lib/types"

const mockUsers: Record<UserRole, User> = {
  mangaka: {
    id: "1",
    name: "Yuki Tanaka",
    email: "yuki@mangaflow.com",
    avatar: "yuki",
    role: "mangaka",
  },
  assistant: {
    id: "2",
    name: "Kenji Yamamoto",
    email: "kenji@mangaflow.com",
    avatar: "kenji",
    role: "assistant",
  },
  tantou: {
    id: "3",
    name: "Sakura Ito",
    email: "sakura@mangaflow.com",
    avatar: "sakura",
    role: "tantou",
  },
  editorial: {
    id: "4",
    name: "Takeshi Sato",
    email: "takeshi@mangaflow.com",
    avatar: "takeshi",
    role: "editorial",
  },
}

interface AuthContextType {
  user: User | null
  role: UserRole
  setRole: (role: UserRole) => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole>("mangaka")

  const user = mockUsers[role]

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setRole,
        isAuthenticated: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
