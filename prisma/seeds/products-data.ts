export interface ProductSeedRow {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  thumbnail: string;
  images: string[];
}

export const PRODUCT_SEED_ROWS: ProductSeedRow[] = [
  {
    id: 1,
    title: 'E2E Alpha Item',
    description:
      'The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.',
    price: 1000,
    category: 'beauty',
    stock: 99,
    thumbnail: '/products/1-thumb.jpg',
    images: ['/products/1-1.jpg'],
  },
  {
    id: 2,
    title: 'E2E Beta Item',
    description:
      'The Eyeshadow Palette with Mirror offers a versatile range of eyeshadow shades for creating stunning eye looks. With a built-in mirror, it is convenient for on-the-go makeup application.',
    price:2550,
    category: 'beauty',
    stock: 34,
    thumbnail: '/products/2-thumb.jpg',
    images: ['/products/2-1.jpg'],
  },
  {
    id: 3,
    title: 'Powder Canister',
    description:
      'The Powder Canister is a finely milled setting powder designed to set makeup and control shine. With a lightweight and translucent formula, it provides a smooth and matte finish.',
    price:1499,
    category: 'beauty',
    stock: 89,
    thumbnail: '/products/3-thumb.jpg',
    images: ['/products/3-1.jpg'],
  },
  {
    id: 4,
    title: 'Red Lipstick',
    description:
      'The Red Lipstick is a classic and bold choice for adding a pop of color to your lips. With a creamy and pigmented formula, it provides a vibrant and long-lasting finish.',
    price:1299,
    category: 'beauty',
    stock: 91,
    thumbnail: '/products/4-thumb.jpg',
    images: ['/products/4-1.jpg'],
  },
  {
    id: 5,
    title: 'Red Nail Polish',
    description:
      'The Red Nail Polish offers a rich and glossy red hue for vibrant and polished nails. With a quick-drying formula, it provides a salon-quality finish at home.',
    price:899,
    category: 'beauty',
    stock: 79,
    thumbnail: '/products/5-thumb.jpg',
    images: ['/products/5-1.jpg'],
  },
  {
    id: 6,
    title: 'Calvin Klein CK One',
    description:
      "CK One by Calvin Klein is a classic unisex fragrance, known for its fresh and clean scent. It's a versatile fragrance suitable for everyday wear.",
    price:4999,
    category: 'fragrances',
    stock: 29,
    thumbnail: '/products/6-thumb.jpg',
    images: ['/products/6-1.jpg', '/products/6-2.jpg', '/products/6-3.jpg'],
  },
  {
    id: 7,
    title: 'Chanel Coco Noir Eau De',
    description:
      'Coco Noir by Chanel is an elegant and mysterious fragrance, featuring notes of grapefruit, rose, and sandalwood. Perfect for evening occasions.',
    price:12999,
    category: 'fragrances',
    stock: 58,
    thumbnail: '/products/7-thumb.jpg',
    images: ['/products/7-1.jpg', '/products/7-2.jpg', '/products/7-3.jpg'],
  },
  {
    id: 8,
    title: "Dior J'adore",
    description:
      "J'adore by Dior is a luxurious and floral fragrance, known for its blend of ylang-ylang, rose, and jasmine. It embodies femininity and sophistication.",
    price:8999,
    category: 'fragrances',
    stock: 98,
    thumbnail: '/products/8-thumb.jpg',
    images: ['/products/8-1.jpg', '/products/8-2.jpg', '/products/8-3.jpg'],
  },
  {
    id: 9,
    title: 'Dolce Shine Eau de',
    description:
      "Dolce Shine by Dolce & Gabbana is a vibrant and fruity fragrance, featuring notes of mango, jasmine, and blonde woods. It's a joyful and youthful scent.",
    price:6999,
    category: 'fragrances',
    stock: 4,
    thumbnail: '/products/9-thumb.jpg',
    images: ['/products/9-1.jpg', '/products/9-2.jpg', '/products/9-3.jpg'],
  },
  {
    id: 10,
    title: 'Gucci Bloom Eau de',
    description:
      "Gucci Bloom by Gucci is a floral and captivating fragrance, with notes of tuberose, jasmine, and Rangoon creeper. It's a modern and romantic scent.",
    price:7999,
    category: 'fragrances',
    stock: 91,
    thumbnail: '/products/10-thumb.jpg',
    images: ['/products/10-1.jpg', '/products/10-2.jpg', '/products/10-3.jpg'],
  },
  {
    id: 11,
    title: 'Annibale Colombo Bed',
    description:
      'The Annibale Colombo Bed is a luxurious and elegant bed frame, crafted with high-quality materials for a comfortable and stylish bedroom.',
    price:189999,
    category: 'furniture',
    stock: 88,
    thumbnail: '/products/11-thumb.jpg',
    images: ['/products/11-1.jpg', '/products/11-2.jpg', '/products/11-3.jpg'],
  },
  {
    id: 12,
    title: 'Annibale Colombo Sofa',
    description:
      'The Annibale Colombo Sofa is a sophisticated and comfortable seating option, featuring exquisite design and premium upholstery for your living room.',
    price:249999,
    category: 'furniture',
    stock: 60,
    thumbnail: '/products/12-thumb.jpg',
    images: ['/products/12-1.jpg', '/products/12-2.jpg', '/products/12-3.jpg'],
  },
  {
    id: 13,
    title: 'Bedside Table African Cherry',
    description:
      'The Bedside Table in African Cherry is a stylish and functional addition to your bedroom, providing convenient storage space and a touch of elegance.',
    price:29999,
    category: 'furniture',
    stock: 64,
    thumbnail: '/products/13-thumb.jpg',
    images: ['/products/13-1.jpg', '/products/13-2.jpg', '/products/13-3.jpg'],
  },
  {
    id: 14,
    title: 'Knoll Saarinen Executive Conference Chair',
    description:
      'The Knoll Saarinen Executive Conference Chair is a modern and ergonomic chair, perfect for your office or conference room with its timeless design.',
    price:49999,
    category: 'furniture',
    stock: 26,
    thumbnail: '/products/14-thumb.jpg',
    images: ['/products/14-1.jpg', '/products/14-2.jpg', '/products/14-3.jpg'],
  },
  {
    id: 15,
    title: 'Wooden Bathroom Sink With Mirror',
    description:
      'The Wooden Bathroom Sink with Mirror is a unique and stylish addition to your bathroom, featuring a wooden sink countertop and a matching mirror.',
    price:79999,
    category: 'furniture',
    stock: 7,
    thumbnail: '/products/15-thumb.jpg',
    images: ['/products/15-1.jpg', '/products/15-2.jpg', '/products/15-3.jpg'],
  },
  {
    id: 16,
    title: 'Apple',
    description:
      'Fresh and crisp apples, perfect for snacking or incorporating into various recipes.',
    price:199,
    category: 'groceries',
    stock: 8,
    thumbnail: '/products/16-thumb.jpg',
    images: ['/products/16-1.jpg'],
  },
  {
    id: 17,
    title: 'Beef Steak',
    description:
      'High-quality beef steak, great for grilling or cooking to your preferred level of doneness.',
    price:1299,
    category: 'groceries',
    stock: 86,
    thumbnail: '/products/17-thumb.jpg',
    images: ['/products/17-1.jpg'],
  },
  {
    id: 18,
    title: 'Cat Food',
    description:
      'Nutritious cat food formulated to meet the dietary needs of your feline friend.',
    price:899,
    category: 'groceries',
    stock: 46,
    thumbnail: '/products/18-thumb.jpg',
    images: ['/products/18-1.jpg'],
  },
  {
    id: 19,
    title: 'Chicken Meat',
    description:
      'Fresh and tender chicken meat, suitable for various culinary preparations.',
    price:999,
    category: 'groceries',
    stock: 97,
    thumbnail: '/products/19-thumb.jpg',
    images: ['/products/19-1.jpg', '/products/19-2.jpg'],
  },
  {
    id: 20,
    title: 'Cooking Oil',
    description:
      'Versatile cooking oil suitable for frying, sautéing, and various culinary applications.',
    price:499,
    category: 'groceries',
    stock: 10,
    thumbnail: '/products/20-thumb.jpg',
    images: ['/products/20-1.jpg'],
  },
];
