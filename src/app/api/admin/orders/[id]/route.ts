import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminSession } from "@/lib/auth";
import { updateOrderFulfillment } from "@/sanity/orders";

const schema = z.object({
  fulfillmentStatus: z.enum([
    "new",
    "packing",
    "shipped",
    "delivered",
    "cancelled",
  ]),
  notes: z.string().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const data = schema.parse(await req.json());
    const order = await updateOrderFulfillment(
      id,
      data.fulfillmentStatus,
      data.notes,
    );
    return NextResponse.json({ order });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not update order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
