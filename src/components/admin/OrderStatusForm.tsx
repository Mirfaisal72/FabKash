"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["new", "packing", "shipped", "delivered", "cancelled"] as const;

export function OrderStatusForm({
  orderId,
  fulfillmentStatus,
  notes,
}: {
  orderId: string;
  fulfillmentStatus: string;
  notes: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setOk(false);
    const form = new FormData(e.currentTarget);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fulfillmentStatus: form.get("fulfillmentStatus"),
        notes: form.get("notes"),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Update failed");
      setLoading(false);
      return;
    }
    setOk(true);
    setLoading(false);
    router.refresh();
  }

  return (
    <form className="form-grid" onSubmit={onSubmit} style={{ marginTop: "1.5rem" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", margin: 0 }}>
        Update fulfillment
      </h2>
      {error ? <p className="error">{error}</p> : null}
      {ok ? <p className="flash">Saved.</p> : null}
      <label>
        Status
        <select name="fulfillmentStatus" defaultValue={fulfillmentStatus}>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        Notes (tracking ID, courier, etc.)
        <textarea name="notes" rows={3} defaultValue={notes} />
      </label>
      <button className="btn btn--primary" type="submit" disabled={loading}>
        {loading ? "Saving…" : "Save status"}
      </button>
    </form>
  );
}
