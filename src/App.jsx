import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Auth from "./Auth";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      // ✅ Get logged in user
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user;

      setUser(currentUser);

      if (currentUser) {
        // ✅ Try get profile
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .maybeSingle(); // 🔥 FIX: prevents 406 error

        // ✅ If no profile → create one automatically
        if (!profile) {
          console.log("Creating profile...");

          await supabase.from("profiles").insert({
            id: currentUser.id,
            email: currentUser.email,
            role: "user",
          });

          setRole("user");
        } else {
          setRole(profile.role);
        }
      }

      setLoading(false);
    };

    init();

    // ✅ Listen for auth changes (important!)
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user;
        setUser(currentUser);

        if (currentUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", currentUser.id)
            .maybeSingle();

          setRole(profile?.role || "user");
        } else {
          setRole(null);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  };

  // ✅ Loading state (prevents flicker + errors)
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  // ❌ Not logged in
  if (!user) return <Auth />;

  // 👑 Admin
  if (role === "admin") {
    return <AdminDashboard user={user} onLogout={logout} />;
  }

  // 👤 Normal user
  return <Dashboard user={user} onLogout={logout} />;
}
