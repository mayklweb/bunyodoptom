export const brandKeys = {
  all: ["brands"] as const,

  list: ["brands", "list"] as const,

  detail: (id: string | number) =>
    ["brands", "detail", id] as const,
};