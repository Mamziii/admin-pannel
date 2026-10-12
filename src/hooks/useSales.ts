// src/hooks/useSales.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export interface SalesData {
  year: number;
  name: string; // نام ماه
  online: number;
  inStore: number;
}

const API_URL = "http://localhost:4000/sales";

export const useSales = () => {
  return useQuery<SalesData[]>({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data } = await axios.get<SalesData[]>(API_URL);
      return data;
    },
    staleTime: 1000 * 60 * 5, // ۵ دقیقه
  });
};