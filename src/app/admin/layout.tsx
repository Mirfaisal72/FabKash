import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { brand } from "@/lib/brand";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <aside className="admin-side">
        <p className="brand-mark">{brand.name}</p>
        <p className="muted" style={{ color: "#c8d3da", margin: "0.35rem 0 0" }}>
          Orders admin
        </p>
        <AdminNav />
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}

async function AdminNav() {
  const session = await getAdminSession();
  return (
    <nav>
      {session ? (
        <>
          <Link href="/admin">Dashboard</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/studio">Sanity Studio (products)</Link>
          <Link href="/" target="_blank">
            View store
          </Link>
          <form
            action={async () => {
              "use server";
              const { clearAdminSession } = await import("@/lib/auth");
              await clearAdminSession();
              redirect("/admin/login");
            }}
          >
            <button
              type="submit"
              className="btn btn--ghost"
              style={{
                color: "#eef3f6",
                borderColor: "rgba(238,243,246,0.25)",
                marginTop: "0.75rem",
                width: "100%",
              }}
            >
              Log out
            </button>
          </form>
        </>
      ) : (
        <Link href="/admin/login">Login</Link>
      )}
    </nav>
  );
}
