export const categoryKeys = {
  all: ["categories"] as const,

  list: ["categories", "list"] as const,

  detail: (id: string | number) =>
    ["categories", "detail", id] as const,
};