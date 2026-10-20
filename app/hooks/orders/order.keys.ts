export const orderKeys = {
  all: ["orders"] as const,

  one: (id: number | string) =>
    ["orders", id] as const,
};