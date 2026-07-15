import { NextResponse } from "next/server";
import { z } from "zod";
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/razorpay";
import { orderNumber } from "@/lib/utils";
import { createOrderDoc } from "@/sanity/orders";
import { getProductsByIds } from "@/sanity/queries";

const schema = z.object({
  customerName: z.string().min(2),
  customerPhone: z.string().min(8),
  customerEmail: z.string().email().optional().or(z.literal("")),
  addressLine1: z.string().min(3),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().min(4),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = schema.parse(json);

    const products = await getProductsByIds(data.items.map((i) => i.productId));

    if (products.length !== data.items.length) {
      return NextResponse.json(
        { error: "One or more products are unavailable." },
        { status: 400 },
      );
    }

    const lineItems = data.items.map((item) => {
      const product = products.find((p) => p._id === item.productId)!;
      if (product.stock < item.quantity) {
        throw new Error(`${product.name} does not have enough stock.`);
      }
      return {
        product,
        quantity: item.quantity,
        unitPriceInr: product.priceInr,
      };
    });

    const totalInr = lineItems.reduce(
      (sum, line) => sum + line.unitPriceInr * line.quantity,
      0,
    );

    const number = orderNumber();
    const rpOrder = await createRazorpayOrder(totalInr, number);

    const order = await createOrderDoc({
      orderNumber: number,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || null,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2 || null,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      totalInr,
      razorpayOrderId: rpOrder.id,
      items: lineItems.map((line) => ({
        productId: line.product._id,
        productName: line.product.name,
        unitPriceInr: line.unitPriceInr,
        quantity: line.quantity,
      })),
    });

    return NextResponse.json({
      orderId: order._id,
      orderNumber: number,
      razorpayOrderId: rpOrder.id,
      amountInr: totalInr,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || null,
      mock: !isRazorpayConfigured() || "mock" in rpOrder,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create order";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
