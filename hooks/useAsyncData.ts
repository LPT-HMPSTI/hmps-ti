"use client";

import { useState, useEffect, useCallback } from "react";

export interface UseAsyncDataOptions {
  /**
   * Apakah pemanggilan data langsung dieksekusi saat komponen mount. Default: true.
   */
  immediate?: boolean;
}

export interface UseAsyncDataReturn<T> {
  data: T;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<T>;
  setData: React.Dispatch<React.SetStateAction<T>>;
}

/**
 * Hook serbaguna untuk mengambil data asynchronous dengan perlindungan fallback data.
 * Memastikan tampilan halaman langsung terisi instan tanpa kedipan (zero-flash UI)
 * sebelum sinkronisasi latar belakang selesai.
 *
 * @param fetcher Fungsi async pengambil data utama (misal dari service Supabase)
 * @param fallbackData Data cadangan awal yang langsung dipakai saat inisialisasi
 * @param options Opsi kontrol eksekusi (seperti immediate: boolean)
 */
export function useAsyncData<T>(
  fetcher: () => Promise<T>,
  fallbackData: T,
  options: UseAsyncDataOptions = { immediate: true }
): UseAsyncDataReturn<T> {
  const [data, setData] = useState<T>(fallbackData);
  const [isLoading, setIsLoading] = useState<boolean>(Boolean(options.immediate));
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (): Promise<T> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (result !== undefined && result !== null) {
        setData(result);
        return result;
      }
      return fallbackData;
    } catch (err: any) {
      const formattedError = err instanceof Error ? err : new Error(String(err));
      console.warn("useAsyncData fetch error, menggunakan data fallback:", formattedError.message);
      setError(formattedError);
      return fallbackData;
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, fallbackData]);

  useEffect(() => {
    if (options.immediate) {
      execute();
    }
  }, [execute, options.immediate]);

  return {
    data,
    isLoading,
    error,
    refetch: execute,
    setData,
  };
}
