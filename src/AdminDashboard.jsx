import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"

export default function AdminDashboard({ user, onLogout }) {
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])

  const fetchAll = async () => {
    const { data: b } = await supabase.from("bookings").select("*")
    const { data: u } = await supabase.from("profiles").select("*")

    setBookings(b || [])
    setUsers(u || [])
  }

  useEffect(() => {
    fetchAll()
  }, [])

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>👑 Admin Panel</h1>

      <button onClick={onLogout}>Logout</button>

      <h2>Users</h2>
      {users.map((u) => (
        <div key={u.id}>
          {u.email} — {u.role}
        </div>
      ))}

      <h2>All Bookings</h2>
      {bookings.map((b) => (
        <div key={b.id} style={{ border: "1px solid #ccc", margin: 10, padding: 10 }}>
          <p>{b.user_email}</p>
          <p>{b.car_model}</p>
          <p>{b.service_type}</p>
        </div>
      ))}
    </div>
  )
}