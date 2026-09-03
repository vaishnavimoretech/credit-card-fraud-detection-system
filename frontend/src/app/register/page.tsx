"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
  const response = await fetch(
    "http://127.0.0.1:8000/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    }
  );

  const data = await response.json();

  console.log("REGISTER RESPONSE:", data);

console.log(data);

alert("Registration Successful!");
}

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-3xl border p-8">
        <h1 className="mb-6 text-3xl font-bold">
          Register
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
          className="mb-4 w-full rounded-lg border p-3"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="mb-4 w-full rounded-lg border p-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="mb-6 w-full rounded-lg border p-3"
        />

        <button
          onClick={handleRegister}
          className="w-full rounded-lg bg-cyan-500 p-3 font-semibold text-black"
        >
          Register
        </button>
      </div>
    </div>
  );
}