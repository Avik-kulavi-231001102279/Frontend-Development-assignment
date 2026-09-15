// Instructions: Please place actual image files in src/assets/products/ matching these names.
// Using placeholder logic if the file is missing isn't directly possible with static imports in Vite without breaking,
// so we will assume these files exist or you will add them. For now we use placeholder URLs to avoid build errors.
// When you have images, change these to: import tshirt from '../assets/products/tshirt.jpg'

const tshirt = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80';
const shoes = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80';
const watch = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80';
const backpack = 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80';
const headphones = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80';
const jeans = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=80';
const smartphone = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&q=80';
const jacket = 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80';
const sunglasses = 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&q=80';

export const products = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    category: "Fashion",
    price: 799,
    image: tshirt,
    rating: 4.5
  },
  {
    id: 2,
    name: "Running Shoes",
    category: "Footwear",
    price: 2499,
    image: shoes,
    rating: 4.8
  },
  {
    id: 3,
    name: "Smart Watch Series 7",
    category: "Electronics",
    price: 4999,
    image: watch,
    rating: 4.6
  },
  {
    id: 4,
    name: "Travel Backpack",
    category: "Accessories",
    price: 1299,
    image: backpack,
    rating: 4.3
  },
  {
    id: 5,
    name: "Wireless Noise-Cancelling Headphones",
    category: "Electronics",
    price: 12000,
    image: headphones,
    rating: 4.9
  },
  {
    id: 6,
    name: "Classic Blue Jeans",
    category: "Fashion",
    price: 1499,
    image: jeans,
    rating: 4.4
  },
  {
    id: 7,
    name: "Pro Smartphone 128GB",
    category: "Electronics",
    price: 45000,
    image: smartphone,
    rating: 4.7
  },
  {
    id: 8,
    name: "Leather Winter Jacket",
    category: "Fashion",
    price: 3499,
    image: jacket,
    rating: 4.8
  },
  {
    id: 9,
    name: "Polarized Aviator Sunglasses",
    category: "Accessories",
    price: 899,
    image: sunglasses,
    rating: 4.5
  }
];
