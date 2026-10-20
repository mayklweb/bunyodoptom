export type Category = {
  id: string;
  slug: string; // URL uchun: /catalog/products/kiyimlar
  name: string;
  icon: string; // emoji yoki icon nomi
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  image: string; // URL yoki local rasm
};

export const categories: Category[] = [
  { id: 'c1', slug: 'kiyimlar', name: 'Kiyimlar', icon: '👕' },
  { id: 'c2', slug: 'poyabzal', name: 'Poyabzal', icon: '👟' },
  { id: 'c3', slug: 'elektronika', name: 'Elektronika', icon: '📱' },
  { id: 'c4', slug: 'uy-royzgor', name: 'Uy-ro\u02bbzg\u02bbor', icon: '🏠' },
  { id: 'c5', slug: 'sport', name: 'Sport', icon: '⚽' },
];

export const products: Product[] = [
  { id: 'p1', categoryId: 'c1', name: 'Erkaklar futbolkasi', price: 89000, image: 'https://picsum.photos/seed/p1/300/300' },
  { id: 'p2', categoryId: 'c1', name: 'Ayollar ko\u02bbylagi', price: 129000, image: 'https://picsum.photos/seed/p2/300/300' },
  { id: 'p3', categoryId: 'c1', name: 'Jinsi shim', price: 199000, image: 'https://picsum.photos/seed/p3/300/300' },
  { id: 'p4', categoryId: 'c2', name: 'Krossovka Nike', price: 450000, image: 'https://picsum.photos/seed/p4/300/300' },
  { id: 'p5', categoryId: 'c2', name: 'Krossovka Adidas', price: 420000, image: 'https://picsum.photos/seed/p5/300/300' },
  { id: 'p6', categoryId: 'c3', name: 'Simsiz quloqchin', price: 350000, image: 'https://picsum.photos/seed/p6/300/300' },
  { id: 'p7', categoryId: 'c3', name: 'Smartfon quvvatlagich', price: 120000, image: 'https://picsum.photos/seed/p7/300/300' },
  { id: 'p8', categoryId: 'c4', name: 'Choynak elektr', price: 180000, image: 'https://picsum.photos/seed/p8/300/300' },
  { id: 'p9', categoryId: 'c4', name: 'Yostiq to\u02bbplami', price: 95000, image: 'https://picsum.photos/seed/p9/300/300' },
  { id: 'p10', categoryId: 'c5', name: 'Futbol to\u02bbpi', price: 150000, image: 'https://picsum.photos/seed/p10/300/300' },
  { id: 'p11', categoryId: 'c5', name: 'Yoga gilamchasi', price: 110000, image: 'https://picsum.photos/seed/p11/300/300' },
];
