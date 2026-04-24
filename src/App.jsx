import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"
import Auth from "./Auth"
import Dashboard from "./Dashboard"
import AdminDashboard from "./AdminDashboard"

export default function App() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)

      if (data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single()

        setRole(profile?.role)
      }
    }

    getUser()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (!user) return <Auth />

  if (role === "admin") {
    return <AdminDashboard user={user} onLogout={logout} />
  }

  return <Dashboard user={user} onLogout={logout} />
}