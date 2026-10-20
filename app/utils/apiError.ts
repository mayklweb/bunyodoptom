import { isAxiosError } from "axios";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string" && message) {
      return message;
    }

    if (!error.response) {
      return "Internet bilan aloqa yo'q. Qaytadan urinib ko'ring";
    }
  }

  return fallback;
}