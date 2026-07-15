"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { useCart } from "@/components/CartProvider";
import { brand, formatInr } from "@/lib/brand";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type CreateOrderResponse = {
  orderId: string;
  orderNumber: string;
  razorpayOrderId: string;
  amountInr: number;
  keyId: string | null;
  mock: boolean;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear } = useCart();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const payloadItems = useMemo(
    () =>
      items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
      })),
    [items],
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const body = {
      customerName: String(form.get("customerName") || ""),
      customerPhone: String(form.get("customerPhone") || ""),
      customerEmail: String(form.get("customerEmail") || ""),
      addressLine1: String(form.get("addressLine1") || ""),
      addressLine2: String(form.get("addressLine2") || ""),
      city: String(form.get("city") || ""),
      state: String(form.get("state") || ""),
      pincode: String(form.get("pincode") || ""),
      items: payloadItems,
    };

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as CreateOrderResponse & { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not create order");

      if (data.mock || !data.keyId) {
        const verify = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: data.orderId,
            razorpayOrderId: data.razorpayOrderId,
            razorpayPaymentId: `pay_dev_${Date.now()}`,
            razorpaySignature: "dev_mock_signature",
          }),
        });
        const verified = await verify.json();
        if (!verify.ok) throw new Error(verified.error || "Payment failed");
        clear();
        router.push(`/order/success?order=${data.orderNumber}`);
        return;
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay script not loaded yet. Please try again.");
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amountInr * 100,
        currency: "INR",
        name: brand.name,
        description: `Order ${data.orderNumber}`,
        order_id: data.razorpayOrderId,
        prefill: {
          name: body.customerName,
          contact: body.customerPhone,
          email: body.customerEmail || undefined,
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const verify = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: data.orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const verified = await verify.json();
          if (!verify.ok) {
            setError(verified.error || "Payment verification failed");
            setLoading(false);
            return;
          }
          clear();
          router.push(`/order/success?order=${data.orderNumber}`);
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="page-shell checkout-page">
        <p className="muted">Add shawls to your cart before checkout.</p>
        <Link href="/shop" className="btn btn--primary" style={{ marginTop: "1rem" }}>
          Go to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="page-shell checkout-page">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="section__head">
        <p className="eyebrow">Secure checkout</p>
        <h2>Delivery & payment</h2>
        <p className="muted">
          Total due: <strong>{formatInr(subtotal)}</strong>. Without Razorpay
          keys, the site runs in demo-pay mode so you can test the flow.
        </p>
      </div>

      {error ? <p className="error">{error}</p> : null}

      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          Full name
          <input name="customerName" required autoComplete="name" />
        </label>
        <div className="row-2">
          <label>
            Phone (WhatsApp preferred)
            <input name="customerPhone" required autoComplete="tel" />
          </label>
          <label>
            Email (optional)
            <input name="customerEmail" type="email" autoComplete="email" />
          </label>
        </div>
        <label>
          Address line 1
          <input name="addressLine1" required autoComplete="address-line1" />
        </label>
        <label>
          Address line 2
          <input name="addressLine2" autoComplete="address-line2" />
        </label>
        <div className="row-2">
          <label>
            City
            <input name="city" required autoComplete="address-level2" />
          </label>
          <label>
            State
            <input name="state" required autoComplete="address-level1" />
          </label>
        </div>
        <label>
          PIN code
          <input name="pincode" required autoComplete="postal-code" />
        </label>
        <button className="btn btn--primary" type="submit" disabled={loading}>
          {loading ? "Processing…" : `Pay ${formatInr(subtotal)}`}
        </button>
      </form>
    </div>
  );
}
