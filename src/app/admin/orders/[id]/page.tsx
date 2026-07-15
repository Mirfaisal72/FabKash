import { notFound, redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { formatInr } from "@/lib/brand";
import { getOrderById } from "@/sanity/queries";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div style={{ maxWidth: 720 }}>
      <p className="eyebrow">Order</p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          letterSpacing: "-0.03em",
        }}
      >
        {order.orderNumber}
      </h1>
      <p className="muted">
        {new Date(order._createdAt).toLocaleString("en-IN")} · Payment{" "}
        <strong>{order.paymentStatus}</strong>
      </p>

      <div className="panel" style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>
          Customer
        </h2>
        <p style={{ margin: "0.5rem 0" }}>
          {order.customerName}
          <br />
          {order.customerPhone}
          {order.customerEmail ? (
            <>
              <br />
              {order.customerEmail}
            </>
          ) : null}
        </p>
        <p className="muted">
          {order.addressLine1}
          {order.addressLine2 ? `, ${order.addressLine2}` : ""}
          <br />
          {order.city}, {order.state} {order.pincode}
        </p>
      </div>

      <div className="panel">
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem" }}>
          Items
        </h2>
        <ul style={{ paddingLeft: "1.1rem" }}>
          {order.items.map((item, i) => (
            <li key={`${item.productId}-${i}`}>
              {item.productName} × {item.quantity} —{" "}
              {formatInr(item.unitPriceInr * item.quantity)}
            </li>
          ))}
        </ul>
        <p>
          <strong>Total {formatInr(order.totalInr)}</strong>
        </p>
      </div>

      <OrderStatusForm
        orderId={order._id}
        fulfillmentStatus={order.fulfillmentStatus}
        notes={order.notes || ""}
      />
    </div>
  );
}
