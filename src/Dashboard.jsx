import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Dashboard({ user, onLogout }) {
  const [bookings, setBookings] = useState([]);
  const [issue, setIssue] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

  // ✅ FETCH BOOKINGS (SAFE)
  const fetchBookings = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("id", { ascending: false });

    if (error) {
      console.error("FETCH ERROR:", error);
      return;
    }

    setBookings(data || []);
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  // 🤖 AI ANALYSIS
  const analyze = async () => {
    if (!issue.trim()) return;

    setLoading(true);

    let result = "🧠 General diagnostic: full inspection recommended.";
    const text = issue.toLowerCase();

    if (text.includes("shake") || text.includes("vibration")) {
      result = "⚠️ Suspension or wheel alignment issue likely.";
    } else if (text.includes("brake")) {
      result = "🔧 Brake pads worn.";
    } else if (text.includes("start")) {
      result = "🔋 Battery issue.";
    } else if (text.includes("smoke")) {
      result = "🚨 Engine overheating.";
    }

    setAiResult(result);

    // ✅ SAFE INSERT (NO CRASH IF COLUMN MISSING)
    const { error } = await supabase.from("bookings").insert([
      {
        user_id: user.id,
        user_email: user.email,
        car_model: "AI",
        service_type: issue,
        date: new Date().toISOString(),
        ai_diagnosis: result // ⚠️ remove if column doesn't exist
      },
    ]);

    if (error) console.error("INSERT ERROR:", error);

    setIssue("");
    fetchBookings();
    setLoading(false);
  };

  // 💳 PAYMENT (SAFE)
  const payForService = async () => {
    setPaymentStatus("Processing...");

    const { error } = await supabase.from("payments").insert([
      {
        user_id: user.id,
        email: user.email,
        amount: 500,
        status: "paid",
      },
    ]);

    if (error) {
      console.error(error);
      setPaymentStatus("❌ Payment failed");
      return;
    }

    setPaymentStatus("✅ Payment successful");
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Dashboard</h2>

      <p>{user?.email}</p>

      <button onClick={onLogout}>Logout</button>

      <h3>AI Diagnosis</h3>

      <input
        value={issue}
        onChange={(e) => setIssue(e.target.value)}
        placeholder="Describe issue"
      />

      <button onClick={analyze}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>

      <button onClick={payForService}>
        Pay KES 500
      </button>

      <p>{paymentStatus}</p>

      <p>{aiResult}</p>

      <h3>Bookings</h3>

      {bookings.length === 0 ? (
        <p>No bookings</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id}>
            <p>{b.service_type}</p>
            <p>{b.ai_diagnosis}</p>
          </div>
        ))
      )}
    </div>
  );
}
