import { useState, useEffect, useCallback } from "react";
import { showApiError, showApiSuccess } from "../api/errors";

export function useCrudTable({
  fetchFn,
  updateFn,
  deleteFn,
  createFn,
  searchFields = ["name", "description"],
  fetchErrorMessage = "Failed to fetch data",
  rowKeyField = "id",
}) {
  const [dataSource, setDataSource] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [searchText, setSearchText] = useState("");
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const items = await fetchFn();
      setDataSource(items);
      setFilteredData(items);
    } catch (error) {
      showApiError(error, fetchErrorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchFn, fetchErrorMessage]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const startEditing = (record) => setEditingKey(record.key);
  const cancelEditing = () => setEditingKey("");

  const handleInputChange = (key, column, value) => {
    setDataSource((prev) => {
      const next = [...prev];
      const index = next.findIndex((item) => item.key === key);
      if (index > -1) {
        next[index] = { ...next[index], [column]: value };
      }
      return next;
    });
  };

  const saveEdit = async (key) => {
    const row = dataSource.find((item) => item.key === key);
    try {
      await updateFn(key, row);
      showApiSuccess("Updated successfully");
      setEditingKey("");
      await loadData();
    } catch (error) {
      showApiError(error, "Failed to update");
    }
  };

  const handleDelete = async (key) => {
    try {
      await deleteFn(key);
      setDataSource((prev) => prev.filter((item) => item.key !== key));
      setFilteredData((prev) => prev.filter((item) => item.key !== key));
      showApiSuccess("Deleted successfully");
    } catch (error) {
      showApiError(error, "Failed to delete");
    }
  };

  const handleCreate = async (values) => {
    try {
      setLoading(true);
      const created = await createFn(values);
      const key = created[rowKeyField] ?? created.id;
      const newRow = { ...created, key };
      setDataSource((prev) => [...prev, newRow]);
      setFilteredData((prev) => [...prev, newRow]);
      showApiSuccess("Created successfully");
      return true;
    } catch (error) {
      showApiError(error, "Failed to create");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value) => {
    setSearchText(value);
    const lower = value.toLowerCase();
    const filtered = dataSource.filter((item) =>
      searchFields.some((field) =>
        String(item[field] ?? "").toLowerCase().includes(lower)
      )
    );
    setFilteredData(filtered);
  };

  const handlePaginationChange = (current, pageSize) => {
    setPagination({ current, pageSize });
  };

  return {
    dataSource,
    filteredData,
    loading,
    editingKey,
    searchText,
    pagination,
    startEditing,
    cancelEditing,
    handleInputChange,
    saveEdit,
    handleDelete,
    handleCreate,
    handleSearch,
    handlePaginationChange,
    reload: loadData,
  };
}
