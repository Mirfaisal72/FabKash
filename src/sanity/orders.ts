import { sanityWriteClient } from "./client";
import type { SanityOrderItem } from "./types";

export async function createOrderDoc(input: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  pincode: string;
  totalInr: number;
  razorpayOrderId: string;
  items: SanityOrderItem[];
}) {
  const client = sanityWriteClient();
  return client.create({
    _type: "order",
    ...input,
    paymentStatus: "pending",
    fulfillmentStatus: "new",
  });
}

export async function markOrderPaid(
  orderId: string,
  razorpayPaymentId: string,
) {
  const client = sanityWriteClient();
  return client
    .patch(orderId)
    .set({
      paymentStatus: "paid",
      fulfillmentStatus: "packing",
      razorpayPaymentId,
    })
    .commit();
}

export async function decrementProductStock(productId: string, quantity: number) {
  const client = sanityWriteClient();
  return client.patch(productId).dec({ stock: quantity }).commit();
}

export async function updateOrderFulfillment(
  orderId: string,
  fulfillmentStatus: string,
  notes?: string,
) {
  const client = sanityWriteClient();
  return client
    .patch(orderId)
    .set({ fulfillmentStatus, ...(notes !== undefined ? { notes } : {}) })
    .commit();
}
