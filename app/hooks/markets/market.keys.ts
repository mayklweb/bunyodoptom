export const marketKeys = {
  all: ["markets"] as const,

  one: (id: number | string) =>
    ["markets", id] as const,
};