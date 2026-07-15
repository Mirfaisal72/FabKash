import { defineField, defineType } from "sanity";

export const order = defineType({
  name: "order",
  title: "Order",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "Order number",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "customerName",
      title: "Customer name",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "customerPhone",
      title: "Phone",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "customerEmail",
      title: "Email",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "addressLine1",
      title: "Address line 1",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "addressLine2",
      title: "Address line 2",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "state",
      title: "State",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "pincode",
      title: "PIN code",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "totalInr",
      title: "Total (INR)",
      type: "number",
      readOnly: true,
    }),
    defineField({
      name: "paymentStatus",
      title: "Payment status",
      type: "string",
      options: {
        list: ["pending", "paid", "failed"],
      },
      initialValue: "pending",
      readOnly: true,
    }),
    defineField({
      name: "fulfillmentStatus",
      title: "Fulfillment status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "Packing", value: "packing" },
          { title: "Shipped", value: "shipped" },
          { title: "Delivered", value: "delivered" },
          { title: "Cancelled", value: "cancelled" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "razorpayOrderId",
      title: "Razorpay order ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "razorpayPaymentId",
      title: "Razorpay payment ID",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "notes",
      title: "Notes (tracking, courier)",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      readOnly: true,
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "productId", type: "string", title: "Product ID" }),
            defineField({ name: "productName", type: "string", title: "Product" }),
            defineField({ name: "unitPriceInr", type: "number", title: "Unit price" }),
            defineField({ name: "quantity", type: "number", title: "Qty" }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "orderNumber",
      subtitle: "customerName",
      status: "fulfillmentStatus",
    },
    prepare({ title, subtitle, status }) {
      return {
        title,
        subtitle: `${subtitle} · ${status || "new"}`,
      };
    },
  },
});
