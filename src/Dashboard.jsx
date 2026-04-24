import { useEffect, useState } from "react"
import { supabase } from "./lib/supabase"

export default function Dashboard({ user, onLogout }) {
  const [bookings, setBookings] = useState([])
  const [issue, setIssue] = useState("")
  const [aiResult, setAiResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState("")

  // 📦 FETCH BOOKINGS
  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false })

    if (error) {
      console.error("FETCH ERROR:", error)
      return
    }

    setBookings(data || [])
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // 🤖 AI DIAGNOSIS ENGINE (UPGRADED)
  const analyze = async () => {
    if (!issue.trim()) return

    setLoading(true)

    const text = issue.toLowerCase()
    let result = ""

    if (text.includes("shake") || text.includes("vibration")) {
      result = "⚠️ Suspension or wheel alignment issue likely. High risk."
    } 
    else if (text.includes("brake") || text.includes("squeak")) {
      result = "🔧 Brake pads worn. Replace soon."
    } 
    else if (text.includes("start") || text.includes("click")) {
      result = "🔋 Battery or starter motor issue detected."
    } 
    else if (text.includes("smoke")) {
      result = "🚨 Engine overheating or oil leak. Stop driving immediately."
    } 
    else if (text.includes("fuel")) {
      result = "⛽ Fuel system or injector issue likely."
    } 
    else {
      result = "🧠 General diagnostic: full inspection recommended."
    }

    setAiResult(result)

    // 💾 SAVE TO SUPABASE
    const { error } = await supabase.from("bookings").insert([
      {
        user_id: user.id,
        user_email: user.email,
        car_model: "AI DIAGNOSIS",
        service_type: issue,
        date: new Date().toISOString(),
        ai_diagnosis: result
      }
    ])

    if (error) console.error("INSERT ERROR:", error)

    setIssue("")
    fetchBookings()
    setLoading(false)
  }

  // 💳 PAYMENT SYSTEM (SIMULATED)
  const payForService = async () => {
    setPaymentStatus("Processing payment...")

    try {
      await new Promise((res) => setTimeout(res, 1500))

      await supabase.from("payments").insert([
        {
          user_id: user.id,
          email: user.email,
          amount: 500,
          status: "paid",
          created_at: new Date().toISOString()
        }
      ])

      setPaymentStatus("✅ Payment successful!")

    } catch (err) {
      console.error(err)
      setPaymentStatus("❌ Payment failed")
    }
  }

  // 🎨 STYLES (ALL IN ONE FILE)
  const styles = {
    container: {
      display: "flex",
      fontFamily: "Arial",
      minHeight: "100vh",
      background: "#f6f7fb"
    },
    sidebar: {
      width: "220px",
      background: "#0f172a",
      color: "white",
      padding: "20px"
    },
    main: {
      flex: 1,
      padding: "30px"
    },
    card: {
      background: "white",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "15px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
    },
    input: {
      width: "100%",
      padding: "12px",
      marginTop: "10px",
      borderRadius: "8px",
      border: "1px solid #ddd"
    },
    button: {
      marginTop: "10px",
      padding: "10px",
      background: "#2563eb",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer"
    },
    logout: {
      marginTop: "20px",
      padding: "10px",
      width: "100%",
      background: "#ef4444",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer"
    },
    result: {
      marginTop: "10px",
      fontWeight: "bold",
      color: "#16a34a"
    },
    booking: {
      background: "white",
      padding: "15px",
      marginTop: "10px",
      borderRadius: "10px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    },
    payBtn: {
      marginTop: "10px",
      padding: "10px",
      background: "#16a34a",
      color: "white",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer"
    }
  }

  return (
    <div style={styles.container}>

      {/* SIDEBAR */}
      <div style={styles.sidebar}>
        <h2>🚗 Garage AI</h2>
        <p style={{ fontSize: 12 }}>{user.email}</p>

        <button style={styles.logout} onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={styles.main}>

        <h1>Dashboard</h1>

        {/* AI CARD */}
        <div style={styles.card}>
          <h3>🧠 AI Car Diagnosis</h3>

          <input
            style={styles.input}
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            placeholder="Describe your car issue..."
          />

          <button
            style={styles.button}
            onClick={analyze}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze"}
          </button>

          <button style={styles.payBtn} onClick={payForService}>
            Pay for Service (KES 500)
          </button>

          {paymentStatus && (
            <p style={{ marginTop: 10 }}>{paymentStatus}</p>
          )}

          {aiResult && (
            <div style={styles.result}>{aiResult}</div>
          )}
        </div>

        {/* BOOKINGS */}
        <h2 style={{ marginTop: 30 }}>📋 Your Bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings yet</p>
        ) : (
          bookings.map((b) => (
            <div key={b.id} style={styles.booking}>
              <p><b>Issue:</b> {b.service_type}</p>
              <p><b>AI:</b> {b.ai_diagnosis}</p>
              <p style={{ fontSize: 12, opacity: 0.6 }}>
                {b.date}
              </p>
            </div>
          ))
        )}

      </div>
    </div>
  )
}