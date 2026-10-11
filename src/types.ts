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