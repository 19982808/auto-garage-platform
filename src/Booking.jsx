import { useState } from "react"
import { supabase } from "./lib/supabase"

export default function Booking({ user }) {
  const [carModel, setCarModel] = useState("")
  const [service, setService] = useState("")
  const [date, setDate] = useState("")

  const createBooking = async () => {
    console.log("🚀 Sending booking...")

    const { data, error } = await supabase.from("bookings").insert([
  {
    user_id: user.id,
    user_email: user.email,
    car_model,
    service_type,
    date
  }
])

    console.log("DATA:", data)
    console.log("ERROR:", error)
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Booking</h2>

      <input placeholder="Car Model" onChange={(e) => setCarModel(e.target.value)} />
      <br />

      <input placeholder="Service Type" onChange={(e) => setService(e.target.value)} />
      <br />

      <input type="date" onChange={(e) => setDate(e.target.value)} />
      <br />

      <button onClick={createBooking}>Book Service</button>
    </div>
  )
}