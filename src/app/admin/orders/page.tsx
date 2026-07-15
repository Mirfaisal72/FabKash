import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { formatInr } from "@/lib/brand";
import { getOrders } from "@/sanity/queries";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  const orders = await getOrders();

  return (
    <div>
      <p className="eyebrow">Sales</p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          letterSpacing: "-0.03em",
          marginBottom: "1.5rem",
        }}
      >
        Orders
      </h1>

      <table className="table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Payment</th>
            <th>Fulfillment</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                <Link href={`/admin/orders/${order._id}`}>{order.orderNumber}</Link>
                <div className="muted">
                  {new Date(order._createdAt).toLocaleString("en-IN")}
                </div>
              </td>
              <td>
                {order.customerName}
                <div className="muted">{order.customerPhone}</div>
              </td>
              <td>
                <span className="badge">{order.paymentStatus}</span>
              </td>
              <td>
                <span className="badge">{order.fulfillmentStatus}</span>
              </td>
              <td>{formatInr(order.totalInr)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 ? (
        <p className="muted">No orders yet.</p>
      ) : null}
    </div>
  );
}
