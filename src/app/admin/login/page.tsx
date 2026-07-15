"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        password: form.get("password"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Login failed");
      setLoading(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <p className="eyebrow">Admin</p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          letterSpacing: "-0.03em",
        }}
      >
        Sign in
      </h1>
      <p className="muted" style={{ marginBottom: "1.25rem" }}>
        Orders admin login. Products are managed in{" "}
        <a href="/studio">Sanity Studio</a>.
      </p>
      {error ? <p className="error">{error}</p> : null}
      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          Email
          <input name="email" type="email" required />
        </label>
        <label>
          Password
          <input name="password" type="password" required />
        </label>
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
