import { useState, useEffect, useCallback, useRef } from "react";
import { getApiErrorMessage } from "../api/errors";

/**
 * Lightweight hook for server-paginated tables.
 * Provides infrastructure only — columns, filters, and actions stay in the feature page.
 */
export function useServerTable({
  fetchFn,
  initialPageSize = 20,
  debounceMs = 300,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: initialPageSize,
    total: 0,
  });
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, current: 1 }));
    }, debounceMs);
    return () => clearTimeout(debounceRef.current);
  }, [search, debounceMs]);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchFn({
        page: pagination.current - 1,
        size: pagination.pageSize,
        search: debouncedSearch,
      });
      setData(result.content);
      setPagination((prev) => ({
        ...prev,
        total: result.totalElements,
      }));
    } catch (error) {
      setError(getApiErrorMessage(error, "Failed to load data"));
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, pagination.current, pagination.pageSize, debouncedSearch]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePaginationChange = (current, pageSize) => {
    setPagination((prev) => ({ ...prev, current, pageSize }));
  };

  const handleSearch = (value) => {
    setSearch(value);
  };

  return {
    data,
    setData,
    loading,
    error,
    search,
    pagination,
    handlePaginationChange,
    handleSearch,
    reload: load,
  };
}
