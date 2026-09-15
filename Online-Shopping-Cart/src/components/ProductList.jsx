import React from 'react';
import ProductCard from './ProductCard';
import { products } from '../data/products';

const ProductList = ({ searchQuery, category, sortOrder }) => {
  // Apply filtering and sorting
  let filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'All' || product.category === category;
    
    return matchesSearch && matchesCategory;
  });

  // Apply sorting
  if (sortOrder === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOrder === 'name-asc') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === 'name-desc') {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
  }

  if (filteredProducts.length === 0) {
    return <div style={{ textAlign: 'center', padding: '2rem', width: '100%' }}>No products found.</div>;
  }

  return (
    <div className="product-grid">
      {filteredProducts.map((product, index) => (
        <div 
          key={product.id} 
          className="stagger-item"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
};

export default ProductList;
