export const extractResult = (response) => {
  const data = response.data;
  return data?.result !== undefined ? data.result : data;
};

export const buildPageQuery = ({ page = 0, size = 20, search, sort }) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("size", String(size));
  if (search?.trim()) {
    params.set("search", search.trim());
  }
  if (sort) {
    params.set("sort", sort);
  }
  return params.toString();
};

export const normalizePageResponse = (response) => {
  const data = response.data ?? response;
  return {
    content: (data.content ?? []).map((item) => ({
      ...item,
      key: item.id ?? item.Id ?? item.bannerId,
    })),
    page: data.page ?? 0,
    size: data.size ?? 20,
    totalElements: data.totalElements ?? 0,
    totalPages: data.totalPages ?? 0,
  };
};
