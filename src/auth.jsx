import { useState } from "react"
import { supabase } from "./lib/supabase"

export default function Auth() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // 🔐 SIGN UP
  const signup = async () => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      })

      console.log("SIGN UP:", data, error)

      if (error) {
        alert(error.message)
        return
      }

      if (data.user) {
        await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email: data.user.email,
            role: "user"
          }
        ])
      }

    } catch (err) {
      console.error("SIGNUP ERROR:", err)
    }
  }

  // 🔑 LOGIN
  const login = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log("LOGIN:", data, error)

      if (error) {
        alert(error.message)
        return
      }

      if (!data.session) {
        alert("No session returned")
      }

    } catch (err) {
      console.error("LOGIN ERROR:", err)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Auth</h1>

      <input
        placeholder="email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={signup}>Sign Up</button>
      <button onClick={login}>Login</button>
    </div>
  )
}