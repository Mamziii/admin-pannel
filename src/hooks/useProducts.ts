import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Product } from "../types";

const API_URL = "http://localhost:4000/products"; 

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get<Product[]>(API_URL);
      return data;
    },
  });
};
