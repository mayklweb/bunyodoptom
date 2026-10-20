// utils/uzbekTransliteration.ts

// Kirillchadan lotinchaga (asosiy, ko'p ishlatiladigan harflar)
const cyrToLat: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo",
  ж: "j", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "x", ц: "ts", ч: "ch", ш: "sh", щ: "sh",
  ъ: "", ы: "i", ь: "", э: "e", ю: "yu", я: "ya",
  ў: "o'", қ: "q", ғ: "g'", ҳ: "h",
};

export function cyrillicToLatin(text: string): string {
  return text
    .toLowerCase()
    .split("")
    .map((ch) => cyrToLat[ch] ?? ch)
    .join("");
}

// Har qanday matnni (kirillcha bo'lsa ham, lotincha bo'lsa ham)
// izlash uchun bitta normal shaklga keltiradi
export function normalizeForSearch(text: string): string {
  const hasCyrillic = /[а-яёўқғҳ]/i.test(text);
  const normalized = hasCyrillic ? cyrillicToLatin(text) : text.toLowerCase();

  // qo'shimcha: apostrof/tinish belgilarini soddalashtirish
  return normalized
    .replace(/['’ʻ`]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}