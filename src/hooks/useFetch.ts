import { useCallback, useEffect, useState } from "react";
import { isAbortError } from "../services/api";

type Fetcher<T> = (signal: AbortSignal) => Promise<T>;

export interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  reload: () => void;
}

interface SettledRequest<T> {
  fetcher: Fetcher<T>;
  attempt: number;
  data: T | null;
  error: Error | null;
}

export function useFetch<T>(fetcher: Fetcher<T>): UseFetchResult<T> {
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<SettledRequest<T> | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetcher(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setSettled({ fetcher, attempt, data, error: null });
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted || isAbortError(error)) return;
        setSettled({
          fetcher,
          attempt,
          data: null,
          error: error instanceof Error ? error : new Error("Erreur inconnue"),
        });
      });

    return () => {
      controller.abort();
    };
  }, [fetcher, attempt]);

  const reload = useCallback(() => {
    setAttempt((n) => n + 1);
  }, []);

  const isCurrent =
    settled !== null &&
    settled.fetcher === fetcher &&
    settled.attempt === attempt;

  return {
    data: isCurrent ? settled.data : null,
    error: isCurrent ? settled.error : null,
    loading: !isCurrent,
    reload,
  };
}
