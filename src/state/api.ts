import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  GetKpisResponse,
  GetProductsResponse,
  GetTransactionsResponse,
} from "./types";

// Use environment variable for base URL
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }), // <-- use the env var
  reducerPath: "main",
  tagTypes: ["Kpis", "Products", "Transactions"],
  endpoints: (build) => ({
    getKpis: build.query<Array<GetKpisResponse>, void>({
      query: () => "kpi/",  // backend route
      providesTags: ["Kpis"],
    }),
    getProducts: build.query<Array<GetProductsResponse>, void>({
      query: () => "product/",
      providesTags: ["Products"],
    }),
    getTransactions: build.query<Array<GetTransactionsResponse>, void>({
      query: () => "transaction/",
      providesTags: ["Transactions"],
    }),
  }),
});

export const { useGetKpisQuery, useGetProductsQuery, useGetTransactionsQuery } =
  api;
