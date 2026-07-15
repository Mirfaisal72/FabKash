export type SanityCategory = {
  _id: string;
  name: string;
  slug: string;
};

export type SanityProduct = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  priceInr: number;
  fabric: string;
  colors: string;
  stock: number;
  images: SanityImageAsset[];
  featured: boolean;
  active: boolean;
  category?: SanityCategory | null;
};

type SanityImageAsset = {
  _type?: string;
  asset?: { _ref?: string; _type?: string };
};

export type SanityOrderItem = {
  productId: string;
  productName: string;
  unitPriceInr: number;
  quantity: number;
};

export type SanityOrder = {
  _id: string;
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
  paymentStatus: string;
  fulfillmentStatus: string;
  razorpayOrderId?: string | null;
  razorpayPaymentId?: string | null;
  notes?: string | null;
  items: SanityOrderItem[];
  _createdAt: string;
};

export const productsQuery = `
*[_type == "product" && active == true] | order(_createdAt desc) {
  _id,
  name,
  "slug": slug.current,
  description,
  priceInr,
  fabric,
  colors,
  stock,
  images,
  featured,
  active,
  category->{ _id, name, "slug": slug.current }
}
`;

export const featuredProductsQuery = `
*[_type == "product" && active == true && featured == true] | order(_createdAt desc)[0...6] {
  _id,
  name,
  "slug": slug.current,
  description,
  priceInr,
  fabric,
  colors,
  stock,
  images,
  featured,
  active,
  category->{ _id, name, "slug": slug.current }
}
`;

export const productBySlugQuery = `
*[_type == "product" && slug.current == $slug][0] {
  _id,
  name,
  "slug": slug.current,
  description,
  priceInr,
  fabric,
  colors,
  stock,
  images,
  featured,
  active,
  category->{ _id, name, "slug": slug.current }
}
`;

export const productsByIdsQuery = `
*[_type == "product" && _id in $ids && active == true] {
  _id,
  name,
  "slug": slug.current,
  description,
  priceInr,
  fabric,
  colors,
  stock,
  images,
  featured,
  active
}
`;

export const categoriesQuery = `
*[_type == "category"] | order(name asc) {
  _id,
  name,
  "slug": slug.current
}
`;

export const ordersQuery = `
*[_type == "order"] | order(_createdAt desc) {
  _id,
  orderNumber,
  customerName,
  customerPhone,
  customerEmail,
  addressLine1,
  addressLine2,
  city,
  state,
  pincode,
  totalInr,
  paymentStatus,
  fulfillmentStatus,
  razorpayOrderId,
  razorpayPaymentId,
  notes,
  items,
  _createdAt
}
`;

export const orderByIdQuery = `
*[_type == "order" && _id == $id][0] {
  _id,
  orderNumber,
  customerName,
  customerPhone,
  customerEmail,
  addressLine1,
  addressLine2,
  city,
  state,
  pincode,
  totalInr,
  paymentStatus,
  fulfillmentStatus,
  razorpayOrderId,
  razorpayPaymentId,
  notes,
  items,
  _createdAt
}
`;

export const paidOrdersQuery = `
*[_type == "order" && paymentStatus == "paid"] | order(_createdAt desc) {
  _id,
  orderNumber,
  customerName,
  customerPhone,
  totalInr,
  fulfillmentStatus,
  _createdAt
}
`;
