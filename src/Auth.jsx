import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

    // Create profile automatically
    if (data?.user) {
      await supabase.from("profiles").insert({
        id: data.user.id,
        email: data.user.email,
        role: "user",
      });
    }

    alert("Check your email to confirm account");
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

    alert("Login successful");
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Auth</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={handleSignUp} disabled={loading}>
        Sign Up
      </button>

      <button onClick={handleLogin} disabled={loading}>
        Login
      </button>
    </div>
  );
}
