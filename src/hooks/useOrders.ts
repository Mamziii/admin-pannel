// src/hooks/useOrders.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Order } from "../types";
import { API_URL } from "../config/api";


const api_url = `${API_URL}/orders`;

export const useOrders = () => {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await axios.get<Order[]>(api_url);
      return data;
    },
  });
};