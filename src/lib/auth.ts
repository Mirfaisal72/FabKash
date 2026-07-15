import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const COOKIE = "loomora_admin";

function secret() {
  const value = process.env.ADMIN_JWT_SECRET;
  if (!value) throw new Error("ADMIN_JWT_SECRET is not set");
  return new TextEncoder().encode(value);
}

export async function verifyAdminPassword(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) return null;
  if (email !== adminEmail || password !== adminPassword) return null;
  return { id: "admin", email: adminEmail, name: "Admin" };
}

export async function createAdminSession(userId: string) {
  const token = await new SignJWT({ sub: userId, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getAdminSession() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.role !== "admin" || typeof payload.sub !== "string") return null;
    return {
      id: payload.sub,
      email: process.env.ADMIN_EMAIL || "admin",
      name: "Admin",
    };
  } catch {
    return null;
  }
}
