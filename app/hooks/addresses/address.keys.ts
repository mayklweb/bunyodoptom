export const addressKeys = {
  all: ["addresses"] as const,

  one: (id: number | string) =>
    ["addresses", id] as const,
};