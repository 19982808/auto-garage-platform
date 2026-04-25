import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // 🔒 Ensure profile exists (fixes 406)
  const ensureProfile = async (user) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("PROFILE CHECK ERROR:", error);
      return;
    }

    // If no profile → create it
    if (!data) {
      const { error: insertError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        role: "user",
      });

      if (insertError) {
        console.error("PROFILE INSERT ERROR:", insertError);
      }
    }
  };

  // 🔄 Restore session on refresh
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUser(data.session.user);
        await ensureProfile(data.session.user);
        onLogin(data.session.user);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          await ensureProfile(session.user);
          onLogin(session.user);
        } else {
          setUser(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ---------------- SIGN UP ----------------
  const handleSignUp = async () => {
    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("SIGN UP:", data, error);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (data?.user) {
      await ensureProfile(data.user);
    }

    alert("Signup successful. Check email if confirmation is enabled.");
    setLoading(false);
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN:", data, error);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (data?.user) {
      await ensureProfile(data.user);
      onLogin(data.user);
    }

    setLoading(false);
  };

  // ---------------- LOGOUT ----------------
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    onLogin(null);
  };

  // ---------------- UI ----------------
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🚗 Garage AI Auth</h2>

      {!user ? (
        <>
          <input
            style={styles.input}
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            style={styles.button}
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>

          <button
            style={styles.button}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </>
      ) : (
        <>
          <p style={{ marginBottom: 10 }}>Logged in as: {user.email}</p>

          <button style={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </>
      )}
    </div>
  );
}

// 🎨 SIMPLE STYLES
const styles = {
  container: {
    maxWidth: 400,
    margin: "80px auto",
    padding: 20,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  button: {
    width: "100%",
    padding: 10,
    marginTop: 5,
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
  logout: {
    width: "100%",
    padding: 10,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
