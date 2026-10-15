// src/hooks/useSales.ts
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "../config/api";

export interface SalesData {
  year: number;
  name: string; // نام ماه
  online: number;
  inStore: number;
}

const api_url = `${API_URL}/sales`;

export const useSales = () => {
  return useQuery<SalesData[]>({
    queryKey: ["sales"],
    queryFn: async () => {
      const { data } = await axios.get<SalesData[]>(api_url);
      return data;
    },
    staleTime: 1000 * 60 * 5, // ۵ دقیقه
  });
};