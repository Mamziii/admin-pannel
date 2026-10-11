// src/hooks/useOrders.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Order } from "../types";


const API_URL = "http://localhost:4000/orders";

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await axios.get<Order[]>(API_URL);
      return data;
    },
  });
};