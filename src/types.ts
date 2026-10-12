export type User = {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  gender: "male" | "female";
  role: "user" | "admin";
}

export type Product = {
  id: number;
  category: string;
  title: string;
  mainImage: string;
  price: number;
  desc: string;
  images: string[];
  colors: string[];
  sizes: string[];
  quantity: number;
  rate: number;
  discount: number;
  date: string;
  type: string;
}

export type OrderItem = {
  productID: number;
  title: string;
  price: number;
  mainImage: string;
  category: string;
  discount: number;
  type: string;
  color: string;
  size: string;
  quantity: number;
  userID: number;
  id: number;
}

export type Order = {
  id: number;
  userID: number;
  userName: string;
  userFirstname: string;
  userLastname: string;
  items: OrderItem[];
  allPrice: number;
  address: string;
  phone: string;
  date: string;
}

export type SalesData = {
  id: number;
  name: string;
  inStore: number;
  online: number;
  year: number;
}