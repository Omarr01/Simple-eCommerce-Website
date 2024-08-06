import React from "react";
import ProductCard from "./ProductCard";

function ProductGrid({ products, toggleCart }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-10 px-20">
      {products.map((product) => (
        <ProductCard
          key={product.pid}
          product={product}
          toggleCart={toggleCart}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
