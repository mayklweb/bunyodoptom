export const formatPhone = (phone?: string) => {
  if (!phone) return '';

  const digits = phone.replace(/\D/g, '');

  // 998991239999 -> +998 99 123 99 99
  if (digits.length === 12 && digits.startsWith('998')) {
    return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(
      5,
      8
    )} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
  }

  // 991239999 -> +998 99 123 99 99
  if (digits.length === 9) {
    return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(
      5,
      7
    )} ${digits.slice(7, 9)}`;
  }

  return phone;
};

export const formatPrice = (price: number, currency = "UZS") =>
  new Intl.NumberFormat("uz-UZ", { style: "currency", currency }).format(price);