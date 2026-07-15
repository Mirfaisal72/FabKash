import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { brand } from "@/lib/brand";
import { formatInr } from "@/lib/brand";
import { getPaidOrders, getShopStats } from "@/sanity/queries";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");

  const [stats, recent] = await Promise.all([
    getShopStats(),
    getPaidOrders(5),
  ]);

  return (
    <div>
      <p className="eyebrow">Overview</p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "2rem",
          letterSpacing: "-0.03em",
          marginBottom: "1.5rem",
        }}
      >
        Hello, {admin.name}
      </h1>

      <div className="stat-row">
        <div className="stat">
          <span className="muted">Active products</span>
          <strong>{stats.productCount}</strong>
        </div>
        <div className="stat">
          <span className="muted">Paid orders</span>
          <strong>{stats.paidOrders}</strong>
        </div>
        <div className="stat">
          <span className="muted">To ship</span>
          <strong>{stats.pendingOrders}</strong>
        </div>
        <div className="stat">
          <span className="muted">Low stock</span>
          <strong>{stats.lowStock}</strong>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "2rem" }}>
        <Link href="/studio" className="btn btn--primary">
          Manage products (Sanity)
        </Link>
        <Link href="/admin/orders" className="btn btn--ghost">
          Manage orders
        </Link>
      </div>

      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem" }}>
        Recent paid orders
      </h2>
      {recent.length === 0 ? (
        <p className="muted">No paid orders yet. Place a test checkout from the store.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((order) => (
              <tr key={order._id}>
                <td>
                  <Link href={`/admin/orders/${order._id}`}>{order.orderNumber}</Link>
                </td>
                <td>
                  {order.customerName}
                  <div className="muted">{order.customerPhone}</div>
                </td>
                <td>{formatInr(order.totalInr)}</td>
                <td>
                  <span className="badge">{order.fulfillmentStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="muted" style={{ marginTop: "2rem" }}>
        Products are edited in Sanity at{" "}
        <Link href="/studio">{brand.name} Studio</Link>. Orders can also be viewed
        there, or updated here for shipping status.
      </p>
    </div>
  );
}
