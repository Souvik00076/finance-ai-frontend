"use client";

import { useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/utils/errors";

interface State<T> {
  data: T | null;
  error: string | null;
  isLoading: boolean;
}

/**
 * Loads data whenever `key` changes. Responses for an outdated key are ignored,
 * so switching periods quickly never shows stale data.
 */
export function useApiData<T>(key: string, load: () => Promise<T>, errorFallback = "Failed to load data"): State<T> {
  const [state, setState] = useState<State<T>>({ data: null, error: null, isLoading: true });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, isLoading: true, error: null }));
    load()
      .then((data) => {
        if (!cancelled) setState({ data, error: null, isLoading: false });
      })
      .catch((err: unknown) => {
        console.error(`Failed to load ${key}:`, err);
        if (!cancelled) setState({ data: null, error: getErrorMessage(err, errorFallback), isLoading: false });
      });
    return () => {
      cancelled = true;
    };
    // `load` is recreated every render; `key` captures everything it depends on.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}
