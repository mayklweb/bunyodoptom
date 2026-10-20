export const productKeys = {
  all: ["products"] as const,

  list: ["products", "list"] as const,

  detail: (id: string | number) =>
    ["products", "detail", id] as const,
};