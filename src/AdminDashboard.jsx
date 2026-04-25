import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function AdminDashboard({ user }) {
  const [bookings, setBookings] = useState([]);

  const fetchAll = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("id", { ascending: false });

    setBookings(data || []);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h2>Admin Panel</h2>

      {bookings.map((b) => (
        <div key={b.id}>
          <p>{b.user_email}</p>
          <p>{b.service_type}</p>
          <p>{b.ai_diagnosis}</p>
        </div>
      ))}
    </div>
  );
}
